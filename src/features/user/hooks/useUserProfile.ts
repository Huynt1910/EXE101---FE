"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/features/user/api/user.services";
import type { UpdateUserProfileRequest } from "@/features/user/type";

const userProfileQueryKey = ["user-profile"] as const;

export function useUserProfile() {
  return useQuery({
    queryKey: userProfileQueryKey,
    queryFn: () => userApi.getProfile(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserProfileMutations() {
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateUserProfileRequest) =>
      userApi.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userProfileQueryKey });
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => userApi.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userProfileQueryKey });
    },
  });

  return {
    updateProfileMutation,
    uploadAvatarMutation,
  };
}
