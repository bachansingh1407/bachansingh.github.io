"use client";

import { useMemo, useState } from "react";
import type { WorkEntry } from "@/lib/types";
import type { FlowNode } from "@/lib/flow";
import { FlowGraph } from "./FlowGraph";
import { Icon } from "./Icon";
import { RichText } from "./RichText";

/** Experience as a timeline (default) or as the same connected-steps diagram used on the home page. */
export function ExperienceView({ roles }: { roles: WorkEntry[] }) {
  const [view, setView] = useState<"timeline" | "flow">("timeline");
  const nodes: FlowNode[] = useMemo(() => roles.map((w, i) => ({
    id: w.uid, title: w.title, text: w.blurb, kind: "process", icon: "briefcase",
    from: i ? [roles[i - 1].uid] : [], chips: w.tech,
  })), [roles]);

  return (
    <>
      <div className="seg view-seg" role="radiogroup" aria-label="Layout">
        {([["timeline", "Timeline"], ["flow", "Flow"]] as const).map(([id, l]) => (
          <button key={id} role="radio" aria-checked={view === id} className={view === id ? "on" : ""} onClick={() => setView(id)}>{l}</button>
        ))}
      </div>
      {view === "flow" ? <FlowGraph nodes={nodes} label="Experience as a flow" /> : (
        <ol className="timeline">
          {roles.map((w) => (
            <li key={w.uid} className="tl-item">
              <span className="tl-dot" aria-hidden="true"><Icon name="briefcase" size={14} /></span>
              <article className="tl-card" id={w.id}>
                <header>
                  <h2 className="tl-role">{w.title}</h2>
                  {w.org || w.dates ? <p className="tl-meta">{[w.org, w.dates].filter(Boolean).join(" · ")}</p> : null}
                </header>
                {w.blurb ? <p className="tl-blurb">{w.blurb}</p> : null}
                {w.tech.length ? <div className="tags">{w.tech.map((t) => <span key={t}>{t}</span>)}</div> : null}
                {w.items.length ? (
                  <ul className="tl-items">
                    {w.items.map((it) => (
                      <li key={it.uid}>{it.title ? <b>{it.title}</b> : null}{it.text ? <span>{it.text}</span> : null}</li>
                    ))}
                  </ul>
                ) : null}
                {w.outcome ? <div className="tl-outcome"><small>Outcome</small><RichText text={w.outcome} /></div> : null}
              </article>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
