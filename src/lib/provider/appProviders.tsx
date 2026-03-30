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

      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
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
