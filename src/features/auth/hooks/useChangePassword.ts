"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/services/auth.services";
import type { ChangePasswordRequest } from "@/features/auth/type";

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) =>
      authApi.changePassword(payload),
  });
}
