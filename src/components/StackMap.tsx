"use client";

import { useId, useMemo, useState } from "react";
import type { StackGroup } from "@/lib/types";
import { BrandIcon } from "./Icon";

/** Interactive stack: filter by layer, search, and open a tool to read why it is used. Tools without notes stay plain. */
export function StackMap({ groups }: { groups: StackGroup[] }) {
  const [q, setQ] = useState("");
  const [layer, setLayer] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const uid = useId();

  const shown = useMemo(() => {
    const v = q.trim().toLowerCase();
    return groups
      .filter((g) => layer === "all" || g.id === layer)
      .map((g) => ({ ...g, items: g.items.filter((i) => !v || `${i.name} ${i.description} ${i.why} ${i.how}`.toLowerCase().includes(v)) }))
      .filter((g) => g.items.length);
  }, [groups, q, layer]);

  const hasNotes = (i: StackGroup["items"][number]) => Boolean(i.why || i.how || i.alternatives);
  return (
    <div className="smap">
      <div className="smap-tools">
        <div className="chips" role="group" aria-label="Filter by layer">
          {[{ id: "all", name: "All" }, ...groups.map((g) => ({ id: g.id, name: g.name }))].map((g) => (
            <button key={g.id} className={`chipbtn${layer === g.id ? " on" : ""}`} aria-pressed={layer === g.id} onClick={() => { setLayer(g.id); setOpen(null); }}>{g.name}</button>
          ))}
        </div>
        <input type="search" className="smap-search" placeholder="Search tools" aria-label="Search tools" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {shown.length === 0 ? <p className="muted">No tools match that search.</p> : null}
      {shown.map((g) => {
        const sel = g.items.find((i) => i.uid === open);
        return (
          <section key={g.uid} className="slayer" aria-labelledby={`${uid}-${g.id}`}>
            <h2 id={`${uid}-${g.id}`} className="slayer-h">{g.name}</h2>
            <div className="tiles">
              {g.items.map((i) => {
                const body = (
                  <>
                    <BrandIcon icon={i.icon} name={i.name} />
                    <span className="tname">{i.name}</span>
                    {i.description ? <span className="tdesc">{i.description}</span> : null}
                    {hasNotes(i) ? <span className="tmore" aria-hidden="true">{open === i.uid ? "−" : "+"}</span> : null}
                  </>
                );
                return hasNotes(i) ? (
                  <button key={i.uid} className={`tile${open === i.uid ? " on" : ""}`} aria-expanded={open === i.uid} aria-controls={`${uid}-${i.uid}`}
                    onClick={() => setOpen(open === i.uid ? null : i.uid)}>{body}</button>
                ) : <div key={i.uid} className="tile static">{body}</div>;
              })}
            </div>
            {sel ? (
              <div className="tdetail" id={`${uid}-${sel.uid}`} role="region" aria-label={`${sel.name} details`}>
                <div className="tdetail-h"><BrandIcon icon={sel.icon} name={sel.name} size={30} /><h3>{sel.name}</h3>
                  <button className="adm-x" aria-label="Close details" onClick={() => setOpen(null)}>✕</button></div>
                <dl>
                  {sel.why ? <><dt>Why I use it</dt><dd>{sel.why}</dd></> : null}
                  {sel.how ? <><dt>How I use it</dt><dd>{sel.how}</dd></> : null}
                  {sel.alternatives ? <><dt>Alternatives I considered</dt><dd>{sel.alternatives}</dd></> : null}
                </dl>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
