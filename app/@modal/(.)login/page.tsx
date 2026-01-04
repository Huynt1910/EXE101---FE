"use client";

import { useRouter, useSearchParams } from "next/navigation";
import LoginModal from "@/app/(auth)/components/login-modal";
import { buildAuthUrl, normalizeCallbackUrl } from "@/lib/auth/callback-url";

export default function LoginModalRoute() {
  const router = useRouter();
  const sp = useSearchParams();

  const callbackUrl = normalizeCallbackUrl(sp.get("callbackUrl"), "/");

  const closeModal = () => router.back();

  const handleLoginSuccess = () => {
    router.replace(callbackUrl);
  };

  const handleSignUp = () => {
    router.replace(buildAuthUrl("/signup", callbackUrl));
  };

  const handleForgotPassword = () => {
    router.replace(buildAuthUrl("/forgot-password", callbackUrl));
  };

  return (
    <LoginModal
      onClose={closeModal}
      onSubmit={handleLoginSuccess}
      onSignUp={handleSignUp}
      onForgotPassword={handleForgotPassword}
    />
  );
}
