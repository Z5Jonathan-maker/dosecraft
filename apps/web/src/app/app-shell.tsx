"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useAuthStore } from "@/stores/auth";
import { FlaskConical } from "lucide-react";

export function AppShell({ children }: { readonly children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!loading && !user && pathname !== "/auth") {
      router.push("/auth");
    }
  }, [user, loading, pathname, router]);

  // Auth page — render standalone
  if (pathname === "/auth") {
    return <>{children}</>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dc-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(255,107,53,0.2) 0%, rgba(179,102,255,0.1) 100%)" }}>
              <FlaskConical className="w-6 h-6 text-dc-accent" />
            </div>
            <div className="absolute inset-0 rounded-2xl animate-pulse-glow" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-dc-accent animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-dc-accent animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-dc-accent animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-dc-bg">
      <Sidebar />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header user={user} />
        <main className="flex-1 p-5 pb-24 lg:pb-8">{children}</main>
      </div>
    </div>
  );
}
