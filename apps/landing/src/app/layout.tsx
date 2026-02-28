import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DoseCraft — Peptide Protocol Lab for Serious Biohackers",
  description:
    "Your private protocol war room. Three evidence lanes (Clinical, Expert, Experimental), AI protocol engine, creator marketplace, and precision dose tracking. Built for biohackers who demand transparency.",
  keywords: [
    "peptide protocols",
    "biohacking",
    "peptide tracking",
    "BPC-157",
    "TB-500",
    "peptide stacks",
    "protocol builder",
    "dose tracker",
    "biohacker app",
    "peptide research",
  ],
  openGraph: {
    title: "DoseCraft — Peptide Protocol Lab",
    description:
      "Three evidence lanes. AI protocol engine. Creator marketplace. The evolution of peptide biohacking.",
    type: "website",
    locale: "en_US",
    siteName: "DoseCraft",
  },
  twitter: {
    card: "summary_large_image",
    title: "DoseCraft — Peptide Protocol Lab",
    description:
      "Three evidence lanes. AI protocol engine. Creator marketplace. The evolution of peptide biohacking.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="bg-dc-bg text-dc-text font-[family-name:var(--font-inter)] min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
