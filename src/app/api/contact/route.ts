import { json } from "@/lib/api";
import { clientIp, sameOrigin } from "@/lib/auth";
import { getPublished } from "@/lib/content";
import { CONTACT_TOPICS } from "@/lib/defaults";
import { L } from "@/lib/limits";
import { createMessage } from "@/lib/messages";
import { notifyNewMessage } from "@/lib/notify";
import { hit } from "@/lib/ratelimit";
import { isValidEmail } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// eslint-disable-next-line no-control-regex
const clean = (s: unknown) => (typeof s === "string" ? s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim() : "");

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (!req.headers.get("content-type")?.includes("application/json")) return json({ error: "Expected JSON." }, 415);
  const text = await req.text();
  if (text.length > 10_000) return json({ error: "That message is too large." }, 413);
  let b: Record<string, unknown>;
  try { b = JSON.parse(text) as Record<string, unknown>; } catch { return json({ error: "Invalid request." }, 400); }

  // Bots: a filled hidden field gets a fake success so they don't retry.
  if (clean(b.website)) return json({ ok: true });

  try {
    if (!(await getPublished()).contact.formEnabled) return json({ error: "The contact form is turned off." }, 404);
  } catch { return json({ error: "The form is temporarily unavailable. Please try again soon." }, 503); }

  if (typeof b.elapsed !== "number" || b.elapsed < 3000) return json({ error: "That was very quick. Please check your message and send again." }, 400);

  const ip = clientIp(req);
  if (hit("contact:" + ip, 3, 3600_000) || hit("contact:all", 40, 3600_000)) {
    return json({ error: "You've sent a few messages already. Please try again later." }, 429);
  }

  const name = clean(b.name), email = clean(b.email), message = clean(b.message);
  const topic = CONTACT_TOPICS.includes(clean(b.topic)) ? clean(b.topic) : CONTACT_TOPICS[CONTACT_TOPICS.length - 1];
  const fields: Record<string, string> = {};
  if (!name) fields.name = "Please enter your name.";
  else if (name.length > L.messageName) fields.name = `Keep your name under ${L.messageName} characters.`;
  if (!isValidEmail(email)) fields.email = "Please enter a valid email address.";
  if (message.length < L.messageMin) fields.message = `Please write at least ${L.messageMin} characters.`;
  else if (message.length > L.messageBody) fields.message = `Please keep it under ${L.messageBody} characters.`;
  if (Object.keys(fields).length) return json({ error: "Please check the highlighted fields.", fields }, 422);

  try {
    const r = await createMessage({ name, email, topic, message });
    if (r === "full") return json({ error: "The inbox is full right now. Please email directly instead." }, 503);
  } catch (e) {
    console.error("Message store failed", e);
    return json({ error: "Your message could not be saved. Please try again or email directly." }, 500);
  }
  void notifyNewMessage({ name, email, topic, message });
  return json({ ok: true });
}
