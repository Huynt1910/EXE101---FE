"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { httpClient } from "@/lib/http/client";
import { hasRole, isBuddyAllowedPath } from "@/lib/auth/route-access";
import { QueryProvider } from "./queryProvider";
import { authStore, useAuthStore } from "@/lib/store/authStore";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const authState = useAuthStore();

  useEffect(() => {
    authStore.restoreAuth();

    httpClient.setOnUnauthorized(() => {
      authStore.logout();

      if (globalThis.window !== undefined && globalThis.location.pathname !== "/login") {
        const currentPath = globalThis.location.pathname + globalThis.location.search;
        globalThis.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
      }
    });

    return () => {
      httpClient.setOnUnauthorized();
    };
  }, []);

  useEffect(() => {
    if (globalThis.window === undefined) return;
    if (!authState.isAuthenticated || !authState.user) return;

    const roles = authState.user.roles ?? [];
    const isBuddyOnly = hasRole(roles, "Buddy") && !hasRole(roles, "Admin");

    if (!isBuddyOnly) return;
    if (isBuddyAllowedPath(pathname)) return;

    globalThis.location.replace("/buddy");
  }, [authState.isAuthenticated, authState.user, pathname]);

  return (
    <QueryProvider>
      {children}
      <Toaster
        position="bottom-center"
        richColors
        toastOptions={{ className: "font-sans" }}
      />
    </QueryProvider>
  );
}
