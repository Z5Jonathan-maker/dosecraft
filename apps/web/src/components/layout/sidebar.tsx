"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  ClipboardCheck,
  BarChart3,
  Calculator,
  Menu,
  X,
  Flame,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Library", href: "/library", icon: BookOpen },
  { label: "Protocols", href: "/protocols", icon: Layers },
  { label: "Log", href: "/log", icon: ClipboardCheck },
  { label: "Insights", href: "/insights", icon: BarChart3 },
  { label: "Calculator", href: "/calculator", icon: Calculator },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-dc-surface border border-dc-border lg:hidden"
        aria-label="Toggle navigation"
      >
        {mobileOpen ? (
          <X className="w-5 h-5 text-dc-text" />
        ) : (
          <Menu className="w-5 h-5 text-dc-text" />
        )}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-40 h-full w-64 bg-dc-surface border-r border-dc-border",
          "flex flex-col transition-transform duration-300",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-dc-border">
          <div className="w-9 h-9 rounded-lg bg-dc-accent/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-dc-accent" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-dc-text tracking-tight">
              Dose<span className="text-dc-accent">Craft</span>
            </h1>
            <p className="text-[10px] text-dc-text-muted uppercase tracking-widest">
              Protocol Lab
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-dc-accent/10 text-dc-accent border-l-2 border-dc-accent"
                    : "text-dc-text-muted hover:text-dc-text hover:bg-dc-surface-alt",
                )}
              >
                <Icon className="w-4.5 h-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dc-border">
          <p className="text-[10px] text-dc-text-muted">
            v0.1.0 &middot; Not medical advice
          </p>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-dc-surface border-t border-dc-border flex lg:hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex-1 flex flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors",
                active ? "text-dc-accent" : "text-dc-text-muted",
              )}
            >
              <Icon className="w-4.5 h-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
