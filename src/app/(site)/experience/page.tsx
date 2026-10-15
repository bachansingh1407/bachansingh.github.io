import { ExperienceView } from "@/components/ExperienceView";
import { pageTitle } from "@/lib/public";
import { buildMeta } from "@/lib/seo";
import { requirePage } from "@/lib/site";

export async function generateMetadata() {
  const pub = await requirePage("experience");
  return buildMeta(pub, { title: pageTitle(pub, "experience"), description: "Selected engineering work, described generally.", path: "/experience" });
}

export default async function ExperiencePage() {
  const pub = await requirePage("experience");
  return (
    <>
      <p className="eyebrow">{pageTitle(pub, "experience")}</p>
      <h1>Selected engineering work</h1>
      <p className="lead">Described generally, with the responsibility, what was built and how it was checked.</p>
      <ExperienceView roles={pub.work} />
    </>
  );
}
