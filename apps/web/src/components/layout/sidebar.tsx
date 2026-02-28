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
  FlaskConical,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";

const NAV_ITEMS = [
  { label: "Dashboard",  href: "/",           icon: LayoutDashboard, color: "#ff6b35" },
  { label: "Library",    href: "/library",     icon: BookOpen,        color: "#00d4ff" },
  { label: "Protocols",  href: "/protocols",   icon: Layers,          color: "#ff6b35" },
  { label: "Log",        href: "/log",          icon: ClipboardCheck,  color: "#00ff88" },
  { label: "Insights",   href: "/insights",    icon: BarChart3,       color: "#b366ff" },
  { label: "Calculator", href: "/calculator",  icon: Calculator,      color: "#ffaa00" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl glass border border-dc-border lg:hidden"
        aria-label="Toggle navigation"
      >
        {mobileOpen ? (
          <X className="w-4.5 h-4.5 text-dc-text" />
        ) : (
          <Menu className="w-4.5 h-4.5 text-dc-text" />
        )}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-40 h-full w-64 sidebar-bg",
          "flex flex-col transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-dc-border/50">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(255,107,53,0.2) 0%, rgba(179,102,255,0.1) 100%)" }}>
              <FlaskConical className="w-5 h-5 text-dc-accent" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-dc-neon-green animate-pulse-glow" />
          </div>
          <div>
            <h1 className="text-[17px] font-bold text-dc-text tracking-tight leading-none">
              Dose<span className="text-dc-accent">Craft</span>
            </h1>
            <p className="text-[9px] text-dc-text-faint uppercase tracking-[0.18em] mt-0.5">
              Protocol Lab
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <div className="px-3 mb-2">
            <p className="text-[9px] font-medium text-dc-text-faint uppercase tracking-[0.15em]">Navigation</p>
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "text-dc-text bg-dc-surface-alt"
                    : "text-dc-text-muted hover:text-dc-text hover:bg-dc-surface-alt/60",
                )}
              >
                <div
                  className={clsx(
                    "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200",
                    active ? "opacity-100" : "opacity-60 group-hover:opacity-90",
                  )}
                  style={active ? {
                    backgroundColor: `${item.color}18`,
                    boxShadow: `0 0 12px ${item.color}25`,
                  } : { backgroundColor: "rgba(255,255,255,0.04)" }}
                >
                  <Icon
                    className="w-3.5 h-3.5"
                    style={{ color: active ? item.color : undefined }}
                  />
                </div>
                <span className="flex-1">{item.label}</span>
                {active && (
                  <ChevronRight className="w-3 h-3 text-dc-text-muted" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Evidence Lane Legend */}
        <div className="mx-3 mb-3 p-3 rounded-xl bg-dc-surface/50 border border-dc-border/40">
          <p className="text-[9px] font-medium text-dc-text-faint uppercase tracking-[0.15em] mb-2">Evidence Lanes</p>
          <div className="space-y-1.5">
            {[
              { label: "Clinical", cls: "lane-dot-clinical", color: "#00d4ff" },
              { label: "Expert", cls: "lane-dot-expert", color: "#ff6b35" },
              { label: "Experimental", cls: "lane-dot-experimental", color: "#b366ff" },
            ].map((lane) => (
              <div key={lane.label} className="flex items-center gap-2">
                <span className={clsx("w-1.5 h-1.5 rounded-full flex-shrink-0", lane.cls)} />
                <span className="text-[10px] text-dc-text-muted">{lane.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Footer */}
        <div className="border-t border-dc-border/50 px-4 py-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-dc-accent/15 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-dc-accent">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-dc-text truncate">{user.email}</p>
                <p className="text-[9px] text-dc-text-faint capitalize">{user.role}</p>
              </div>
            </div>
          )}
          <p className="text-[9px] text-dc-text-faint mt-3 leading-relaxed">
            Not medical advice — educational only.
          </p>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-dc-border flex lg:hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex-1 flex flex-col items-center gap-1 py-2.5 text-[9px] font-medium transition-colors",
                active ? "text-dc-accent" : "text-dc-text-muted",
              )}
            >
              <Icon
                className="w-4.5 h-4.5"
                style={active ? { color: item.color } : undefined}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
