"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "@/app/(auth)/components/login-form";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  getDefaultAuthenticatedPath,
  resolveAuthenticatedRedirectPath,
} from "@/lib/auth/route-access";
import { normalizeCallbackUrl, buildAuthUrl } from "@/lib/callback-url";
import { signInWithGoogleAndGetIdToken } from "@/lib/config/firebase-google";
import { handleApiError } from "@/lib/error-handler";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const { sessionQuery, loginMutation, googleLoginMutation, user } = useAuth();

  const normalizedCallbackUrl = normalizeCallbackUrl(
    sp.get("callbackUrl"),
    getDefaultAuthenticatedPath(user?.roles ?? []),
  );
  const callbackUrl = resolveAuthenticatedRedirectPath(normalizedCallbackUrl, user?.roles ?? []);

  const handleSubmit = (email: string, password: string) => {
    loginMutation.mutate({ email, password });
  };

  const handleSignUp = () => {
    router.push(buildAuthUrl("/signup", callbackUrl));
  };

  const handleForgotPassword = () => {
    router.push(buildAuthUrl("/forgot-password", callbackUrl));
  };

  const handleGoogleSignIn = async () => {
    try {
      const idToken = await signInWithGoogleAndGetIdToken();
      googleLoginMutation.mutate({ idToken });
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    if (sessionQuery.data?.accessToken) {
      router.replace(callbackUrl);
    }
  }, [sessionQuery.data?.accessToken, callbackUrl, router]);

  // Show error with handleApiError
  useEffect(() => {
    if (loginMutation.isError) {
      handleApiError(loginMutation.error);
    }
  }, [loginMutation.isError, loginMutation.error]);

  useEffect(() => {
    if (googleLoginMutation.isError) {
      handleApiError(googleLoginMutation.error);
    }
  }, [googleLoginMutation.isError, googleLoginMutation.error]);

  return (
    <LoginForm
      mode="page"
      onSubmit={handleSubmit}
      onGoogleSignIn={handleGoogleSignIn}
      onSignUp={handleSignUp}
      onForgotPassword={handleForgotPassword}
      isLoading={loginMutation.isPending}
      isGoogleLoading={googleLoginMutation.isPending}
    />
  );
}
