import { randomBytes } from "crypto";
import { adminGuard, isResponse, json, readJsonBody } from "@/lib/api";
import { clientIp } from "@/lib/auth";
import { hit } from "@/lib/ratelimit";
import { captureScreenshot } from "@/lib/screenshot";
import { setBytes, setJson } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 40;

/** Takes a screenshot of a live URL through the configured screenshot service and stores it like any upload. */
export async function POST(req: Request) {
  const g = await adminGuard(req, true); if (g) return g;
  const body = await readJsonBody(req, 2_000); if (isResponse(body)) return body;
  const url = typeof (body as { url?: unknown })?.url === "string" ? (body as { url: string }).url.trim() : "";
  if (hit("capture:" + clientIp(req), 20, 3_600_000)) return json({ error: "Too many captures. Try again later." }, 429);
  try {
    const { bytes, type } = await captureScreenshot(url);
    const id = randomBytes(12).toString("hex");
    await setBytes(`media/${id}`, bytes);
    await setJson(`media-meta/${id}`, { type, ext: type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg", size: bytes.length, at: new Date().toISOString() });
    return json({ id, at: new Date().toISOString().slice(0, 10) });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Capture failed." }, 502);
  }
}
