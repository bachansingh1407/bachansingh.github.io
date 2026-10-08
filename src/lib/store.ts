import { promises as fs } from "fs";
import path from "path";

const KEY = "content";
const FILE = path.join(process.cwd(), ".data", "content.json");

function mode(): "blobs" | "file" {
  const forced = process.env.CONTENT_STORE;
  if (forced === "blobs" || forced === "file") return forced;
  return process.env.NETLIFY ? "blobs" : "file";
}

async function blobStore() {
  const { getStore } = await import("@netlify/blobs");
  return getStore("portfolio");
}

/** Returns saved content, or null when nothing has been saved yet. Throws on storage errors. */
export async function readRaw(): Promise<unknown | null> {
  if (mode() === "blobs") {
    const store = await blobStore();
    return (await store.get(KEY, { type: "json" })) ?? null;
  }
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
}

export async function writeRaw(data: unknown): Promise<void> {
  if (mode() === "blobs") {
    const store = await blobStore();
    await store.setJSON(KEY, data);
    return;
  }
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
}
