import { ProjectCard } from "@/components/ProjectCard";
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
      <h1>{pageTitle(pub, "projects")}</h1>
      <p className="lead">A few projects, explained in depth rather than a long list.</p>
      <div className="pgrid pgrid-2">{pub.projects.map((p) => <ProjectCard key={p.uid} p={p} />)}</div>
    </>
  );
}
