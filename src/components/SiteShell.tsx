"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { NavItem, SearchEntry } from "@/lib/types";
import { SearchDialog } from "./SearchDialog";
import { Toc } from "./Toc";

const GROUPS = ["Portfolio", "How I work", "Reference"];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

function Pager({ nav }: { nav: NavItem[] }) {
  const pathname = usePathname();
  const base = "/" + (pathname.split("/")[1] ?? "");
  const i = nav.findIndex((n) => n.href === base);
  if (i < 0) return null;
  const prev = nav[i - 1];
  const next = nav[i + 1];
  if (!prev && !next) return null;
  return (
    <div className="pager">
      {prev ? (
        <Link href={prev.href}><small>Previous</small><b>{prev.title}</b></Link>
      ) : <span />}
      {next ? (
        <Link href={next.href} className="next"><small>Next</small><b>{next.title}</b></Link>
      ) : null}
    </div>
  );
}

export function SiteShell({
  nav, search, name, role, updated, hasContact, children,
}: {
  nav: NavItem[]; search: SearchEntry[]; name: string; role: string;
  updated: string; hasContact: boolean; children: ReactNode;
}) {
  const pathname = usePathname();
  const [closed, setClosed] = useState(false);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [manual, setManual] = useState<Record<string, boolean>>({});

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearching(true);
      }
      if (e.key === "Escape") setSearching(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function toggleNav() {
    if (window.matchMedia("(max-width: 900px)").matches) setOpen((o) => !o);
    else setClosed((c) => !c);
  }

  function toggleTheme() {
    const el = document.documentElement;
    const cur = el.dataset.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    el.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch { /* storage unavailable */ }
  }

  const here = nav.find((n) => isActive(pathname, n.href));
  const child = here?.children?.find((c) => c.href === pathname);

  return (
    <div className={`shell${closed ? " nav-closed" : ""}${open ? " nav-open" : ""}`}>
      <div className="accent-line" />
      <div className="scrim" onClick={() => setOpen(false)} />

      <aside className="sidebar" aria-label="Site navigation">
        <div className="brand">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
            <circle cx="15" cy="15" r="12" stroke="var(--accent)" strokeWidth="2.2" strokeDasharray="4 3.2" />
            <circle cx="15" cy="15" r="4.2" fill="var(--accent)" />
          </svg>
          <b>{name}</b>
        </div>
        <div className="side-meta">
          <div className="row"><span>Portfolio</span></div>
          <div>
            {role}
            {hasContact ? <> · <Link href="/contact">Contact</Link></> : null}
          </div>
        </div>
        <nav className="nav">
          {GROUPS.map((g) => {
            const items = nav.filter((n) => n.group === g);
            if (!items.length) return null;
            return (
              <div key={g}>
                <div className="nav-label">{g}</div>
                {items.map((n) => {
                  const active = isActive(pathname, n.href);
                  if (!n.children?.length) {
                    return (
                      <Link key={n.id} href={n.href} className={`nav-item${active ? " active" : ""}`}>{n.title}</Link>
                    );
                  }
                  const expanded = manual[n.id] ?? active;
                  return (
                    <div key={n.id} className={`nav-group${expanded ? " open" : ""}`}>
                      <div className="nav-row">
                        <Link href={n.href} className={`nav-item${pathname === n.href ? " active" : ""}`}>{n.title}</Link>
                        <button
                          className="nav-chev"
                          aria-label={`${expanded ? "Collapse" : "Expand"} ${n.title}`}
                          aria-expanded={expanded}
                          onClick={() => setManual((m) => ({ ...m, [n.id]: !expanded }))}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                        </button>
                      </div>
                      <div className="nav-sub">
                        {n.children.map((c) => (
                          <Link key={c.href} href={c.href} className={pathname === c.href ? "active" : ""}>{c.title}</Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </nav>
        {updated ? <div className="side-foot">Last updated {updated}</div> : null}
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="top-left">
            <button className="icon-btn" onClick={toggleNav} aria-label="Toggle navigation">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 5v14" /><path d="M17 8l-4 4 4 4" /></svg>
            </button>
            <span className="crumb">
              {here?.id === "projects" && child ? <>Projects / <b>{child.title}</b></> : <b>{here?.title ?? ""}</b>}
            </span>
          </div>
          <div className="top-right">
            <button className="icon-btn" onClick={() => setSearching(true)} aria-label="Search (Ctrl K)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            </button>
            <button className="icon-btn" onClick={() => window.print()} aria-label="Print page">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M7 9V3h10v6" /><rect x="4" y="9" width="16" height="8" rx="2" /><path d="M7 14h10v7H7z" /></svg>
            </button>
            <button className="icon-btn" onClick={toggleTheme} aria-label="Switch theme">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z" /></svg>
            </button>
            {hasContact ? (
              <Link href="/contact" className="icon-btn" aria-label="Contact">
                <span className="avatar">{name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()}</span>
              </Link>
            ) : null}
          </div>
        </header>

        <div className="wrap">
          <article id="article">
            {children}
            <Pager nav={nav} />
            {updated ? <p className="foot">Last updated {updated}.</p> : null}
          </article>
          <Toc />
        </div>
      </div>

      <SearchDialog open={searching} onClose={() => setSearching(false)} entries={search} />
    </div>
  );
}
