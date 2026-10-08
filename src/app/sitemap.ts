import type { MetadataRoute } from "next";
import { PAGE_PATH, getPublic } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const pub = await getPublic();
  const lastModified = new Date(pub.updated);
  return [
    ...pub.pages.map((p) => ({ url: base + PAGE_PATH[p.id], lastModified })),
    ...pub.projects.map((p) => ({ url: `${base}/projects/${p.id}`, lastModified })),
  ];
}
