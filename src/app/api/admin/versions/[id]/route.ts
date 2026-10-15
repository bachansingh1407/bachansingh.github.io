import { adminGuard, json } from "@/lib/api";
import { getVersionChanges } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await adminGuard(req, false); if (g) return g;
  const { id } = await ctx.params;
  try { return json({ changes: await getVersionChanges(id) }); }
  catch (e) { return json({ error: e instanceof Error ? e.message : "Could not load changes." }, 404); }
}
