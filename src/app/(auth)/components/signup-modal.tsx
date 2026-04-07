"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import SignUpForm from "@/app/(auth)/components/signup-form";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSignup } from "@/features/auth/hooks/useSignup";
import {
  signInWithGoogleAndGetIdToken,
  isGooglePopupCancelError,
  checkGoogleRedirectResult,
} from "@/lib/config/firebase-google";
import { handleApiError } from "@/lib/error-handler";

export interface SignUpModalProps {
  callbackUrl: string;
  onClose: () => void;
  onLogIn?: () => void;
}

const VERIFY_EMAIL_PATH = "/verify-email";
const SUCCESS_TOAST_DURATION_MS = 3000;

export default function SignUpModal({
  callbackUrl,
  onClose,
  onLogIn,
}: Readonly<SignUpModalProps>) {
  const router = useRouter();
  const { signupMutation } = useSignup();
  const { sessionQuery, googleLoginMutation } = useAuth();
  const [submittedEmail, setSubmittedEmail] = useState("");

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleSubmit = (payload: {
    email: string;
    fullName: string;
    password: string;
  }) => {
    setSubmittedEmail(payload.email);
    signupMutation.mutate(payload);
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

  // ============================================================================
  // Effects
  // ============================================================================

  // Pick up Google redirect result on mobile
  useEffect(() => {
    checkGoogleRedirectResult().then((idToken) => {
      if (idToken) {
        googleLoginMutation.mutate({ idToken });
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle successful signup: show toast and navigate to verify-email
  useEffect(() => {
    if (signupMutation.isSuccess && submittedEmail) {
      toast.success(
        "Account created! Check your email for verification code.",
        {
          duration: SUCCESS_TOAST_DURATION_MS,
        },
      );
      router.replace(
        `${VERIFY_EMAIL_PATH}?email=${encodeURIComponent(submittedEmail)}`,
      );
    }
  }, [signupMutation.isSuccess, submittedEmail, router]);

  // Handle signup error: show error toast
  useEffect(() => {
    if (signupMutation.isError) {
      handleApiError(signupMutation.error);
    }
  }, [signupMutation.isError, signupMutation.error]);

  useEffect(() => {
    if (googleLoginMutation.isError) {
      handleApiError(googleLoginMutation.error);
    }
  }, [googleLoginMutation.isError, googleLoginMutation.error]);

  useEffect(() => {
    if (sessionQuery.data?.accessToken) {
      onClose();
    }
  }, [sessionQuery.data?.accessToken, onClose]);

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="fixed inset-0 z-100 grid place-items-center p-0 sm:p-6">
      {/* Backdrop - Click to close */}
      <button
        type="button"
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        aria-label="Close signup modal"
        onClick={onClose}
      />

      {/* Modal Container */}
      {/* Mobile: full screen, no border radius */}
      {/* Desktop: auto height, max 85svh, rounded corners */}
      <dialog
        open
        aria-label="Sign up modal"
        className="
          relative flex flex-col bg-card shadow-2xl
          w-full h-svh rounded-none overflow-hidden min-h-0
          sm:h-auto sm:max-h-[85svh] sm:max-w-lg sm:rounded-2xl
        "
      >
        {/* ===== Header Section ===== */}
        <div className="peach-gradient relative border-b px-8 pt-6 pb-5 text-center sm:px-12 sm:pt-7 sm:pb-6">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="
              absolute right-4 top-4 rounded-full bg-white p-2
              text-foreground/70 hover:text-primary transition-colors
            "
          >
            <X className="h-5 w-5" />
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-3">
            <Image
              src="/logo_bonddy.png"
              alt="Bonddy logo"
              width={68}
              height={68}
              priority
            />
          </div>

          {/* Title */}
          <h2 className="text-lg font-extrabold text-primary sm:text-xl">
            Create an account
          </h2>
        </div>

        {/* ===== Form Section ===== */}
        {/* Scrollable on mobile when form grows */}
        <div className="flex-1 min-h-0 overflow-y-auto px-10 py-8 sm:px-14 no-scrollbar">
          <div className="w-full max-w-md mx-auto">
            <SignUpForm
              centered={false}
              mode="modal"
              callbackUrl={callbackUrl}
              onSubmit={handleSubmit}
              onGoogleSignIn={handleGoogleSignIn}
              onLogIn={onLogIn}
              isLoading={signupMutation.isPending}
              isGoogleLoading={googleLoginMutation.isPending}
            />
          </div>
        </div>
      </dialog>
    </div>
  );
}
