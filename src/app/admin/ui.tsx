"use client";

import {
  DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors,
  type Announcements, type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { useFocusTrap } from "@/components/useFocusTrap";
import { wordDiff } from "@/lib/changes";
import type { Content, Issue } from "@/lib/types";

/* ---------- context ---------- */
export interface Ctx {
  c: Content;
  set: (fn: (d: Content) => void) => void;
  issue: (path: string) => Issue | undefined;
  count: (prefix: string) => number;
  remove: (label: string, fn: (d: Content) => void) => void;
  notify: (text: string) => void;
  selected: Record<string, string>;
  select: (section: string, uid: string) => void;
  aiOn: boolean;
}
export const AdminCtx = createContext<Ctx | null>(null);
export function useAdmin(): Ctx {
  const v = useContext(AdminCtx);
  if (!v) throw new Error("AdminCtx missing");
  return v;
}

/* ---------- fields ---------- */
export function Field(props: {
  label: string; value: string; onChange: (v: string) => void; path?: string; max?: number;
  rows?: number; hint?: string; placeholder?: string; mono?: boolean; type?: string; ai?: boolean;
}) {
  const { issue, aiOn, notify } = useAdmin();
  const id = useId();
  const { label, value, onChange, path, max, rows, hint, placeholder, mono, type, ai } = props;
  const [sug, setSug] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function suggest() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/ai/improve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: value, label }) });
      const data = (await res.json().catch(() => ({}))) as { suggestion?: string; error?: string };
      if (!res.ok || !data.suggestion) throw new Error(data.error ?? "Could not get a suggestion.");
      setSug(data.suggestion);
    } catch (e) { notify(e instanceof Error ? e.message : "Could not get a suggestion."); }
    finally { setBusy(false); }
  }
  const err = path ? issue(path) : undefined;
  const over = max !== undefined && value.length > max;
  const common = {
    id, value, placeholder, "aria-invalid": err ? true : undefined,
    "aria-describedby": err ? `${id}-e` : hint ? `${id}-h` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
  };
  return (
    <div className="adm-field">
      <div className="adm-label-row">
        <label htmlFor={id}>{label}</label>
        {max !== undefined && (value.length > max * 0.7 || over) ? <span className={`adm-count-txt${over ? " over" : ""}`}>{value.length}/{max}</span> : null}
      </div>
      {rows ? <textarea {...common} rows={rows} className={mono ? "mono" : ""} /> : <input {...common} type={type ?? "text"} />}
      {err ? (
        <small id={`${id}-e`} className="err" role="alert">
          {err.message}{" "}
          {err.fix ? <button type="button" className="adm-btn sm" onClick={() => onChange(err.fix!)}>Use {err.fix.length > 40 ? err.fix.slice(0, 40) + "…" : err.fix}</button> : null}
        </small>
      ) : hint ? <small id={`${id}-h`}>{hint}</small> : null}
      {ai && aiOn && rows ? (
        <div>
          {sug === null ? (
            <button type="button" className="adm-btn sm ai-btn" disabled={busy || value.trim().length < 20} onClick={suggest}>
              <Icon name="sparkles" size={14} />{busy ? "Thinking…" : "Suggest a clearer version"}
            </button>
          ) : (
            <div className="ai-sug" role="region" aria-label="AI suggestion">
              <p className="ai-diff">{wordDiff(value, sug).map((seg, i) => <span key={i} className={seg.t}>{seg.s}</span>)}</p>
              <div className="adm-row">
                <button type="button" className="adm-btn primary sm" onClick={() => { onChange(sug); setSug(null); }}>Use this version</button>
                <button type="button" className="adm-btn sm" onClick={() => setSug(null)}>Keep mine</button>
              </div>
              <small>AI can change the meaning. Read it before you accept, and keep only what is true.</small>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function NumberField({ label, value, onChange, min, max, hint, path }: {
  label: string; value: number; onChange: (n: number) => void; min: number; max: number; hint?: string; path?: string;
}) {
  const { issue } = useAdmin();
  const id = useId();
  const err = path ? issue(path) : undefined;
  return (
    <div className="adm-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="number" min={min} max={max} value={value} aria-invalid={err ? true : undefined}
        onChange={(e) => onChange(Math.max(min, Math.min(max, Math.floor(Number(e.target.value) || 0))))} />
      {err ? <small className="err" role="alert">{err.message}</small> : hint ? <small>{hint}</small> : null}
    </div>
  );
}

/** Public / Hidden control: an eye icon plus the word, so state is never shown by colour alone. */
export function VisibilitySwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={value} className={`vis${value ? " on" : ""}`} onClick={() => onChange(!value)}>
      <Icon name={value ? "eye" : "eyeoff"} size={15} /><span>{value ? "Public" : "Hidden"}</span><i className="knob" aria-hidden="true" />
    </button>
  );
}
export function ToggleSwitch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} className={`vis plain${checked ? " on" : ""}`} onClick={() => onChange(!checked)}>
      <span>{label}</span><i className="knob" aria-hidden="true" />
    </button>
  );
}
export const Badge = ({ visible }: { visible: boolean }) => <span className={`pill${visible ? "" : " draft"}`}>{visible ? "Public" : "Hidden"}</span>;

/** One layout for every list item: grip on the left, content in the middle, actions on the right. */
export function ItemRow({ handle, actions, dragging, children }: { handle?: ReactNode; actions?: ReactNode; dragging?: boolean; children: ReactNode }) {
  return (
    <div className={`irow${dragging ? " drag" : ""}`}>
      <div className="irow-h">{handle}</div>
      <div className="irow-b">{children}</div>
      <div className="irow-a">{actions}</div>
    </div>
  );
}

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <header className="phead">
      <div><h2>{title}</h2>{description ? <p>{description}</p> : null}</div>
      {children ? <div className="phead-a">{children}</div> : null}
    </header>
  );
}

/** "?" button that opens a small explanation. Closes on Escape or a click elsewhere. */
export function HelpPop({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLSpanElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", down); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
  }, [open]);
  return (
    <span className="helppop" ref={box}>
      <button type="button" className="help-btn" aria-label={label} aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>?</button>
      {open ? <div className="helppop-card" id={id} role="region" aria-label={label}>{children}</div> : null}
    </span>
  );
}

export async function uploadFile(file: File): Promise<{ id: string; type: string }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/media", { method: "POST", body: fd });
  const data = (await res.json().catch(() => ({}))) as { id?: string; type?: string; error?: string };
  if (!res.ok || !data.id) throw new Error(data.error ?? "Upload failed.");
  return { id: data.id, type: data.type ?? "" };
}

export function ImageField({ label, media, alt, altPath, onChange, hint }: {
  label: string; media: string; alt: string; altPath: string; hint?: string; onChange: (v: { media: string; alt: string }) => void;
}) {
  const { notify } = useAdmin();
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  async function pick(f: File | undefined) {
    if (!f) return;
    setBusy(true);
    try {
      const r = await uploadFile(f);
      if (!r.type.startsWith("image/")) throw new Error("That is not an image.");
      onChange({ media: r.id, alt });
    } catch (e) { notify(e instanceof Error ? e.message : "Upload failed."); }
    finally { setBusy(false); if (input.current) input.current.value = ""; }
  }
  return (
    <div className="adm-field">
      <span className="adm-label">{label}</span>
      <div className="adm-img">
        {media ? <img src={`/media/${media}`} alt="" /> : null}
        <div>
          <div className="adm-row">
            <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" id={`${altPath}-f`} onChange={(e) => pick(e.target.files?.[0])} />
            <label htmlFor={`${altPath}-f`} className="adm-btn sm" style={{ cursor: "pointer" }}>{busy ? "Uploading…" : media ? "Replace image" : "Upload image"}</label>
            {media ? <button type="button" className="adm-btn sm danger" onClick={() => onChange({ media: "", alt: "" })}>Remove</button> : null}
          </div>
          {media ? <Field label="Alt text (describe the image)" value={alt} path={altPath} max={200} onChange={(v) => onChange({ media, alt: v })} /> : <small className="adm-muted">{hint ?? "JPG, PNG or WebP, up to 2 MB."}</small>}
        </div>
      </div>
    </div>
  );
}

/* ---------- sortable lists ---------- */
const GripIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="9" cy="6" r="1.7" /><circle cx="15" cy="6" r="1.7" /><circle cx="9" cy="12" r="1.7" /><circle cx="15" cy="12" r="1.7" /><circle cx="9" cy="18" r="1.7" /><circle cx="15" cy="18" r="1.7" />
  </svg>
);

function SortRow({ id, label, children }: { id: string; label: string; children: (handle: ReactNode, dragging: boolean) => ReactNode }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  const handle = (
    <button type="button" className="grip" ref={setActivatorNodeRef} {...attributes} {...listeners}
      aria-label={`Reorder ${label}. Press space to lift, arrow keys to move, space to drop.`}>
      <GripIcon />
    </button>
  );
  return <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}>{children(handle, isDragging)}</div>;
}

export function SortableList<T>({ items, onChange, idOf, labelOf, children, name }: {
  items: T[]; onChange: (next: T[]) => void; idOf: (t: T) => string; labelOf: (t: T) => string; name: string;
  children: (a: { item: T; index: number; handle: ReactNode; dragging: boolean; move: (d: -1 | 1) => void }) => ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const pos = (id: unknown) => items.findIndex((i) => idOf(i) === id);
  const lab = (id: unknown) => { const i = pos(id); return i < 0 ? "item" : labelOf(items[i]) || "item"; };
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${lab(active.id)}. Position ${pos(active.id) + 1} of ${items.length}.`,
    onDragOver: ({ active, over }) => (over ? `${lab(active.id)} is now at position ${pos(over.id) + 1} of ${items.length}.` : undefined),
    onDragEnd: ({ active, over }) => `Dropped ${lab(active.id)} at position ${(over ? pos(over.id) : pos(active.id)) + 1} of ${items.length}.`,
    onDragCancel: ({ active }) => `Reordering cancelled. ${lab(active.id)} returned to position ${pos(active.id) + 1}.`,
  };
  function end(e: DragEndEvent) {
    if (!e.over || e.active.id === e.over.id) return;
    const from = pos(e.active.id), to = pos(e.over.id);
    if (from >= 0 && to >= 0) onChange(arrayMove(items, from, to));
  }
  return (
    <DndContext id={name} sensors={sensors} collisionDetection={closestCenter} onDragEnd={end} accessibility={{ announcements }}>
      <SortableContext items={items.map(idOf)} strategy={verticalListSortingStrategy}>
        {items.map((item, index) => (
          <SortRow key={idOf(item)} id={idOf(item)} label={labelOf(item) || "item"}>
            {(handle, dragging) => children({
              item, index, handle, dragging,
              move: (d) => { const j = index + d; if (j >= 0 && j < items.length) onChange(arrayMove(items, index, j)); },
            })}
          </SortRow>
        ))}
      </SortableContext>
    </DndContext>
  );
}

export function RowMenu({ label, onUp, onDown, onDuplicate, onDelete }: {
  label: string; onUp?: () => void; onDown?: () => void; onDuplicate?: () => void; onDelete?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    box.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
    const down = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", down); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
  }, [open]);
  const run = (fn?: () => void) => () => { setOpen(false); fn?.(); };
  return (
    <div ref={box} style={{ position: "relative" }}>
      <button type="button" className="kebab" aria-label={`Actions for ${label}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" /></svg>
      </button>
      {open ? (
        <div className="menu" role="menu">
          <button role="menuitem" disabled={!onUp} onClick={run(onUp)}>Move up</button>
          <button role="menuitem" disabled={!onDown} onClick={run(onDown)}>Move down</button>
          {onDuplicate ? <button role="menuitem" onClick={run(onDuplicate)}>Duplicate</button> : null}
          {onDelete ? <><hr /><button role="menuitem" className="danger" onClick={run(onDelete)}>Delete…</button></> : null}
        </div>
      ) : null}
    </div>
  );
}

/* ---------- master / detail ---------- */
export function MasterDetail<T extends { uid: string }>({ section, noun, items, onChange, titleOf, metaOf, visibleOf, onAdd, onDuplicate, onDelete, renderEditor }: {
  section: string; noun: string; items: T[]; onChange: (next: T[]) => void; titleOf: (t: T) => string; metaOf?: (t: T) => string;
  visibleOf?: (t: T) => boolean; onAdd: () => void; onDuplicate?: (t: T) => void; onDelete: (t: T) => void; renderEditor: (t: T) => ReactNode;
}) {
  const { selected, select, count } = useAdmin();
  const [q, setQ] = useState("");
  const [confirm, setConfirm] = useState<T | null>(null);
  const cur = items.find((i) => i.uid === selected[section]) ?? null;
  const filtered = q.trim() ? items.filter((i) => `${titleOf(i)} ${metaOf?.(i) ?? ""}`.toLowerCase().includes(q.trim().toLowerCase())) : null;

  const row = (item: T, handle: ReactNode | null, index: number, move: ((d: -1 | 1) => void) | null, dragging = false) => {
    const errs = count(`${section}.${item.uid}`);
    return (
      <div className={`adm-li${cur?.uid === item.uid ? " sel" : ""}${dragging ? " drag" : ""}`}>
        {handle}
        <button type="button" className="adm-li-main" onClick={() => select(section, item.uid)} aria-current={cur?.uid === item.uid}>
          <b>{titleOf(item) || `Untitled ${noun}`}</b>
          <span>{[visibleOf ? (visibleOf(item) ? "Public" : "Hidden") : "", metaOf?.(item) ?? "", errs ? `${errs} to fix` : ""].filter(Boolean).join(" · ")}</span>
        </button>
        <RowMenu label={titleOf(item) || noun}
          onUp={move && index > 0 ? () => move(-1) : undefined} onDown={move && index < items.length - 1 ? () => move(1) : undefined}
          onDuplicate={onDuplicate ? () => onDuplicate(item) : undefined} onDelete={() => setConfirm(item)} />
      </div>
    );
  };

  return (
    <div className="adm-md">
      <div className="adm-listbox">
        <div className="adm-row" style={{ marginBottom: ".6rem" }}>
          <button type="button" className="adm-btn primary sm" onClick={onAdd}>Add {noun}</button>
        </div>
        {items.length > 4 ? <div className="adm-field"><input type="search" placeholder={`Filter ${noun}s`} aria-label={`Filter ${noun}s`} value={q} onChange={(e) => setQ(e.target.value)} /></div> : null}
        {items.length === 0 ? <p className="adm-muted">No {noun}s yet.</p> : null}
        {filtered ? (
          filtered.length ? filtered.map((i) => <div key={i.uid}>{row(i, null, 0, null)}</div>) : <p className="adm-muted">No matches.</p>
        ) : (
          <SortableList name={`${section}-list`} items={items} onChange={onChange} idOf={(i) => i.uid} labelOf={titleOf}>
            {({ item, index, handle, dragging, move }) => row(item, handle, index, move, dragging)}
          </SortableList>
        )}
        {!filtered && items.length > 1 ? <p className="adm-muted" style={{ fontSize: ".78rem", margin: ".6rem .2rem 0" }}>Drag the handle to reorder, or use the ⋯ menu.</p> : null}
      </div>
      <div>
        {cur ? (
          <div className="adm-editor" key={cur.uid}>
            {renderEditor(cur)}
            <div className="adm-danger">
              <button type="button" className="adm-btn danger" onClick={() => setConfirm(cur)}>Delete this {noun}…</button>
            </div>
          </div>
        ) : <div className="adm-card adm-muted">Select a {noun} on the left to edit it.</div>}
      </div>
      <ConfirmModal open={!!confirm} danger title={`Delete "${confirm ? titleOf(confirm) || noun : ""}"?`}
        body="You can undo this right after, and earlier versions stay in History." confirmLabel="Delete"
        onCancel={() => setConfirm(null)} onConfirm={() => { if (confirm) onDelete(confirm); setConfirm(null); }} />
    </div>
  );
}

/* ---------- dialogs & toast ---------- */
export function ConfirmModal({ open, title, body, confirmLabel, danger, onConfirm, onCancel, children }: {
  open: boolean; title: string; body?: string; confirmLabel: string; danger?: boolean; onConfirm: () => void; onCancel: () => void; children?: ReactNode;
}) {
  const ref = useFocusTrap<HTMLDivElement>(open, onCancel);
  const tid = useId();
  if (!open) return null;
  return (
    <div className="modal adm-modal" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="panel" ref={ref} role="alertdialog" aria-modal="true" aria-labelledby={tid}>
        <h2 id={tid}>{title}</h2>
        {body ? <p className="adm-muted" style={{ margin: 0 }}>{body}</p> : null}
        {children}
        <div className="adm-row">
          <button type="button" className="adm-btn" onClick={onCancel}>Cancel</button>
          <button type="button" className={`adm-btn ${danger ? "danger" : "primary"}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

export function Toast({ text, undo, onClose }: { text: string; undo?: () => void; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, undo ? 10000 : 5000); return () => clearTimeout(t); }, [text, undo, onClose]);
  return (
    <div className="toast" role="status" aria-live="polite">
      <span>{text}</span>
      {undo ? <button type="button" onClick={() => { undo(); onClose(); }}>Undo</button> : null}
      <button type="button" aria-label="Dismiss" onClick={onClose}>✕</button>
    </div>
  );
}
