import { getJson } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** For uptime monitors: confirms the app is running and content storage is readable. Reveals nothing else. */
export async function GET() {
  try {
    await getJson("published");
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ ok: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
