import { DEFAULT_CONTENT, EMPTY_CASE, PAGE_IDS } from "./defaults";
import type {
  CaseStudy, Content, PageConfig, PageId, Project, StackGroup, WorkEntry,
} from "./types";

const str = (v: unknown, d = "") => (typeof v === "string" ? v : d);
const bool = (v: unknown, d = true) => (typeof v === "boolean" ? v : d);
const rec = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const strs = (v: unknown): string[] =>
  list(v).filter((x): x is string => typeof x === "string").map((s) => s.trim()).filter(Boolean);

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function uniqueSlug(base: string, used: Set<string>, fallback: string): string {
  const s = slugify(base) || fallback;
  let out = s;
  let i = 2;
  while (used.has(out)) out = `${s}-${i++}`;
  used.add(out);
  return out;
}

/** Only http(s) links or site-relative paths are kept, so javascript: URLs can never be stored. */
export function safeUrl(v: unknown): string {
  const s = str(v).trim();
  return /^https?:\/\/\S+$/i.test(s) || /^\/(?!\/)\S*$/.test(s) ? s : "";
}

function safeEmail(v: unknown): string {
  const s = str(v).trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : "";
}

function normalizeCase(v: unknown): CaseStudy {
  const r = rec(v);
  const out = { ...EMPTY_CASE };
  (Object.keys(out) as (keyof CaseStudy)[]).forEach((k) => (out[k] = str(r[k]).trim()));
  return out;
}

export function normalizeContent(input: unknown): Content {
  const d = DEFAULT_CONTENT;
  const r = rec(input);
  const p = rec(r.profile);

  // Pages: every built-in page exactly once; "start" can't be hidden.
  const seen = new Set<string>();
  const pages: PageConfig[] = [];
  for (const raw of list(r.pages)) {
    const x = rec(raw);
    const id = str(x.id) as PageId;
    if (!PAGE_IDS.includes(id) || seen.has(id)) continue;
    seen.add(id);
    const fallback = d.pages.find((q) => q.id === id)!;
    pages.push({
      id,
      title: str(x.title).trim() || fallback.title,
      visible: id === "start" ? true : bool(x.visible),
    });
  }
  for (const dp of d.pages) if (!seen.has(dp.id)) pages.push({ ...dp });

  const workIds = new Set<string>();
  const work: WorkEntry[] = Array.isArray(r.work)
    ? r.work.map((raw, i) => {
        const x = rec(raw);
        return {
          id: uniqueSlug(str(x.id) || str(x.title), workIds, `work-${i + 1}`),
          title: str(x.title).trim(),
          org: str(x.org).trim(),
          dates: str(x.dates).trim(),
          blurb: str(x.blurb).trim(),
          items: list(x.items)
            .map((it) => rec(it))
            .map((it) => ({ title: str(it.title).trim(), text: str(it.text).trim() }))
            .filter((it) => it.title || it.text),
          outcome: str(x.outcome).trim(),
          visible: bool(x.visible),
        };
      })
    : d.work;

  const projIds = new Set<string>();
  const projects: Project[] = Array.isArray(r.projects)
    ? r.projects.map((raw, i) => {
        const x = rec(raw);
        return {
          id: uniqueSlug(str(x.id) || str(x.name), projIds, `project-${i + 1}`),
          name: str(x.name).trim(),
          category: str(x.category).trim(),
          summary: str(x.summary).trim(),
          status: str(x.status).trim(),
          tech: strs(x.tech),
          scope: strs(x.scope),
          caseStudy: normalizeCase(x.caseStudy),
          demoUrl: safeUrl(x.demoUrl),
          repoUrl: safeUrl(x.repoUrl),
          sourceNote: str(x.sourceNote).trim(),
          visible: bool(x.visible),
        };
      })
    : d.projects;

  const groupIds = new Set<string>();
  const stack: StackGroup[] = Array.isArray(r.stack)
    ? r.stack.map((raw, i) => {
        const x = rec(raw);
        return {
          id: uniqueSlug(str(x.id) || str(x.name), groupIds, `group-${i + 1}`),
          name: str(x.name).trim(),
          visible: bool(x.visible),
          items: list(x.items)
            .map((it) => rec(it))
            .map((it) => ({
              name: str(it.name).trim(),
              description: str(it.description).trim(),
              visible: bool(it.visible),
            }))
            .filter((it) => it.name),
        };
      })
    : d.stack;

  const how = rec(r.how);
  const c = rec(r.contact);

  return {
    profile: {
      name: str(p.name, d.profile.name).trim() || d.profile.name,
      role: str(p.role, d.profile.role).trim(),
      positioning: str(p.positioning, d.profile.positioning).trim(),
      intro: str(p.intro, d.profile.intro).trim(),
    },
    pages,
    about: str(r.about, d.about).trim(),
    work,
    projects,
    how: {
      intro: str(how.intro, d.how.intro).trim(),
      steps: Array.isArray(how.steps)
        ? how.steps
            .map((s) => rec(s))
            .map((s) => ({ title: str(s.title).trim(), text: str(s.text).trim() }))
            .filter((s) => s.title)
        : d.how.steps,
    },
    stack,
    contact: {
      email: safeEmail(c.email),
      github: safeUrl(c.github),
      linkedin: safeUrl(c.linkedin),
      resumeUrl: safeUrl(c.resumeUrl),
    },
    updated: /^\d{4}-\d{2}-\d{2}/.test(str(r.updated)) ? str(r.updated).slice(0, 10) : d.updated,
  };
}
