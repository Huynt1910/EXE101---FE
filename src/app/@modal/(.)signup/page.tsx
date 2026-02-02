"use client";

import SignUpModal from "@/app/(auth)/components/signup-modal";
import { normalizeCallbackUrl, buildAuthUrl } from "@/lib/callback-url";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignUpModalRoute() {
  const router = useRouter();
  const sp = useSearchParams();

  const callbackUrl = normalizeCallbackUrl(sp.get("callbackUrl"), "/");

  const close = () => router.back();

  const handleLogin = () => {
    router.replace(buildAuthUrl("/login", callbackUrl));
  };

  return (
    <SignUpModal
      callbackUrl={callbackUrl}
      onClose={close}
      onLogIn={handleLogin}
    />
  );
}
