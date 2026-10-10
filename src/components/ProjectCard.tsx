import Link from "next/link";
import type { Project } from "@/lib/types";
import { CategoryChip } from "./CategoryChip";

export function ProjectCard({ p, big = false }: { p: Project; big?: boolean }) {
  const initials = p.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <Link href={`/projects/${p.id}`} className={`pcard${big ? " big" : ""}`}>
      <div className="pcard-cover">
        {p.cover ? <img src={`/media/${p.cover}`} alt={p.coverAlt} loading="lazy" width={1200} height={750} /> : <div className="pcard-ph" aria-hidden="true">{initials}</div>}
        <CategoryChip name={p.category} floating />
      </div>
      <div className="pcard-body">
        <h3>{p.name}</h3>
        {p.outcomeLine || p.summary ? <p>{p.outcomeLine || p.summary}</p> : null}
        {p.tech.length ? <div className="tags">{p.tech.slice(0, big ? 6 : 4).map((t) => <span key={t}>{t}</span>)}</div> : null}
      </div>
    </Link>
  );
}
