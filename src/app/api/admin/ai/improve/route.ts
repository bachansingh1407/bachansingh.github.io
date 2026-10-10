import { adminGuard, isResponse, json, readJsonBody } from "@/lib/api";
import { AiError, IMPROVE_SYSTEM, groq } from "@/lib/ai";
import { clientIp } from "@/lib/auth";
import { L } from "@/lib/limits";
import { hit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Suggests a clearer version of one field. The author always reviews it before anything changes. */
export async function POST(req: Request) {
  const g = await adminGuard(req, true); if (g) return g;
  const body = await readJsonBody(req, 20_000); if (isResponse(body)) return body;
  const { text, label } = (body ?? {}) as { text?: unknown; label?: unknown };
  if (typeof text !== "string" || text.trim().length < 20) return json({ error: "Write at least a sentence first." }, 400);
  if (text.length > L.improveText) return json({ error: "That text is too long to improve in one go." }, 413);
  if (hit("improve:" + clientIp(req), 30, 3_600_000)) return json({ error: "Too many requests. Try again later." }, 429);
  const field = typeof label === "string" ? label.slice(0, 60) : "text";
  try {
    const suggestion = await groq(
      [{ role: "system", content: IMPROVE_SYSTEM }, { role: "user", content: `Field: ${field}\n\nText:\n${text}` }],
      { maxTokens: 1200, temperature: 0.3 },
    );
    return json({ suggestion });
  } catch (e) {
    if (e instanceof AiError) return json({ error: e.message }, e.status === 503 ? 503 : 502);
    return json({ error: "Could not get a suggestion." }, 500);
  }
}
