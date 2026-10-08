"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { CASE_LABELS, EMPTY_CASE } from "@/lib/defaults";
import { readiness } from "@/lib/readiness";
import type { CaseStudy, Content, Project, StackGroup, WorkEntry } from "@/lib/types";

type Set = (fn: (d: Content) => void) => void;

function Field(props: {
  label: string; value: string; onChange: (v: string) => void;
  rows?: number; hint?: string; placeholder?: string; mono?: boolean;
}) {
  const id = useId();
  const { label, value, onChange, rows, hint, placeholder, mono } = props;
  return (
    <div className="adm-field">
      <label htmlFor={id}>{label}</label>
      {rows ? (
        <textarea id={id} rows={rows} value={value} placeholder={placeholder} className={mono ? "mono" : ""} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}

function Public({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="adm-check">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} /> Public
    </label>
  );
}

function Mover({ i, len, onMove, onDelete }: {
  i: number; len: number; onMove: (dir: -1 | 1) => void; onDelete?: () => void;
}) {
  return (
    <span className="adm-row">
      <button type="button" className="adm-btn sm" disabled={i === 0} onClick={() => onMove(-1)} aria-label="Move up">↑</button>
      <button type="button" className="adm-btn sm" disabled={i === len - 1} onClick={() => onMove(1)} aria-label="Move down">↓</button>
      {onDelete ? <button type="button" className="adm-btn sm danger" onClick={onDelete}>Delete</button> : null}
    </span>
  );
}

function move<T>(arr: T[], i: number, dir: -1 | 1) {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

const lines = (a: string[]) => a.join("\n");
const toLines = (v: string) => v.split("\n");

function Badge({ visible }: { visible: boolean }) {
  return <span className={`pill${visible ? "" : " draft"}`}>{visible ? "Public" : "Hidden"}</span>;
}

/* ---------- Tabs ---------- */

function PagesTab({ c, set }: { c: Content; set: Set }) {
  return (
    <>
      <p className="muted">Rename, reorder or hide pages. Hiding Projects also hides every project page. Pages with nothing to show stay hidden automatically.</p>
      {c.pages.map((p, i) => (
        <div className="adm-card" key={p.id} style={{ padding: "1rem" }}>
          <div className="adm-grid">
            <Field label={`Title (${p.id})`} value={p.title} onChange={(v) => set((d) => { d.pages[i].title = v; })} />
            <div className="adm-field">
              <label>Visibility</label>
              {p.id === "start" ? <small>The start page is always public.</small> : <Public value={p.visible} onChange={(v) => set((d) => { d.pages[i].visible = v; })} />}
            </div>
          </div>
          <Mover i={i} len={c.pages.length} onMove={(dir) => set((d) => move(d.pages, i, dir))} />
        </div>
      ))}
    </>
  );
}

function ProfileTab({ c, set }: { c: Content; set: Set }) {
  return (
    <>
      <div className="adm-grid">
        <Field label="Name" value={c.profile.name} onChange={(v) => set((d) => { d.profile.name = v; })} />
        <Field label="Role" value={c.profile.role} onChange={(v) => set((d) => { d.profile.role = v; })} />
      </div>
      <Field label="Positioning statement (first heading)" value={c.profile.positioning} rows={2}
        hint="One specific sentence. Every claim needs a real example behind it."
        onChange={(v) => set((d) => { d.profile.positioning = v; })} />
      <Field label="Introduction" value={c.profile.intro} rows={3} onChange={(v) => set((d) => { d.profile.intro = v; })} />
    </>
  );
}

function AboutTab({ c, set }: { c: Content; set: Set }) {
  return (
    <Field label="About text" value={c.about} rows={14}
      hint="Blank line = new paragraph. Lines starting with “- ” become a bullet list. Leave empty to hide the page."
      onChange={(v) => set((d) => { d.about = v; })} />
  );
}

function WorkTab({ c, set }: { c: Content; set: Set }) {
  const add = () => set((d) => {
    d.work.push({ id: "new-entry", title: "New entry", org: "", dates: "", blurb: "", items: [], outcome: "", visible: false });
  });
  return (
    <>
      <p className="muted">Describe responsibility, what you built and how it was validated, generalized for confidentiality. Company and dates appear only if you fill them in.</p>
      {c.work.map((w: WorkEntry, i) => (
        <details className="adm-card" key={i}>
          <summary>{w.title || "Untitled"} <Badge visible={w.visible} /></summary>
          <div>
            <div className="adm-grid">
              <Field label="Role title" value={w.title} onChange={(v) => set((d) => { d.work[i].title = v; })} />
              <Field label="Company (optional)" value={w.org} onChange={(v) => set((d) => { d.work[i].org = v; })} />
              <Field label="Dates (optional)" value={w.dates} onChange={(v) => set((d) => { d.work[i].dates = v; })} />
            </div>
            <Field label="Summary" value={w.blurb} rows={2} onChange={(v) => set((d) => { d.work[i].blurb = v; })} />
            <h2>Work items</h2>
            {w.items.map((it, j) => (
              <div className="adm-sub" key={j}>
                <Field label="Title" value={it.title} onChange={(v) => set((d) => { d.work[i].items[j].title = v; })} />
                <Field label="Description" value={it.text} rows={2} onChange={(v) => set((d) => { d.work[i].items[j].text = v; })} />
                <Mover i={j} len={w.items.length} onMove={(dir) => set((d) => move(d.work[i].items, j, dir))}
                  onDelete={() => set((d) => { d.work[i].items.splice(j, 1); })} />
              </div>
            ))}
            <button type="button" className="adm-btn sm" onClick={() => set((d) => { d.work[i].items.push({ title: "", text: "" }); })}>Add work item</button>
            <Field label="Outcome or a decision you owned" value={w.outcome} rows={3} onChange={(v) => set((d) => { d.work[i].outcome = v; })} />
            <div className="adm-row" style={{ justifyContent: "space-between" }}>
              <Public value={w.visible} onChange={(v) => set((d) => { d.work[i].visible = v; })} />
              <Mover i={i} len={c.work.length} onMove={(dir) => set((d) => move(d.work, i, dir))}
                onDelete={() => { if (confirm(`Delete "${w.title}"?`)) set((d) => { d.work.splice(i, 1); }); }} />
            </div>
          </div>
        </details>
      ))}
      <button type="button" className="adm-btn" onClick={add}>Add experience entry</button>
    </>
  );
}

function ProjectsTab({ c, set }: { c: Content; set: Set }) {
  const add = () => set((d) => {
    d.projects.push({
      id: "new-project", name: "New project", category: "", summary: "", status: "", tech: [], scope: [],
      caseStudy: { ...EMPTY_CASE }, demoUrl: "", repoUrl: "", sourceNote: "", visible: false,
    });
  });
  return (
    <>
      <p className="muted">Three to five featured projects work best. Empty case-study sections are never shown publicly. Links appear only if filled in.</p>
      {c.projects.map((p: Project, i) => (
        <details className="adm-card" key={i}>
          <summary>{p.name || "Untitled"} <Badge visible={p.visible} /></summary>
          <div>
            <div className="adm-grid">
              <Field label="Name" value={p.name} onChange={(v) => set((d) => { d.projects[i].name = v; })} />
              <Field label="URL slug" value={p.id} hint="Used in the page address." onChange={(v) => set((d) => { d.projects[i].id = v; })} />
              <Field label="Category" value={p.category} onChange={(v) => set((d) => { d.projects[i].category = v; })} />
              <Field label="Status label (optional)" value={p.status} onChange={(v) => set((d) => { d.projects[i].status = v; })} />
            </div>
            <Field label="Summary" value={p.summary} rows={2} onChange={(v) => set((d) => { d.projects[i].summary = v; })} />
            <div className="adm-grid">
              <Field label="Technologies (one per line)" value={lines(p.tech)} rows={4} onChange={(v) => set((d) => { d.projects[i].tech = toLines(v); })} />
              <Field label="Scope / features (one per line)" value={lines(p.scope)} rows={4}
                hint="Keep only what is true." onChange={(v) => set((d) => { d.projects[i].scope = toLines(v); })} />
            </div>
            <h2>Case study</h2>
            {(Object.keys(CASE_LABELS) as (keyof CaseStudy)[]).map((k) => (
              <Field key={k} label={CASE_LABELS[k]} value={p.caseStudy[k]} rows={k === "decisions" ? 5 : 3}
                hint={k === "decisions" ? "Options considered, choice made, reason." : undefined}
                onChange={(v) => set((d) => { d.projects[i].caseStudy[k] = v; })} />
            ))}
            <h2>Links</h2>
            <div className="adm-grid">
              <Field label="Live demo URL" value={p.demoUrl} placeholder="https://" onChange={(v) => set((d) => { d.projects[i].demoUrl = v; })} />
              <Field label="Repository URL" value={p.repoUrl} placeholder="https://" onChange={(v) => set((d) => { d.projects[i].repoUrl = v; })} />
            </div>
            <Field label="If no source is available, say why" value={p.sourceNote} onChange={(v) => set((d) => { d.projects[i].sourceNote = v; })} />
            <div className="adm-row" style={{ justifyContent: "space-between" }}>
              <Public value={p.visible} onChange={(v) => set((d) => { d.projects[i].visible = v; })} />
              <Mover i={i} len={c.projects.length} onMove={(dir) => set((d) => move(d.projects, i, dir))}
                onDelete={() => { if (confirm(`Delete "${p.name}"?`)) set((d) => { d.projects.splice(i, 1); }); }} />
            </div>
          </div>
        </details>
      ))}
      <button type="button" className="adm-btn" onClick={add}>Add project</button>
    </>
  );
}

function StackTab({ c, set }: { c: Content; set: Set }) {
  return (
    <>
      {c.stack.map((g: StackGroup, i) => (
        <details className="adm-card" key={i}>
          <summary>{g.name || "Untitled group"} <Badge visible={g.visible} /></summary>
          <div>
            <Field label="Group name" value={g.name} onChange={(v) => set((d) => { d.stack[i].name = v; })} />
            {g.items.map((it, j) => (
              <div className="adm-sub" key={j}>
                <div className="adm-grid">
                  <Field label="Technology" value={it.name} onChange={(v) => set((d) => { d.stack[i].items[j].name = v; })} />
                  <Field label="Used for" value={it.description} onChange={(v) => set((d) => { d.stack[i].items[j].description = v; })} />
                </div>
                <div className="adm-row" style={{ justifyContent: "space-between" }}>
                  <Public value={it.visible} onChange={(v) => set((d) => { d.stack[i].items[j].visible = v; })} />
                  <Mover i={j} len={g.items.length} onMove={(dir) => set((d) => move(d.stack[i].items, j, dir))}
                    onDelete={() => set((d) => { d.stack[i].items.splice(j, 1); })} />
                </div>
              </div>
            ))}
            <button type="button" className="adm-btn sm" onClick={() => set((d) => { d.stack[i].items.push({ name: "", description: "", visible: true }); })}>Add technology</button>
            <div className="adm-row" style={{ justifyContent: "space-between", marginTop: "1rem" }}>
              <Public value={g.visible} onChange={(v) => set((d) => { d.stack[i].visible = v; })} />
              <Mover i={i} len={c.stack.length} onMove={(dir) => set((d) => move(d.stack, i, dir))}
                onDelete={() => { if (confirm(`Delete group "${g.name}"?`)) set((d) => { d.stack.splice(i, 1); }); }} />
            </div>
          </div>
        </details>
      ))}
      <button type="button" className="adm-btn" onClick={() => set((d) => { d.stack.push({ id: "new-group", name: "New group", items: [], visible: false }); })}>Add group</button>
    </>
  );
}

function HowTab({ c, set }: { c: Content; set: Set }) {
  return (
    <>
      <Field label="Introduction" value={c.how.intro} rows={2} onChange={(v) => set((d) => { d.how.intro = v; })} />
      {c.how.steps.map((s, i) => (
        <div className="adm-card" key={i} style={{ padding: "1rem" }}>
          <Field label={`Step ${i + 1} title`} value={s.title} onChange={(v) => set((d) => { d.how.steps[i].title = v; })} />
          <Field label="Description" value={s.text} rows={2} onChange={(v) => set((d) => { d.how.steps[i].text = v; })} />
          <Mover i={i} len={c.how.steps.length} onMove={(dir) => set((d) => move(d.how.steps, i, dir))}
            onDelete={() => set((d) => { d.how.steps.splice(i, 1); })} />
        </div>
      ))}
      <button type="button" className="adm-btn" onClick={() => set((d) => { d.how.steps.push({ title: "New step", text: "" }); })}>Add step</button>
    </>
  );
}

function ContactTab({ c, set }: { c: Content; set: Set }) {
  return (
    <>
      <p className="muted">Only fields you fill in are shown publicly. Links must start with https:// (resume can also be a path like /resume.pdf).</p>
      <div className="adm-grid">
        <Field label="Email" value={c.contact.email} onChange={(v) => set((d) => { d.contact.email = v; })} />
        <Field label="GitHub URL" value={c.contact.github} placeholder="https://github.com/…" onChange={(v) => set((d) => { d.contact.github = v; })} />
        <Field label="LinkedIn URL" value={c.contact.linkedin} placeholder="https://linkedin.com/in/…" onChange={(v) => set((d) => { d.contact.linkedin = v; })} />
        <Field label="Resume URL" value={c.contact.resumeUrl} placeholder="https://… or /resume.pdf" hint="Put the PDF in the project's public/ folder to use a path." onChange={(v) => set((d) => { d.contact.resumeUrl = v; })} />
      </div>
    </>
  );
}

function AdvancedTab({ c, onApply }: { c: Content; onApply: (c: Content) => void }) {
  const [text, setText] = useState(() => JSON.stringify(c, null, 2));
  const [err, setErr] = useState("");
  return (
    <>
      <p className="muted">Raw content as JSON. Use this to import a backup. Invalid fields are cleaned up when you save.</p>
      <Field label="Content JSON" value={text} rows={22} mono onChange={setText} />
      {err ? <p className="adm-err" role="alert">{err}</p> : null}
      <button type="button" className="adm-btn" onClick={() => {
        try { onApply(JSON.parse(text) as Content); setErr(""); } catch { setErr("That is not valid JSON."); }
      }}>Load into editor</button>
      <p className="muted">Loading does not publish. Review the other tabs, then choose Save changes.</p>
    </>
  );
}

function OverviewTab({ c }: { c: Content }) {
  const warnings = useMemo(() => readiness(c), [c]);
  return (
    <>
      <h2 style={{ marginTop: 0 }}>Publish-readiness check</h2>
      <p className="muted">Based on what is in the editor now. These are warnings, nothing is blocked.</p>
      {warnings.length === 0 ? <div className="adm-ok">Nothing to flag.</div> : warnings.map((w, i) => (
        <div key={i} className={`adm-warn${w.level === "info" ? " info" : ""}`}>{w.text}</div>
      ))}
      <h2>Backup</h2>
      <p className="muted">Download all content, including hidden items, as JSON. Do this regularly.</p>
      <a className="adm-btn" href="/api/admin/export">Export content</a>
    </>
  );
}

/* ---------- Shell ---------- */

const TABS = [
  ["overview", "Overview"], ["pages", "Pages"], ["profile", "Profile"], ["about", "About"],
  ["work", "Experience"], ["projects", "Projects"], ["stack", "Stack"], ["how", "How I work"],
  ["contact", "Contact"], ["advanced", "Advanced"],
] as const;
type Tab = (typeof TABS)[number][0];

export function AdminApp({ initial }: { initial: Content }) {
  const [c, setC] = useState<Content>(initial);
  const [tab, setTab] = useState<Tab>("overview");
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const set: Set = (fn) => {
    setC((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
    setDirty(true);
    setStatus("");
  };

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    setSaving(true);
    setStatus("Saving…");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c),
      });
      if (res.status === 401) { setStatus("Session expired. Reload the page and sign in again."); return; }
      const data = (await res.json()) as { content?: Content; error?: string };
      if (!res.ok || !data.content) throw new Error(data.error ?? "Save failed.");
      setC(data.content);
      setDirty(false);
      setStatus("Saved. The public site is updated.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    location.reload();
  }

  return (
    <main className="adm">
      <div className="adm-bar">
        <div>
          <h1>Portfolio admin</h1>
          <span className="adm-status" role="status">{status || (dirty ? "Unsaved changes" : "All changes saved")}</span>
        </div>
        <div className="adm-row">
          <Link className="adm-btn" href="/" target="_blank">View site</Link>
          <button className="adm-btn primary" onClick={save} disabled={!dirty || saving}>Save changes</button>
          <button className="adm-btn" onClick={signOut}>Sign out</button>
        </div>
      </div>

      <div className="adm-tabs" role="tablist">
        {TABS.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? "on" : ""} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab c={c} />}
      {tab === "pages" && <PagesTab c={c} set={set} />}
      {tab === "profile" && <ProfileTab c={c} set={set} />}
      {tab === "about" && <AboutTab c={c} set={set} />}
      {tab === "work" && <WorkTab c={c} set={set} />}
      {tab === "projects" && <ProjectsTab c={c} set={set} />}
      {tab === "stack" && <StackTab c={c} set={set} />}
      {tab === "how" && <HowTab c={c} set={set} />}
      {tab === "contact" && <ContactTab c={c} set={set} />}
      {tab === "advanced" && (
        <AdvancedTab key={JSON.stringify(c).length} c={c} onApply={(next) => { setC(next); setDirty(true); setStatus("Loaded into the editor. Not saved yet."); }} />
      )}
    </main>
  );
}
