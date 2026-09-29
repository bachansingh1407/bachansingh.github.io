"use client";
import { useEffect, useRef, useState } from "react";
import { portfolio as P } from "@/data/portfolio";
export default function ProjectArcade() {
  const ref = useRef<HTMLDialogElement>(null); const [i, setI] = useState<number | null>(null);
  const show = (n: number) => { setI(n); requestAnimationFrame(() => ref.current?.showModal()); };
  useEffect(() => {
    const h = (e: Event) => show((e as CustomEvent<number>).detail);
    window.addEventListener("open-project", h);
    return () => window.removeEventListener("open-project", h);
  }, []);
  const p = i === null ? null : P.projects[i];
  return (
    <section id="projects" className="room" aria-labelledby="hp">
      <h2 id="hp">Project Arcade</h2><p className="hand">insert curiosity to continue ↓</p>
      <p className="sub">Placeholder projects. Replace them in data/portfolio.ts.</p>
      <div className="grid">{P.projects.map((x, n) => (
        <button key={x.name} className="cab" onClick={() => show(n)}>
          <h3>{x.name}</h3><div className="scr"><span>PLAYER 1 READY</span></div><div className="st">Start project</div>
          <p className="stack">{x.stack.join(" • ")}</p>
        </button>))}
      </div>
      <dialog ref={ref} aria-labelledby="dt" onClose={() => setI(null)}>
        {p && (<>
          <h3 id="dt">{p.name}</h3>
          <div className="tags">{p.stack.map((s) => <span key={s} className="sticker">{s}</span>)}</div>
          <dl><dt>Problem</dt><dd>{p.problem}</dd><dt>What was built</dt><dd>{p.built}</dd><dt>Architecture</dt><dd>{p.architecture}</dd><dt>My contribution</dt><dd>{p.contribution}</dd></dl>
          <div className="links"><a className="btn" href={p.github} target="_blank" rel="noopener noreferrer">GitHub repo</a><a className="btn pu" href={p.live} target="_blank" rel="noopener noreferrer">Live demo</a><button className="btn off" onClick={() => ref.current?.close()}>Close</button></div>
        </>)}
      </dialog>
    </section>
  );
}
