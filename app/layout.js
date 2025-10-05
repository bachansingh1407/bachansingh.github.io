import { Geist, Geist_Mono,Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata = {
  title: "Portfolio - Bachan Singh",
  description: "Full Stack Developer (MERN)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  ${montserrat.variable}  antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
