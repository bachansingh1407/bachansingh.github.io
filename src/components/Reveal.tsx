"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fades content in as it scrolls into view. Content is visible by default (server render, no JavaScript,
 * reduced motion). It only hides itself when it is confirmed to be below the fold, and a timer always shows it.
 */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"show" | "armed" | "in">("show");

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return;
    setState("armed");
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setState("in"); io.disconnect(); } }, { threshold: 0.05 });
    io.observe(el);
    const failsafe = setTimeout(() => setState("in"), 5000);
    return () => { io.disconnect(); clearTimeout(failsafe); };
  }, []);

  return <div ref={ref} className={`reveal ${state}${className ? " " + className : ""}`} style={{ transitionDelay: state === "in" ? `${delay}ms` : "0ms" }}>{children}</div>;
}
