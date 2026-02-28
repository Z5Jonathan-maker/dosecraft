"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useAuthStore } from "@/stores/auth";

export function AppShell({ children }: { readonly children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect to auth page if not authenticated (except on auth page)
  useEffect(() => {
    if (!loading && !user && pathname !== "/auth") {
      router.push("/auth");
    }
  }, [user, loading, pathname, router]);

  // Don't render main layout on auth page
  if (pathname === "/auth") {
    return <>{children}</>;
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dc-bg">
        <div className="text-dc-text-muted">Loading...</div>
      </div>
    );
  }

  // Only render main layout if authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <Header user={user} />
        <main className="p-6 pb-24 lg:pb-6">{children}</main>
      </div>
    </div>
  );
}
