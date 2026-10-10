import { notFound } from "next/navigation";
import { CategoryChip } from "@/components/CategoryChip";
import { RichText } from "@/components/RichText";
import { CASE_LABELS } from "@/lib/defaults";
import { slugify } from "@/lib/normalize";
import { buildMeta } from "@/lib/seo";
import { getPub, requirePage } from "@/lib/site";
import type { CaseStudy } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const pub = await getPub();
  const p = pub.projects.find((x) => x.id === id);
  if (!p) return { title: "Not found" };
  return buildMeta(pub, { title: p.name, description: p.outcomeLine || p.summary, path: `/projects/${p.id}`, image: p.cover });
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
        <CategoryChip name={p.category} />
        {p.status ? <span className="pill draft">{p.status}</span> : null}
        {p.tech.map((t) => <span className="pill" key={t}>{t}</span>)}
      </div>
      {p.summary ? <p className="lead">{p.summary}</p> : null}
      {p.cover && p.coverCapturedAt ? (
        <figure className="browser">
          <div className="browser-bar" aria-hidden="true"><i /><i /><i /><span>{p.demoUrl ? p.demoUrl.replace(/^https?:\/\//, "") : p.name}</span></div>
          <img src={`/media/${p.cover}`} alt={p.coverAlt} width={1200} height={750} fetchPriority="high" />
          <figcaption>Live preview captured {p.coverCapturedAt}.{p.demoUrl ? <> <a className="textlink" href={p.demoUrl} target="_blank" rel="noopener noreferrer">Visit the live site</a></> : null}</figcaption>
        </figure>
      ) : p.cover ? <img className="cover" src={`/media/${p.cover}`} alt={p.coverAlt} width={1200} height={750} fetchPriority="high" /> : null}

      {p.scope.length ? (<><h2 id="scope">Scope</h2><ul>{p.scope.map((s, i) => <li key={i}>{s}</li>)}</ul></>) : null}

      {sections.length ? (
        <>
          <h2 id="case-study">Case study</h2>
          {sections.map((k) => (
            <section key={k}><h3 id={slugify(CASE_LABELS[k])}>{CASE_LABELS[k]}</h3><RichText text={p.caseStudy[k]} /></section>
          ))}
        </>
      ) : null}

      {p.images.length ? (
        <>
          <h2 id="screenshots">Screenshots</h2>
          <div className="gallery">
            {p.images.map((m) => <figure key={m.uid}><img src={`/media/${m.media}`} alt={m.alt} loading="lazy" width={1200} height={750} /></figure>)}
          </div>
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
