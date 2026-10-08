import { notFound } from "next/navigation";
import { RichText } from "@/components/RichText";
import { CASE_LABELS } from "@/lib/defaults";
import { getPublic, requirePage } from "@/lib/content";
import { slugify } from "@/lib/normalize";
import type { CaseStudy } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const p = (await getPublic()).projects.find((x) => x.id === id);
  return p ? { title: p.name, description: p.summary || undefined } : { title: "Not found" };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const pub = await requirePage("projects"); // hiding Projects also hides project pages
  const p = pub.projects.find((x) => x.id === id);
  if (!p) notFound();

  const sections = (Object.keys(CASE_LABELS) as (keyof CaseStudy)[]).filter((k) => p.caseStudy[k]);
  const hasLinks = p.demoUrl || p.repoUrl || p.sourceNote;

  return (
    <>
      <h1>{p.name}</h1>
      <div className="meta">
        {p.category ? <span className="pill">{p.category}</span> : null}
        {p.status ? <span className="pill draft">{p.status}</span> : null}
        {p.tech.map((t) => <span className="pill" key={t}>{t}</span>)}
      </div>
      {p.summary ? <p className="lead">{p.summary}</p> : null}

      {p.scope.length ? (
        <>
          <h2 id="scope">Scope</h2>
          <ul>{p.scope.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </>
      ) : null}

      {sections.length ? (
        <>
          <h2 id="case-study">Case study</h2>
          {sections.map((k) => (
            <section key={k}>
              <h3 id={slugify(CASE_LABELS[k])}>{CASE_LABELS[k]}</h3>
              <RichText text={p.caseStudy[k]} />
            </section>
          ))}
        </>
      ) : null}

      {hasLinks ? (
        <>
          <h2 id="links">Links</h2>
          <ul>
            {p.demoUrl ? <li><a className="textlink" href={p.demoUrl} target="_blank" rel="noopener noreferrer">Live demo</a></li> : null}
            {p.repoUrl ? <li><a className="textlink" href={p.repoUrl} target="_blank" rel="noopener noreferrer">Repository</a></li> : null}
            {p.sourceNote ? <li className="muted">{p.sourceNote}</li> : null}
          </ul>
        </>
      ) : null}
    </>
  );
}
