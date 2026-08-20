import type { Metadata, Viewport } from "next";
import { Archivo, Space_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import ThemeProvider from "@/components/ThemeProvider";
import AiAssistant from "@/components/AiAssistant";
import FloatingNav from "@/components/FloatingNav";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    site.name,
    site.role,
    "software engineer portfolio",
    "backend developer",
    "web developer",
  ],
  authors: [{ name: site.name, url: site.siteUrl }],
  creator: site.name,
  openGraph: {
    type: "website",
    url: site.siteUrl,
    title: site.title,
    description: site.description,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    creator: site.socials.twitter
      ? `@${site.socials.twitter.split("/").pop()}`
      : undefined,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    url: site.siteUrl,
    email: site.contact.email,
    worksFor: {
      "@type": "Organization",
      name: site.company,
    },
    sameAs: Object.values(site.socials).filter(Boolean),
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${spaceMono.variable} ${montserrat.variable}`}
    >
      <body className="font-display antialiased bg-bg text-ink dark:bg-bg-dark dark:text-ink-dark">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <FloatingNav />
          <AiAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}