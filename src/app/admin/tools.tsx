"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { useFocusTrap } from "@/components/useFocusTrap";
import { wordDiff } from "@/lib/changes";
import { normalizeContent } from "@/lib/normalize";
import { PAGE_PATH } from "@/lib/public";
import { PALETTES, contrastChecks } from "@/lib/themes";
import type { Change, Content, Issue, Message, Suggestion, VersionInfo } from "@/lib/types";
import { ConfirmModal, HelpPop, useAdmin } from "./ui";

export interface SectionDef { id: string; label: string; icon: string; group: string; desc: string }
export const SECTIONS = [
  { id: "dashboard", label: "Dashboard", icon: "home", group: "Overview", desc: "What needs attention before you publish." },
  { id: "profile", label: "Profile", icon: "user", group: "Content", desc: "Your name, role, headline and photo. This is the first thing visitors read." },
  { id: "about", label: "About", icon: "file", group: "Content", desc: "A short, specific introduction to who you are and how you work." },
  { id: "work", label: "Experience", icon: "briefcase", group: "Content", desc: "Roles and the work you did, described without confidential details." },
  { id: "projects", label: "Projects", icon: "folder", group: "Content", desc: "Case studies with context, decisions and validation. Depth beats a long list." },
  { id: "stack", label: "Stack", icon: "layers", group: "Content", desc: "The tools you use, with icons and short notes on why." },
  { id: "how", label: "How I work", icon: "flag", group: "Content", desc: "The step-by-step diagram on your home page." },
  { id: "testimonials", label: "Testimonials", icon: "chat", group: "Content", desc: "Real quotes you have permission to show." },
  { id: "pages", label: "Pages", icon: "grid", group: "Site", desc: "Rename, reorder or hide pages." },
  { id: "contact", label: "Contact & resume", icon: "mail", group: "Site", desc: "How people reach you, and your resume." },
  { id: "appearance", label: "Appearance", icon: "palette", group: "Site", desc: "Colour themes visitors can choose from." },
  { id: "assistant", label: "AI assistant", icon: "sparkles", group: "Site", desc: "Optional “Ask about my work” chat powered by Groq." },
  { id: "inbox", label: "Inbox", icon: "inbox", group: "Inbox & tools", desc: "Messages sent through your contact form." },
  { id: "history", label: "History", icon: "history", group: "Inbox & tools", desc: "Every published change, with the old text so you can put it back." },
  { id: "preview", label: "Preview", icon: "eye", group: "Inbox & tools", desc: "See your saved draft, including hidden items, before it goes live." },
  { id: "advanced", label: "Backup & import", icon: "download", group: "Inbox & tools", desc: "Download a backup or load one back in." },
] as const satisfies readonly SectionDef[];
export type SectionId = (typeof SECTIONS)[number]["id"];
export const sectionLabel = (id: string) => SECTIONS.find((x) => x.id === id)?.label ?? "";

/** Which section an issue path belongs to, and which item inside it. */
export function locate(path: string): { section: SectionId; uid?: string } {
  const [head, second] = path.split(".");
  if (path.startsWith("site.ai")) return { section: "assistant" };
  const map: Record<string, SectionId> = { profile: "profile", pages: "pages", about: "about", work: "work", projects: "projects", stack: "stack", how: "how", testimonials: "testimonials", contact: "contact", site: "appearance" };
  const section = map[head] ?? "dashboard";
  return { section, uid: ["work", "projects", "stack", "testimonials"].includes(head) ? second : undefined };
}

function describe(path: string, c: Content): string {
  const { section, uid } = locate(path);
  const name = sectionLabel(section);
  const item = uid ? [...c.work, ...c.projects, ...c.stack, ...c.testimonials].find((i) => i.uid === uid) : undefined;
  const label = item ? ("title" in item ? item.title : "name" in item ? item.name : "") : "";
  return label ? `${name} › ${label}` : name;
}

/* ---------- Dashboard ---------- */
const DISMISS_KEY = "pf_admin_dismissed";

function SuggestionCard({ s, onGo, onDismiss }: { s: Suggestion; onGo: () => void; onDismiss: () => void }) {
  return (
    <div className={`sug ${s.level}`}>
      <div className="sug-main">
        <span className="sug-level">{s.level === "important" ? "Important" : "Nice to have"}</span>
        <b>{s.title}</b>
      </div>
      <div className="sug-actions">
        <HelpPop label={`How to: ${s.title}`}>
          <h4>Why it matters</h4><p>{s.why}</p>
          <h4>How to do it</h4>
          <ol>{s.how.map((h, i) => <li key={i}>{h}</li>)}</ol>
          <button type="button" className="adm-btn primary sm" onClick={onGo}>Take me there</button>
        </HelpPop>
        <button type="button" className="adm-btn primary sm" onClick={onGo}>Take me there<Icon name="arrow" size={14} /></button>
        <button type="button" className="adm-link" onClick={onDismiss}>Dismiss</button>
      </div>
    </div>
  );
}

export function DashboardSection({ issues, suggestions, unpublished, publishedAt, unread, onGo, onSection }: {
  issues: Issue[]; suggestions: Suggestion[]; unpublished: boolean; publishedAt: string; unread: number;
  onGo: (path: string) => void; onSection: (id: SectionId) => void;
}) {
  const { c } = useAdmin();
  const errors = issues.filter((i) => i.level === "error");
  const [dismissed, setDismissed] = useState<string[]>([]);
  useEffect(() => { try { setDismissed(JSON.parse(localStorage.getItem(DISMISS_KEY) ?? "[]") as string[]); } catch { /* storage unavailable */ } }, []);
  const dismiss = (id: string) => { const next = [...dismissed, id]; setDismissed(next); try { localStorage.setItem(DISMISS_KEY, JSON.stringify(next)); } catch { /* ignore */ } };
  const open = suggestions.filter((x) => !dismissed.includes(x.id));
  const go = (s: Suggestion) => onGo(s.target.uid ? `${s.target.section}.${s.target.uid}` : s.target.section);
  const when = publishedAt ? new Date(publishedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "Never";

  return (
    <>
      <div className="stats">
        <div className="stat"><small>Status</small><b>{unpublished ? "Unpublished changes" : "Live and up to date"}</b></div>
        <div className="stat"><small>Last published</small><b>{when}</b></div>
        <button className="stat link" onClick={() => onSection("inbox")}><small>Unread messages</small><b>{unread}</b></button>
        <div className={`stat${errors.length ? " bad" : ""}`}><small>To fix before publishing</small><b>{errors.length}</b></div>
      </div>

      {errors.length ? (
        <section aria-labelledby="fix-h">
          <h3 className="adm-h3" id="fix-h">Fix before publishing</h3>
          {errors.slice(0, 10).map((i, n) => (
            <div key={n} className="adm-warn err adm-row" style={{ justifyContent: "space-between" }}>
              <span><b>{describe(i.path, c)}:</b> {i.message}</span>
              <button className="adm-btn sm" onClick={() => onGo(i.path)}>Take me there</button>
            </div>
          ))}
          {errors.length > 10 ? <p className="adm-muted">…and {errors.length - 10} more.</p> : null}
        </section>
      ) : <div className="adm-ok">{unpublished ? "No blocking problems. You can publish." : "Everything is published."}</div>}

      <h3 className="adm-h3">Suggestions{open.length ? ` (${open.length})` : ""}</h3>
      <p className="adm-muted adm-note">Advice only, nothing here blocks publishing. Press <b>?</b> to see why it matters and how to do it.</p>
      {open.length === 0 ? <div className="adm-ok">Nothing to suggest right now.</div> : open.map((x) => <SuggestionCard key={x.id} s={x} onGo={() => go(x)} onDismiss={() => dismiss(x.id)} />)}
      {dismissed.length ? <button type="button" className="adm-link" onClick={() => { setDismissed([]); try { localStorage.removeItem(DISMISS_KEY); } catch { /* ignore */ } }}>Show dismissed suggestions ({dismissed.length})</button> : null}
    </>
  );
}

/* ---------- Appearance ---------- */
export function AppearanceSection() {
  const { c, set } = useAdmin();
  const enabled = c.site.palettes;
  const toggle = (id: string, on: boolean) => set((d) => {
    const next = on ? [...d.site.palettes, id] : d.site.palettes.filter((p) => p !== id);
    if (!next.length) return;
    d.site.palettes = PALETTES.map((p) => p.id).filter((p) => next.includes(p));
    if (!d.site.palettes.includes(d.site.defaultPalette)) d.site.defaultPalette = d.site.palettes[0];
  });
  return (
    <>
      <p className="adm-muted">Choose which colour themes visitors can pick, and which one they see first. Every theme has a light and a dark version, and every combination below meets WCAG AA contrast.</p>
      <div className="adm-field" style={{ maxWidth: "16rem" }}>
        <label htmlFor="defmode">Default appearance</label>
        <select id="defmode" value={c.site.defaultMode} onChange={(e) => set((d) => { d.site.defaultMode = e.target.value as Content["site"]["defaultMode"]; })}>
          <option value="system">Follow the visitor&apos;s system</option><option value="light">Light</option><option value="dark">Dark</option>
        </select>
      </div>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="adm-label" style={{ marginBottom: ".6rem" }}>Colour themes</legend>
        {PALETTES.map((p) => {
          const checks = [...contrastChecks(p.light, "light"), ...contrastChecks(p.dark, "dark")];
          const failing = checks.filter((x) => x.ratio < x.min);
          const low = Math.min(...checks.filter((x) => x.min === 4.5).map((x) => x.ratio));
          const on = enabled.includes(p.id);
          return (
            <div key={p.id} className="adm-palette">
              <label className="adm-check"><input type="checkbox" checked={on} disabled={on && enabled.length === 1} onChange={(e) => toggle(p.id, e.target.checked)} /> {p.name}</label>
              <span className="sw" aria-hidden="true">{[p.light.bg, p.light.surface, p.light.accent, p.dark.bg, p.dark.surface, p.dark.accent].map((col, i) => <i key={i} style={{ background: col }} />)}</span>
              <span className="pill">{failing.length === 0 ? `AA · lowest text ${low.toFixed(1)}:1` : `${failing.length} contrast checks fail`}</span>
              <label className="adm-check" style={{ marginLeft: "auto" }}>
                <input type="radio" name="defpalette" checked={c.site.defaultPalette === p.id} disabled={!on} onChange={() => set((d) => { d.site.defaultPalette = p.id; })} /> Default
              </label>
            </div>
          );
        })}
      </fieldset>
      <p className="adm-muted" style={{ marginTop: "1rem" }}>Your own admin theme (Daylight, Paper, Midnight, Graphite or System) is the selector in the top bar. It is remembered on this browser only.</p>
    </>
  );
}

/* ---------- Inbox ---------- */
export function InboxSection({ messages, setMessages, loaded, error, reload }: {
  messages: Message[]; setMessages: (m: Message[]) => void; loaded: boolean; error: string; reload: () => void;
}) {
  const { notify } = useAdmin();
  const [tab, setTab] = useState<"inbox" | "archived">("inbox");
  const [sel, setSel] = useState("");
  const [confirm, setConfirm] = useState<Message | null>(null);
  const list = messages.filter((m) => (tab === "archived") === m.archived);
  const cur = messages.find((m) => m.id === sel) ?? null;
  const patchLocal = (m: Message) => setMessages(messages.map((x) => (x.id === m.id ? m : x)));

  async function patch(id: string, body: { read?: boolean; archived?: boolean }) {
    const res = await fetch(`/api/admin/messages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = (await res.json().catch(() => ({}))) as { message?: Message; error?: string };
    if (!res.ok || !data.message) { notify(data.error ?? "Could not update."); return; }
    patchLocal(data.message);
  }
  async function del(m: Message) {
    const res = await fetch(`/api/admin/messages/${m.id}`, { method: "DELETE" });
    if (!res.ok) { notify("Could not delete the message."); return; }
    setMessages(messages.filter((x) => x.id !== m.id)); setSel(""); notify("Message deleted.");
  }
  function open(m: Message) { setSel(m.id); if (!m.read) void patch(m.id, { read: true }); }

  if (error) return <div className="adm-warn err">{error} <button className="adm-btn sm" onClick={reload}>Retry</button></div>;
  if (!loaded) return <p className="adm-muted">Loading messages…</p>;
  return (
    <>
      <div className="adm-row" style={{ marginBottom: "1rem" }}>
        <button className={`adm-btn sm${tab === "inbox" ? " primary" : ""}`} onClick={() => { setTab("inbox"); setSel(""); }}>Inbox ({messages.filter((m) => !m.archived).length})</button>
        <button className={`adm-btn sm${tab === "archived" ? " primary" : ""}`} onClick={() => { setTab("archived"); setSel(""); }}>Archived ({messages.filter((m) => m.archived).length})</button>
        <button className="adm-btn sm" onClick={reload}>Refresh</button>
      </div>
      <div className="adm-msg">
        <div className="adm-listbox">
          {list.length === 0 ? <p className="adm-muted">{tab === "inbox" ? "No messages yet." : "Nothing archived."}</p> : list.map((m) => (
            <div key={m.id} className={`adm-li${sel === m.id ? " sel" : ""}`}>
              <button className="adm-li-main" style={{ paddingLeft: ".7rem" }} onClick={() => open(m)}>
                <b className={m.read ? "" : "unread"}>{m.name}</b>
                <span>{m.topic} · {new Date(m.at).toLocaleDateString()}</span>
              </button>
            </div>
          ))}
        </div>
        <div>
          {cur ? (
            <div className="adm-editor">
              <h2 style={{ margin: 0, fontSize: "1.1rem" }}>{cur.name}</h2>
              <p className="adm-muted" style={{ margin: ".2rem 0 0" }}>{cur.email} · {cur.topic} · {new Date(cur.at).toLocaleString()}</p>
              <div className="adm-msg-body">{cur.message}</div>
              <div className="adm-row">
                <a className="adm-btn primary" href={`mailto:${cur.email}?subject=${encodeURIComponent("Re: " + cur.topic)}`}>Reply by email</a>
                <button className="adm-btn" onClick={() => patch(cur.id, { read: !cur.read })}>Mark {cur.read ? "unread" : "read"}</button>
                <button className="adm-btn" onClick={() => { void patch(cur.id, { archived: !cur.archived }); setSel(""); }}>{cur.archived ? "Move to inbox" : "Archive"}</button>
              </div>
              <div className="adm-danger"><button className="adm-btn danger" onClick={() => setConfirm(cur)}>Delete message…</button></div>
            </div>
          ) : <div className="adm-card adm-muted">Select a message to read it.</div>}
        </div>
      </div>
      <ConfirmModal open={!!confirm} danger title="Delete this message?" body="Messages can't be recovered after deletion." confirmLabel="Delete"
        onCancel={() => setConfirm(null)} onConfirm={() => { if (confirm) void del(confirm); setConfirm(null); }} />
    </>
  );
}

/* ---------- History ---------- */
function ChangeRow({ ch, onRestore }: { ch: Change; onRestore: (c: Change) => void }) {
  const [shown, setShown] = useState(false);
  return (
    <div className={`chg ${ch.kind}`}>
      <div className="chg-h">
        <span className="chg-k">{ch.kind === "changed" ? "Changed" : ch.kind === "added" ? "Added" : "Removed"}</span>
        <b>{ch.label}</b>
        {ch.kind === "changed" ? <button type="button" className="adm-link" onClick={() => setShown((x) => !x)}>{shown ? "Hide text" : "Show old and new text"}</button> : null}
        {ch.kind !== "added" ? <button type="button" className="adm-btn sm" onClick={() => onRestore(ch)}>{ch.kind === "removed" ? "Bring it back" : "Put old text back"}</button> : null}
      </div>
      {shown && ch.kind === "changed" ? (
        <div className="chg-body">
          <div><small>Before</small><p className="chg-old">{ch.before || <i>(empty)</i>}</p></div>
          <div><small>After</small><p className="chg-new">{ch.after || <i>(empty)</i>}</p></div>
          <div className="chg-diff"><small>What changed</small><p>{wordDiff(ch.before, ch.after).map((x, i) => <span key={i} className={x.t}>{x.s}</span>)}</p></div>
        </div>
      ) : null}
    </div>
  );
}

export function HistorySection({ dirty, baseRev, onRestored, onRestoreChange }: {
  dirty: boolean; baseRev: number; onRestored: (c: Content) => void; onRestoreChange: (c: Change) => void;
}) {
  const { notify } = useAdmin();
  const [rows, setRows] = useState<VersionInfo[] | null>(null);
  const [err, setErr] = useState("");
  const [pick, setPick] = useState<VersionInfo | null>(null);
  const [openId, setOpenId] = useState("");
  const [changes, setChanges] = useState<Record<string, Change[] | "loading" | "error">>({});
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setErr("");
    try {
      const res = await fetch("/api/admin/versions");
      const data = (await res.json()) as { versions?: VersionInfo[]; error?: string };
      if (!res.ok || !data.versions) throw new Error(data.error ?? "Could not load history.");
      setRows(data.versions);
    } catch (e) { setErr(e instanceof Error ? e.message : "Could not load history."); }
  };
  useEffect(() => { void load(); }, []);

  async function toggle(v: VersionInfo) {
    if (openId === v.id) { setOpenId(""); return; }
    setOpenId(v.id);
    if (changes[v.id] && changes[v.id] !== "error") return;
    setChanges((m) => ({ ...m, [v.id]: "loading" }));
    try {
      const res = await fetch(`/api/admin/versions/${v.id}`);
      const data = (await res.json()) as { changes?: Change[]; error?: string };
      if (!res.ok || !data.changes) throw new Error(data.error ?? "failed");
      setChanges((m) => ({ ...m, [v.id]: data.changes! }));
    } catch { setChanges((m) => ({ ...m, [v.id]: "error" })); }
  }

  async function restore(v: VersionInfo) {
    const res = await fetch(`/api/admin/versions/${v.id}/restore`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ baseRev }) });
    const data = (await res.json().catch(() => ({}))) as { draft?: Content; error?: string };
    if (!res.ok || !data.draft) { notify(data.error ?? "Could not restore."); return; }
    onRestored(data.draft);
    notify("Whole version restored into your draft. Review it, then publish.");
  }

  const sections = ["all", ...SECTIONS.map((x) => x.id)];
  return (
    <>
      <p className="adm-muted adm-note">Each time you publish, the changes are recorded: which text changed, and what it said before. Open a version to see them, and put back a single old value without touching anything else. The last 100 versions are kept.</p>
      <div className="adm-field" style={{ maxWidth: "16rem" }}>
        <label htmlFor="hist-filter">Show changes in</label>
        <select id="hist-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>{sections.map((x) => <option key={x} value={x}>{x === "all" ? "Everything" : sectionLabel(x)}</option>)}</select>
      </div>
      {err ? <div className="adm-warn err">{err} <button className="adm-btn sm" onClick={load}>Retry</button></div> : null}
      {rows === null && !err ? <p className="adm-muted">Loading…</p> : null}
      {rows?.length === 0 ? <div className="adm-card adm-muted">No published versions yet. Your first publish creates one.</div> : null}
      {rows?.map((v) => {
        const ch = changes[v.id];
        const list = Array.isArray(ch) ? ch.filter((x) => filter === "all" || x.section === filter) : [];
        return (
          <div key={v.id} className="adm-card ver">
            <div className="ver-h">
              <div><b>{new Date(v.at).toLocaleString()}</b>{v.note ? <span> · {v.note}</span> : null}<br /><span className="adm-muted adm-sm">{v.changeCount ? `${v.changeCount} change${v.changeCount === 1 ? "" : "s"}` : "No tracked changes"} · {v.counts}</span></div>
              <div className="adm-row">
                <button className="adm-btn sm" aria-expanded={openId === v.id} onClick={() => toggle(v)}>{openId === v.id ? "Hide changes" : "See changes"}</button>
                <button className="adm-btn sm" onClick={() => setPick(v)}>Restore whole version…</button>
              </div>
            </div>
            {openId === v.id ? (
              <div className="ver-body">
                {ch === "loading" || ch === undefined ? <p className="adm-muted">Loading changes…</p> : null}
                {ch === "error" ? <p className="adm-err">Couldn&apos;t load the changes. <button className="adm-link" onClick={() => { setChanges((m) => { const n = { ...m }; delete n[v.id]; return n; }); void toggle(v); }}>Retry</button></p> : null}
                {Array.isArray(ch) && list.length === 0 ? <p className="adm-muted">{ch.length ? "No changes in this section." : "This version was recorded without change details."}</p> : null}
                {list.map((x) => <ChangeRow key={x.id} ch={x} onRestore={onRestoreChange} />)}
              </div>
            ) : null}
          </div>
        );
      })}
      <ConfirmModal open={!!pick} title="Restore this whole version into your draft?" confirmLabel="Restore"
        body={dirty ? "You have unsaved edits. They will be replaced by this version." : "Your current draft will be replaced by this version. Nothing goes live until you publish."}
        onCancel={() => setPick(null)} onConfirm={() => { if (pick) void restore(pick); setPick(null); }} />
    </>
  );
}

/* ---------- Preview ---------- */
export function PreviewSection({ dirty, pages }: { dirty: boolean; pages: Content["pages"] }) {
  const [path, setPath] = useState("/");
  const [width, setWidth] = useState<number | "100%">("100%");
  const [n, setN] = useState(0);
  const src = `/api/admin/preview?on=1&next=${encodeURIComponent(path)}&r=${n}`;
  return (
    <>
      <p className="adm-muted">This is your saved draft with hidden items shown, exactly as it will look once published.</p>
      {dirty ? <div className="adm-warn">You have unsaved edits. Save the draft to see them here.</div> : null}
      <div className="adm-row" style={{ marginBottom: ".8rem" }}>
        <div className="adm-field" style={{ margin: 0 }}>
          <label className="sr-only" htmlFor="pv-page">Page</label>
          <select id="pv-page" value={path} onChange={(e) => setPath(e.target.value)}>
            {pages.filter((p) => p.visible || true).map((p) => <option key={p.id} value={PAGE_PATH[p.id]}>{p.title}</option>)}
          </select>
        </div>
        {([["Phone", 390], ["Tablet", 820], ["Desktop", "100%"]] as const).map(([l, w]) => (
          <button key={l} className={`adm-btn sm${width === w ? " primary" : ""}`} onClick={() => setWidth(w)}>{l}</button>
        ))}
        <button className="adm-btn sm" onClick={() => setN((x) => x + 1)}>Refresh</button>
        <a className="adm-btn sm" href={src} target="_blank" rel="noopener noreferrer">Open in new tab</a>
      </div>
      <div className="adm-frame"><iframe key={src} title="Draft preview" src={src} style={{ width }} /></div>
      <p className="adm-muted" style={{ marginTop: ".8rem" }}>Preview stays on for you until you choose Exit preview on the site. Visitors never see it.</p>
    </>
  );
}

/* ---------- Backup & import ---------- */
const summary = (c: Content) => [
  ["Pages (public)", c.pages.filter((p) => p.visible).length], ["Projects", c.projects.length], ["Experience", c.work.length],
  ["Technologies", c.stack.reduce((n, g) => n + g.items.length, 0)], ["Testimonials", c.testimonials.length],
] as [string, number][];

export function AdvancedSection({ onImport }: { onImport: (c: Content) => void }) {
  const { c, notify } = useAdmin();
  const [busy, setBusy] = useState(false);
  const [incoming, setIncoming] = useState<Content | null>(null);
  const [err, setErr] = useState("");
  const fid = useId();

  async function exportAll() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/export");
      if (!res.ok) { const d = (await res.json().catch(() => ({}))) as { error?: string }; throw new Error(d.error ?? "Export failed."); }
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      notify("Backup downloaded.");
    } catch (e) { notify(e instanceof Error ? e.message : "Export failed."); }
    finally { setBusy(false); }
  }

  async function readFile(f: File | undefined) {
    if (!f) return;
    setErr("");
    if (f.size > 1_000_000) { setErr("That file is too large to be a portfolio backup."); return; }
    try {
      const raw = JSON.parse(await f.text()) as Record<string, unknown>;
      const src = raw && typeof raw === "object" && "draft" in raw ? raw.draft : raw;
      if (!src || typeof src !== "object" || !("profile" in (src as object))) throw new Error("not a portfolio backup");
      setIncoming(normalizeContent(src));
    } catch { setErr("That file isn't a valid portfolio backup."); }
  }

  const before = summary(c), after = incoming ? summary(incoming) : [];
  return (
    <>
      <h2 className="adm-h2">Download a backup</h2>
      <p className="adm-muted">Includes your draft and the published version. A copy is also saved automatically once a day when you open the admin (last 14 kept).</p>
      <button className="adm-btn" onClick={exportAll} disabled={busy}>{busy ? "Preparing…" : "Download backup"}</button>
      <h2 className="adm-h2">Import a backup</h2>
      <p className="adm-muted">You&apos;ll see what changes before anything is loaded. Importing replaces your editor content but doesn&apos;t publish it.</p>
      <input id={fid} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => { void readFile(e.target.files?.[0]); e.target.value = ""; }} />
      <label htmlFor={fid} className="adm-btn" style={{ cursor: "pointer" }}>Choose backup file…</label>
      {err ? <p className="err" role="alert" style={{ color: "var(--danger)", fontWeight: 700 }}>{err}</p> : null}
      <ConfirmModal open={!!incoming} title="Load this backup into your editor?" confirmLabel="Load into editor" onCancel={() => setIncoming(null)}
        onConfirm={() => { if (incoming) onImport(incoming); setIncoming(null); }}>
        <table className="tbl" style={{ marginTop: "1rem", fontSize: ".88rem" }}>
          <thead><tr><th>Item</th><th>Now</th><th>Backup</th></tr></thead>
          <tbody>{before.map(([l, n], i) => <tr key={l}><td>{l}</td><td>{n}</td><td>{after[i]?.[1]}</td></tr>)}</tbody>
        </table>
      </ConfirmModal>
    </>
  );
}

/* ---------- Command palette ---------- */
export interface Command { label: string; hint: string; run: () => void }
export function CommandPalette({ open, onClose, commands }: { open: boolean; onClose: () => void; commands: Command[] }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const ref = useFocusTrap<HTMLDivElement>(open, onClose);
  const id = useId();
  useEffect(() => { if (open) { setQ(""); setSel(0); } }, [open]);
  const hits = useMemo(() => { const v = q.trim().toLowerCase(); return commands.filter((c) => !v || `${c.label} ${c.hint}`.toLowerCase().includes(v)).slice(0, 12); }, [q, commands]);
  if (!open) return null;
  const run = (c: Command) => { onClose(); c.run(); };
  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="panel" ref={ref} role="dialog" aria-modal="true" aria-label="Search the admin">
        <input type="search" autoFocus value={q} placeholder="Jump to a section, project, or action" role="combobox" aria-expanded="true" aria-controls={id}
          aria-activedescendant={hits[sel] ? `${id}-${sel}` : undefined}
          onChange={(e) => { setQ(e.target.value); setSel(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, hits.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
            if (e.key === "Enter" && hits[sel]) run(hits[sel]);
          }} />
        <div className="results" id={id} role="listbox">
          {hits.length === 0 ? <p>No matches.</p> : hits.map((h, i) => (
            <a key={i} id={`${id}-${i}`} role="option" aria-selected={i === sel} className={i === sel ? "sel" : ""} tabIndex={-1} href="#" onMouseEnter={() => setSel(i)} onClick={(e) => { e.preventDefault(); run(h); }}>
              {h.label}<small>{h.hint}</small>
            </a>
          ))}
        </div>
        <button className="adm-btn sm close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
