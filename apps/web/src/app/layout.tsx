import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "./app-shell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DoseCraft — Peptide Protocol Lab",
  description:
    "Precision peptide protocol design, tracking, and insights. Build evidence-based biohacking stacks with clinical, expert, and experimental data lanes.",
  keywords: [
    "peptides",
    "biohacking",
    "BPC-157",
    "TB-500",
    "CJC-1295",
    "protocols",
    "dose tracking",
    "body optimization",
    "longevity",
  ],
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-dc-bg text-dc-text`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
