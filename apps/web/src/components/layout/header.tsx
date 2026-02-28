"use client";

import { usePathname } from "next/navigation";
import { Bell, User } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/library": "Peptide Library",
  "/protocols": "Protocols",
  "/protocols/builder": "Protocol Builder",
  "/log": "Daily Log",
  "/insights": "Insights",
  "/calculator": "Calculator",
};

export function Header() {
  const pathname = usePathname();

  const title =
    PAGE_TITLES[pathname] ??
    (pathname.startsWith("/library/") ? "Peptide Detail" : "DoseCraft");

  return (
    <header className="sticky top-0 z-20 bg-dc-bg/80 backdrop-blur-md border-b border-dc-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="lg:ml-0 ml-12">
          <h2 className="text-xl font-bold text-dc-text">{title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-dc-surface-alt text-dc-text-muted hover:text-dc-text transition-colors relative">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-dc-accent rounded-full" />
          </button>
          <button className="w-8 h-8 rounded-full bg-dc-surface-alt border border-dc-border flex items-center justify-center hover:border-dc-accent transition-colors">
            <User className="w-4 h-4 text-dc-text-muted" />
          </button>
        </div>
      </div>
    </header>
  );
}
