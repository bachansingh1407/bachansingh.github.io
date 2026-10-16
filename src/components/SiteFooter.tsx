import Link from "next/link";
import type { NavItem } from "@/lib/types";

export function SiteFooter({ nav, name, role, positioning, links, updated }: {
  nav: NavItem[]; name: string; role: string; positioning: string; links: { label: string; href: string }[]; updated: string;
}) {
  return (
    <footer className="sfoot">
      <div className="sfoot-in">
        <div>
          <b style={{ fontSize: "1.1rem", letterSpacing: "-.02em" }}>{name}</b>
          {positioning ? <p>{positioning}</p> : role ? <p>{role}</p> : null}
        </div>
        <nav aria-label="Footer">
          <h2>Pages</h2>
          <ul>{nav.map((n) => <li key={n.id}><Link href={n.href}>{n.title}</Link></li>)}</ul>
        </nav>
        {links.length ? (
          <div>
            <h2>Find me</h2>
            <ul>{links.map((l) => <li key={l.label}><a href={l.href} {...(/^https?:/.test(l.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{l.label}</a></li>)}</ul>
          </div>
        ) : null}
      </div>
      <div className="sfoot-base"><span>© {new Date().getFullYear()} {name}</span>{updated ? <span>Last updated {updated}</span> : null}</div>
    </footer>
  );
}
