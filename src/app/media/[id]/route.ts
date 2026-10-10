import { getBytes, getJson } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!/^[a-f0-9]{24}$/.test(id)) return new Response("Not found", { status: 404 });
  try {
    const [meta, bytes] = await Promise.all([getJson<{ type: string; ext: string }>(`media-meta/${id}`), getBytes(`media/${id}`)]);
    if (!meta || !bytes) return new Response("Not found", { status: 404 });
    return new Response(bytes as unknown as BodyInit, {
      headers: {
        "Content-Type": meta.type,
        "Content-Disposition": `inline; filename="${id}.${meta.ext}"`,
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Temporarily unavailable", { status: 503 });
  }
}
