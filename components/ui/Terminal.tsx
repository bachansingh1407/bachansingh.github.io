"use client";
import { useEffect, useRef, useState } from "react";
import { portfolio as P } from "@/data/portfolio";
import { ROOMS } from "./Nav";
type Line = { kind: "in" | "out"; text: string };
const NAMES = ["help", "about", "whoami", "stack", "projects", "open", "goto", "experience", "contact", "coffee", "theme", "neofetch", "history", "clear", "secret"];
const CHIPS = ["help", "about", "stack", "projects", "neofetch", "coffee", "secret"];
const toast = (m: string) => window.dispatchEvent(new CustomEvent("toast", { detail: m }));
export default function Terminal() {
  const [open, setOpen] = useState(false); const [v, setV] = useState("");
  const [log, setLog] = useState<Line[]>([{ kind: "out", text: 'DEVELOPER.OS v1.0\nType "help", press Tab to autocomplete, or tap a command below.' }]);
  const hist = useRef<string[]>([]); const hi = useRef(0);
  const end = useRef<HTMLDivElement>(null); const inp = useRef<HTMLInputElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [log]);
  useEffect(() => { if (open) inp.current?.focus(); }, [open]);
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, []);
  function exec(raw: string): string | null {
    const [c, ...a] = raw.trim().split(/\s+/); const arg = a.join(" ").toLowerCase();
    switch (c.toLowerCase()) {
      case "": return "";
      case "help": return "about        who I am\nstack        technologies by area\nprojects     list projects\nopen <n>     open project n (e.g. open 2)\ngoto <room>  jump to: " + ROOMS.map((r) => r[0]).join(", ") + "\nexperience   the save file summary\ncontact      how to reach me\nneofetch     system info\ntheme        toggle light/dark\ncoffee       caffeine level\nhistory      previous commands\nclear        clear screen";
      case "about": case "whoami": return `${P.name}\n${P.role}. ${P.tagline}`;
      case "stack": return `frontend    ${P.frontend.map((f) => f.name).join(", ")}\nbackend     ${P.backend.join(", ")}\ndatabases   ${P.databases.map((d) => d.name).join(", ")}\nengineering ${P.engineering.join(", ")}`;
      case "projects": return P.projects.map((p, i) => `${i + 1}. ${p.name}\n   ${p.stack.join(" • ")}`).join("\n") + "\n\nType: open <number>";
      case "open": { const n = parseInt(arg, 10) - 1; if (!P.projects[n]) return `usage: open <1-${P.projects.length}>`; window.dispatchEvent(new CustomEvent("open-project", { detail: n })); setOpen(false); return null; }
      case "goto": { const r = ROOMS.find(([id]) => id === arg); if (!r) return "unknown room. try: " + ROOMS.map((x) => x[0]).join(", "); document.getElementById(r[0])?.scrollIntoView({ behavior: "smooth" }); setOpen(false); return null; }
      case "experience": return `${P.level}\n1.5+ years\nquests: ${P.quests.join(", ")}`;
      case "contact": return `email     ${P.email}\ngithub    ${P.github}\nlinkedin  ${P.linkedin}`;
      case "neofetch": return `${P.name.toLowerCase().replace(/\W+/g, "-")}@developer.os\n----------------------\nrole:      ${P.role}\nexperience: 1.5+ years\nstack:     ${P.frontend.length + P.backend.length + P.databases.length} tools\nprojects:  ${P.projects.length}\ncaffeine:  87%\nshell:     cartoon-sh`;
      case "theme": { const d = document.documentElement; const dark = d.dataset.theme === "dark" || (!d.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches); d.dataset.theme = dark ? "light" : "dark"; return `theme: ${d.dataset.theme}`; }
      case "coffee": return "████████████████████\nCAFFEINE LEVEL: 87%\n████████████████████";
      case "secret": return "You found the secret.\n\nThere is no secret.\n\nBut you get +10 developer XP.";
      case "history": return hist.current.map((h, i) => `${i + 1}  ${h}`).join("\n") || "empty";
      case "clear": setLog([]); return null;
      case "sudo": return arg === "make-me-a-sandwich" ? "Permission denied." : "nice try.";
      default: return `command not found: ${c}\nType "help" for the list.`;
    }
  }
  function run(raw: string) {
    const t = raw.trim(); if (t) { hist.current.push(t); hi.current = hist.current.length; }
    const out = exec(t); setLog((l) => (out === null ? l : [...l, { kind: "in", text: t }, ...(out ? [{ kind: "out" as const, text: out }] : [])]));
    if (t === "coffee") toast("COFFEE +1");
    setV("");
  }
  function key(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") run(v);
    else if (e.key === "ArrowUp") { e.preventDefault(); hi.current = Math.max(0, hi.current - 1); setV(hist.current[hi.current] ?? ""); }
    else if (e.key === "ArrowDown") { e.preventDefault(); hi.current = Math.min(hist.current.length, hi.current + 1); setV(hist.current[hi.current] ?? ""); }
    else if (e.key === "Tab") { e.preventDefault(); const m = NAMES.filter((n) => n.startsWith(v.toLowerCase())); if (m.length === 1) setV(m[0] + (["open", "goto"].includes(m[0]) ? " " : "")); }
  }
  return (<>
    <button id="mascot" aria-label="Open the developer terminal" onClick={() => { toast("Developer is currently pretending the bug doesn't exist."); setOpen(true); }}>
      <svg viewBox="0 0 90 100" aria-hidden="true"><path d="M20 98c0-26 10-34 25-34s25 8 25 34z" fill="#8B5CF6" stroke="#18181B" strokeWidth="4" /><path d="M14 40c-2-26 18-34 32-32s30 10 28 32c-2 20-16 28-30 28S16 60 14 40z" fill="#DCFCE7" stroke="#18181B" strokeWidth="4" /><path d="M12 30c6-22 60-26 66 0-16-8-48-8-66 0z" fill="#22C55E" stroke="#18181B" strokeWidth="4" /><ellipse className="eye" cx="34" cy="44" rx="4" ry="6" fill="#18181B" /><ellipse className="eye" cx="58" cy="44" rx="4" ry="6" fill="#18181B" /><path d="M36 56q10 8 20 0" fill="none" stroke="#18181B" strokeWidth="4" strokeLinecap="round" /></svg>
    </button>
    {open && (
      <section id="term" role="dialog" aria-label="Developer terminal">
        <div className="tbar"><span className="dots" aria-hidden="true"><i /><i /><i /></span><span>developer.os — bash</span><button className="tx" onClick={() => setOpen(false)} aria-label="Close terminal">esc</button></div>
        <div className="tout" onClick={() => inp.current?.focus()}>
          {log.map((l, i) => <div key={i} className={l.kind}>{l.kind === "in" ? "$ " : ""}{l.text}</div>)}<div ref={end} />
        </div>
        <div className="chips">{CHIPS.map((c) => <button key={c} onClick={() => run(c)}>{c}</button>)}</div>
        <label className="tin"><span aria-hidden="true">$</span><input ref={inp} value={v} onChange={(e) => setV(e.target.value)} onKeyDown={key} autoComplete="off" spellCheck={false} aria-label="Terminal command" /></label>
      </section>
    )}
  </>);5
}
