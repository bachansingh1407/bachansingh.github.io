import { sniff } from "./media";

/** Public https addresses only: no credentials, odd ports, IP literals, or internal-looking hostnames. */
export function isPublicHttpsUrl(raw: string): boolean {
  let u: URL;
  try { u = new URL(raw); } catch { return false; }
  if (u.protocol !== "https:" || u.username || u.password || (u.port && u.port !== "443")) return false;
  const h = u.hostname.toLowerCase();
  if (!h.includes(".") || /^[\d.]+$/.test(h) || h.includes(":") || h.startsWith("[")) return false;
  if (/(^|\.)(localhost|local|internal|intranet|lan|home|corp|test|invalid)$/.test(h)) return false;
  return true;
}

const DEFAULT_TEMPLATE = "https://image.thum.io/get/width/1200/crop/750/noanimate/{url}";

/**
 * Asks a screenshot service for a picture of the page. Our server only talks to the service named in
 * SCREENSHOT_URL_TEMPLATE (use {url} or {urlenc}), never to the target site itself.
 */
export async function captureScreenshot(target: string): Promise<{ bytes: Uint8Array; type: string }> {
  if (!isPublicHttpsUrl(target)) throw new Error("Use a public https:// address.");
  const tpl = process.env.SCREENSHOT_URL_TEMPLATE || DEFAULT_TEMPLATE;
  const endpoint = tpl.replace("{urlenc}", encodeURIComponent(target)).replace("{url}", target);
  if (!/^https:\/\//.test(endpoint)) throw new Error("Screenshot service is misconfigured.");
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), process.env.NETLIFY ? 9_000 : 30_000); // Netlify functions stop at about 10 s
  try {
    const res = await fetch(endpoint, { signal: ctl.signal, redirect: "follow" });
    if (!res.ok) throw new Error("The screenshot service couldn't capture that page.");
    const bytes = new Uint8Array(await res.arrayBuffer());
    const kind = sniff(bytes);
    if (!kind || !kind.type.startsWith("image/")) throw new Error("The service didn't return an image.");
    if (bytes.length > kind.max) throw new Error("The screenshot is too large.");
    return { bytes, type: kind.type };
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") throw new Error("The screenshot took too long. Try again, or upload an image instead.");
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
