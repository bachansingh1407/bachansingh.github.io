import { adminGuard, isResponse, json, readJsonBody } from "@/lib/api";
import { ConflictError, ValidationError, publish } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const g = await adminGuard(req, true); if (g) return g;
  const body = await readJsonBody(req, 10_000); if (isResponse(body)) return body;
  const { baseRev, note } = (body ?? {}) as { baseRev?: unknown; note?: unknown };
  if (typeof baseRev !== "number") return json({ error: "Missing revision." }, 400);
  try {
    return json(await publish(baseRev, typeof note === "string" ? note : ""));
  } catch (e) {
    if (e instanceof ConflictError) return json({ error: "The draft changed since you last saved. Save or reload first.", current: e.current }, 409);
    if (e instanceof ValidationError) return json({ error: "Fix the highlighted problems before publishing.", issues: e.issues }, 422);
    console.error("Publish failed", e);
    return json({ error: "Could not publish. Nothing was changed." }, 500);
  }
}
