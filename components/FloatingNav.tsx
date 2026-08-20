"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/data/site";
import ThemeToggle from "./ThemeToggle";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

/**
 * Replaces the old sticky top Nav. No header bar eating vertical space —
 * instead a single fixed control, bottom-left (Ai Assistant owns
 * bottom-right), that expands into the section list + theme toggle.
 * Tracks scroll position so the current section is always visible at a
 * glance, collapsed or not.
 */
export default function FloatingNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#top");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = ["top", ...links.map((l) => l.href.slice(1))]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={rootRef} className="fixed bottom-5 left-5 z-50 flex flex-col-reverse items-start gap-3">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-12 w-12 items-center justify-center border-[1px] border-ink bg-bg text-ink shadow-[4px_4px_0_0_#0a0a0a] transition-transform hover:-translate-y-0.5 dark:border-ink-dark dark:bg-bg-dark dark:text-ink-dark dark:shadow-[4px_4px_0_0_#f2f2ed]"
      >
        {open ? <X size={18} /> : <Menu size={18} className="text-accent dark:text-accent-dark" />}
      </button>

      {/* Expanded panel */}
      <div
        className={`flex flex-col border-[1px] border-ink bg-bg text-ink shadow-[4px_4px_0_0_#0a0a0a] transition-all duration-200 ease-out dark:border-ink-dark dark:bg-bg-dark dark:text-ink-dark dark:shadow-[4px_4px_0_0_#f2f2ed] ${
          open
            ? "pointer-events-auto max-h-96 w-52 opacity-100"
            : "pointer-events-none max-h-0 w-52 opacity-0"
        } overflow-hidden`}
      >
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="border-b-[1px] border-ink/10 px-4 py-3 font-mono text-xs font-bold uppercase tracking-widest text-accent dark:border-ink-dark/10 dark:text-accent-dark"
        >
          {site.firstName}
        </a>
        <ul className="flex flex-col">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                  active === link.href
                    ? "bg-ink text-bg dark:bg-ink-dark dark:text-bg-dark"
                    : "text-sub hover:text-ink dark:text-sub-dark dark:hover:text-ink-dark"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t-[1px] border-ink/10 px-4 py-3 dark:border-ink-dark/10">
          <span className="font-mono text-[11px] uppercase tracking-widest text-sub dark:text-sub-dark">
            Theme
          </span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
