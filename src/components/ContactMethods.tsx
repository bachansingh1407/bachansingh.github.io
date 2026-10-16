import { contactRows } from "./ContactLinks";
import { Icon } from "./Icon";
import type { Contact } from "@/lib/types";

/** Large, tappable contact rows for the contact page. */
export function ContactMethods({ contact }: { contact: Contact }) {
  const rows = contactRows(contact);
  if (!rows.length) return null;
  return (
    <div className="cmethods">
      {rows.map((r) => (
        <a key={r.label} className="cm" href={r.href} {...(/^(https?:|\/)/.test(r.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          <span className="cm-ico"><Icon name={r.icon} size={20} /></span>
          <span className="cm-txt"><b>{r.label}</b><small>{r.text}</small></span>
          <span className="cm-go"><Icon name="arrow" size={18} /></span>
        </a>
      ))}
    </div>
  );
}
