import { L } from "./limits";
import { PALETTES } from "./themes";
import type { CaseStudy, Content, Issue } from "./types";
import { CASE_LABELS } from "./defaults";

export function isValidEmail(s: string): boolean {
  if (s.length === 0 || s.length > L.email || /\s/.test(s)) return false;
  const at = s.lastIndexOf("@");
  if (at < 1 || s.indexOf("@") !== at) return false;
  const local = s.slice(0, at), domain = s.slice(at + 1);
  if (local.length > 64 || !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  const labels = domain.split(".");
  if (labels.length < 2) return false;
  if (!labels.every((l) => /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(l))) return false;
  return /^[A-Za-z]{2,}$/.test(labels[labels.length - 1]);
}

/** Returns an error message (and an optional one-click fix) for a link, or null when it is fine. */
export function checkUrl(raw: string, allowPath = false): { message: string; fix?: string } | null {
  const s = raw.trim();
  if (!s) return null;
  if (s.length > L.url) return { message: `Link is too long (max ${L.url} characters).` };
  if (/\s/.test(s)) return { message: "Links can't contain spaces." };
  if (allowPath && /^\/(?!\/)\S*$/.test(s)) return null;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) {
    if (/^[^/\s]+\.[A-Za-z]{2,}(\/|$)/.test(s)) return { message: "Add https:// at the start.", fix: "https://" + s };
    return { message: allowPath ? "Use a full https:// link or a path like /resume.pdf." : "Use a full https:// link." };
  }
  try {
    const u = new URL(s);
    if (u.protocol !== "https:" && u.protocol !== "http:") return { message: "Only http and https links are allowed." };
    if (!u.hostname.includes(".") && u.hostname !== "localhost") return { message: "That doesn't look like a real address." };
  } catch {
    return { message: "That link isn't valid." };
  }
  return null;
}

/** Link that is safe to render publicly (re-checked at read time as a second line of defence). */
export function safeHref(raw: string, allowPath = false): string {
  return raw && !checkUrl(raw, allowPath) ? raw.trim() : "";
}

const MEDIA = /^[a-f0-9]{24}$/;

/** Full content check. Errors block publishing; warnings are advice. Paths use item uids so they survive reordering. */
export function validateContent(c: Content): Issue[] {
  const out: Issue[] = [];
  const err = (path: string, message: string, fix?: string) => out.push({ path, message, level: "error", fix });
  const max = (path: string, v: string, n: number, label: string) => {
    if (v.length > n) err(path, `${label} is ${v.length - n} characters too long (max ${n}).`);
  };
  const req = (path: string, v: string, label: string) => { if (!v.trim()) err(path, `${label} is required.`); };
  const count = (path: string, n: number, cap: number, label: string) => {
    if (n > cap) err(path, `Too many ${label} (max ${cap}).`);
  };
  const url = (path: string, v: string, allowPath = false) => {
    const e = checkUrl(v, allowPath);
    if (e) err(path, e.message, e.fix);
  };

  const p = c.profile;
  req("profile.name", p.name, "Name"); max("profile.name", p.name, L.name, "Name");
  max("profile.role", p.role, L.role, "Role");
  max("profile.positioning", p.positioning, L.positioning, "Positioning");
  max("profile.intro", p.intro, L.intro, "Introduction");
  max("profile.location", p.location, L.location, "Location");
  max("profile.photoAlt", p.photoAlt, L.alt, "Alt text");
  if (p.photo && !p.photoAlt.trim()) err("profile.photoAlt", "Describe the photo for screen readers.");

  c.pages.forEach((pg) => { req(`pages.${pg.id}.title`, pg.title, "Title"); max(`pages.${pg.id}.title`, pg.title, L.pageTitle, "Title"); });
  max("about", c.about, L.about, "About text");

  count("work", c.work.length, L.work, "experience entries");
  c.work.forEach((w) => {
    const b = `work.${w.uid}`;
    req(`${b}.title`, w.title, "Role title"); max(`${b}.title`, w.title, L.workTitle, "Title");
    max(`${b}.org`, w.org, L.org, "Company"); max(`${b}.dates`, w.dates, L.dates, "Dates");
    max(`${b}.blurb`, w.blurb, L.blurb, "Summary"); max(`${b}.outcome`, w.outcome, L.outcome, "Outcome");
    count(`${b}.tech`, w.tech.length, L.workTech, "technologies");
    w.tech.forEach((t, i) => max(`${b}.tech`, t, L.chip, `Technology ${i + 1}`));
    count(`${b}.items`, w.items.length, L.workItems, "work items");
    w.items.forEach((it) => {
      max(`${b}.items.${it.uid}.title`, it.title, L.itemTitle, "Title");
      max(`${b}.items.${it.uid}.text`, it.text, L.itemText, "Description");
      if (!it.title.trim() && !it.text.trim()) err(`${b}.items.${it.uid}.title`, "Empty item. Fill it in or delete it.");
    });
  });

  count("projects", c.projects.length, L.projects, "projects");
  const slugs = new Map<string, number>();
  c.projects.forEach((x) => slugs.set(x.id, (slugs.get(x.id) ?? 0) + 1));
  c.projects.forEach((x) => {
    const b = `projects.${x.uid}`;
    req(`${b}.name`, x.name, "Name"); max(`${b}.name`, x.name, L.projectName, "Name");
    req(`${b}.id`, x.id, "URL slug"); max(`${b}.id`, x.id, L.slug, "Slug");
    if (x.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x.id)) err(`${b}.id`, "Use lowercase letters, numbers and hyphens only.", x.id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
    if ((slugs.get(x.id) ?? 0) > 1) err(`${b}.id`, "Another project already uses this slug.");
    max(`${b}.category`, x.category, L.category, "Category"); max(`${b}.summary`, x.summary, L.summary, "Summary");
    max(`${b}.outcomeLine`, x.outcomeLine, L.outcomeLine, "Outcome line"); max(`${b}.status`, x.status, L.status, "Status");
    count(`${b}.tech`, x.tech.length, L.tech, "technologies"); count(`${b}.scope`, x.scope.length, L.scope, "scope items");
    x.tech.forEach((t, i) => max(`${b}.tech`, t, L.techItem, `Technology ${i + 1}`));
    x.scope.forEach((t, i) => max(`${b}.scope`, t, L.scopeItem, `Scope item ${i + 1}`));
    (Object.keys(CASE_LABELS) as (keyof CaseStudy)[]).forEach((k) => max(`${b}.caseStudy.${k}`, x.caseStudy[k], L.caseSection, CASE_LABELS[k]));
    url(`${b}.demoUrl`, x.demoUrl); url(`${b}.repoUrl`, x.repoUrl); max(`${b}.sourceNote`, x.sourceNote, L.sourceNote, "Note");
    max(`${b}.coverAlt`, x.coverAlt, L.alt, "Alt text");
    if (x.cover && !x.coverAlt.trim()) err(`${b}.coverAlt`, "Describe the cover image for screen readers.");
    count(`${b}.images`, x.images.length, L.images, "images");
    x.images.forEach((m) => {
      if (!MEDIA.test(m.media)) err(`${b}.images.${m.uid}.media`, "Invalid image.");
      max(`${b}.images.${m.uid}.alt`, m.alt, L.alt, "Alt text");
      if (!m.alt.trim()) err(`${b}.images.${m.uid}.alt`, "Describe this image for screen readers.");
    });
  });

  count("stack", c.stack.length, L.stackGroups, "stack groups");
  c.stack.forEach((g) => {
    const b = `stack.${g.uid}`;
    req(`${b}.name`, g.name, "Group name"); max(`${b}.name`, g.name, L.groupName, "Group name");
    count(`${b}.items`, g.items.length, L.stackItems, "technologies");
    g.items.forEach((it) => {
      req(`${b}.items.${it.uid}.name`, it.name, "Technology"); max(`${b}.items.${it.uid}.name`, it.name, L.stackName, "Name");
      max(`${b}.items.${it.uid}.description`, it.description, L.stackDesc, "Description");
      max(`${b}.items.${it.uid}.why`, it.why, L.why, "Why I use it");
      max(`${b}.items.${it.uid}.how`, it.how, L.how, "How I use it");
      max(`${b}.items.${it.uid}.alternatives`, it.alternatives, L.alternatives, "Alternatives");
    });
  });

  count("how.steps", c.how.steps.length, L.steps, "steps"); max("how.intro", c.how.intro, L.howIntro, "Introduction");
  c.how.steps.forEach((s) => {
    req(`how.steps.${s.uid}.title`, s.title, "Step title"); max(`how.steps.${s.uid}.title`, s.title, L.stepTitle, "Title");
    max(`how.steps.${s.uid}.text`, s.text, L.stepText, "Description");
    count(`how.steps.${s.uid}.chips`, s.chips.length, L.chips, "chips");
    s.chips.forEach((t) => max(`how.steps.${s.uid}.chips`, t, L.chip, "Chip"));
    const ids = new Set(c.how.steps.map((x) => x.uid));
    if (s.from.includes(s.uid)) err(`how.steps.${s.uid}.from`, "A step can't take input from itself.");
    if (s.from.some((f) => !ids.has(f))) err(`how.steps.${s.uid}.from`, "This step points to a step that no longer exists.");
  });

  count("testimonials", c.testimonials.length, L.testimonials, "testimonials");
  c.testimonials.forEach((t) => {
    const b = `testimonials.${t.uid}`;
    req(`${b}.quote`, t.quote, "Quote"); max(`${b}.quote`, t.quote, L.quote, "Quote");
    req(`${b}.name`, t.name, "Name"); max(`${b}.name`, t.name, L.personName, "Name"); max(`${b}.role`, t.role, L.personName, "Role");
  });

  const k = c.contact;
  if (k.email && !isValidEmail(k.email)) err("contact.email", "That doesn't look like a valid email address.");
  url("contact.github", k.github); url("contact.linkedin", k.linkedin); url("contact.resumeUrl", k.resumeUrl, true);
  if (k.retentionDays < 0 || k.retentionDays > L.retentionMax) err("contact.retentionDays", `Use 0 (keep forever) to ${L.retentionMax} days.`);

  count("site.ai.questions", c.site.ai.questions.length, L.questions, "suggested questions");
  c.site.ai.questions.forEach((q) => max("site.ai.questions", q, L.question, "Question"));
  if (!c.site.palettes.length) err("site.palettes", "Enable at least one colour theme.");
  if (!c.site.palettes.includes(c.site.defaultPalette)) err("site.defaultPalette", "The default theme must be enabled.");
  c.site.palettes.forEach((id) => { if (!PALETTES.some((p) => p.id === id)) err("site.palettes", `Unknown theme "${id}".`); });
  return out;
}

export const errorsOnly = (issues: Issue[]) => issues.filter((i) => i.level === "error");
