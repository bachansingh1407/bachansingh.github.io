import { adminGuard, json } from "@/lib/api";
import { getDraftState } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const g = await adminGuard(req, false); if (g) return g;
  try {
    const { draft, published } = await getDraftState();
    const body = JSON.stringify({ exportedAt: new Date().toISOString(), draft, published }, null, 2);
    return new Response(body, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="portfolio-backup-${draft.updated}.json"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("Export failed", e);
    return json({ error: "Export failed. Content storage could not be read." }, 500);
  }
}
