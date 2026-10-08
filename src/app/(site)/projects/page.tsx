import Link from "next/link";
import { pageTitle, requirePage } from "@/lib/content";

export async function generateMetadata() {
  return { title: pageTitle(await requirePage("projects"), "projects") };
}

export default async function ProjectsPage() {
  const pub = await requirePage("projects");
  return (
    <>
      <h1>{pageTitle(pub, "projects")}</h1>
      <p className="lead">A few projects, explained in depth rather than a long list.</p>
      <div className="rows">
        {pub.projects.map((p) => (
          <Link key={p.id} href={`/projects/${p.id}`} className="row-link">
            <b>{p.name}</b>
            {p.summary ? <span className="d">{p.summary}</span> : null}
            {p.category ? <span className="tag">{p.category}</span> : null}
          </Link>
        ))}
      </div>
    </>
  );
}
