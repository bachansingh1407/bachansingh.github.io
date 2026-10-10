import { MEDIA_MAX } from "./limits";

export type MediaKind = { type: string; ext: string; max: number };

/** Identify an upload by its first bytes, never by the file name or the browser's claim. */
export function sniff(b: Uint8Array): MediaKind | null {
  const eq = (off: number, ...bytes: number[]) => bytes.every((v, i) => b[off + i] === v);
  if (b.length > 8 && eq(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return { type: "image/png", ext: "png", max: MEDIA_MAX.image };
  if (b.length > 3 && eq(0, 0xff, 0xd8, 0xff)) return { type: "image/jpeg", ext: "jpg", max: MEDIA_MAX.image };
  if (b.length > 12 && eq(0, 0x52, 0x49, 0x46, 0x46) && eq(8, 0x57, 0x45, 0x42, 0x50)) return { type: "image/webp", ext: "webp", max: MEDIA_MAX.image };
  if (b.length > 5 && eq(0, 0x25, 0x50, 0x44, 0x46, 0x2d)) return { type: "application/pdf", ext: "pdf", max: MEDIA_MAX.pdf };
  return null;
}
