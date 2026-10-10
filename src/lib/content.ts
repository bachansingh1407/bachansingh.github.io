import { randomBytes } from "crypto";
import { DEFAULT_CONTENT } from "./defaults";
import { MAX_VERSIONS } from "./limits";
import { normalizeContent } from "./normalize";
import { diffContent } from "./changes";
import { counts, toPublic } from "./public";
import { del, getJson, list, setJson } from "./store";
import { errorsOnly, validateContent } from "./validate";
import type { Change, Content, Issue, VersionInfo } from "./types";

export { PAGE_PATH, formatUpdated, navFor, pageTitle, searchFor } from "./public";

export class StorageUnavailable extends Error {}
export class ConflictError extends Error { constructor(public current: Content) { super("conflict"); } }
export class ValidationError extends Error { constructor(public issues: Issue[]) { super("invalid"); } }

const nowIso = () => new Date().toISOString();
const today = () => nowIso().slice(0, 10);
let lastGood: Content | null = null;

/** Loads draft and published, creating them on first run (or migrating the old single "content" key). */
async function load(): Promise<{ draft: Content; published: Content }> {
  const [d, p] = await Promise.all([getJson("draft"), getJson("published")]);
  if (d && p) return { draft: normalizeContent(d), published: normalizeContent(p) };
  const seed = normalizeContent((await getJson("content")) ?? DEFAULT_CONTENT);
  const published = p ? normalizeContent(p) : { ...seed, rev: 0, publishedAt: nowIso() };
  const draft = d ? normalizeContent(d) : { ...published };
  if (!p) await setJson("published", published);
  if (!d) await setJson("draft", draft);
  return { draft, published };
}

/**
 * What visitors get. If storage fails we serve the last good published copy from memory, and if there
 * is none we throw. We never fall back to the starter content, which could expose hidden items.
 */
export async function getPublished(): Promise<Content> {
  try {
    const raw = await getJson("published");
    const c = raw ? normalizeContent(raw) : (await load()).published;
    lastGood = c;
    return c;
  } catch (e) {
    console.error("Storage read failed", e);
    if (lastGood) return lastGood;
    throw new StorageUnavailable("Content storage is unavailable");
  }
}

/** Draft with hidden items shown, for the owner's preview only. */
export async function getPreviewContent(): Promise<Content> {
  return toPublic((await load()).draft, { preview: true });
}

export async function getDraftState() {
  const { draft, published } = await load();
  return { draft, published };
}

export async function saveDraft(input: unknown, baseRev: number): Promise<{ draft: Content; issues: Issue[] }> {
  const { draft: current } = await load();
  if (baseRev !== current.rev) throw new ConflictError(current);
  const next = normalizeContent(input);
  next.rev = current.rev + 1;
  next.updated = today();
  next.publishedAt = current.publishedAt;
  await setJson("draft", next);
  return { draft: next, issues: validateContent(next) };
}

function versionId() {
  return nowIso().replace(/[-:.]/g, "").slice(0, 15) + "-" + randomBytes(3).toString("hex");
}

export async function publish(baseRev: number, note: string): Promise<{ draft: Content; published: Content }> {
  const { draft, published: previous } = await load();
  if (baseRev !== draft.rev) throw new ConflictError(draft);
  const issues = errorsOnly(validateContent(draft));
  if (issues.length) throw new ValidationError(issues);

  const at = nowIso();
  const published = { ...draft, publishedAt: at };
  await setJson("published", published);
  const nextDraft = { ...draft, publishedAt: at };
  await setJson("draft", nextDraft);
  lastGood = published;

  // Record what changed so any old value can be looked at, or put back, later.
  const changes = diffContent(previous, published);
  const existing = await loadIndex(); // read before writing, so the new snapshot can't be counted twice
  const id = versionId();
  const info: VersionInfo = { id, at, note: note.slice(0, 120), counts: counts(published), changeCount: changes.length };
  await setJson(`versions/${id}`, { ...info, content: published, changes });
  const index = [info, ...existing.filter((v) => v.id !== id)];
  for (const gone of index.slice(MAX_VERSIONS)) await del(`versions/${gone.id}`);
  await setJson("versions-index", index.slice(0, MAX_VERSIONS));
  return { draft: nextDraft, published };
}

/** Small index so the History screen doesn't have to read every snapshot. Built once from older snapshots if missing. */
async function loadIndex(): Promise<VersionInfo[]> {
  const idx = await getJson<VersionInfo[]>("versions-index");
  if (idx) return idx;
  const keys = (await list("versions/")).reverse();
  const rows = await Promise.all(keys.map((k) => getJson<{ id: string; at: string; note: string; content: unknown; changes?: Change[] }>(k)));
  const built = rows.filter(Boolean).map((r) => ({
    id: r!.id, at: r!.at, note: r!.note, counts: counts(normalizeContent(r!.content)), changeCount: r!.changes?.length ?? 0,
  }));
  if (built.length) await setJson("versions-index", built);
  return built;
}

export async function listVersions(): Promise<VersionInfo[]> {
  return loadIndex();
}

export async function getVersionChanges(id: string): Promise<Change[]> {
  if (!/^\d{8}T\d{6}-[a-f0-9]{6}$/.test(id)) throw new Error("Bad version id");
  const v = await getJson<{ changes?: Change[] }>(`versions/${id}`);
  if (!v) throw new Error("Version not found");
  return v.changes ?? [];
}

export async function restoreVersion(id: string, baseRev: number): Promise<Content> {
  if (!/^\d{8}T\d{6}-[a-f0-9]{6}$/.test(id)) throw new Error("Bad version id");
  const v = await getJson<{ content: unknown }>(`versions/${id}`);
  if (!v) throw new Error("Version not found");
  const { draft: current } = await load();
  if (baseRev !== current.rev) throw new ConflictError(current);
  const next = normalizeContent(v.content);
  next.rev = current.rev + 1;
  next.updated = today();
  next.publishedAt = current.publishedAt;
  await setJson("draft", next);
  return next;
}

/** Writes at most one backup per day (when the admin is opened) and keeps the last 14. */
export async function maybeBackup(): Promise<void> {
  try {
    const keys = await list("backups/");
    if (keys.some((k) => k.endsWith(today()))) return;
    const { draft, published } = await load();
    await setJson(`backups/${today()}`, { at: nowIso(), draft, published });
    for (const k of keys.slice(0, Math.max(0, keys.length + 1 - 14))) await del(k);
  } catch (e) {
    console.error("Backup skipped", e);
  }
}
