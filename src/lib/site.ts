import { cache } from "react";
import { notFound } from "next/navigation";
import { isPreview } from "./auth";
import { getPreviewContent, getPublished } from "./content";
import { toPublic } from "./public";
import type { Content, PageId } from "./types";

/** One read per request, shared by the root layout, the site layout and the page. */
export const publishedOnce = cache(getPublished);
export const previewOnce = cache(isPreview);

export const getPub = cache(async (): Promise<Content> => {
  if (await previewOnce()) return getPreviewContent();
  return toPublic(await publishedOnce());
});

export async function requirePage(id: PageId): Promise<Content> {
  const pub = await getPub();
  if (!pub.pages.some((p) => p.id === id)) notFound();
  return pub;
}
