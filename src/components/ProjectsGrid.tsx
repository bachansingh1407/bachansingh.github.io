"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

/** Projects index with a category filter. Cards animate into their new places when filtered. */
export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const cats = useMemo(() => Array.from(new Set(projects.map((p) => p.category).filter(Boolean))), [projects]);
  const [cat, setCat] = useState("all");
  const shown = cat === "all" ? projects : projects.filter((p) => p.category === cat);
  const span = shown.length <= 2 || shown.length === 4 ? "s3" : "";
  return (
    <>
      {cats.length > 1 ? (
        <div className="pfilter">
          <div className="chips" role="group" aria-label="Filter by category">
            {["all", ...cats].map((c) => (
              <button key={c} className={`chipbtn${cat === c ? " on" : ""}`} aria-pressed={cat === c} onClick={() => setCat(c)}>{c === "all" ? `All (${projects.length})` : c}</button>
            ))}
          </div>
        </div>
      ) : <div style={{ height: "1.8rem" }} />}
      <div className="pgrid">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.div key={p.uid} layout className={`cell ${span}`} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }}>
              <ProjectCard p={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
