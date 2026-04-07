"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import SignUpForm from "@/app/(auth)/components/signup-form";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSignup } from "@/features/auth/hooks/useSignup";
import { normalizeCallbackUrl, buildAuthUrl } from "@/lib/callback-url";
import { signInWithGoogleAndGetIdToken, isGooglePopupCancelError, checkGoogleRedirectResult } from "@/lib/config/firebase-google";
import { handleApiError } from "@/lib/error-handler";

export default function SignUpPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const { signupMutation } = useSignup();
  const { sessionQuery, googleLoginMutation } = useAuth();
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

  const callbackUrl = normalizeCallbackUrl(sp.get("callbackUrl"), "/");

  const handleSubmit = (payload: {
    email: string;
    fullName: string;
    password: string;
  }) => {
    setSubmittedEmail(payload.email);
    signupMutation.mutate(payload);
  };

  const handleLogin = () => {
    router.push(buildAuthUrl("/login", callbackUrl));
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
      router.replace(callbackUrl);
    }
  }, [sessionQuery.data?.accessToken, callbackUrl, router]);

  // Redirect to verify-email on success
  useEffect(() => {
    if (signupMutation.isSuccess && submittedEmail) {
      toast.success("Account created! Check your email for verification code.", {
        duration: 3000,
      });
      
      router.push(`/verify-email?email=${encodeURIComponent(submittedEmail)}`);
    }
  }, [signupMutation.isSuccess, submittedEmail, router]);

  // Show error with handleApiError
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

  return (
    <SignUpForm
      mode="page"
      callbackUrl={callbackUrl}
      onSubmit={handleSubmit}
      onGoogleSignIn={handleGoogleSignIn}
      onLogIn={handleLogin}
      isLoading={signupMutation.isPending}
      isGoogleLoading={googleLoginMutation.isPending}
    />
  );
}
