"use client";
import { useState } from "react";
import { portfolio as P } from "@/data/portfolio";
const toast = (m: string) => window.dispatchEvent(new CustomEvent("toast", { detail: m }));
const Gear = ({ c }: { c: string }) => (<svg viewBox="0 0 64 64" aria-hidden="true"><g className="gear"><circle cx="32" cy="32" r="18" fill={c} stroke="#18181B" strokeWidth="4" /><g stroke="#18181B" strokeWidth="8" strokeLinecap="round"><path d="M32 6v6M32 52v6M6 32h6M52 32h6M14 14l4 4M46 46l4 4M14 50l4-4M46 18l4-4" /></g><circle cx="32" cy="32" r="6" fill="#FAF9F6" stroke="#18181B" strokeWidth="3" /></g></svg>);
export function FrontendLab() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section id="frontend" className="room" aria-labelledby="hf">
      <h2 id="hf">Frontend Lab</h2><p className="hand">where pixels become interfaces →</p>
      <p className="sub">Hover, focus, or tap a machine to switch it on.</p>
      <div className="grid">{P.frontend.map((f) => (
        <button key={f.name} className={`machine box ${open === f.name ? "open" : ""}`} onClick={() => setOpen(open === f.name ? null : f.name)}>
          <Gear c="#22C55E" /><b>{f.name}</b><small>{f.machine}</small><p className="tip">{f.tip}</p>
        </button>))}
      </div>
    </section>
  );
}
export function BackendBasement() {
  const nodes = ["Client", "API", "Server", "Database", "Response"];
  return (
    <section id="backend" className="room basement" aria-labelledby="hb"><div className="in">
      <h2 id="hb">Backend Basement</h2><p className="hand">where requests disappear... and eventually come back with data.</p>
      <div className="pipe" role="img" aria-label="Request flow: client, API, server, database, response"><div className="pkt" />
        {nodes.map((n, i) => (<span key={n} style={{ display: "contents" }}><div className="node">{n}</div>{i < nodes.length - 1 && <i />}</span>))}
      </div>
      <div className="grid">{P.backend.map((b) => <div key={b} className="box"><b>{b}</b></div>)}</div>
    </div></section>
  );
}
export function DatabaseVault() {
  return (
    <section id="database" className="room" aria-labelledby="hd">
      <h2 id="hd">The Database Vault</h2><p className="hand">I don&apos;t just connect databases. I design around the data.</p>
      <div className="grid vault">{P.databases.map((d) => (
        <button key={d.name} className="db box" onClick={() => toast(d.egg)}>
          <span className="led" /><span className="led" /><span className="led" /><h3>{d.name}</h3><p>{d.desc}</p>
        </button>))}
      </div>
      <div className="tags">{P.concepts.map((c) => <span key={c} className="sticker g">{c}</span>)}</div>
    </section>
  );
}
