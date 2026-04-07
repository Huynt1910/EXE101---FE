"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "@/app/(auth)/components/login-form";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  getDefaultAuthenticatedPath,
  resolveAuthenticatedRedirectPath,
} from "@/lib/auth/route-access";
import { normalizeCallbackUrl, buildAuthUrl } from "@/lib/callback-url";
import { signInWithGoogleAndGetIdToken, isGooglePopupCancelError, checkGoogleRedirectResult } from "@/lib/config/firebase-google";
import { handleApiError } from "@/lib/error-handler";

export interface LoginModalProps {
  onClose: () => void;
  onAuthenticated?: (callbackUrl: string) => void;
}

export default function LoginModal({
  onClose,
  onAuthenticated,
}: Readonly<LoginModalProps>) {
  const router = useRouter();
  const sp = useSearchParams();
  const { sessionQuery, loginMutation, googleLoginMutation, user } = useAuth();
  const hasHandledAuthRef = useRef(false);
  const normalizedCallbackUrl = normalizeCallbackUrl(
    sp.get("callbackUrl"),
    getDefaultAuthenticatedPath(user?.roles ?? []),
  );
  const callbackUrl = resolveAuthenticatedRedirectPath(
    normalizedCallbackUrl,
    user?.roles ?? [],
  );

  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  const handleSubmit = (email: string, password: string) => {
    loginMutation.mutate({ email, password });
  };

  const handleSignUp = () => {
    // Replace to avoid stacking login->signup in history inside intercepted modal flow.
    router.replace(buildAuthUrl("/signup", callbackUrl), { scroll: false });
  };

  const handleForgotPassword = () => {
    router.push(buildAuthUrl("/forgot-password", callbackUrl), {
      scroll: false,
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      const idToken = await signInWithGoogleAndGetIdToken();
      googleLoginMutation.mutate({ idToken });
    } catch (error) {
      if (!isGooglePopupCancelError(error)) {
        handleApiError(error);
      }
    }
  };

  // Pick up Google redirect result on mobile
  useEffect(() => {
    checkGoogleRedirectResult().then((idToken) => {
      if (idToken) {
        googleLoginMutation.mutate({ idToken });
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (sessionQuery.data?.accessToken) {
      if (hasHandledAuthRef.current) return;
      hasHandledAuthRef.current = true;

      if (onAuthenticated) {
        onAuthenticated(callbackUrl);
        return;
      }

      router.replace(callbackUrl, { scroll: false });
    }
  }, [callbackUrl, onAuthenticated, router, sessionQuery.data?.accessToken]);

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
    <div className="fixed inset-0 z-[100] grid place-items-center p-0 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        aria-label="Close login modal backdrop"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Login"
        className="
          relative flex flex-col bg-card shadow-2xl
          w-full h-[100svh] rounded-none overflow-hidden
          sm:h-auto sm:max-h-[85svh] sm:max-w-lg sm:rounded-2xl
        "
      >
        <div className="peach-gradient relative border-b text-center px-8 pt-6 pb-5 sm:px-12 sm:pt-7 sm:pb-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close login modal"
            className="absolute right-4 top-4 rounded-full bg-white p-2 text-foreground/70 hover:text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex justify-center">
            <Image
              src="/logo_bonddy.png"
              alt="Bonddy logo"
              width={68}
              height={68}
              priority
            />
          </div>

          <h2 className="mt-2 text-lg sm:text-2xl font-extrabold text-primary">
            Welcome back
          </h2>
          <p className="text-xs sm:text-sm lg:text-md text-muted-foreground">
            Log in to your account
          </p>
        </div>

        <div className="px-10 py-8 sm:px-14 sm:py-8">
          <div className="w-full max-w-md mx-auto">
            <LoginForm
              mode="modal"
              centered={false}
              onSubmit={handleSubmit}
              onGoogleSignIn={handleGoogleSignIn}
              onForgotPassword={handleForgotPassword}
              onSignUp={handleSignUp}
              isLoading={loginMutation.isPending}
              isGoogleLoading={googleLoginMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
