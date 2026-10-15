import { safeHref } from "./validate";
import type { Content, NavItem, PageId, SearchEntry } from "./types";

export const PAGE_PATH: Record<PageId, string> = {
  start: "/", about: "/about", experience: "/experience", projects: "/projects",
  how: "/how", stack: "/stack", contact: "/contact",
};
const GROUP: Record<PageId, string> = {
  start: "Portfolio", about: "Portfolio", experience: "Portfolio", projects: "Portfolio",
  how: "How I work", stack: "Reference", contact: "Reference",
};

/**
 * What visitors may see. Hidden items and empty pages are removed here, on the server, so they are
 * never sent to a browser. Hiding Projects also hides project pages. With `preview`, hidden items
 * are shown so the owner can review a draft before publishing.
 */
export function toPublic(c: Content, opts: { preview?: boolean } = {}): Content {
  const show = (v: boolean) => opts.preview || v;
  const pageVisible = (id: PageId) => show(c.pages.find((p) => p.id === id)?.visible ?? false);

  const work = pageVisible("experience") ? c.work.filter((w) => show(w.visible) && w.title) : [];
  const projects = (pageVisible("projects") ? c.projects.filter((p) => show(p.visible) && p.name) : [])
    .map((p) => ({ ...p, demoUrl: safeHref(p.demoUrl), repoUrl: safeHref(p.repoUrl) }));
  const stack = pageVisible("stack")
    ? c.stack.filter((g) => show(g.visible) && g.name)
        .map((g) => ({ ...g, items: g.items.filter((i) => show(i.visible) && i.name) }))
        .filter((g) => g.items.length > 0)
    : [];
  const testimonials = c.testimonials.filter((t) => show(t.visible) && t.quote && t.name);

  const live: Record<PageId, boolean> = {
    start: true,
    about: pageVisible("about") && c.about.length > 0,
    experience: work.length > 0,
    projects: projects.length > 0,
    how: pageVisible("how") && c.how.steps.length > 0,
    stack: stack.length > 0,
    contact: pageVisible("contact"),
  };

  const contact = {
    ...c.contact,
    github: safeHref(c.contact.github), linkedin: safeHref(c.contact.linkedin),
    resumeUrl: safeHref(c.contact.resumeUrl, true),
  };

  return { ...c, work, projects, stack, testimonials, contact, pages: c.pages.filter((p) => live[p.id]) };
}

export function pageTitle(pub: Content, id: PageId): string {
  return pub.pages.find((p) => p.id === id)?.title ?? "Page";
}

export function navFor(pub: Content): NavItem[] {
  return pub.pages.map((p) => ({
    id: p.id, href: PAGE_PATH[p.id], title: p.title, group: GROUP[p.id],
    children:
      p.id === "experience" ? pub.work.map((w) => ({ title: w.title, href: `/experience#${w.id}` }))
      : p.id === "projects" ? pub.projects.map((x) => ({ title: x.name, href: `/projects/${x.id}` }))
      : undefined,
  }));
}

export function searchFor(pub: Content): SearchEntry[] {
  return [
    ...pub.pages.map((p) => ({ title: p.title, kind: "Page", href: PAGE_PATH[p.id] })),
    ...pub.projects.map((p) => ({ title: p.name, kind: p.category ? `Project · ${p.category}` : "Project", href: `/projects/${p.id}`, text: p.summary })),
    ...pub.work.flatMap((w) => w.items.map((i) => ({ title: i.title, kind: "Experience", href: `/experience#${w.id}`, text: i.text }))),
    ...pub.stack.flatMap((g) => g.items.map((i) => ({ title: i.name, kind: `Stack · ${g.name}`, href: "/stack", text: i.description }))),
  ];
}

export function formatUpdated(iso: string): string {
  const d = new Date((iso || "").slice(0, 10) + "T00:00:00Z");
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

/** True when two contents differ in anything a visitor could see or an editor changed. */
export function sameContent(a: Content, b: Content): boolean {
  const strip = (c: Content) => JSON.stringify({ ...c, rev: 0, updated: "", publishedAt: "" });
  return strip(a) === strip(b);
}

export function counts(c: Content): string {
  return `${c.projects.length} projects · ${c.work.length} roles · ${c.stack.reduce((n, g) => n + g.items.length, 0)} technologies`;
}
