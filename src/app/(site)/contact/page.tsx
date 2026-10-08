import { pageTitle, requirePage } from "@/lib/content";

export async function generateMetadata() {
  return { title: pageTitle(await requirePage("contact"), "contact") };
}

export default async function ContactPage() {
  const pub = await requirePage("contact");
  const { contact } = pub;
  const rows = [
    contact.email && { label: "Email", text: contact.email, href: `mailto:${contact.email}` },
    contact.github && { label: "GitHub", text: contact.github.replace(/^https?:\/\//, ""), href: contact.github },
    contact.linkedin && { label: "LinkedIn", text: contact.linkedin.replace(/^https?:\/\//, ""), href: contact.linkedin },
    contact.resumeUrl && { label: "Resume", text: "Download", href: contact.resumeUrl },
  ].filter(Boolean) as { label: string; text: string; href: string }[];

  return (
    <>
      <h1>{pageTitle(pub, "contact")}</h1>
      {rows.length ? (
        <div className="rows">
          {rows.map((r) => (
            <a key={r.label} className="row-link" href={r.href} {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              <b>{r.label}</b>
              <span className="d">{r.text}</span>
            </a>
          ))}
        </div>
      ) : (
        <div className="empty">
          <b>Contact details coming soon</b>
          Email, GitHub and LinkedIn appear here once they are added.
        </div>
      )}
    </>
  );
}
