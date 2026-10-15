import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Mulish } from "next/font/google";
import { cookies } from "next/headers";
import { DEFAULT_CONTENT } from "@/lib/defaults";
import { publishedOnce } from "@/lib/site";
import { isMode, themeCss } from "@/lib/themes";
import type { Mode } from "@/lib/types";
import "./globals.css";

const sans = Mulish({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const dynamic = "force-dynamic";
export const metadata: Metadata = { metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000") };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

const CSS = themeCss();
const JS_FLAG = `document.documentElement.classList.add("js")`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The theme is applied on the server from the visitor's cookie, so the page never flashes the wrong colours.
  let site = DEFAULT_CONTENT.site;
  try { site = (await publishedOnce()).site; } catch { /* storage down: use built-in theme defaults only */ }
  const [p, m] = ((await cookies()).get("pf_theme")?.value ?? "").split(".");
  const palette = site.palettes.includes(p) ? p : site.defaultPalette;
  const mode: Mode = isMode(m) ? m : site.defaultMode;

  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} data-palette={palette} data-mode={mode} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
