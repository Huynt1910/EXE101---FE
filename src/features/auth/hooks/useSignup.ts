"use client";

import { useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import type { RequestOtpRequest, SignUpRequest, VerifyEmailRequest } from "../type";
import { authApi } from "../api/services/auth.services";
import { httpClient } from "@/lib/http/client";
import { authStore, useAuthStore } from "@/lib/store/authStore";

export function useSignup() {
  const authState = useAuthStore();
  const logout = authStore.logout;

  useEffect(() => {
    httpClient.setOnUnauthorized(logout);
    return () => {
      httpClient.setOnUnauthorized();
    };
  }, [logout]);

  // Sign up mutation - just registers the user
  const signupMutation = useMutation({
    mutationFn: (payload: SignUpRequest) => authApi.register(payload),
  });

  // Verify email mutation - verifies OTP and handles authentication
  const verifyEmailMutation = useMutation({
    mutationFn: async (payload: VerifyEmailRequest) => {
      const response = await authApi.verifyEmail(payload);

      // Handle token from verify email response
      if (response.success && response.data?.accessToken) {
        const token = response.data.accessToken;
        authStore.setAuthToken(token, response.data.roles ?? []);
      }

      return response;
    },
  });

  const requestOtpMutation = useMutation({
    mutationFn: (payload: RequestOtpRequest) => authApi.requestOtp(payload),
  });

  const sessionQuery = useMemo(
    () => ({
      data: authState.token ? { accessToken: authState.token } : null,
    }),
    [authState.token],
  );

  const user = useMemo(
    () =>
      authState.user
        ? {
            ...authState.user,
            accessToken: authState.token,
          }
        : null,
    [authState.token, authState.user],
  );

  return {
    signupMutation,
    verifyEmailMutation,
    requestOtpMutation,
    sessionQuery,
    logout,
    isAuthenticated: authState.isAuthenticated,
    user,
  };
}

export type UseSignupResult = ReturnType<typeof useSignup>;
