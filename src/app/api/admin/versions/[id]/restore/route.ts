import { adminGuard, isResponse, json, readJsonBody } from "@/lib/api";
import { ConflictError, restoreVersion } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await adminGuard(req, true); if (g) return g;
  const body = await readJsonBody(req, 10_000); if (isResponse(body)) return body;
  const baseRev = (body as { baseRev?: unknown })?.baseRev;
  if (typeof baseRev !== "number") return json({ error: "Missing revision." }, 400);
  const { id } = await ctx.params;
  try {
    return json({ draft: await restoreVersion(id, baseRev) });
  } catch (e) {
    if (e instanceof ConflictError) return json({ error: "The draft changed. Reload first.", current: e.current }, 409);
    return json({ error: e instanceof Error ? e.message : "Could not restore." }, 400);
  }
}
