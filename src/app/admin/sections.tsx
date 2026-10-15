"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BrandIcon, Icon } from "@/components/Icon";
import { FlowGraph } from "@/components/FlowGraph";
import { CASE_LABELS, EMPTY_CASE } from "@/lib/defaults";
import { STEP_ICONS } from "@/lib/icons";
import { L } from "@/lib/limits";
import { checkUrl } from "@/lib/validate";
import { newUid } from "@/lib/uid";
import type { CaseStudy, Project, StackGroup, StackIcon, StackItem, Step, StepKind, Testimonial, WorkEntry } from "@/lib/types";
import {
  Badge, Field, ImageField, ItemRow, MasterDetail, NumberField, RowMenu, SortableList, ToggleSwitch, VisibilitySwitch, uploadFile, useAdmin,
} from "./ui";

const lines = (a: string[]) => a.join("\n");
const toLines = (v: string) => v.split("\n");
const Sub = ({ children }: { children: ReactNode }) => <h3 className="adm-h3">{children}</h3>;
const Card = ({ children }: { children: ReactNode }) => <div className="adm-card">{children}</div>;
const Note = ({ children }: { children: ReactNode }) => <p className="adm-muted adm-note">{children}</p>;

/* ---------- Profile ---------- */
export function ProfileSection() {
  const { c, set } = useAdmin();
  const p = c.profile;
  return (
    <>
      <Card>
        <div className="adm-grid">
          <Field label="Name" path="profile.name" max={L.name} value={p.name} onChange={(v) => set((d) => { d.profile.name = v; })} />
          <Field label="Role" path="profile.role" max={L.role} value={p.role} onChange={(v) => set((d) => { d.profile.role = v; })} />
          <Field label="Location (optional)" path="profile.location" max={L.location} value={p.location} onChange={(v) => set((d) => { d.profile.location = v; })} />
        </div>
        <Field ai label="Positioning statement (home page heading)" path="profile.positioning" max={L.positioning} rows={2} value={p.positioning}
          hint="One specific sentence. Every claim needs a real example behind it." onChange={(v) => set((d) => { d.profile.positioning = v; })} />
        <Field ai label="Introduction" path="profile.intro" max={L.intro} rows={4} value={p.intro} onChange={(v) => set((d) => { d.profile.intro = v; })} />
      </Card>
      <Card>
        <ImageField label="Hero photo (optional)" media={p.photo} alt={p.photoAlt} altPath="profile.photoAlt" hint="Without a photo, the home page shows a graphic."
          onChange={(v) => set((d) => { d.profile.photo = v.media; d.profile.photoAlt = v.alt; })} />
      </Card>
    </>
  );
}

/* ---------- Pages ---------- */
export function PagesSection() {
  const { c, set } = useAdmin();
  const upd = (id: string, fn: (p: (typeof c.pages)[number]) => void) => set((d) => { const x = d.pages.find((q) => q.id === id); if (x) fn(x); });
  return (
    <>
      <Note>Rename, reorder or hide pages. Hiding Projects also hides every project page. Pages with nothing to show hide themselves.</Note>
      <SortableList name="pages" items={c.pages} idOf={(p) => p.id} labelOf={(p) => p.title} onChange={(next) => set((d) => { d.pages = next; })}>
        {({ item: p, index, handle, dragging, move }) => (
          <ItemRow handle={handle} dragging={dragging} actions={<RowMenu label={p.title} onUp={index > 0 ? () => move(-1) : undefined} onDown={index < c.pages.length - 1 ? () => move(1) : undefined} />}>
            <Field label={`Page title · /${p.id === "start" ? "" : p.id}`} path={`pages.${p.id}.title`} max={L.pageTitle} value={p.title} onChange={(v) => upd(p.id, (x) => { x.title = v; })} />
            {p.id === "start" ? <span className="adm-muted">The home page is always public.</span> : <VisibilitySwitch value={p.visible} onChange={(v) => upd(p.id, (x) => { x.visible = v; })} />}
          </ItemRow>
        )}
      </SortableList>
    </>
  );
}

export function AboutSection() {
  const { c, set } = useAdmin();
  return (
    <Card>
      <Field ai label="About text" path="about" max={L.about} rows={16} value={c.about}
        hint="Blank line = new paragraph. Lines starting with “- ” become a bullet list. Leave empty to hide the page." onChange={(v) => set((d) => { d.about = v; })} />
      <Note>Your email, GitHub and LinkedIn links appear beside this text. Switch that on or off in Contact & resume.</Note>
    </Card>
  );
}

/* ---------- Experience ---------- */
export function WorkSection() {
  const { c, set, remove, select } = useAdmin();
  const upd = (uid: string, fn: (w: WorkEntry) => void) => set((d) => { const x = d.work.find((i) => i.uid === uid); if (x) fn(x); });
  return (
    <MasterDetail<WorkEntry> section="work" noun="role" items={c.work} onChange={(next) => set((d) => { d.work = next; })}
      titleOf={(w) => w.title} metaOf={(w) => w.org} visibleOf={(w) => w.visible}
      onAdd={() => { const uid = newUid(); set((d) => { d.work.push({ uid, id: "new-role", title: "New role", org: "", dates: "", blurb: "", tech: [], items: [], outcome: "", visible: false }); }); select("work", uid); }}
      onDuplicate={(w) => { const uid = newUid(); set((d) => { d.work.push({ ...structuredClone(w), uid, id: w.id + "-copy", title: w.title + " (copy)", visible: false, items: w.items.map((i) => ({ ...i, uid: newUid() })) }); }); select("work", uid); }}
      onDelete={(w) => remove(w.title || "role", (d) => { d.work = d.work.filter((x) => x.uid !== w.uid); })}
      renderEditor={(w) => (
        <>
          <div className="adm-editor-head"><h2>{w.title || "Untitled role"}</h2><VisibilitySwitch value={w.visible} onChange={(v) => upd(w.uid, (x) => { x.visible = v; })} /></div>
          <Note>Describe responsibility, what you built and how it was validated, generalized for confidentiality.</Note>
          <div className="adm-grid">
            <Field label="Role title" path={`work.${w.uid}.title`} max={L.workTitle} value={w.title} onChange={(v) => upd(w.uid, (x) => { x.title = v; })} />
            <Field label="Company (optional)" path={`work.${w.uid}.org`} max={L.org} value={w.org} onChange={(v) => upd(w.uid, (x) => { x.org = v; })} />
            <Field label="Dates (optional)" path={`work.${w.uid}.dates`} max={L.dates} value={w.dates} onChange={(v) => upd(w.uid, (x) => { x.dates = v; })} />
          </div>
          <Field ai label="Summary" path={`work.${w.uid}.blurb`} max={L.blurb} rows={2} value={w.blurb} onChange={(v) => upd(w.uid, (x) => { x.blurb = v; })} />
          <Field label="Technologies used (one per line)" path={`work.${w.uid}.tech`} rows={3} value={lines(w.tech)} hint={`Up to ${L.workTech}. Shown as chips on the page.`} onChange={(v) => upd(w.uid, (x) => { x.tech = toLines(v); })} />
          <Sub>Work items</Sub>
          <SortableList name={`work-items-${w.uid}`} items={w.items} idOf={(i) => i.uid} labelOf={(i) => i.title} onChange={(next) => upd(w.uid, (x) => { x.items = next; })}>
            {({ item, index, handle, dragging, move }) => (
              <ItemRow handle={handle} dragging={dragging} actions={
                <RowMenu label={item.title || "item"} onUp={index > 0 ? () => move(-1) : undefined} onDown={index < w.items.length - 1 ? () => move(1) : undefined}
                  onDelete={() => remove(item.title || "item", (d) => { const x = d.work.find((q) => q.uid === w.uid); if (x) x.items = x.items.filter((q) => q.uid !== item.uid); })} />}>
                <Field label="Title" path={`work.${w.uid}.items.${item.uid}.title`} max={L.itemTitle} value={item.title} onChange={(v) => upd(w.uid, (x) => { const i = x.items.find((q) => q.uid === item.uid); if (i) i.title = v; })} />
                <Field label="Description" path={`work.${w.uid}.items.${item.uid}.text`} max={L.itemText} rows={2} value={item.text} onChange={(v) => upd(w.uid, (x) => { const i = x.items.find((q) => q.uid === item.uid); if (i) i.text = v; })} />
              </ItemRow>
            )}
          </SortableList>
          <button type="button" className="adm-btn sm" disabled={w.items.length >= L.workItems} onClick={() => upd(w.uid, (x) => { x.items.push({ uid: newUid(), title: "", text: "" }); })}>Add work item</button>
          <Sub>Outcome</Sub>
          <Field ai label="Outcome or a decision you owned" path={`work.${w.uid}.outcome`} max={L.outcome} rows={4} value={w.outcome} onChange={(v) => upd(w.uid, (x) => { x.outcome = v; })} />
        </>
      )} />
  );
}

/* ---------- Projects ---------- */
export function ProjectsSection() {
  const { c, set, remove, select, notify } = useAdmin();
  const upd = (uid: string, fn: (p: Project) => void) => set((d) => { const x = d.projects.find((i) => i.uid === uid); if (x) fn(x); });
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState("");

  async function addShot(uid: string, f: File | undefined) {
    if (!f) return;
    setBusy("shot");
    try {
      const r = await uploadFile(f);
      if (!r.type.startsWith("image/")) throw new Error("That is not an image.");
      upd(uid, (x) => { x.images.push({ uid: newUid(), media: r.id, alt: "" }); });
    } catch (e) { notify(e instanceof Error ? e.message : "Upload failed."); }
    finally { setBusy(""); if (fileRef.current) fileRef.current.value = ""; }
  }
  async function capture(p: Project) {
    setBusy("capture");
    try {
      const res = await fetch("/api/admin/capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: p.demoUrl }) });
      const data = (await res.json().catch(() => ({}))) as { id?: string; at?: string; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error ?? "Capture failed.");
      upd(p.uid, (x) => { x.cover = data.id!; x.coverCapturedAt = data.at ?? ""; if (!x.coverAlt) x.coverAlt = `Screenshot of the ${x.name} live site`; });
      notify("Preview captured. Save the draft to keep it.");
    } catch (e) { notify(e instanceof Error ? e.message : "Capture failed."); }
    finally { setBusy(""); }
  }

  return (
    <MasterDetail<Project> section="projects" noun="project" items={c.projects} onChange={(next) => set((d) => { d.projects = next; })}
      titleOf={(p) => p.name} metaOf={(p) => p.category} visibleOf={(p) => p.visible}
      onAdd={() => { const uid = newUid(); set((d) => { d.projects.push({ uid, id: "new-project", name: "New project", category: "", summary: "", outcomeLine: "", status: "", featured: false, cover: "", coverAlt: "", coverCapturedAt: "", images: [], tech: [], scope: [], caseStudy: { ...EMPTY_CASE }, demoUrl: "", repoUrl: "", sourceNote: "", visible: false }); }); select("projects", uid); }}
      onDuplicate={(p) => { const uid = newUid(); set((d) => { d.projects.push({ ...structuredClone(p), uid, id: p.id + "-copy", name: p.name + " (copy)", visible: false, featured: false, images: p.images.map((i) => ({ ...i, uid: newUid() })) }); }); select("projects", uid); }}
      onDelete={(p) => remove(p.name || "project", (d) => { d.projects = d.projects.filter((x) => x.uid !== p.uid); })}
      renderEditor={(p) => {
        const b = `projects.${p.uid}`;
        const canCapture = Boolean(p.demoUrl) && !checkUrl(p.demoUrl);
        return (
          <>
            <div className="adm-editor-head"><h2>{p.name || "Untitled project"}</h2>
              <div className="adm-row"><ToggleSwitch label="Featured on home" checked={p.featured} onChange={(v) => upd(p.uid, (x) => { x.featured = v; })} />
                <VisibilitySwitch value={p.visible} onChange={(v) => upd(p.uid, (x) => { x.visible = v; })} /></div></div>
            <div className="adm-grid">
              <Field label="Name" path={`${b}.name`} max={L.projectName} value={p.name} onChange={(v) => upd(p.uid, (x) => { x.name = v; })} />
              <Field label="URL slug" path={`${b}.id`} max={L.slug} value={p.id} hint="Used in the page address." onChange={(v) => upd(p.uid, (x) => { x.id = v; })} />
              <Field label="Category" path={`${b}.category`} max={L.category} value={p.category} onChange={(v) => upd(p.uid, (x) => { x.category = v; })} />
              <Field label="Status label (optional)" path={`${b}.status`} max={L.status} value={p.status} onChange={(v) => upd(p.uid, (x) => { x.status = v; })} />
            </div>
            <Field ai label="Summary" path={`${b}.summary`} max={L.summary} rows={3} value={p.summary} onChange={(v) => upd(p.uid, (x) => { x.summary = v; })} />
            <Field label="One-line outcome (shown on the project card)" path={`${b}.outcomeLine`} max={L.outcomeLine} value={p.outcomeLine}
              hint="Only a result you can stand behind. Leave empty if unsure." onChange={(v) => upd(p.uid, (x) => { x.outcomeLine = v; })} />

            <Sub>Live link and preview</Sub>
            <div className="adm-grid">
              <Field label="Live demo URL" path={`${b}.demoUrl`} value={p.demoUrl} placeholder="https://" onChange={(v) => upd(p.uid, (x) => { x.demoUrl = v; })} />
              <Field label="Repository URL" path={`${b}.repoUrl`} value={p.repoUrl} placeholder="https://" onChange={(v) => upd(p.uid, (x) => { x.repoUrl = v; })} />
            </div>
            <Field label="If no source is available, say why" path={`${b}.sourceNote`} max={L.sourceNote} value={p.sourceNote} onChange={(v) => upd(p.uid, (x) => { x.sourceNote = v; })} />
            <div className="adm-row" style={{ marginBottom: ".8rem" }}>
              <button type="button" className="adm-btn" disabled={!canCapture || busy === "capture"} onClick={() => capture(p)}>
                <Icon name="image" size={15} />{busy === "capture" ? "Capturing…" : "Capture preview from live URL"}
              </button>
              <span className="adm-muted adm-sm">{canCapture ? "Takes a screenshot of the live page and uses it as the cover." : "Add a valid live demo URL first."}{p.coverCapturedAt ? ` Last captured ${p.coverCapturedAt}.` : ""}</span>
            </div>
            <ImageField label="Cover image" media={p.cover} alt={p.coverAlt} altPath={`${b}.coverAlt`}
              onChange={(v) => upd(p.uid, (x) => { if (v.media !== x.cover) x.coverCapturedAt = ""; x.cover = v.media; x.coverAlt = v.alt; })} />

            <div className="adm-grid">
              <Field label="Technologies (one per line)" path={`${b}.tech`} rows={4} value={lines(p.tech)} hint={`Up to ${L.tech}.`} onChange={(v) => upd(p.uid, (x) => { x.tech = toLines(v); })} />
              <Field label="Scope / features (one per line)" path={`${b}.scope`} rows={4} value={lines(p.scope)} hint="Keep only what is true." onChange={(v) => upd(p.uid, (x) => { x.scope = toLines(v); })} />
            </div>
            <Sub>Case study</Sub>
            {(Object.keys(CASE_LABELS) as (keyof CaseStudy)[]).map((k) => (
              <Field ai key={k} label={CASE_LABELS[k]} path={`${b}.caseStudy.${k}`} max={L.caseSection} rows={k === "decisions" ? 6 : 4} value={p.caseStudy[k]}
                hint={k === "decisions" ? "Options considered, choice made, reason." : undefined} onChange={(v) => upd(p.uid, (x) => { x.caseStudy[k] = v; })} />
            ))}
            <Sub>Screenshots</Sub>
            <SortableList name={`shots-${p.uid}`} items={p.images} idOf={(i) => i.uid} labelOf={(i) => i.alt || "screenshot"} onChange={(next) => upd(p.uid, (x) => { x.images = next; })}>
              {({ item, index, handle, dragging, move }) => (
                <ItemRow handle={handle} dragging={dragging} actions={
                  <RowMenu label={`screenshot ${index + 1}`} onUp={index > 0 ? () => move(-1) : undefined} onDown={index < p.images.length - 1 ? () => move(1) : undefined}
                    onDelete={() => remove("screenshot", (d) => { const x = d.projects.find((q) => q.uid === p.uid); if (x) x.images = x.images.filter((q) => q.uid !== item.uid); })} />}>
                  <ImageField label={`Screenshot ${index + 1}`} media={item.media} alt={item.alt} altPath={`${b}.images.${item.uid}.alt`}
                    onChange={(v) => upd(p.uid, (x) => { const i = x.images.find((q) => q.uid === item.uid); if (i) { i.media = v.media; i.alt = v.alt; } })} />
                </ItemRow>
              )}
            </SortableList>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" id={`shot-${p.uid}`} disabled={p.images.length >= L.images} onChange={(e) => addShot(p.uid, e.target.files?.[0])} />
            <label htmlFor={`shot-${p.uid}`} className="adm-btn sm" aria-disabled={p.images.length >= L.images} style={{ cursor: p.images.length >= L.images ? "default" : "pointer", opacity: p.images.length >= L.images ? 0.5 : 1 }}>{busy === "shot" ? "Uploading…" : "Add screenshot"}</label>
          </>
        );
      }} />
  );
}

/* ---------- Stack ---------- */
function IconPicker({ item, onPick }: { item: StackItem; onPick: (i: StackIcon | null) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [res, setRes] = useState<StackIcon[]>([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open || !q.trim()) { setRes([]); return; }
    const t = setTimeout(async () => {
      setBusy(true); setErr("");
      try {
        const r = await fetch(`/api/admin/icons?q=${encodeURIComponent(q)}`);
        const d = (await r.json()) as { icons?: StackIcon[]; error?: string };
        if (!r.ok) throw new Error(d.error ?? "Search failed.");
        setRes(d.icons ?? []);
      } catch (e) { setErr(e instanceof Error ? e.message : "Search failed."); }
      finally { setBusy(false); }
    }, 250);
    return () => clearTimeout(t);
  }, [q, open]);

  return (
    <div className="iconpick">
      <div className="adm-row">
        <span className="iconpick-cur"><BrandIcon icon={item.icon} name={item.name || "?"} size={28} /></span>
        <button type="button" className="adm-btn sm" aria-expanded={open} onClick={() => { setOpen((o) => !o); setQ(item.name); }}>{item.icon ? "Change icon" : "Choose icon"}</button>
        {item.icon ? <button type="button" className="adm-btn sm" onClick={() => onPick(null)}>Remove</button> : null}
      </div>
      {open ? (
        <div className="iconpick-pop">
          <input type="search" aria-label="Search icons" placeholder="Search brand icons (e.g. react)" value={q} onChange={(e) => setQ(e.target.value)} />
          {err ? <p className="adm-err">{err}</p> : null}
          {busy ? <p className="adm-muted adm-sm">Searching…</p> : null}
          <div className="iconpick-grid">
            {res.map((i) => (
              <button type="button" key={i.slug} className="iconpick-i" title={i.title} onClick={() => { onPick(i); setOpen(false); }}>
                <BrandIcon icon={i} name={i.title} size={24} /><span>{i.title}</span>
              </button>
            ))}
          </div>
          {!busy && q.trim() && !res.length && !err ? <p className="adm-muted adm-sm">No icons found. Some tools have no brand icon, and a letter badge is used instead.</p> : null}
          <p className="adm-muted adm-sm">Icons from Simple Icons (CC0).</p>
        </div>
      ) : null}
    </div>
  );
}

export function StackSection() {
  const { c, set, remove, select, notify } = useAdmin();
  const upd = (uid: string, fn: (g: StackGroup) => void) => set((d) => { const x = d.stack.find((i) => i.uid === uid); if (x) fn(x); });
  const [finding, setFinding] = useState(false);

  async function findIcons(g: StackGroup) {
    setFinding(true);
    let found = 0;
    try {
      const picks = new Map<string, StackIcon>();
      for (const it of g.items.filter((i) => !i.icon && i.name)) {
        const r = await fetch(`/api/admin/icons?match=${encodeURIComponent(it.name)}`);
        if (!r.ok) throw new Error("Icon search is unavailable right now.");
        const d = (await r.json()) as { icon: StackIcon | null };
        if (d.icon) picks.set(it.uid, d.icon);
      }
      found = picks.size;
      if (found) upd(g.uid, (x) => { x.items.forEach((i) => { const p = picks.get(i.uid); if (p) i.icon = p; }); });
      notify(found ? `Added ${found} icon${found === 1 ? "" : "s"}. Others have no exact match, so pick them by hand.` : "No exact matches found. Pick icons by hand.");
    } catch (e) { notify(e instanceof Error ? e.message : "Could not find icons."); }
    finally { setFinding(false); }
  }

  return (
    <MasterDetail<StackGroup> section="stack" noun="group" items={c.stack} onChange={(next) => set((d) => { d.stack = next; })}
      titleOf={(g) => g.name} metaOf={(g) => `${g.items.length} tools`} visibleOf={(g) => g.visible}
      onAdd={() => { const uid = newUid(); set((d) => { d.stack.push({ uid, id: "new-group", name: "New group", items: [], visible: false }); }); select("stack", uid); }}
      onDelete={(g) => remove(g.name || "group", (d) => { d.stack = d.stack.filter((x) => x.uid !== g.uid); })}
      renderEditor={(g) => (
        <>
          <div className="adm-editor-head"><h2>{g.name || "Untitled group"}</h2>
            <div className="adm-row">
              <button type="button" className="adm-btn sm" disabled={finding || !g.items.some((i) => !i.icon)} onClick={() => findIcons(g)}><Icon name="search" size={14} />{finding ? "Searching…" : "Find icons automatically"}</button>
              <VisibilitySwitch value={g.visible} onChange={(v) => upd(g.uid, (x) => { x.visible = v; })} />
            </div></div>
          <Field label="Group name" path={`stack.${g.uid}.name`} max={L.groupName} value={g.name} onChange={(v) => upd(g.uid, (x) => { x.name = v; })} />
          <Sub>Tools</Sub>
          <Note>Add “why” notes to the tools you want visitors to open. Tools without notes show as plain tiles.</Note>
          <SortableList name={`stack-items-${g.uid}`} items={g.items} idOf={(i) => i.uid} labelOf={(i) => i.name} onChange={(next) => upd(g.uid, (x) => { x.items = next; })}>
            {({ item, index, handle, dragging, move }) => {
              const pu = (fn: (i: StackItem) => void) => upd(g.uid, (x) => { const i = x.items.find((q) => q.uid === item.uid); if (i) fn(i); });
              const pb = `stack.${g.uid}.items.${item.uid}`;
              return (
                <ItemRow handle={handle} dragging={dragging} actions={
                  <RowMenu label={item.name || "tool"} onUp={index > 0 ? () => move(-1) : undefined} onDown={index < g.items.length - 1 ? () => move(1) : undefined}
                    onDelete={() => remove(item.name || "tool", (d) => { const x = d.stack.find((q) => q.uid === g.uid); if (x) x.items = x.items.filter((q) => q.uid !== item.uid); })} />}>
                  <div className="adm-grid">
                    <Field label="Tool" path={`${pb}.name`} max={L.stackName} value={item.name} onChange={(v) => pu((i) => { i.name = v; })} />
                    <Field label="Used for (short)" path={`${pb}.description`} max={L.stackDesc} value={item.description} onChange={(v) => pu((i) => { i.description = v; })} />
                  </div>
                  <IconPicker item={item} onPick={(ic) => pu((i) => { i.icon = ic; })} />
                  <details className="adm-more" open={Boolean(item.why || item.how || item.alternatives)}>
                    <summary>Why, how and alternatives (shown when a visitor opens this tool)</summary>
                    <Field ai label="Why I use it" path={`${pb}.why`} max={L.why} rows={2} value={item.why} onChange={(v) => pu((i) => { i.why = v; })} />
                    <Field ai label="How I use it" path={`${pb}.how`} max={L.how} rows={2} value={item.how} onChange={(v) => pu((i) => { i.how = v; })} />
                    <Field label="Alternatives I considered" path={`${pb}.alternatives`} max={L.alternatives} rows={2} value={item.alternatives} onChange={(v) => pu((i) => { i.alternatives = v; })} />
                  </details>
                  <VisibilitySwitch value={item.visible} onChange={(v) => pu((i) => { i.visible = v; })} />
                </ItemRow>
              );
            }}
          </SortableList>
          <button type="button" className="adm-btn sm" disabled={g.items.length >= L.stackItems}
            onClick={() => upd(g.uid, (x) => { x.items.push({ uid: newUid(), name: "", description: "", icon: null, why: "", how: "", alternatives: "", visible: true }); })}>Add tool</button>
        </>
      )} />
  );
}

/* ---------- How I work (flow) ---------- */
const KIND_LABEL: Record<StepKind, string> = { start: "Start (yellow)", process: "Step (blue)", end: "Result (green)" };

export function HowSection() {
  const { c, set, remove } = useAdmin();
  const nodes = useMemo(() => c.how.steps.map((s) => ({ id: s.uid, title: s.title || "Untitled", text: s.text, kind: s.kind, icon: s.icon, from: s.from, chips: s.chips })), [c.how.steps]);
  const upd = (uid: string, fn: (s: Step) => void) => set((d) => { const x = d.how.steps.find((q) => q.uid === uid); if (x) fn(x); });
  return (
    <>
      <Card><Field ai label="Introduction" path="how.intro" max={L.howIntro} rows={2} value={c.how.intro} onChange={(v) => set((d) => { d.how.intro = v; })} /></Card>
      <Sub>Live preview</Sub>
      <Note>This is how the diagram looks on your home page. Boxes arrange themselves from each step&apos;s “takes input from” choices. The “Let&apos;s talk” contact box is added automatically at the end.</Note>
      {nodes.length ? <div className="adm-preview"><FlowGraph nodes={nodes} label="Preview" /></div> : <Card><span className="adm-muted">No steps yet.</span></Card>}
      <Sub>Steps</Sub>
      <SortableList name="how-steps" items={c.how.steps} idOf={(s) => s.uid} labelOf={(s) => s.title} onChange={(next) => set((d) => { d.how.steps = next; })}>
        {({ item, index, handle, dragging, move }) => {
          const earlier = c.how.steps.slice(0, index);
          return (
            <ItemRow handle={handle} dragging={dragging} actions={
              <RowMenu label={item.title || "step"} onUp={index > 0 ? () => move(-1) : undefined} onDown={index < c.how.steps.length - 1 ? () => move(1) : undefined}
                onDelete={() => remove(item.title || "step", (d) => { d.how.steps = d.how.steps.filter((q) => q.uid !== item.uid); d.how.steps.forEach((s) => { s.from = s.from.filter((f) => f !== item.uid); }); })} />}>
              <div className="adm-grid">
                <Field label={`Step ${index + 1} title`} path={`how.steps.${item.uid}.title`} max={L.stepTitle} value={item.title} onChange={(v) => upd(item.uid, (s) => { s.title = v; })} />
                <div className="adm-field">
                  <label htmlFor={`k-${item.uid}`}>Colour and meaning</label>
                  <select id={`k-${item.uid}`} value={item.kind} onChange={(e) => upd(item.uid, (s) => { s.kind = e.target.value as StepKind; })}>
                    {(Object.keys(KIND_LABEL) as StepKind[]).map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
                  </select>
                </div>
              </div>
              <Field ai label="Description" path={`how.steps.${item.uid}.text`} max={L.stepText} rows={2} value={item.text} onChange={(v) => upd(item.uid, (s) => { s.text = v; })} />
              <div className="adm-field">
                <span className="adm-label">Icon</span>
                <div className="iconrow" role="radiogroup" aria-label="Icon">
                  <button type="button" role="radio" aria-checked={!item.icon} className={`iconchoice${!item.icon ? " on" : ""}`} onClick={() => upd(item.uid, (s) => { s.icon = ""; })}>Auto</button>
                  {STEP_ICONS.map((n) => (
                    <button type="button" key={n} role="radio" aria-checked={item.icon === n} aria-label={n} title={n} className={`iconchoice${item.icon === n ? " on" : ""}`} onClick={() => upd(item.uid, (s) => { s.icon = n; })}><Icon name={n} size={17} /></button>
                  ))}
                </div>
              </div>
              <div className="adm-field">
                <span className="adm-label">Takes input from</span>
                {earlier.length === 0 ? <small>The first step has nothing before it.</small> : (
                  <div className="adm-checks">
                    {earlier.map((e) => (
                      <label key={e.uid} className="adm-check"><input type="checkbox" checked={item.from.includes(e.uid)}
                        onChange={(ev) => upd(item.uid, (s) => { s.from = ev.target.checked ? [...s.from, e.uid] : s.from.filter((f) => f !== e.uid); })} /> {e.title || "Untitled"}</label>
                    ))}
                  </div>
                )}
                {c.how.steps.some((s) => s.uid === item.uid && s.from.some((f) => !c.how.steps.slice(0, index).some((e) => e.uid === f))) ? <small className="err">Linked to a step further down. Reorder or re-tick the boxes.</small> : null}
              </div>
              <Field label="“Used in this step” chips (one per line)" path={`how.steps.${item.uid}.chips`} rows={2} value={lines(item.chips)} hint={`Up to ${L.chips}. For example: Requirements, QA feedback.`} onChange={(v) => upd(item.uid, (s) => { s.chips = toLines(v); })} />
            </ItemRow>
          );
        }}
      </SortableList>
      <button type="button" className="adm-btn sm" disabled={c.how.steps.length >= L.steps}
        onClick={() => set((d) => { const last = d.how.steps[d.how.steps.length - 1]; d.how.steps.push({ uid: newUid(), title: "New step", text: "", kind: "process", icon: "", from: last ? [last.uid] : [], chips: [] }); })}>Add step</button>
    </>
  );
}

/* ---------- Testimonials ---------- */
export function TestimonialsSection() {
  const { c, set, remove, select } = useAdmin();
  const upd = (uid: string, fn: (t: Testimonial) => void) => set((d) => { const x = d.testimonials.find((i) => i.uid === uid); if (x) fn(x); });
  return (
    <>
      <Note>Only add real quotes you have permission to use. Testimonials stay hidden until you mark them public, and the home page section only appears when at least one is public.</Note>
      <MasterDetail<Testimonial> section="testimonials" noun="testimonial" items={c.testimonials} onChange={(next) => set((d) => { d.testimonials = next; })}
        titleOf={(t) => t.name || t.quote.slice(0, 30)} metaOf={(t) => t.role} visibleOf={(t) => t.visible}
        onAdd={() => { const uid = newUid(); set((d) => { d.testimonials.push({ uid, quote: "", name: "", role: "", visible: false }); }); select("testimonials", uid); }}
        onDelete={(t) => remove(t.name || "testimonial", (d) => { d.testimonials = d.testimonials.filter((x) => x.uid !== t.uid); })}
        renderEditor={(t) => (
          <>
            <div className="adm-editor-head"><h2>{t.name || "New testimonial"}</h2><VisibilitySwitch value={t.visible} onChange={(v) => upd(t.uid, (x) => { x.visible = v; })} /></div>
            <Field label="Quote" path={`testimonials.${t.uid}.quote`} max={L.quote} rows={4} value={t.quote} onChange={(v) => upd(t.uid, (x) => { x.quote = v; })} />
            <div className="adm-grid">
              <Field label="Name" path={`testimonials.${t.uid}.name`} max={L.personName} value={t.name} onChange={(v) => upd(t.uid, (x) => { x.name = v; })} />
              <Field label="Role and company (optional)" path={`testimonials.${t.uid}.role`} max={L.personName} value={t.role} onChange={(v) => upd(t.uid, (x) => { x.role = v; })} />
            </div>
          </>
        )} />
    </>
  );
}

/* ---------- Contact ---------- */
export function ContactSection() {
  const { c, set, notify } = useAdmin();
  const k = c.contact;
  const [busy, setBusy] = useState(false);
  async function pickResume(f: File | undefined) {
    if (!f) return;
    setBusy(true);
    try {
      const r = await uploadFile(f);
      if (r.type !== "application/pdf") throw new Error("Please choose a PDF.");
      set((d) => { d.contact.resumeUrl = `/media/${r.id}`; });
      notify("Resume uploaded. Save the draft to keep it.");
    } catch (e) { notify(e instanceof Error ? e.message : "Upload failed."); }
    finally { setBusy(false); }
  }
  return (
    <>
      <Card>
        <Sub>Contact form</Sub>
        <div className="adm-row" style={{ marginBottom: "1rem" }}><ToggleSwitch label="Show the contact form" checked={k.formEnabled} onChange={(v) => set((d) => { d.contact.formEnabled = v; })} /></div>
        <NumberField label="Keep messages for (days, 0 = forever)" path="contact.retentionDays" min={0} max={L.retentionMax} value={k.retentionDays}
          hint="Older messages are deleted automatically when you open the admin." onChange={(n) => set((d) => { d.contact.retentionDays = n; })} />
      </Card>
      <Card>
        <Sub>Public details</Sub>
        <Note>Only fields you fill in are shown. They appear on the Contact page, and beside your About text if you leave the switch below on.</Note>
        <div className="adm-grid">
          <Field label="Email" path="contact.email" max={L.email} value={k.email} onChange={(v) => set((d) => { d.contact.email = v; })} />
          <Field label="GitHub URL" path="contact.github" value={k.github} placeholder="https://github.com/…" onChange={(v) => set((d) => { d.contact.github = v; })} />
          <Field label="LinkedIn URL" path="contact.linkedin" value={k.linkedin} placeholder="https://linkedin.com/in/…" onChange={(v) => set((d) => { d.contact.linkedin = v; })} />
        </div>
        <ToggleSwitch label="Show these on the About page" checked={k.showOnAbout} onChange={(v) => set((d) => { d.contact.showOnAbout = v; })} />
      </Card>
      <Card>
        <Sub>Resume</Sub>
        <div className="adm-row" style={{ marginBottom: "1rem" }}>
          <input type="file" accept="application/pdf" className="sr-only" id="resume-file" onChange={(e) => pickResume(e.target.files?.[0])} />
          <label htmlFor="resume-file" className="adm-btn" style={{ cursor: "pointer" }}><Icon name="upload" size={15} />{busy ? "Uploading…" : "Upload resume (PDF, up to 4 MB)"}</label>
          {k.resumeUrl ? <button type="button" className="adm-btn danger sm" onClick={() => set((d) => { d.contact.resumeUrl = ""; })}>Remove</button> : null}
        </div>
        <Field label="Resume link" path="contact.resumeUrl" value={k.resumeUrl} placeholder="Upload a PDF above, or paste https://…" onChange={(v) => set((d) => { d.contact.resumeUrl = v; })} />
      </Card>
    </>
  );
}

/* ---------- AI assistant ---------- */
export function AssistantSection() {
  const { c, set, aiOn } = useAdmin();
  const a = c.site.ai;
  return (
    <>
      {!aiOn ? (
        <div className="adm-warn">The AI features need a Groq API key. Add <code>GROQ_API_KEY</code> to your environment variables (free at console.groq.com/keys), then redeploy. Nothing below has any effect until then.</div>
      ) : null}
      <Card>
        <Sub>“Ask about my work” on your public site</Sub>
        <Note>Visitors can ask questions and get answers written from your published pages only. It never sees hidden items or drafts, it is told not to guess, and every answer is labelled as AI-generated.</Note>
        <ToggleSwitch label="Show the Ask AI button" checked={a.enabled} onChange={(v) => set((d) => { d.site.ai.enabled = v; })} />
        <div style={{ height: "1rem" }} />
        <Field label="Suggested questions (one per line)" path="site.ai.questions" rows={4} value={lines(a.questions)} hint={`Up to ${L.questions}, ${L.question} characters each. Shown as buttons before a visitor types.`}
          onChange={(v) => set((d) => { d.site.ai.questions = toLines(v); })} />
      </Card>
      <Card>
        <Sub>Writing help in this admin</Sub>
        <Note>When a key is set, text fields marked with a sparkle button can suggest a clearer version. You see the changes highlighted and choose whether to use them. Nothing is applied automatically.</Note>
        <p className="adm-muted adm-sm">Visitors&apos; questions are sent to Groq to produce an answer and are not stored by this site. Rate limits apply to protect your free quota.</p>
      </Card>
    </>
  );
}
