"use client";
import { useEffect, useState } from "react";
export const ROOMS = [["desk", "Desk", "g"], ["frontend", "Frontend Lab", "g"], ["backend", "Backend Basement", "p"], ["database", "Database Vault", "p"], ["projects", "Project Arcade", "p"], ["experience", "Experience Room", "g"], ["contact", "Send a Signal", "p"]] as const;
export default function Nav() {
  const [on, setOn] = useState("desk"); const [open, setOpen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setOn(e.target.id)), { rootMargin: "-40% 0px -55% 0px" });
    ROOMS.forEach(([id]) => { const n = document.getElementById(id); if (n) io.observe(n); });
    return () => io.disconnect();
  }, []);
  return (<>
    <nav id="map" aria-label="World map">
      {ROOMS.map(([id, n, c]) => (<a key={id} href={`#${id}`} aria-label={n} aria-current={on === id} className={`${c} ${on === id ? "on" : ""}`}><span>{n}</span></a>))}
    </nav>
    <button className="btn pu" id="menuBtn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
    <nav id="menu" className={open ? "open" : ""} aria-label="The world">
      {ROOMS.map(([id, n]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{n}</a>)}
    </nav>
  </>);
}
