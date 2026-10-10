import type { Metadata } from "next";
import type { Content } from "./types";

export function buildMeta(pub: Content, o: { title?: string; description?: string; path: string; image?: string }): Metadata {
  const description = (o.description || pub.profile.positioning || pub.profile.intro).slice(0, 200);
  const image = o.image || pub.profile.photo;
  const images = image ? [{ url: `/media/${image}` }] : undefined;
  const full = o.title ? `${o.title} · ${pub.profile.name}` : `${pub.profile.name} · ${pub.profile.role || "Portfolio"}`;
  return {
    ...(o.title ? { title: o.title } : {}),
    description,
    alternates: { canonical: o.path },
    openGraph: { title: full, description, url: o.path, type: "website", siteName: pub.profile.name, images },
    twitter: { card: images ? "summary_large_image" : "summary", title: full, description, images: images?.map((i) => i.url) },
  };
}

export function personJsonLd(pub: Content): string {
  const sameAs = [pub.contact.github, pub.contact.linkedin].filter(Boolean);
  const data = {
    "@context": "https://schema.org", "@type": "Person",
    name: pub.profile.name, jobTitle: pub.profile.role || undefined, description: pub.profile.positioning || undefined,
    image: pub.profile.photo ? `/media/${pub.profile.photo}` : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
