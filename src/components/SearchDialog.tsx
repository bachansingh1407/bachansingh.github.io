"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { SearchEntry } from "@/lib/types";
import { useFocusTrap } from "./useFocusTrap";

export function SearchDialog({ open, onClose, entries }: { open: boolean; onClose: () => void; entries: SearchEntry[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const panel = useFocusTrap<HTMLDivElement>(open, onClose);
  const titleId = useId(), listId = useId();

  useEffect(() => { if (open) { setQ(""); setSel(0); setTimeout(() => input.current?.focus(), 0); } }, [open]);

  const hits = useMemo(() => {
    const v = q.trim().toLowerCase();
    return entries.filter((e) => !v || `${e.title} ${e.text ?? ""} ${e.kind}`.toLowerCase().includes(v)).slice(0, 10);
  }, [q, entries]);

  function go(href: string) { onClose(); router.push(href); }
  if (!open) return null;

  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="panel" ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 id={titleId} className="sr-only">Search</h2>
        <input
          ref={input} type="search" value={q} placeholder="Search pages, projects and technologies" autoComplete="off"
          role="combobox" aria-expanded="true" aria-controls={listId} aria-activedescendant={hits[sel] ? `${listId}-${sel}` : undefined}
          onChange={(e) => { setQ(e.target.value); setSel(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, hits.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
            if (e.key === "Enter" && hits[sel]) go(hits[sel].href);
          }}
        />
        <div className="results" id={listId} role="listbox" aria-label="Results">
          {hits.length === 0 ? <p>No results. Try a technology or project name.</p> : hits.map((h, i) => (
            <a key={`${h.href}-${h.title}-${i}`} id={`${listId}-${i}`} role="option" aria-selected={i === sel} href={h.href}
              className={i === sel ? "sel" : ""} onMouseEnter={() => setSel(i)} tabIndex={-1}
              onClick={(e) => { e.preventDefault(); go(h.href); }}>
              {h.title}<small>{h.kind}</small>
            </a>
          ))}
        </div>
        <button className="btn sm close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
