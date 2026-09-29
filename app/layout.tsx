import type { Metadata } from "next";
import { Bowlby_One, Figtree, Caveat } from "next/font/google";
import "./globals.css";
import { portfolio as P } from "@/data/portfolio";
const display = Bowlby_One({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = Figtree({ subsets: ["latin"], variable: "--font-body" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand" });
export const metadata: Metadata = { title: `${P.name} — ${P.role}`, description: P.tagline };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" className={`${display.variable} ${body.variable} ${hand.variable}`}><body>{children}</body></html>);
}
