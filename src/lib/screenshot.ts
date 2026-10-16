
import { sniff } from "./media";
import { onNetlify } from "./store";

/**
 * Public HTTPS addresses only:
 * no credentials, unusual ports, IP literals, or internal hostnames.
 */
export function isPublicHttpsUrl(raw: string): boolean {
  let url: URL;

  try {
    url = new URL(raw);
  } catch {
    return false;
  }

  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    (url.port && url.port !== "443")
  ) {
    return false;
  }

  const hostname = url.hostname.toLowerCase();

  if (
    !hostname.includes(".") ||
    /^[\d.]+$/.test(hostname) ||
    hostname.includes(":") ||
    hostname.startsWith("[")
  ) {
    return false;
  }

  if (
    /(^|\.)(localhost|local|internal|intranet|lan|home|corp|test|invalid)$/.test(
      hostname
    )
  ) {
    return false;
  }

  return true;
}

const DEFAULT_TEMPLATE =
  "https://image.thum.io/get/width/1200/crop/750/noanimate/{url}";

/**
 * Captures a screenshot through the configured screenshot service.
 *
 * SCREENSHOT_URL_TEMPLATE is read only on the server.
 * Use {url} or {urlenc} as the target URL placeholder.
 */
export async function captureScreenshot(
  target: string
): Promise<{ bytes: Uint8Array; type: string }> {
  if (!isPublicHttpsUrl(target)) {
    throw new Error("Use a public https:// address.");
  }

  const template =
    process.env.SCREENSHOT_URL_TEMPLATE || DEFAULT_TEMPLATE;

  const endpoint = template
    .replace("{urlenc}", encodeURIComponent(target))
    .replace("{url}", target);

  let parsedEndpoint: URL;

  try {
    parsedEndpoint = new URL(endpoint);
  } catch {
    throw new Error("Screenshot service is misconfigured.");
  }

  if (parsedEndpoint.protocol !== "https:") {
    throw new Error("Screenshot service is misconfigured.");
  }

  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    onNetlify() ? 9_000 : 30_000
  );

  try {
    const response = await fetch(parsedEndpoint.toString(), {
      signal: controller.signal,
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error("The screenshot service couldn't capture that page.");
    }

    const bytes = new Uint8Array(await response.arrayBuffer());
    const image = sniff(bytes);

    if (!image || !image.type.startsWith("image/")) {
      throw new Error("The service didn't return an image.");
    }

    if (bytes.length > image.max) {
      throw new Error("The screenshot is too large.");
    }

    return {
      bytes,
      type: image.type,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "The screenshot took too long. Try again, or upload an image instead."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
