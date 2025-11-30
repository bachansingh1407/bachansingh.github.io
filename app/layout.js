import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import ClientProvider from "./ClientLayout";
import ScrollToTop from "./components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Portfolio - Bachan Singh",
  description: "Frontend Developer at almuqeet systems",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  ${poppins.variable} antialiased`}
      >
         {/* Wrap your entire frontend with Redux */}
        <ClientProvider>
            {children}
            
        <ScrollToTop />
        </ClientProvider>
      </body>
    </html>
  );
}
