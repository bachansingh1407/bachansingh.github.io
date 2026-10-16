import { ContactForm } from "@/components/ContactForm";
import { contactRows } from "@/components/ContactLinks";
import { ContactMethods } from "@/components/ContactMethods";
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
  if (!contact.formEnabled && !hasLinks) {
    return <div className="cpage single"><div className="empty"><b>Contact details coming soon</b>Email, GitHub and LinkedIn appear here once they are added.</div></div>;
  }
  return (
    <div className={`cpage${contact.formEnabled ? "" : " single"}`}>
      <div className="rise">
        <p className="sec-eyebrow">{pageTitle(pub, "contact")}</p>
        <h1>Let&apos;s talk.</h1>
        <p className="cintro">Hiring, a project, or a question about my work.{contact.formEnabled ? " Send a message and I'll reply by email." : ""}</p>
        <ContactMethods contact={contact} />
        <ul className="ctips" aria-label="What to include">
          <li><span><b>What it is</b>The role, project or question in a sentence or two.</span></li>
          <li><span><b>When</b>Any timeline or deadline you have in mind.</span></li>
          <li><span><b>Links</b>A job description, brief or repository, if there is one.</span></li>
        </ul>
      </div>
      {contact.formEnabled ? (
        <div className="formcard rise" style={{ ["--i" as string]: 2 }}>
          <h2>Send a message</h2>
          <ContactForm />
        </div>
      ) : null}
    </div>
  );
}
