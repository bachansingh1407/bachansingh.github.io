import { RichText } from "@/components/RichText";
import { pageTitle, requirePage } from "@/lib/content";

export async function generateMetadata() {
  return { title: pageTitle(await requirePage("about"), "about") };
}

export default async function AboutPage() {
  const pub = await requirePage("about");
  return (
    <>
      <h1>{pageTitle(pub, "about")}</h1>
      <div className="lead-block"><RichText text={pub.about} /></div>
    </>
  );
}
