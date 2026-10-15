import { adminGuard, json } from "@/lib/api";
import { listVersions } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const g = await adminGuard(req, false); if (g) return g;
  try { return json({ versions: await listVersions() }); }
  catch { return json({ error: "Could not load version history." }, 500); }
}
