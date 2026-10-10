import { DEFAULT_CONTENT, EMPTY_CASE, PAGE_IDS } from "./defaults";
import { L } from "./limits";
import { isMode, isPalette, PALETTES } from "./themes";
import { isSafeSvgPath } from "./icons";
import { newUid } from "./uid";
import type { CaseStudy, Content, Mode, PageConfig, PageId, Project, StackGroup, StackIcon, StepKind, WorkEntry } from "./types";

const str = (v: unknown, d = "") => (typeof v === "string" ? v : d);
const bool = (v: unknown, d = true) => (typeof v === "boolean" ? v : d);
const num = (v: unknown, d: number) => (typeof v === "number" && Number.isFinite(v) ? v : d);
const rec = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const strs = (v: unknown): string[] => list(v).filter((x): x is string => typeof x === "string");

/** Hard ceiling so a bad import can't bloat storage. Normal limits are enforced by validateContent. */
const HARD = 20000;
const cut = (s: string) => (s.length > HARD ? s.slice(0, HARD) : s);

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, L.slug);
}

function uniqueSlug(base: string, used: Set<string>, fallback: string): string {
  const s = slugify(base) || fallback;
  let out = s, i = 2;
  while (used.has(out)) out = `${s}-${i++}`;
  used.add(out);
  return out;
}

function uidOf(v: unknown, used: Set<string>): string {
  let u = str(v).trim().slice(0, 40);
  if (!/^[A-Za-z0-9_-]+$/.test(u) || used.has(u)) u = newUid();
  used.add(u);
  return u;
}

function normalizeCase(v: unknown): CaseStudy {
  const r = rec(v);
  const out = { ...EMPTY_CASE };
  (Object.keys(out) as (keyof CaseStudy)[]).forEach((k) => (out[k] = cut(str(r[k]))));
  return out;
}

function iconOf(v: unknown): StackIcon | null {
  const r = rec(v);
  const slug = str(r.slug).trim(), title = str(r.title).trim(), path = str(r.path).trim();
  return /^[a-z0-9]{1,60}$/.test(slug) && isSafeSvgPath(path) ? { slug, title: title.slice(0, 60), path } : null;
}
const KINDS: StepKind[] = ["start", "process", "end"];

const mediaId = (v: unknown) => (/^[a-f0-9]{24}$/.test(str(v)) ? str(v) : "");

/**
 * Cleans structure and types. Text is kept as typed (trimmed): bad links and over-long text are NOT
 * silently dropped here. validateContent reports them so the author can fix them.
 */
export function normalizeContent(input: unknown): Content {
  const d = DEFAULT_CONTENT;
  const r = rec(input);
  const p = rec(r.profile);
  const all = new Set<string>();

  const seen = new Set<string>();
  const pages: PageConfig[] = [];
  for (const raw of list(r.pages)) {
    const x = rec(raw);
    const id = str(x.id) as PageId;
    if (!PAGE_IDS.includes(id) || seen.has(id)) continue;
    seen.add(id);
    const fb = d.pages.find((q) => q.id === id)!;
    pages.push({ id, title: cut(str(x.title)).trim() || fb.title, visible: id === "start" ? true : bool(x.visible) });
  }
  for (const dp of d.pages) if (!seen.has(dp.id)) pages.push({ ...dp });

  const workIds = new Set<string>();
  const work: WorkEntry[] = Array.isArray(r.work)
    ? r.work.map((raw, i) => {
        const x = rec(raw);
        return {
          uid: uidOf(x.uid, all),
          id: uniqueSlug(str(x.id) || str(x.title), workIds, `work-${i + 1}`),
          title: cut(str(x.title)).trim(), org: cut(str(x.org)).trim(), dates: cut(str(x.dates)).trim(),
          blurb: cut(str(x.blurb)).trim(),
          tech: strs(x.tech).map((t) => cut(t).trim()),
          items: list(x.items).map((it) => rec(it)).map((it) => ({
            uid: uidOf(it.uid, all), title: cut(str(it.title)).trim(), text: cut(str(it.text)).trim(),
          })),
          outcome: cut(str(x.outcome)).trim(), visible: bool(x.visible),
        };
      })
    : d.work;

  const projIds = new Set<string>();
  const projects: Project[] = Array.isArray(r.projects)
    ? r.projects.map((raw, i) => {
        const x = rec(raw);
        return {
          uid: uidOf(x.uid, all),
          id: uniqueSlug(str(x.id) || str(x.name), projIds, `project-${i + 1}`),
          name: cut(str(x.name)).trim(), category: cut(str(x.category)).trim(), summary: cut(str(x.summary)).trim(),
          outcomeLine: cut(str(x.outcomeLine)).trim(), status: cut(str(x.status)).trim(),
          featured: bool(x.featured, false), cover: mediaId(x.cover), coverAlt: cut(str(x.coverAlt)).trim(),
          coverCapturedAt: /^\d{4}-\d{2}-\d{2}/.test(str(x.coverCapturedAt)) ? str(x.coverCapturedAt).slice(0, 10) : "",
          images: list(x.images).map((m) => rec(m)).filter((m) => mediaId(m.media)).map((m) => ({
            uid: uidOf(m.uid, all), media: mediaId(m.media), alt: cut(str(m.alt)).trim(),
          })),
          tech: strs(x.tech).map((s) => cut(s).trim()), scope: strs(x.scope).map((s) => cut(s).trim()),
          caseStudy: normalizeCase(x.caseStudy),
          demoUrl: cut(str(x.demoUrl)).trim(), repoUrl: cut(str(x.repoUrl)).trim(),
          sourceNote: cut(str(x.sourceNote)).trim(), visible: bool(x.visible),
        };
      })
    : d.projects;

  const groupIds = new Set<string>();
  const stack: StackGroup[] = Array.isArray(r.stack)
    ? r.stack.map((raw, i) => {
        const x = rec(raw);
        return {
          uid: uidOf(x.uid, all),
          id: uniqueSlug(str(x.id) || str(x.name), groupIds, `group-${i + 1}`),
          name: cut(str(x.name)).trim(), visible: bool(x.visible),
          items: list(x.items).map((it) => rec(it)).map((it) => ({
            uid: uidOf(it.uid, all), name: cut(str(it.name)).trim(),
            description: cut(str(it.description)).trim(), icon: iconOf(it.icon),
            why: cut(str(it.why)).trim(), how: cut(str(it.how)).trim(), alternatives: cut(str(it.alternatives)).trim(),
            visible: bool(it.visible),
          })),
        };
      })
    : d.stack;

  const testimonials = Array.isArray(r.testimonials)
    ? r.testimonials.map((raw) => {
        const x = rec(raw);
        return { uid: uidOf(x.uid, all), quote: cut(str(x.quote)).trim(), name: cut(str(x.name)).trim(), role: cut(str(x.role)).trim(), visible: bool(x.visible, false) };
      })
    : [];

  const how = rec(r.how);
  const c = rec(r.contact);
  const s = rec(r.site);
  const palettes = strs(s.palettes).filter(isPalette).filter((x, i, a) => a.indexOf(x) === i);
  const enabled = palettes.length ? palettes : PALETTES.map((x) => x.id);
  const defaultPalette = isPalette(s.defaultPalette) && enabled.includes(s.defaultPalette as string) ? (s.defaultPalette as string) : enabled[0];
  const defaultMode: Mode = isMode(s.defaultMode) ? s.defaultMode : "system";

  return {
    schema: 2,
    rev: Math.max(0, Math.floor(num(r.rev, 0))),
    updated: /^\d{4}-\d{2}-\d{2}/.test(str(r.updated)) ? str(r.updated).slice(0, 10) : d.updated,
    publishedAt: str(r.publishedAt).slice(0, 40),
    profile: {
      name: cut(str(p.name, d.profile.name)).trim() || d.profile.name,
      role: cut(str(p.role, d.profile.role)).trim(),
      positioning: cut(str(p.positioning, d.profile.positioning)).trim(),
      intro: cut(str(p.intro, d.profile.intro)).trim(),
      photo: mediaId(p.photo), photoAlt: cut(str(p.photoAlt)).trim(), location: cut(str(p.location)).trim(),
    },
    pages,
    about: cut(str(r.about, d.about)).trim(),
    work, projects, testimonials,
    how: {
      intro: cut(str(how.intro, d.how.intro)).trim(),
      steps: Array.isArray(how.steps)
        ? how.steps.map((x) => rec(x)).map((x) => ({
            uid: uidOf(x.uid, all), title: cut(str(x.title)).trim(), text: cut(str(x.text)).trim(),
            kind: (KINDS.includes(x.kind as StepKind) ? x.kind : "process") as StepKind,
            icon: /^[a-z]{2,20}$/.test(str(x.icon)) ? str(x.icon) : "",
            from: strs(x.from).slice(0, 8), chips: strs(x.chips).map((c) => cut(c).trim()),
          }))
        : d.how.steps,
    },
    stack,
    contact: {
      email: cut(str(c.email)).trim(), github: cut(str(c.github)).trim(), linkedin: cut(str(c.linkedin)).trim(),
      resumeUrl: cut(str(c.resumeUrl)).trim(),
      formEnabled: bool(c.formEnabled, true),
      retentionDays: Math.min(L.retentionMax, Math.max(0, Math.floor(num(c.retentionDays, 365)))),
      showOnAbout: bool(c.showOnAbout, true),
    },
    site: {
      palettes: enabled, defaultPalette, defaultMode,
      ai: {
        enabled: bool(rec(s.ai).enabled, false),
        questions: Array.isArray(rec(s.ai).questions) ? strs(rec(s.ai).questions).map((q) => cut(q).trim()) : d.site.ai.questions,
      },
    },
  };
}
