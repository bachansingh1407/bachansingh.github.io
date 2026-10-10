"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { applyChange } from "@/lib/changes";
import { sameContent } from "@/lib/public";
import { suggestions as buildSuggestions } from "@/lib/readiness";
import type { Change, Content, Issue, Message } from "@/lib/types";
import { validateContent } from "@/lib/validate";
import { AdminThemeSwitch } from "./AdminThemeSwitch";
import {
  AboutSection, AssistantSection, ContactSection, HowSection, PagesSection, ProfileSection, ProjectsSection, StackSection, TestimonialsSection, WorkSection,
} from "./sections";
import {
  AdvancedSection, AppearanceSection, CommandPalette, DashboardSection, HistorySection, InboxSection, PreviewSection, SECTIONS, locate, sectionLabel,
  type Command, type SectionId,
} from "./tools";
import { AdminCtx, ConfirmModal, PageHeader, Toast, type Ctx } from "./ui";

const JSON_HEADERS = { "Content-Type": "application/json" };
const GROUPS = ["Overview", "Content", "Site", "Inbox & tools"];

export function AdminApp({ initialDraft, initialPublished, aiConfigured }: { initialDraft: Content; initialPublished: Content; aiConfigured: boolean }) {
  const [c, setC] = useState(initialDraft);
  const [published, setPublished] = useState(initialPublished);
  const [dirty, setDirty] = useState(false);
  const [section, setSection] = useState<SectionId>("dashboard");
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ text: string; undo?: () => void; n: number } | null>(null);
  const [busy, setBusy] = useState<"" | "save" | "publish">("");
  const [pubOpen, setPubOpen] = useState(false);
  const [note, setNote] = useState("");
  const [palette, setPalette] = useState(false);
  const [conflict, setConflict] = useState<Content | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [mLoaded, setMLoaded] = useState(false);
  const [mError, setMError] = useState("");

  const cRef = useRef(c); cRef.current = c;
  const seq = useRef(0);

  const issues = useMemo(() => validateContent(c), [c]);
  const sugg = useMemo(() => buildSuggestions(c), [c]);
  const issueMap = useMemo(() => { const m = new Map<string, Issue>(); for (const i of issues) if (!m.has(i.path)) m.set(i.path, i); return m; }, [issues]);
  const errors = issues.filter((i) => i.level === "error");
  const unpublished = !sameContent(c, published);
  const sectionErrors = useMemo(() => { const m: Record<string, number> = {}; for (const i of errors) { const s = locate(i.path).section; m[s] = (m[s] ?? 0) + 1; } return m; }, [errors]);

  const notify = useCallback((text: string, undo?: () => void) => setToast({ text, undo, n: Date.now() }), []);
  const set = useCallback((fn: (d: Content) => void) => {
    seq.current += 1;
    setC((prev) => { const next = structuredClone(prev); fn(next); return next; });
    setDirty(true);
  }, []);
  const remove = useCallback((label: string, fn: (d: Content) => void) => {
    const before = cRef.current;
    set(fn);
    notify(`Deleted "${label}".`, () => { seq.current += 1; setC(before); setDirty(true); });
  }, [set, notify]);

  const ctx: Ctx = {
    c, set, remove, notify, selected, aiOn: aiConfigured,
    issue: (p) => issueMap.get(p),
    count: (prefix) => errors.filter((i) => i.path === prefix || i.path.startsWith(prefix + ".")).length,
    select: (s, uid) => setSelected((x) => ({ ...x, [s]: uid })),
  };

  const goTo = useCallback((path: string) => {
    const { section: s, uid } = locate(path);
    setSection(s);
    if (uid) setSelected((x) => ({ ...x, [s]: uid }));
    window.scrollTo({ top: 0 });
  }, []);

  /** Saves the draft. Only the revision is merged back, so anything typed meanwhile is never overwritten. */
  const persist = useCallback(async (): Promise<Content | null> => {
    const sentSeq = seq.current;
    try {
      const cur = cRef.current;
      const res = await fetch("/api/admin/draft", { method: "PUT", headers: JSON_HEADERS, body: JSON.stringify({ content: cur, baseRev: cur.rev }) });
      const data = (await res.json().catch(() => ({}))) as { draft?: Content; current?: Content; error?: string };
      if (res.status === 409) { setConflict(data.current ?? null); return null; }
      if (!res.ok || !data.draft) { notify(data.error ?? "Could not save."); return null; }
      setC((prev) => ({ ...prev, rev: data.draft!.rev, updated: data.draft!.updated }));
      cRef.current = { ...cRef.current, rev: data.draft.rev, updated: data.draft.updated };
      if (seq.current === sentSeq) setDirty(false);
      return data.draft;
    } catch { notify("Couldn't reach the server. Your edits are still here. Try again."); return null; }
  }, [notify]);

  const save = useCallback(async () => {
    if (busy) return;
    setBusy("save");
    const d = await persist();
    setBusy("");
    if (d) notify("Draft saved.");
  }, [busy, persist, notify]);

  async function doPublish() {
    setBusy("publish");
    try {
      let rev = cRef.current.rev;
      if (dirty) { const d = await persist(); if (!d) return; rev = d.rev; }
      const res = await fetch("/api/admin/publish", { method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ baseRev: rev, note }) });
      const data = (await res.json().catch(() => ({}))) as { published?: Content; draft?: Content; current?: Content; error?: string };
      if (res.status === 409) { setConflict(data.current ?? null); return; }
      if (!res.ok || !data.published || !data.draft) { notify(data.error ?? "Could not publish. Nothing was changed."); setSection("dashboard"); return; }
      setPublished(data.published);
      setC((prev) => ({ ...prev, publishedAt: data.draft!.publishedAt }));
      setPubOpen(false); setNote("");
      notify("Published. Your changes are live.");
    } catch { notify("Couldn't reach the server. Nothing was published."); }
    finally { setBusy(""); }
  }

  /** Puts one old value (or a removed item) back into the draft. */
  const restoreChange = useCallback((ch: Change) => {
    const draft = structuredClone(cRef.current);
    if (!applyChange(draft, ch)) { notify("Can't put this back: the item it belonged to no longer exists."); return; }
    seq.current += 1; setC(draft); setDirty(true);
    notify(`Put back: ${ch.label}. Review it, then save and publish.`);
  }, [notify]);

  const loadMessages = useCallback(async () => {
    setMError("");
    try {
      const res = await fetch("/api/admin/messages");
      const data = (await res.json()) as { messages?: Message[]; error?: string };
      if (!res.ok || !data.messages) throw new Error(data.error ?? "Could not load messages.");
      setMessages(data.messages); setMLoaded(true);
    } catch (e) { setMError(e instanceof Error ? e.message : "Could not load messages."); }
  }, []);
  useEffect(() => { void loadMessages(); }, [loadMessages]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette(true); }
      if (mod && e.key.toLowerCase() === "s") { e.preventDefault(); void save(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  async function signOut() {
    if (dirty && !confirm("You have unsaved changes. Sign out anyway?")) return;
    await fetch("/api/admin/logout", { method: "POST" });
    location.reload();
  }

  const unread = messages.filter((m) => !m.read && !m.archived).length;
  const commands: Command[] = [
    ...SECTIONS.map((s) => ({ label: s.label, hint: "Section", run: () => setSection(s.id) })),
    ...c.projects.map((p) => ({ label: p.name || "Untitled project", hint: "Project", run: () => goTo(`projects.${p.uid}`) })),
    ...c.work.map((w) => ({ label: w.title || "Untitled role", hint: "Experience", run: () => goTo(`work.${w.uid}`) })),
    ...c.stack.map((g) => ({ label: g.name || "Untitled group", hint: "Stack group", run: () => goTo(`stack.${g.uid}`) })),
    ...c.testimonials.map((t) => ({ label: t.name || "Testimonial", hint: "Testimonial", run: () => goTo(`testimonials.${t.uid}`) })),
    { label: "Save draft", hint: "Action · Ctrl S", run: () => void save() },
    { label: "Publish…", hint: "Action", run: () => setPubOpen(true) },
    { label: "Open the live site", hint: "Action", run: () => window.open("/", "_blank") },
  ];

  const def = SECTIONS.find((s) => s.id === section)!;
  const chip = dirty ? <span className="adm-chip dirty">● Unsaved changes</span>
    : unpublished ? <span className="adm-chip">Draft saved · not published</span>
    : <span className="adm-chip ok">✓ Published</span>;

  return (
    <AdminCtx.Provider value={ctx}>
      <div className="adm-layout">
        <nav className="adm-side" aria-label="Admin sections">
          <div className="adm-brand">
            <svg width="26" height="26" viewBox="0 0 30 30" fill="none" aria-hidden="true"><circle cx="15" cy="15" r="12" stroke="var(--accent)" strokeWidth="2.2" strokeDasharray="4 3.2" /><circle cx="15" cy="15" r="4.2" fill="var(--accent)" /></svg>
            Portfolio admin
          </div>
          {GROUPS.map((g) => (
            <div key={g} className="adm-group">
              <div className="adm-group-l">{g}</div>
              {SECTIONS.filter((s) => s.group === g).map((s) => {
                const n = sectionErrors[s.id] ?? 0;
                return (
                  <button key={s.id} className={`adm-nav${section === s.id ? " on" : ""}`} aria-current={section === s.id ? "page" : undefined} onClick={() => setSection(s.id)}>
                    <span className="adm-nav-l"><Icon name={s.icon} size={17} />{s.label}</span>
                    {n ? <span className="adm-count" aria-label={`${n} to fix`}>{n}</span> : s.id === "inbox" && unread ? <span className="adm-count info" aria-label={`${unread} unread`}>{unread}</span> : null}
                  </button>
                );
              })}
            </div>
          ))}
          <div className="adm-side-foot">
            <a className="adm-nav" href="/" target="_blank" rel="noopener noreferrer"><span className="adm-nav-l"><Icon name="link" size={17} />View site</span></a>
            <button className="adm-nav" onClick={signOut}><span className="adm-nav-l"><Icon name="user" size={17} />Sign out</span></button>
          </div>
        </nav>

        <div className="adm-col">
          <header className="adm-top">
            <div className="adm-row"><span className="adm-crumb">{sectionLabel(section)}</span>{chip}</div>
            <div className="adm-row">
              <button className="adm-btn sm" onClick={() => setPalette(true)} aria-label="Search the admin (Ctrl K)"><Icon name="search" size={14} />Search</button>
              <AdminThemeSwitch />
              <button className="adm-btn" onClick={() => void save()} disabled={!dirty || !!busy}>{busy === "save" ? "Saving…" : "Save draft"}</button>
              <button className="adm-btn primary" onClick={() => setPubOpen(true)} disabled={!!busy || (!dirty && !unpublished)}>Publish…</button>
            </div>
          </header>

          <main className="adm-main">
            <PageHeader title={def.label} description={def.desc} />
            {section === "dashboard" && <DashboardSection issues={issues} suggestions={sugg} unpublished={unpublished} publishedAt={published.publishedAt} unread={unread} onGo={goTo} onSection={setSection} />}
            {section === "profile" && <ProfileSection />}
            {section === "pages" && <PagesSection />}
            {section === "about" && <AboutSection />}
            {section === "work" && <WorkSection />}
            {section === "projects" && <ProjectsSection />}
            {section === "stack" && <StackSection />}
            {section === "how" && <HowSection />}
            {section === "testimonials" && <TestimonialsSection />}
            {section === "contact" && <ContactSection />}
            {section === "appearance" && <AppearanceSection />}
            {section === "assistant" && <AssistantSection />}
            {section === "inbox" && <InboxSection messages={messages} setMessages={setMessages} loaded={mLoaded} error={mError} reload={loadMessages} />}
            {section === "history" && <HistorySection dirty={dirty} baseRev={c.rev} onRestored={(d) => { seq.current += 1; setC(d); setDirty(false); }} onRestoreChange={restoreChange} />}
            {section === "preview" && <PreviewSection dirty={dirty} pages={c.pages} />}
            {section === "advanced" && <AdvancedSection onImport={(next) => { set((d) => { Object.assign(d, next, { rev: d.rev }); }); notify("Backup loaded into the editor. Review it, then save and publish."); }} />}
          </main>
        </div>
      </div>

      {toast ? <Toast key={toast.n} text={toast.text} undo={toast.undo} onClose={() => setToast(null)} /> : null}
      <CommandPalette open={palette} onClose={() => setPalette(false)} commands={commands} />

      <ConfirmModal open={pubOpen} title={errors.length ? "Fix these before publishing" : "Publish your changes?"}
        confirmLabel={errors.length ? "Review problems" : busy === "publish" ? "Publishing…" : "Publish"}
        body={errors.length ? `${errors.length} ${errors.length === 1 ? "problem needs" : "problems need"} fixing. Nothing has been published.` : "Visitors will see the new version straight away. The changes are recorded in History, so any old text can be put back."}
        onCancel={() => setPubOpen(false)}
        onConfirm={() => { if (errors.length) { setPubOpen(false); setSection("dashboard"); } else void doPublish(); }}>
        {errors.length ? (
          <div style={{ marginTop: "1rem" }}>{errors.slice(0, 5).map((e, i) => <div key={i} className="adm-warn err">{e.message}</div>)}</div>
        ) : (
          <div className="adm-field" style={{ marginTop: "1rem" }}>
            <label htmlFor="pub-note">What changed? (optional)</label>
            <input id="pub-note" type="text" maxLength={120} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Added PromptForge case study" />
            {sugg.length ? <small>{sugg.length} suggestions on the Dashboard (not blocking).</small> : null}
          </div>
        )}
      </ConfirmModal>

      <ConfirmModal open={!!conflict} title="This draft changed somewhere else" confirmLabel="Load the latest (discard my edits)"
        body="Another tab or device saved a newer draft. To avoid overwriting it, nothing was saved. You can load the latest version, or cancel to keep editing and copy out what you need."
        onCancel={() => setConflict(null)} onConfirm={() => { if (conflict) { seq.current += 1; setC(conflict); setDirty(false); } setConflict(null); }} />
    </AdminCtx.Provider>
  );
}
