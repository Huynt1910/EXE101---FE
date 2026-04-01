"use client";

import React, { useEffect } from "react";
import { Toaster } from "sonner";
import { httpClient } from "@/lib/http/client";
import { QueryProvider } from "./queryProvider";
import { authStore } from "@/lib/store/authStore";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
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
