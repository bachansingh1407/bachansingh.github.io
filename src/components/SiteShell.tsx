"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { Mode, NavItem, SearchEntry } from "@/lib/types";
import { AskWidget } from "./AskWidget";
import { SearchDialog } from "./SearchDialog";
import { ThemePicker } from "./ThemePicker";
import { Toc } from "./Toc";

const GROUPS = ["Portfolio", "How I work", "Reference"];
const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));

interface Props {
  nav: NavItem[]; search: SearchEntry[]; name: string; role: string; updated: string;
  resumeHref: string; palettes: string[]; defaultPalette: string; defaultMode: Mode;
  preview: boolean; ask: { enabled: boolean; questions: string[] }; children: ReactNode;
}

function Pager({ nav }: { nav: NavItem[] }) {
  const pathname = usePathname();
  const i = nav.findIndex((n) => n.href === "/" + (pathname.split("/")[1] ?? ""));
  if (i < 0) return null;
  const prev = nav[i - 1], next = nav[i + 1];
  if (!prev && !next) return null;
  return (
    <div className="pager">
      {prev ? <Link href={prev.href}><small>Previous</small><b>{prev.title}</b></Link> : <span />}
      {next ? <Link href={next.href} className="next"><small>Next</small><b>{next.title}</b></Link> : null}
    </div>
  );
}

const SearchIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>;
const DownloadIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11" /><path d="M7 11l5 5 5-5" /><path d="M5 20h14" /></svg>;

export function SiteShell(p: Props) {
  const pathname = usePathname();
  const landing = pathname === "/";
  const [closed, setClosed] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [searching, setSearching] = useState(false);
  const [manual, setManual] = useState<Record<string, boolean>>({});

  useEffect(() => { setOpen(false); setMenu(false); }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearching(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleNav = () => (window.matchMedia("(max-width: 900px)").matches ? setOpen((o) => !o) : setClosed((c) => !c));
  const here = p.nav.find((n) => isActive(pathname, n.href));
  const child = here?.children?.find((c) => c.href === pathname);
  const contact = p.nav.find((n) => n.id === "contact");
  const actions = (
    <>
      <button className="icon-btn" onClick={() => setSearching(true)} aria-label="Search (Ctrl K)"><SearchIcon /></button>
      {p.resumeHref ? <a className="icon-btn" href={p.resumeHref} target="_blank" rel="noopener noreferrer" aria-label="Download resume" title="Resume"><DownloadIcon /></a> : null}
      <ThemePicker palettes={p.palettes} defaultPalette={p.defaultPalette} defaultMode={p.defaultMode} />
    </>
  );
  const dialog = (
    <>
      <SearchDialog open={searching} onClose={() => setSearching(false)} entries={p.search} />
      {p.ask.enabled ? <AskWidget name={p.name} questions={p.ask.questions} /> : null}
    </>
  );
  const banner = p.preview ? (
    <div className="preview-bar" role="status">Previewing your draft. Hidden items are shown. <a href="/api/admin/preview?on=0&next=/admin">Exit preview</a></div>
  ) : null;

  if (landing) {
    const links = p.nav.filter((n) => n.id !== "start");
    return (
      <div className="landing">
        {banner}
        <a className="skip" href="#main">Skip to content</a>
        <header className="lnav">
          <Link href="/" className="lbrand">
            <svg width="26" height="26" viewBox="0 0 30 30" fill="none" aria-hidden="true"><circle cx="15" cy="15" r="12" stroke="var(--accent)" strokeWidth="2.2" strokeDasharray="4 3.2" /><circle cx="15" cy="15" r="4.2" fill="var(--accent)" /></svg>
            <b>{p.name}</b>
          </Link>
          <nav className="llinks" aria-label="Main">{links.map((n) => <Link key={n.id} href={n.href}>{n.title}</Link>)}</nav>
          <div className="top-right">
            {actions}
            {contact ? <Link href={contact.href} className="btn primary sm hide-s">Get in touch</Link> : null}
            <button className="icon-btn menu-btn" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
          </div>
        </header>
        {menu ? <nav className="lmenu" aria-label="Menu">{links.map((n) => <Link key={n.id} href={n.href}>{n.title}</Link>)}</nav> : null}
        <main id="main">{p.children}</main>
        <footer className="lfoot">
          <span>{p.name}{p.role ? ` · ${p.role}` : ""}</span>
          {p.updated ? <span>Last updated {p.updated}</span> : null}
        </footer>
        {dialog}
      </div>
    );
  }

  return (
    <div className={`shell${closed ? " nav-closed" : ""}${open ? " nav-open" : ""}`}>
      {banner}
      <a className="skip" href="#article">Skip to content</a>
      <div className="accent-line" />
      <div className="scrim" onClick={() => setOpen(false)} />

      <aside className="sidebar" aria-label="Site navigation">
        <div className="brand">
          <Link href="/" className="lbrand">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true"><circle cx="15" cy="15" r="12" stroke="var(--accent)" strokeWidth="2.2" strokeDasharray="4 3.2" /><circle cx="15" cy="15" r="4.2" fill="var(--accent)" /></svg>
            <b>Portfolio</b>
          </Link>
        </div>
        <div className="side-meta">
          <div className="row"><span>{p.name}</span></div>
          <div>{p.role}{contact ? <> · <Link href={contact.href}>Contact</Link></> : null}</div>
        </div>
        <nav className="nav">
          {GROUPS.map((g) => {
            const items = p.nav.filter((n) => n.group === g);
            if (!items.length) return null;
            return (
              <div key={g}>
                <div className="nav-label">{g}</div>
                {items.map((n) => {
                  const active = isActive(pathname, n.href);
                  if (!n.children?.length) return <Link key={n.id} href={n.href} className={`nav-item${active ? " active" : ""}`}>{n.title}</Link>;
                  const expanded = manual[n.id] ?? active;
                  return (
                    <div key={n.id} className={`nav-group${expanded ? " open" : ""}`}>
                      <div className="nav-row">
                        <Link href={n.href} className={`nav-item${pathname === n.href ? " active" : ""}`}>{n.title}</Link>
                        <button className="nav-chev" aria-label={`${expanded ? "Collapse" : "Expand"} ${n.title}`} aria-expanded={expanded} onClick={() => setManual((m) => ({ ...m, [n.id]: !expanded }))}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                        </button>
                      </div>
                      <div className="nav-sub">{n.children.map((c) => <Link key={c.href} href={c.href} className={pathname === c.href ? "active" : ""}>{c.title}</Link>)}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </nav>
        {p.updated ? <div className="side-foot">Last updated {p.updated}</div> : null}
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="top-left">
            <button className="icon-btn" onClick={toggleNav} aria-label="Toggle navigation">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 5v14" /><path d="M17 8l-4 4 4 4" /></svg>
            </button>
            <span className="crumb">{here?.id === "projects" && child ? <>Projects / <b>{child.title}</b></> : <b>{here?.title ?? ""}</b>}</span>
          </div>
          <div className="top-right">
            {actions}
            {contact ? <Link href={contact.href} className="btn primary sm hide-s">Get in touch</Link> : null}
          </div>
        </header>
        <div className="wrap">
          <article id="article">
            <Toc mobile />
            {p.children}
            <Pager nav={p.nav} />
            {p.updated ? <p className="foot">Last updated {p.updated}.</p> : null}
          </article>
          <Toc />
        </div>
      </div>
      {dialog}
    </div>
  );
}
