"use client";

import React, { useEffect } from "react";
import { Toaster } from "sonner";
import { QueryProvider } from "./queryProvider";
import { authStore } from "@/lib/store/authStore";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    authStore.restoreAuth();
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
