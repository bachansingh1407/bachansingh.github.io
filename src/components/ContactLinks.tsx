import Link from "next/link";
import type { Contact } from "@/lib/types";
import { Icon } from "./Icon";

export function contactRows(c: Contact) {
  return [
    c.email && { label: "Email", text: c.email, href: `mailto:${c.email}`, icon: "mail" },
    c.github && { label: "GitHub", text: c.github.replace(/^https?:\/\//, ""), href: c.github, icon: "code" },
    c.linkedin && { label: "LinkedIn", text: c.linkedin.replace(/^https?:\/\//, ""), href: c.linkedin, icon: "briefcase" },
    c.resumeUrl && { label: "Resume", text: "Download (PDF)", href: c.resumeUrl, icon: "file" },
  ].filter(Boolean) as { label: string; text: string; href: string; icon: string }[];
}

/** Icon rows for email, profiles and resume. Used on the About page and beside the contact form. */
export function ContactLinks({ contact, title, messageLink = false }: { contact: Contact; title: string; messageLink?: boolean }) {
  const rows = contactRows(contact);
  if (!rows.length && !messageLink) return null;
  return (
    <aside className="findme" aria-label={title}>
      <h2>{title}</h2>
      <ul>
        {rows.map((r) => (
          <li key={r.label}>
            <a href={r.href} {...(/^(https?:|\/)/.test(r.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              <span className="fm-ico"><Icon name={r.icon} size={17} /></span>
              <span className="fm-txt"><b>{r.label}</b><small>{r.text}</small></span>
            </a>
          </li>
        ))}
      </ul>
      {messageLink ? <Link href="/contact" className="btn primary sm">Send a message</Link> : null}
    </aside>
  );
}
