"use client";
import { useState } from "react";
import { portfolio as P } from "@/data/portfolio";
const STEPS = ["Preparing message...", "Encrypting...", "Launching...", "████████████████████", "MESSAGE READY ✓ (opening your email app)"];
export default function SignalStation() {
  const [out, setOut] = useState<string[]>([]); const [busy, setBusy] = useState(false);
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const href = `mailto:${P.email}?subject=${encodeURIComponent("Signal from " + f.get("n"))}&body=${encodeURIComponent(`${f.get("m")}\n\n${f.get("n")} (${f.get("e")})`)}`;
    setBusy(true); setOut([]); const fast = matchMedia("(prefers-reduced-motion: reduce)").matches;
    STEPS.forEach((s, i) => setTimeout(() => { setOut((o) => [...o, s]); if (i === STEPS.length - 1) { setBusy(false); location.href = href; } }, fast ? 0 : i * 450));
  }
  return (
    <section id="contact" className="room" aria-labelledby="hc">
      <h2 id="hc">Send a Signal</h2><p className="hand">no forms were harmed in the making of this transmission</p>
      <div className="box narrow"><form onSubmit={submit}>
        <label>Name<input name="n" required autoComplete="name" /></label>
        <label>Email<input name="e" type="email" required autoComplete="email" /></label>
        <label>Message<textarea name="m" rows={4} required /></label>
        <button className="btn pu" type="submit" disabled={busy}>Transmit</button>
        <div id="tx" aria-live="polite">{out.join("\n")}</div>
      </form></div>
      <div className="links">
        <a className="btn" href={P.github} target="_blank" rel="noopener noreferrer">GitHub profile</a>
        <a className="btn pu" href={P.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn profile</a>
        <a className="btn off" href={`mailto:${P.email}`}>Email me</a>
        <a className="btn off" href={P.resume}>Résumé</a>
      </div>
    </section>
  );
}
