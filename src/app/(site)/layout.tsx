import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { aiConfigured } from "@/lib/ai";
import { formatUpdated, navFor, searchFor } from "@/lib/public";
import { getPub, previewOnce } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pub = await getPub();
  const title = `${pub.profile.name} · ${pub.profile.role || "Portfolio"}`;
  return {
    title: { default: title, template: `%s · ${pub.profile.name}` },
    ...((await previewOnce()) ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const pub = await getPub();
  return (
    <SiteShell
      nav={navFor(pub)} search={searchFor(pub)} name={pub.profile.name} role={pub.profile.role}
      updated={formatUpdated(pub.publishedAt || pub.updated)} resumeHref={pub.contact.resumeUrl}
      palettes={pub.site.palettes} defaultPalette={pub.site.defaultPalette} defaultMode={pub.site.defaultMode}
      preview={await previewOnce()}
      ask={{ enabled: pub.site.ai.enabled && aiConfigured(), questions: pub.site.ai.questions }}
    >
      {children}
    </SiteShell>
  );
}
