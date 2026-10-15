import type { Change, Content } from "./types";

/**
 * Field-level change tracking. Every tracked text field and every list item gets a stable path made of
 * collection names and item uids, so a change can be shown, and a single old value can be put back.
 */
interface Entry { kind: "field" | "item"; label: string; section: string; value: string; item?: unknown; parent: string | null; arrayPath?: string }
type Flat = Map<string, Entry>;
const CAP = 6000;
const cap = (s: string) => (s.length > CAP ? s.slice(0, CAP) : s);

export function flatten(c: Content): Flat {
  const m: Flat = new Map();
  const field = (path: string, label: string, section: string, value: string, parent: string | null) => m.set(path, { kind: "field", label, section, value, parent });
  const item = (path: string, label: string, section: string, it: unknown, parent: string | null, arrayPath: string) => m.set(path, { kind: "item", label, section, value: "", item: it, parent, arrayPath });

  (["name", "role", "positioning", "intro", "location"] as const).forEach((k) => field(`profile/${k}`, `Profile › ${k}`, "profile", c.profile[k], null));
  field("about", "About text", "about", c.about, null);
  c.pages.forEach((p) => field(`pages/${p.id}/title`, `Page title › ${p.id}`, "pages", p.title, null));

  for (const w of c.work) {
    const b = `work/${w.uid}`, name = w.title || "Role";
    item(b, `Experience › ${name}`, "work", w, null, "work");
    (["title", "org", "dates", "blurb", "outcome"] as const).forEach((k) => field(`${b}/${k}`, `Experience › ${name} › ${k}`, "work", w[k], b));
    field(`${b}/tech`, `Experience › ${name} › technologies`, "work", w.tech.join("\n"), b);
    for (const it of w.items) {
      const ib = `${b}/items/${it.uid}`;
      item(ib, `Experience › ${name} › ${it.title || "item"}`, "work", it, b, `${b}/items`);
      field(`${ib}/title`, `Experience › ${name} › ${it.title || "item"} › title`, "work", it.title, ib);
      field(`${ib}/text`, `Experience › ${name} › ${it.title || "item"} › description`, "work", it.text, ib);
    }
  }
  for (const p of c.projects) {
    const b = `projects/${p.uid}`, name = p.name || "Project";
    item(b, `Project › ${name}`, "projects", p, null, "projects");
    (["name", "category", "summary", "outcomeLine", "status", "demoUrl", "repoUrl", "sourceNote"] as const).forEach((k) => field(`${b}/${k}`, `Project › ${name} › ${k}`, "projects", p[k], b));
    field(`${b}/tech`, `Project › ${name} › technologies`, "projects", p.tech.join("\n"), b);
    field(`${b}/scope`, `Project › ${name} › scope`, "projects", p.scope.join("\n"), b);
    (Object.keys(p.caseStudy) as (keyof Content["projects"][number]["caseStudy"])[]).forEach((k) => field(`${b}/caseStudy/${k}`, `Project › ${name} › case study › ${k}`, "projects", p.caseStudy[k], b));
  }
  for (const g of c.stack) {
    const b = `stack/${g.uid}`;
    item(b, `Stack › ${g.name || "Group"}`, "stack", g, null, "stack");
    field(`${b}/name`, `Stack › ${g.name || "Group"} › name`, "stack", g.name, b);
    for (const it of g.items) {
      const ib = `${b}/items/${it.uid}`;
      item(ib, `Stack › ${g.name} › ${it.name || "item"}`, "stack", it, b, `${b}/items`);
      (["name", "description", "why", "how", "alternatives"] as const).forEach((k) => field(`${ib}/${k}`, `Stack › ${g.name} › ${it.name || "item"} › ${k}`, "stack", it[k], ib));
    }
  }
  field("how/intro", "How I work › introduction", "how", c.how.intro, null);
  for (const s of c.how.steps) {
    const b = `how/steps/${s.uid}`;
    item(b, `How I work › ${s.title || "step"}`, "how", s, null, "how/steps");
    field(`${b}/title`, `How I work › ${s.title || "step"} › title`, "how", s.title, b);
    field(`${b}/text`, `How I work › ${s.title || "step"} › description`, "how", s.text, b);
    field(`${b}/chips`, `How I work › ${s.title || "step"} › chips`, "how", s.chips.join("\n"), b);
  }
  for (const t of c.testimonials) {
    const b = `testimonials/${t.uid}`;
    item(b, `Testimonial › ${t.name || "quote"}`, "testimonials", t, null, "testimonials");
    field(`${b}/quote`, `Testimonial › ${t.name || "quote"} › quote`, "testimonials", t.quote, b);
  }
  (["email", "github", "linkedin", "resumeUrl"] as const).forEach((k) => field(`contact/${k}`, `Contact › ${k}`, "contact", c.contact[k], null));
  return m;
}

/** Everything that differs between two versions of the content. */
export function diffContent(prev: Content, next: Content): Change[] {
  const a = flatten(prev), b = flatten(next), out: Change[] = [];
  const alive = (m: Flat, k: string | null) => k === null || m.has(k);
  for (const [path, e] of b) {
    const old = a.get(path);
    if (e.kind === "item") {
      if (!old && alive(a, e.parent)) out.push({ id: `+${path}`, kind: "added", section: e.section, label: e.label, path, before: "", after: "", parent: e.arrayPath });
    } else if (old && old.kind === "field" && old.value !== e.value) {
      out.push({ id: `~${path}`, kind: "changed", section: e.section, label: e.label, path, before: cap(old.value), after: cap(e.value) });
    }
  }
  for (const [path, e] of a) {
    if (e.kind === "item" && !b.has(path) && alive(b, e.parent)) {
      out.push({ id: `-${path}`, kind: "removed", section: e.section, label: e.label, path, before: "", after: "", item: e.item, parent: e.arrayPath });
    }
  }
  return out;
}

function arrayAt(c: Content, arrayPath: string): unknown[] | null {
  const seg = arrayPath.split("/");
  let cur: unknown = c;
  for (let i = 0; i < seg.length; i++) {
    const s = seg[i];
    if (Array.isArray(cur)) { cur = cur.find((x) => (x as { uid?: string }).uid === s); if (!cur) return null; continue; }
    cur = (cur as Record<string, unknown>)[s];
    if (cur === undefined) return null;
  }
  return Array.isArray(cur) ? cur : null;
}

function resolve(c: Content, path: string): { owner: Record<string, unknown>; key: string } | null {
  const seg = path.split("/");
  let cur: unknown = c;
  for (let i = 0; i < seg.length - 1; i++) {
    const s = seg[i];
    if (Array.isArray(cur)) {
      cur = cur.find((x) => (x as { uid?: string; id?: string }).uid === s || (x as { id?: string }).id === s);
    } else cur = (cur as Record<string, unknown>)?.[s];
    if (cur === undefined || cur === null) return null;
  }
  return typeof cur === "object" ? { owner: cur as Record<string, unknown>, key: seg[seg.length - 1] } : null;
}

const LISTS = new Set(["tech", "scope", "chips"]);

/** Puts an old value (or a removed item) back into a draft. Returns false when its home no longer exists. */
export function applyChange(draft: Content, ch: Change): boolean {
  if (ch.kind === "removed") {
    const arr = ch.parent ? arrayAt(draft, ch.parent) : null;
    const it = ch.item as { uid?: string } | undefined;
    if (!arr || !it || arr.some((x) => (x as { uid?: string }).uid === it.uid)) return false;
    arr.push(structuredClone(it));
    return true;
  }
  if (ch.kind === "added") return false;
  const r = resolve(draft, ch.path);
  if (!r || !(r.key in r.owner)) return false;
  r.owner[r.key] = LISTS.has(r.key) ? ch.before.split("\n") : ch.before;
  return true;
}

export interface Seg { t: "same" | "add" | "del"; s: string }
/** Word-level diff for showing old and new text. */
export function wordDiff(a: string, b: string): Seg[] {
  const x = a.split(/(\s+)/).filter(Boolean), y = b.split(/(\s+)/).filter(Boolean);
  if (x.length * y.length > 250_000) return [{ t: "del", s: a }, { t: "add", s: b }];
  const dp: number[][] = Array.from({ length: x.length + 1 }, () => new Array(y.length + 1).fill(0));
  for (let i = x.length - 1; i >= 0; i--) for (let j = y.length - 1; j >= 0; j--)
    dp[i][j] = x[i] === y[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: Seg[] = [];
  const push = (t: Seg["t"], s: string) => { const l = out[out.length - 1]; if (l && l.t === t) l.s += s; else out.push({ t, s }); };
  let i = 0, j = 0;
  while (i < x.length && j < y.length) {
    if (x[i] === y[j]) { push("same", x[i]); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) push("del", x[i++]);
    else push("add", y[j++]);
  }
  while (i < x.length) push("del", x[i++]);
  while (j < y.length) push("add", y[j++]);
  return out;
}
