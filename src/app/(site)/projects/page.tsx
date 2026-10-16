import { ProjectsGrid } from "@/components/ProjectsGrid";
import { pageTitle } from "@/lib/public";
import { buildMeta } from "@/lib/seo";
import { requirePage } from "@/lib/site";

export async function generateMetadata() {
  const pub = await requirePage("projects");
  return buildMeta(pub, { title: pageTitle(pub, "projects"), description: "Projects explained in depth: problem, approach, decisions and validation.", path: "/projects" });
}

export default async function ProjectsPage() {
  const pub = await requirePage("projects");
  return (
    <>
      <div className="pagehead">
        <p className="sec-eyebrow">{pageTitle(pub, "projects")}</p>
        <h1>Work, explained in depth</h1>
        <p>Each project is written as context, decisions and validation, not just a screenshot.</p>
      </div>
      <section className="lsec" style={{ paddingTop: 0 }}><ProjectsGrid projects={pub.projects} /></section>
    </>
  );
}
