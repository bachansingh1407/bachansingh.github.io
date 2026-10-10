import { randomBytes } from "crypto";
import { adminGuard, json } from "@/lib/api";
import { clientIp } from "@/lib/auth";
import { sniff } from "@/lib/media";
import { hit } from "@/lib/ratelimit";
import { setBytes, setJson } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const g = await adminGuard(req, true); if (g) return g;
  if (hit("upload:" + clientIp(req), 40, 3600_000)) return json({ error: "Too many uploads. Try again later." }, 429);
  let file: File | null = null;
  try { const f = (await req.formData()).get("file"); file = f instanceof File ? f : null; }
  catch { return json({ error: "Invalid upload." }, 400); }
  if (!file) return json({ error: "No file received." }, 400);
  if (file.size > 5 * 1024 * 1024) return json({ error: "File is too large." }, 413);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniff(bytes);
  if (!kind) return json({ error: "Use a JPG, PNG or WebP image, or a PDF." }, 415);
  if (bytes.length > kind.max) return json({ error: `That file is over ${Math.round(kind.max / 1048576)} MB.` }, 413);

  const id = randomBytes(12).toString("hex");
  try {
    await setBytes(`media/${id}`, bytes);
    await setJson(`media-meta/${id}`, { type: kind.type, ext: kind.ext, size: bytes.length, at: new Date().toISOString() });
  } catch (e) {
    console.error("Upload failed", e);
    return json({ error: "Could not store the file." }, 500);
  }
  return json({ id, type: kind.type });
}
