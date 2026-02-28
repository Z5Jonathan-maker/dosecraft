"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Search, ChevronDown, User } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import clsx from "clsx";

const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  "/":                   { title: "Dashboard",        subtitle: "Your protocol overview" },
  "/library":            { title: "Peptide Library",  subtitle: "Browse evidence-based compounds" },
  "/protocols":          { title: "Protocols",        subtitle: "Your stacks and templates" },
  "/protocols/builder":  { title: "Protocol Builder", subtitle: "Design your custom stack" },
  "/log":                { title: "Daily Log",        subtitle: "Track your doses and outcomes" },
  "/insights":           { title: "Insights",         subtitle: "Analytics and AI observations" },
  "/calculator":         { title: "Calculator",       subtitle: "Reconstitution and dosing tools" },
};

interface HeaderProps {
  readonly user?: { readonly email: string; readonly role?: string };
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications] = useState(3);

  const pageInfo =
    PAGE_TITLES[pathname] ??
    (pathname.startsWith("/library/")
      ? { title: "Peptide Detail", subtitle: "Evidence review" }
      : { title: "DoseCraft" });

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <header className="sticky top-0 z-20 bg-dc-bg/80 backdrop-blur-xl border-b border-dc-border/60">
      <div className="flex items-center justify-between px-6 py-3.5">
        {/* Left: Title */}
        <div className="lg:ml-0 ml-12">
          <h2 className="text-lg font-semibold text-dc-text leading-none">{pageInfo.title}</h2>
          {pageInfo.subtitle && (
            <p className="text-xs text-dc-text-muted mt-0.5">{pageInfo.subtitle}</p>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search (decorative) */}
          <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-dc-surface border border-dc-border text-dc-text-muted text-sm hover:border-dc-accent/30 transition-colors">
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs">Search...</span>
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-dc-surface-alt border border-dc-border text-dc-text-faint">
              ⌘K
            </span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-dc-surface text-dc-text-muted hover:text-dc-text transition-colors">
            <Bell className="w-4.5 h-4.5" />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-dc-accent rounded-full animate-pulse-glow" />
            )}
          </button>

          {/* User Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-dc-surface border border-transparent hover:border-dc-border transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-lg bg-dc-accent/15 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-dc-accent">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-dc-text-muted hidden sm:inline">
                  {user.email.split("@")[0]}
                </span>
                <ChevronDown
                  className={clsx(
                    "w-3.5 h-3.5 text-dc-text-muted transition-transform duration-200",
                    dropdownOpen && "rotate-180",
                  )}
                />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-52 glass rounded-xl border border-dc-border shadow-xl z-20 py-1">
                    <div className="px-4 py-3 border-b border-dc-border">
                      <p className="text-sm font-medium text-dc-text truncate">{user.email}</p>
                      <p className="text-xs text-dc-text-muted capitalize mt-0.5">{user.role ?? "user"}</p>
                    </div>
                    <button
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-dc-text-muted hover:text-dc-text hover:bg-dc-surface-alt transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-dc-danger hover:bg-dc-danger/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
