"use client";
import { useEffect, useState } from "react";
import { portfolio as P } from "@/data/portfolio";
const LINES = ["Loading creativity", "Loading caffeine", "Loading JavaScript", "Loading backend", "Connecting databases", "Deploying personality"];
export default function DeveloperDesk() {
  const [n, setN] = useState(0); const [ready, setReady] = useState(false);
  useEffect(() => {
    if (ready) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setReady(true); return; }
    const t = setInterval(() => setN((x) => x + 1), 380);
    return () => clearInterval(t);
  }, [ready]);
  useEffect(() => { if (n >= LINES.length + 2) setReady(true); }, [n]);
  return (
    <header id="desk" className="desk">
      {!ready && <button className="btn off skip" onClick={() => setReady(true)}>Skip intro</button>}
      <div className="laptop">
        <div className="screen flick" aria-live="polite">
          {!ready ? (<>
            <div>BOOTING DEVELOPER.OS...</div>
            {LINES.slice(0, n).map((l) => <div key={l}>{l}........ ✓</div>)}
            {n > LINES.length && <div className="cursor">SYSTEM READY.</div>}
          </>) : (<>
            <div>&gt; hello, world</div>
            <h1 className="big">HEY, I&apos;M {P.name.toUpperCase()}.<br />I BUILD THINGS THAT LIVE BETWEEN PIXELS AND DATABASES.</h1>
            <div className="sub2">{P.role}. {P.tagline}</div>
            <div className="cta"><a className="btn" href="#frontend">Enter the world</a><a className="btn pu" href="#projects">View my work</a><a className="btn off" href="#contact">Send a signal</a></div>
          </>)}
        </div>
        <div className="base" />
      </div>
    </header>
  );
}
