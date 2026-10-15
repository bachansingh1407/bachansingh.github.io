import { promises as fs } from "fs";
import path from "path";

/** Tiny key-value layer: local files in development, Netlify Blobs on Netlify. Keys use [A-Za-z0-9/_.-]. */
const ROOT = process.env.CONTENT_DIR ? path.resolve(process.env.CONTENT_DIR) : path.join(process.cwd(), ".data");

function mode(): "blobs" | "file" {
  const f = process.env.CONTENT_STORE;
  if (f === "blobs" || f === "file") return f;
  return process.env.NETLIFY ? "blobs" : "file";
}
const okKey = (k: string) => /^[A-Za-z0-9][A-Za-z0-9/_.-]*$/.test(k) && !k.includes("..");
const file = (k: string) => {
  if (!okKey(k)) throw new Error("Invalid storage key");
  return path.join(ROOT, ...k.split("/")) + ".bin";
};
async function blobs() {
  const { getStore } = await import("@netlify/blobs");
  return getStore("portfolio");
}

export async function getJson<T = unknown>(key: string): Promise<T | null> {
  if (mode() === "blobs") return ((await (await blobs()).get(key, { type: "json" })) as T | null) ?? null;
  try { return JSON.parse(await fs.readFile(file(key), "utf8")) as T; }
  catch (e) { if ((e as NodeJS.ErrnoException).code === "ENOENT") return null; throw e; }
}
export async function setJson(key: string, value: unknown): Promise<void> {
  if (mode() === "blobs") { await (await blobs()).setJSON(key, value); return; }
  const f = file(key);
  await fs.mkdir(path.dirname(f), { recursive: true });
  await fs.writeFile(f, JSON.stringify(value), "utf8");
}
export async function getBytes(key: string): Promise<Uint8Array | null> {
  if (mode() === "blobs") {
    const buf = (await (await blobs()).get(key, { type: "arrayBuffer" })) as ArrayBuffer | null;
    return buf ? new Uint8Array(buf) : null;
  }
  try { return new Uint8Array(await fs.readFile(file(key))); }
  catch (e) { if ((e as NodeJS.ErrnoException).code === "ENOENT") return null; throw e; }
}
export async function setBytes(key: string, bytes: Uint8Array): Promise<void> {
  if (mode() === "blobs") {
    const copy = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
    await (await blobs()).set(key, copy);
    return;
  }
  const f = file(key);
  await fs.mkdir(path.dirname(f), { recursive: true });
  await fs.writeFile(f, bytes);
}
export async function del(key: string): Promise<void> {
  if (mode() === "blobs") { await (await blobs()).delete(key); return; }
  try { await fs.unlink(file(key)); } catch (e) { if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e; }
}
export async function list(prefix: string): Promise<string[]> {
  if (mode() === "blobs") {
    const res = await (await blobs()).list({ prefix });
    return res.blobs.map((b: { key: string }) => b.key).sort();
  }
  const dir = path.join(ROOT, ...prefix.replace(/\/$/, "").split("/"));
  try {
    const names = await fs.readdir(dir);
    return names.filter((n) => n.endsWith(".bin")).map((n) => prefix.replace(/\/?$/, "/") + n.slice(0, -4)).sort();
  } catch (e) { if ((e as NodeJS.ErrnoException).code === "ENOENT") return []; throw e; }
}
