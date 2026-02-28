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
    "Track every pin, dose, and result. Three evidence lanes. AI-powered protocol engineering. Built for lifters, hybrid athletes, and biohackers who demand precision.",
  keywords: [
    "peptide protocols",
    "biohacking",
    "peptide tracking",
    "BPC-157",
    "peptide stacks",
    "protocol builder",
    "dose tracker",
  ],
  openGraph: {
    title: "DoseCraft — Peptide Protocol Lab",
    description:
      "Run peptide stacks like the pros. Three evidence lanes, AI protocol builder, full tracking.",
    type: "website",
    locale: "en_US",
    siteName: "DoseCraft",
  },
  twitter: {
    card: "summary_large_image",
    title: "DoseCraft — Peptide Protocol Lab",
    description:
      "Run peptide stacks like the pros. Three evidence lanes, AI protocol builder, full tracking.",
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
