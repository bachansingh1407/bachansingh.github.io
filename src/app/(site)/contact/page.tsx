import { ContactForm } from "@/components/ContactForm";
import { ContactLinks, contactRows } from "@/components/ContactLinks";
import { pageTitle } from "@/lib/public";
import { buildMeta } from "@/lib/seo";
import { requirePage } from "@/lib/site";

export async function generateMetadata() {
  const pub = await requirePage("contact");
  return buildMeta(pub, { title: pageTitle(pub, "contact"), description: "Get in touch.", path: "/contact" });
}

export default async function ContactPage() {
  const pub = await requirePage("contact");
  const { contact } = pub;
  const hasLinks = contactRows(contact).length > 0;
  return (
    <>
      <h1>{pageTitle(pub, "contact")}</h1>
      {contact.formEnabled || hasLinks ? (
        <div className={`contact-grid${contact.formEnabled && hasLinks ? "" : " single"}`}>
          {contact.formEnabled ? <div><p className="lead">Send me a message and I&apos;ll reply by email.</p><ContactForm /></div> : null}
          {hasLinks ? <ContactLinks contact={contact} title="Or reach me directly" /> : null}
        </div>
      ) : (
        <div className="empty"><b>Contact details coming soon</b>Email, GitHub and LinkedIn appear here once they are added.</div>
      )}
    </>
  );
}
