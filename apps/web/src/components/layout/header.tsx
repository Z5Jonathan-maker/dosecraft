"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeSearch]);

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
          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-dc-surface border border-dc-border text-dc-text-muted text-sm hover:border-dc-accent/30 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs">Search...</span>
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-dc-surface-alt border border-dc-border text-dc-text-faint">
              ⌘K
            </span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl hover:bg-dc-surface text-dc-text-muted hover:text-dc-text transition-colors"
            >
              <Bell className="w-4.5 h-4.5" />
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-dc-accent rounded-full animate-pulse-glow" />
              )}
            </button>

            {notifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-72 glass rounded-xl border border-dc-border shadow-xl z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-dc-border flex items-center justify-between">
                    <p className="text-sm font-medium text-dc-text">Notifications</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-dc-accent/15 text-dc-accent font-medium">
                      {notifications} new
                    </span>
                  </div>
                  <div className="divide-y divide-dc-border/40">
                    {[
                      { title: "BPC-157 dose logged", time: "2 min ago" },
                      { title: "Weekly compliance: 89%", time: "1 hour ago" },
                      { title: "New insight: Sleep quality +12%", time: "3 hours ago" },
                    ].map((n) => (
                      <div key={n.title} className="px-4 py-3 hover:bg-dc-surface-alt/50 transition-colors cursor-pointer">
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-dc-accent mt-1.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-dc-text">{n.title}</p>
                            <p className="text-[10px] text-dc-text-muted mt-0.5">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-dc-border text-center">
                    <button className="text-[10px] text-dc-accent hover:text-dc-accent-hover transition-colors">
                      Mark all as read
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

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
      {/* Search Modal (⌘K) */}
      {searchOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={closeSearch} />
          <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
            <div className="glass rounded-2xl border border-dc-border shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-dc-border">
                <Search className="w-4.5 h-4.5 text-dc-text-muted flex-shrink-0" />
                <input
                  autoFocus
                  placeholder="Search peptides, protocols, insights..."
                  className="flex-1 bg-transparent text-sm text-dc-text placeholder:text-dc-text-muted/50 outline-none"
                />
                <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-dc-surface-alt border border-dc-border text-dc-text-faint flex-shrink-0">
                  ESC
                </kbd>
              </div>
              <div className="p-4 space-y-1">
                {[
                  { label: "Peptide Library", href: "/library" },
                  { label: "Protocol Builder", href: "/protocols/builder" },
                  { label: "Daily Log", href: "/log" },
                  { label: "Insights & Analytics", href: "/insights" },
                  { label: "Dose Calculator", href: "/calculator" },
                ].map((item) => (
                  <button
                    key={item.href}
                    onClick={() => { router.push(item.href); closeSearch(); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-dc-text-muted hover:text-dc-text hover:bg-dc-surface-alt transition-colors text-left"
                  >
                    <Search className="w-3.5 h-3.5 flex-shrink-0" />
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-dc-border text-center">
                <p className="text-[10px] text-dc-text-faint">Full-text search coming soon</p>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
