import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { formatUpdated, getPublic, navFor, searchFor } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pub = await getPublic();
  const title = `${pub.profile.name} · Portfolio`;
  return {
    title: { default: title, template: `%s · ${pub.profile.name}` },
    description: pub.profile.positioning,
    openGraph: { title, description: pub.profile.positioning, type: "website" },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const pub = await getPublic();
  const hasContact = pub.pages.some((p) => p.id === "contact");
  return (
    <SiteShell
      nav={navFor(pub)}
      search={searchFor(pub)}
      name={pub.profile.name}
      role={pub.profile.role}
      updated={formatUpdated(pub.updated)}
      hasContact={hasContact}
    >
      {children}
    </SiteShell>
  );
}
