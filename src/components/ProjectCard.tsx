"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { CategoryChip, hueOf } from "./CategoryChip";
import { Icon } from "./Icon";

export function ProjectCard({ p, feat = false }: { p: Project; feat?: boolean }) {
  const initials = p.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <motion.div style={{ height: "100%" }} whileHover={{ y: -5 }} whileTap={{ scale: 0.99 }} transition={{ type: "spring", stiffness: 340, damping: 26 }}>
      <Link href={`/projects/${p.id}`} className={`pcard${feat ? " feat" : ""}`} style={{ ["--h" as string]: String(hueOf(p.category || p.name)) }}>
        <div className="pcard-cover">
          {p.cover ? <img src={`/media/${p.cover}`} alt={p.coverAlt} loading="lazy" width={1200} height={750} /> : <div className="pcard-ph" aria-hidden="true"><span>{initials}</span></div>}
          <CategoryChip name={p.category} floating />
          <span className="pcard-go" aria-hidden="true"><Icon name="arrow" size={17} /></span>
        </div>
        <div className="pcard-body">
          <h3>{p.name}</h3>
          {p.outcomeLine || p.summary ? <p>{p.outcomeLine || p.summary}</p> : null}
          {p.tech.length ? <div className="tags">{p.tech.slice(0, feat ? 6 : 4).map((t) => <span key={t}>{t}</span>)}</div> : null}
        </div>
      </Link>
    </motion.div>
  );
}
