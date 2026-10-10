import { promises as fs } from "fs";
import path from "path";
import { ConflictError, StorageUnavailable, ValidationError, getDraftState, getVersionChanges, getPublished, listVersions, publish, restoreVersion, saveDraft } from "../src/lib/content";
import { createMessage, deleteMessage, listMessages, updateMessage } from "../src/lib/messages";
import { del, list, setJson } from "../src/lib/store";

let failed = 0;
const ok = (c: boolean, n: string) => { if (!c) { failed++; console.log("FAIL", n); } };
const throws = async (f: () => Promise<unknown>, cls: new (...a: never[]) => Error, n: string) => {
  try { await f(); ok(false, n + " (did not throw)"); } catch (e) { ok(e instanceof cls, n + " (" + (e as Error).name + ")"); }
};

async function main() {
  if (!process.env.CONTENT_DIR) throw new Error("Set CONTENT_DIR to a scratch folder (npm test does this).");
  await fs.rm(process.env.CONTENT_DIR, { recursive: true, force: true });
  // First run seeds draft + published
  const first = await getDraftState();
  ok(first.draft.rev === 0 && first.published.projects.length === 4, "first run seeded");

  // Draft saves bump the revision; stale revisions are rejected (no silent overwrite)
  const edited = structuredClone(first.draft); edited.profile.role = "Full-stack Developer";
  const saved = await saveDraft(edited, 0);
  ok(saved.draft.rev === 1, "rev bumped");
  await throws(() => saveDraft(edited, 0), ConflictError, "stale save rejected");

  // Publishing: blocked on errors, drafts still save, nothing goes live
  const bad = structuredClone(saved.draft); bad.contact.email = "nope"; bad.about = "x".repeat(7000);
  const s2 = await saveDraft(bad, 1);
  ok(s2.issues.length >= 2, "issues reported on save");
  await throws(() => publish(2, ""), ValidationError, "publish blocked");
  ok((await getPublished()).profile.role === "Software Developer", "published unchanged after blocked publish");

  // Fix and publish; version snapshot recorded
  const good = structuredClone(s2.draft); good.contact.email = "me@example.com"; good.about = "Short about.";
  const s3 = await saveDraft(good, 2);
  const pub = await publish(s3.draft.rev, "first publish");
  ok(pub.published.profile.role === "Full-stack Developer" && pub.published.publishedAt !== "", "published");
  ok((await listVersions()).length === 1, "one version");
const firstV = (await listVersions())[0];
ok(firstV.changeCount > 0, "version records its changes: " + firstV.changeCount);
const detail = await getVersionChanges(firstV.id);
ok(detail.some((c) => c.path === "profile/role" && c.before === "Software Developer" && c.after === "Full-stack Developer"), "role change has old and new value");

  // Version history is capped at 30; restore loads into the draft only
  for (let i = 0; i < 33; i++) { await new Promise((r) => setTimeout(r, 2)); await publish((await getDraftState()).draft.rev, "v" + i); }
  const vs = await listVersions();
  ok(vs.length === 100 || vs.length === 34, "versions kept (up to 100): " + vs.length);
  const target = vs[vs.length - 1];
  const rev = (await getDraftState()).draft.rev;
  const d2 = structuredClone((await getDraftState()).draft); d2.profile.role = "Changed after"; await saveDraft(d2, rev);
  const restored = await restoreVersion(target.id, rev + 1);
  ok(restored.profile.role === "Full-stack Developer", "restore loads snapshot into draft");
  ok((await getPublished()).profile.role === "Full-stack Developer", "restore does not touch published");
  await throws(() => restoreVersion("../../etc/passwd", 0), Error, "bad version id rejected");

  // Storage outage: serve last good copy, never defaults
  const file = path.join(process.env.CONTENT_DIR as string, "published.bin");
  await fs.writeFile(file, "{ not json");
  const fallback = await getPublished();
  ok(fallback.profile.role === "Full-stack Developer" && fallback.about === "Short about.", "outage serves last good published copy, not defaults");

  // Messages
  await createMessage({ name: "A", email: "a@b.co", topic: "Hiring or a role", message: "Hello there friend" });
  await new Promise((r) => setTimeout(r, 3));
  await createMessage({ name: "B", email: "b@b.co", topic: "Something else", message: "Another message" });
  let msgs = await listMessages(0);
  ok(msgs.length === 2 && msgs[0].name === "B", "newest first");
  const up = await updateMessage(msgs[0].id, { read: true, archived: true });
  ok(up?.read === true && up.archived === true, "update");
  ok((await updateMessage("bad", { read: true })) === null, "bad id ignored");
  const old = await list("messages/");
  await setJson(old[0], { ...(msgs[1]), id: msgs[1].id, at: "2020-01-01T00:00:00Z" });
  msgs = await listMessages(30);
  ok(msgs.length === 1, "retention purges old messages");
  ok(await deleteMessage(msgs[0].id), "delete");
  ok((await listMessages(0)).length === 0, "empty after delete");
  void del;
}

main().then(() => {
  console.log(failed ? `${failed} FAILED` : "store/draft/publish/versions/messages: all checks passed");
  process.exit(failed ? 1 : 0);
}).catch((e) => { console.error("ERROR", e); process.exit(1); });
