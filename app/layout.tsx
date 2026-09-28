import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bachan Singh — Frontend Engineer",
  description: "A playful portfolio of products, systems and experiments.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}