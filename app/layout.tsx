import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-orbitron"
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani"
});

export const metadata: Metadata = {
  title: "F1 Pulse",
  description: "The ultimate motorsport experience with live data and interactive F1 tools."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} ${rajdhani.variable}`}>
        <div aria-hidden className="pointer-events-none fixed inset-0 grid-overlay opacity-25" />
        <Nav />
        <main className="app-container">{children}</main>
      </body>
    </html>
  );
}
