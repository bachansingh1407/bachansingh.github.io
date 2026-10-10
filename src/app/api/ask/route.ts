import { json } from "@/lib/api";
import { AiError, aiConfigured, askSystemPrompt, cleanHistory, groq } from "@/lib/ai";
import { clientIp, sameOrigin } from "@/lib/auth";
import { getPublished } from "@/lib/content";
import { toPublic } from "@/lib/public";
import { hit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public "Ask about my work" endpoint. Answers come only from published content. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (!req.headers.get("content-type")?.includes("application/json")) return json({ error: "Expected JSON." }, 415);
  const text = await req.text();
  if (text.length > 6000) return json({ error: "That conversation is too long." }, 413);
  let body: { messages?: unknown };
  try { body = JSON.parse(text) as { messages?: unknown }; } catch { return json({ error: "Invalid request." }, 400); }

  let pub;
  try { pub = toPublic(await getPublished()); } catch { return json({ error: "Temporarily unavailable." }, 503); }
  if (!pub.site.ai.enabled || !aiConfigured()) return json({ error: "The assistant is turned off." }, 404);

  const history = cleanHistory(body.messages);
  if (!history.length || history[history.length - 1].role !== "user") return json({ error: "Ask a question first." }, 400);

  const ip = clientIp(req);
  const wait = hit(`ask:${ip}`, 8, 60_000) || hit(`ask-h:${ip}`, 60, 3_600_000) || hit("ask:all", 400, 3_600_000);
  if (wait) return json({ error: "That's a lot of questions. Please wait a little and try again.", retryAfter: wait }, 429);

  try {
    const answer = await groq([{ role: "system", content: askSystemPrompt(pub) }, ...history], { maxTokens: 350, temperature: 0.2 });
    return json({ answer });
  } catch (e) {
    if (e instanceof AiError) return json({ error: e.message }, e.status === 429 ? 429 : 502);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
}
