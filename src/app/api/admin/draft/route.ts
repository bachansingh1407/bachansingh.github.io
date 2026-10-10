import { adminGuard, isResponse, json, readJsonBody } from "@/lib/api";
import { ConflictError, getDraftState, saveDraft } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const g = await adminGuard(req, false); if (g) return g;
  try { return json(await getDraftState()); }
  catch { return json({ error: "Could not read stored content." }, 500); }
}

export async function PUT(req: Request) {
  const g = await adminGuard(req, true); if (g) return g;
  const body = await readJsonBody(req); if (isResponse(body)) return body;
  const { content, baseRev } = (body ?? {}) as { content?: unknown; baseRev?: unknown };
  if (typeof baseRev !== "number" || !content) return json({ error: "Missing content or revision." }, 400);
  try {
    return json(await saveDraft(content, baseRev));
  } catch (e) {
    if (e instanceof ConflictError) {
      return json({ error: "This draft was changed somewhere else (another tab or device). Reload to see the latest version before saving.", current: e.current }, 409);
    }
    console.error("Draft save failed", e);
    return json({ error: "Could not save. Check the content storage setup." }, 500);
  }
}
