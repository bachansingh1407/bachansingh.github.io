import { notFound } from "next/navigation";
import { DEFAULT_CONTENT } from "./defaults";
import { normalizeContent } from "./normalize";
import { readRaw } from "./store";
import type { Content, NavItem, PageId, SearchEntry } from "./types";

export const PAGE_PATH: Record<PageId, string> = {
  start: "/", about: "/about", experience: "/experience", projects: "/projects",
  how: "/how", stack: "/stack", contact: "/contact",
};

const GROUP: Record<PageId, string> = {
  start: "Portfolio", about: "Portfolio", experience: "Portfolio", projects: "Portfolio",
  how: "How I work", stack: "Reference", contact: "Reference",
};

/** Full content including hidden items. Admin only. Throws if storage fails. */
export async function getContentStrict(): Promise<Content> {
  const raw = await readRaw();
  return raw ? normalizeContent(raw) : normalizeContent(DEFAULT_CONTENT);
}

async function getContentSafe(): Promise<Content> {
  try {
    return await getContentStrict();
  } catch (e) {
    console.error("Content storage unavailable, using defaults", e);
    return normalizeContent(DEFAULT_CONTENT);
  }
}

/**
 * Public view: hidden items and pages with nothing to show are removed on the server,
 * so they are never sent to a visitor's browser. Hiding Projects also hides project pages.
 */
export async function getPublic(): Promise<Content> {
  const c = await getContentSafe();
  const visible = (id: PageId) => c.pages.find((p) => p.id === id)?.visible ?? false;

  const work = visible("experience") ? c.work.filter((w) => w.visible && w.title) : [];
  const projects = visible("projects") ? c.projects.filter((p) => p.visible && p.name) : [];
  const stack = visible("stack")
    ? c.stack
        .filter((g) => g.visible && g.name)
        .map((g) => ({ ...g, items: g.items.filter((i) => i.visible) }))
        .filter((g) => g.items.length > 0)
    : [];

  const live: Record<PageId, boolean> = {
    start: true,
    about: visible("about") && c.about.length > 0,
    experience: work.length > 0,
    projects: projects.length > 0,
    how: visible("how") && c.how.steps.length > 0,
    stack: stack.length > 0,
    contact: visible("contact"),
  };

  return { ...c, work, projects, stack, pages: c.pages.filter((p) => live[p.id]) };
}

export async function requirePage(id: PageId): Promise<Content> {
  const pub = await getPublic();
  if (!pub.pages.some((p) => p.id === id)) notFound();
  return pub;
}

export function pageTitle(pub: Content, id: PageId): string {
  return pub.pages.find((p) => p.id === id)?.title ?? "Page";
}

export function navFor(pub: Content): NavItem[] {
  return pub.pages.map((p) => ({
    id: p.id,
    href: PAGE_PATH[p.id],
    title: p.title,
    group: GROUP[p.id],
    children:
      p.id === "experience"
        ? pub.work.map((w) => ({ title: w.title, href: `/experience#${w.id}` }))
        : p.id === "projects"
          ? pub.projects.map((x) => ({ title: x.name, href: `/projects/${x.id}` }))
          : undefined,
  }));
}

export function searchFor(pub: Content): SearchEntry[] {
  return [
    ...pub.pages.map((p) => ({ title: p.title, kind: "Page", href: PAGE_PATH[p.id] })),
    ...pub.projects.map((p) => ({
      title: p.name, kind: `Project · ${p.category}`.replace(/ · $/, ""), href: `/projects/${p.id}`, text: p.summary,
    })),
    ...pub.work.flatMap((w) =>
      w.items.map((i) => ({ title: i.title, kind: "Experience", href: `/experience#${w.id}`, text: i.text })),
    ),
    ...pub.stack.flatMap((g) =>
      g.items.map((i) => ({ title: i.name, kind: `Stack · ${g.name}`, href: "/stack", text: i.description })),
    ),
  ];
}

export function formatUpdated(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}
