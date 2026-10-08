import type { CaseStudy, Content } from "./types";

export interface Warning { level: "warn" | "info"; text: string }

const PLACEHOLDER = /\b(lorem|todo|tbd|placeholder|coming soon|to be added|to confirm|xxx)\b/i;

/** Publish-readiness check: warns, never blocks. */
export function readiness(c: Content): Warning[] {
  const w: Warning[] = [];
  const hasContact = Object.values(c.contact).some(Boolean);
  if (!hasContact) w.push({ level: "warn", text: "No contact details yet. A reader who is interested has no next step." });
  if (!c.contact.resumeUrl) w.push({ level: "info", text: "No resume link. Add one in Contact." });
  if (!c.about) w.push({ level: "warn", text: "About is empty, so the About page stays hidden." });

  for (const e of c.work.filter((x) => x.visible)) {
    const label = `Experience "${e.title || e.id}"`;
    if (!e.org) w.push({ level: "info", text: `${label}: no company name (fine if generalized on purpose).` });
    if (!e.dates) w.push({ level: "info", text: `${label}: no dates.` });
    if (e.items.length === 0 && !e.outcome) w.push({ level: "warn", text: `${label}: no work items or outcome written.` });
    if (e.title !== "" && !e.outcome) w.push({ level: "info", text: `${label}: no outcome or decision you owned.` });
  }

  const visibleProjects = c.projects.filter((p) => p.visible);
  if (visibleProjects.length > 5) w.push({ level: "info", text: "More than five public projects. Depth usually beats breadth." });
  for (const p of visibleProjects) {
    const label = `Project "${p.name || p.id}"`;
    const filled = (Object.keys(p.caseStudy) as (keyof CaseStudy)[]).filter((k) => p.caseStudy[k]).length;
    if (filled === 0) w.push({ level: "warn", text: `${label}: no case-study text. Add context, contribution and decisions, or hide it.` });
    else if (!p.caseStudy.decisions) w.push({ level: "warn", text: `${label}: no Decisions section.` });
    if (!p.demoUrl && !p.repoUrl && !p.sourceNote) w.push({ level: "info", text: `${label}: no demo, repository or reason the source is unavailable.` });
    const blob = [p.summary, p.status, ...p.scope, ...Object.values(p.caseStudy)].join(" ");
    if (PLACEHOLDER.test(blob)) w.push({ level: "warn", text: `${label}: contains placeholder wording (for example "to confirm").` });
  }
  return w;
}
