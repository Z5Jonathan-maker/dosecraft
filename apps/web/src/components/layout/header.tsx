"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/library": "Peptide Library",
  "/protocols": "Protocols",
  "/protocols/builder": "Protocol Builder",
  "/log": "Daily Log",
  "/insights": "Insights",
  "/calculator": "Calculator",
};

interface HeaderProps {
  readonly user?: { readonly email: string };
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const title =
    PAGE_TITLES[pathname] ??
    (pathname.startsWith("/library/") ? "Peptide Detail" : "DoseCraft");

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

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
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-dc-text-muted hidden sm:inline">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-dc-surface-alt text-dc-text-muted hover:text-dc-danger transition-colors"
                title="Logout"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
