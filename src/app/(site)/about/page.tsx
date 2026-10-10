import { ContactLinks, contactRows } from "@/components/ContactLinks";
import { RichText } from "@/components/RichText";
import { pageTitle } from "@/lib/public";
import { buildMeta } from "@/lib/seo";
import { requirePage } from "@/lib/site";

export async function generateMetadata() {
  const pub = await requirePage("about");
  return buildMeta(pub, { title: pageTitle(pub, "about"), description: pub.about.split("\n")[0], path: "/about" });
}

export default async function AboutPage() {
  const pub = await requirePage("about");
  const showLinks = pub.contact.showOnAbout && (contactRows(pub.contact).length > 0 || (pub.contact.formEnabled && pub.pages.some((p) => p.id === "contact")));
  return (
    <>
      <h1>{pageTitle(pub, "about")}</h1>
      <div className={showLinks ? "about-grid" : ""}>
        <div className="lead-block"><RichText text={pub.about} /></div>
        {showLinks ? <ContactLinks contact={pub.contact} title="Find me" messageLink={pub.contact.formEnabled && pub.pages.some((p) => p.id === "contact")} /> : null}
      </div>
    </>
  );
}
