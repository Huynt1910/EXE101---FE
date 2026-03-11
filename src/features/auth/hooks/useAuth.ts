import { useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import type { LoginRequest } from "../type";
import { httpClient } from "@/lib/http/client";
import { authStore, useAuthStore } from "@/lib/store/authStore";

export function useAuth() {
  const authState = useAuthStore();

  const logout = authStore.logout;

  useEffect(() => {
    httpClient.setOnUnauthorized(logout);
    return () => {
      httpClient.setOnUnauthorized();
    };
  }, [logout]);

  const loginMutation = useMutation({
    mutationFn: (payload: LoginRequest) => authStore.login(payload),
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
    sessionQuery,
    loginMutation,
    logout,
    isAuthenticated: authState.isAuthenticated,
    user,
  };
}

export type UseAuthResult = ReturnType<typeof useAuth>;