"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { SearchEntry } from "@/lib/types";
import { Icon } from "./Icon";
import { useFocusTrap } from "./useFocusTrap";

const ICON: Record<string, string> = { Page: "file", Project: "folder", Experience: "briefcase", Stack: "layers" };
const LABEL: Record<string, string> = { Page: "Pages", Project: "Projects", Experience: "Experience", Stack: "Stack" };
const ORDER = ["Page", "Project", "Experience", "Stack"];
const groupOf = (e: SearchEntry) => e.kind.split(" · ")[0];
const detailOf = (e: SearchEntry) => [e.kind.split(" · ")[1], e.text].filter(Boolean).join(" · ") || groupOf(e);

/** Highlights the first match of the query inside a title. */
function Mark({ text, q }: { text: string; q: string }) {
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
}

/** Trims long descriptions so the matching part stays visible. */
function snippet(text: string, q: string): string {
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  return i > 36 ? "…" + text.slice(i - 28) : text;
}

interface Row { e: SearchEntry; idx: number }

/** Every word typed must appear. Title matches rank above matches in the description. Empty query suggests pages and a few projects. */
function search(entries: SearchEntry[], q: string): { name: string; rows: Row[] }[] {
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  let list: { e: SearchEntry; s: number; o: number }[];
  if (!words.length) {
    const seen: Record<string, number> = {};
    list = entries.map((e, o) => ({ e, s: 0, o })).filter(({ e }) => {
      const g = groupOf(e);
      seen[g] = (seen[g] ?? 0) + 1;
      return g === "Page" || (g === "Project" && seen[g] <= 4);
    });
  } else {
    list = entries.map((e, o) => {
      const title = e.title.toLowerCase(), hay = `${title} ${e.text ?? ""} ${e.kind}`.toLowerCase();
      if (!words.every((w) => hay.includes(w))) return { e, s: -1, o };
      return { e, s: title.startsWith(words[0]) ? 3 : words.every((w) => title.includes(w)) ? 2 : 1, o };
    }).filter((x) => x.s >= 0);
  }
  const groups = ORDER.map((name) => ({ name, items: list.filter((x) => groupOf(x.e) === name).sort((a, b) => b.s - a.s || a.o - b.o).slice(0, 8) })).filter((g) => g.items.length);
  let n = 0;
  return groups.map((g) => ({ name: g.name, rows: g.items.map((x) => ({ e: x.e, idx: n++ })) }));
}

export function SearchDialog({ open, onClose, entries, initialQuery = "" }: { open: boolean; onClose: () => void; entries: SearchEntry[]; initialQuery?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const panel = useFocusTrap<HTMLDivElement>(open, onClose);
  const titleId = useId(), listId = useId();

  useEffect(() => { if (open) { setQ(initialQuery); setSel(0); setTimeout(() => input.current?.focus(), 0); } }, [open, initialQuery]);

  const groups = useMemo(() => search(entries, q), [entries, q]);
  const flat = useMemo(() => groups.flatMap((g) => g.rows), [groups]);
  const trimmed = q.trim();

  useEffect(() => { document.getElementById(`${listId}-${sel}`)?.scrollIntoView({ block: "nearest" }); }, [sel, listId]);

  function go(href: string) { onClose(); router.push(href); }
  function onKey(e: { key: string; preventDefault: () => void }) {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => (flat.length ? (s + 1) % flat.length : 0)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => (flat.length ? (s - 1 + flat.length) % flat.length : 0)); }
    else if (e.key === "Enter" && flat[sel]) { e.preventDefault(); go(flat[sel].e.href); }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="sd" onMouseDown={(e: { target: unknown; currentTarget: unknown }) => e.target === e.currentTarget && onClose()}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          <motion.div className="sd-panel" ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId}
            initial={{ opacity: 0, y: -16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.985 }} transition={{ type: "spring", stiffness: 420, damping: 34 }}>
            <h2 id={titleId} className="sr-only">Search</h2>
            <div className="sd-head">
              <Icon name="search" size={20} />
              <input ref={input} type="search" value={q} placeholder="Search pages, projects, tools…" autoComplete="off" spellCheck={false}
                role="combobox" aria-expanded="true" aria-controls={listId} aria-activedescendant={flat[sel] ? `${listId}-${sel}` : undefined}
                onChange={(e) => { setQ(e.target.value); setSel(0); }} onKeyDown={onKey} />
              {q ? <button type="button" className="sd-clear" aria-label="Clear search" onClick={() => { setQ(""); setSel(0); input.current?.focus(); }}>Clear</button> : null}
              <button type="button" className="sd-esc" onClick={onClose} aria-label="Close search"><kbd>Esc</kbd></button>
            </div>

            <div className="sd-body" id={listId} role="listbox" aria-label="Results">
              {flat.length === 0 ? (
                <div className="sd-empty">
                  <span className="sd-empty-ico"><Icon name="search" size={22} /></span>
                  <b>No results for “{trimmed}”</b>
                  <span>Check the spelling, or try a project or tool name.</span>
                  <div className="chips" style={{ justifyContent: "center", marginTop: "1.1rem" }}>
                    {entries.filter((e) => groupOf(e) === "Page").slice(0, 4).map((e) => <a key={e.href} href={e.href} className="chipbtn" onClick={(ev) => { ev.preventDefault(); go(e.href); }}>{e.title}</a>)}
                  </div>
                </div>
              ) : groups.map((g) => (
                <div key={g.name} role="group" aria-labelledby={`${listId}-g-${g.name}`}>
                  <div className="sd-gl" id={`${listId}-g-${g.name}`}>{trimmed ? LABEL[g.name] : g.name === "Page" ? "Jump to" : "Projects"}</div>
                  {g.rows.map(({ e, idx }) => (
                    <a key={`${e.href}-${e.title}-${idx}`} id={`${listId}-${idx}`} role="option" aria-selected={idx === sel} href={e.href} tabIndex={-1} className="sd-item"
                      onMouseMove={() => sel !== idx && setSel(idx)} onClick={(ev) => { ev.preventDefault(); go(e.href); }}>
                      {idx === sel ? <motion.span layoutId="sd-hl" className="sd-hl" transition={{ type: "spring", stiffness: 520, damping: 40 }} /> : null}
                      <span className="sd-ico"><Icon name={ICON[g.name] ?? "file"} size={17} /></span>
                      <span className="sd-txt"><span className="sd-t"><Mark text={e.title} q={trimmed} /></span><span className="sd-s"><Mark text={snippet(detailOf(e), trimmed)} q={trimmed} /></span></span>
                      <span className="sd-enter" aria-hidden="true">↵</span>
                    </a>
                  ))}
                </div>
              ))}
            </div>

            <footer className="sd-foot">
              <span className="sd-keys"><kbd>↑</kbd><kbd>↓</kbd><span>move</span><kbd>↵</kbd><span>open</span><kbd>Esc</kbd><span>close</span></span>
              <span aria-live="polite">{trimmed ? `${flat.length} result${flat.length === 1 ? "" : "s"}` : "Type to search"}</span>
            </footer>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}