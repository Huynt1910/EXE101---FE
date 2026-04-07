"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  getDefaultAuthenticatedPath,
  resolveAuthenticatedRedirectPath,
} from "@/lib/auth/route-access";
import { buildAuthUrl, normalizeCallbackUrl } from "@/lib/callback-url";
import { authStore } from "@/lib/store/authStore";

type SyncStatus = "syncing" | "failed";

export default function SessionSyncPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasStartedRef = useRef(false);
  const [status, setStatus] = useState<SyncStatus>("syncing");

  const safeCallbackUrl = useMemo(() => {
    return normalizeCallbackUrl(searchParams.get("callbackUrl"), "/");
  }, [searchParams]);

  const fallbackLoginUrl = useMemo(() => {
    return buildAuthUrl("/login", safeCallbackUrl);
  }, [safeCallbackUrl]);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    let isDisposed = false;

    async function syncSession() {
      try {
        await authStore.refreshSession();

        if (isDisposed) return;

        const roles = authStore.getState().user?.roles ?? [];
        const redirectPath = resolveAuthenticatedRedirectPath(
          safeCallbackUrl,
          roles,
        );

        router.replace(redirectPath || getDefaultAuthenticatedPath(roles));
      } catch {
        authStore.logout();

        if (isDisposed) return;

        setStatus("failed");

        window.setTimeout(() => {
          if (!isDisposed) {
            router.replace(fallbackLoginUrl);
          }
        }, 1200);
      }
    }

    void syncSession();

    return () => {
      isDisposed = true;
    };
  }, [fallbackLoginUrl, router, safeCallbackUrl]);

  return (
    <main className="grid min-h-svh place-items-center bg-muted/20 px-4">
      <div className="w-full max-w-md rounded-3xl border border-border/70 bg-background p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 rounded-full bg-primary/10 p-3 text-primary">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {status === "syncing" ? "Updating your session" : "Session expired"}
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              {status === "syncing"
                ? "We are refreshing your account access so your latest role and permissions are available."
                : "We could not restore your session automatically. Redirecting you to the login page now."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
