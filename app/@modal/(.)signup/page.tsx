"use client";

import { useRouter, useSearchParams } from "next/navigation";
import SignUpModal from "@/app/(auth)/components/signup-modal";
import { buildAuthUrl, normalizeCallbackUrl } from "@/lib/auth/callback-url";

export default function SignUpModalRoute() {
  const router = useRouter();
  const sp = useSearchParams();

  const callbackUrl = normalizeCallbackUrl(sp.get("callbackUrl"), "/");

  const close = () => router.back();

  const handleLogin = () => {
    router.replace(buildAuthUrl("/login", callbackUrl));
  };

  return <SignUpModal callbackUrl={callbackUrl} onClose={close} onLogIn={handleLogin} />;
}
