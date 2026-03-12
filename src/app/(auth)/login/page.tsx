"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "@/app/(auth)/components/login-form";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { normalizeCallbackUrl, buildAuthUrl } from "@/lib/callback-url";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const { sessionQuery, loginMutation } = useAuth();

  const callbackUrl = normalizeCallbackUrl(sp.get("callbackUrl"), "/");

  const handleSubmit = (email: string, password: string) => {
    loginMutation.mutate({ email, password });
  };

  const handleSignUp = () => {
    router.push(buildAuthUrl("/signup", callbackUrl));
  };

  const handleForgotPassword = () => {
    router.push(buildAuthUrl("/forgot-password", callbackUrl));
  };

  useEffect(() => {
    if (sessionQuery.data?.accessToken) {
      router.replace(callbackUrl);
    }
  }, [sessionQuery.data?.accessToken, callbackUrl, router]);

  return (
    <LoginForm
      mode="page"
      onSubmit={handleSubmit}
      onSignUp={handleSignUp}
      onForgotPassword={handleForgotPassword}
      isLoading={loginMutation.isPending}
      error={loginMutation.error?.message || null}
    />
  );
}
