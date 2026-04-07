"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { buddyQueryKeys } from "@/features/buddy/api/buddy.query-key";
import { buddyApi } from "@/features/buddy/api/buddy.services";
import type {
  RegisterAsBuddyRequest,
  UpdateBuddyProfileRequest,
} from "@/features/buddy/type";

export function useBuddiesQuery() {
  return useQuery({
    queryKey: buddyQueryKeys.list(),
    queryFn: () => buddyApi.getBuddies(),
    staleTime: 60 * 1000,
  });
}

export function usePendingApplicantsQuery() {
  return useQuery({
    queryKey: buddyQueryKeys.pendingApplicants(),
    queryFn: () => buddyApi.getPendingApplicants(),
    staleTime: 30 * 1000,
  });
}

export function useBuddyDetailQuery(id?: string | null) {
  return useQuery({
    queryKey: buddyQueryKeys.detail(id ?? ""),
    queryFn: () => buddyApi.getBuddyById(id ?? ""),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

export function useBuddyReviewsQuery(
  buddyId?: string | null,
  { page = 1, pageSize = 6 }: { page?: number; pageSize?: number } = {},
) {
  return useQuery({
    queryKey: buddyQueryKeys.reviews(buddyId ?? "", page, pageSize),
    queryFn: () => buddyApi.getBuddyReviews(buddyId ?? "", { page, pageSize }),
    enabled: Boolean(buddyId),
    staleTime: 60 * 1000,
  });
}

export function useRegisterAsBuddyMutation() {
  return useMutation({
    mutationFn: (payload: RegisterAsBuddyRequest) => buddyApi.registerAsBuddy(payload),
  });
}

export function useBuddyMeQuery() {
  return useQuery({
    queryKey: buddyQueryKeys.me(),
    queryFn: () => buddyApi.getBuddyMe(),
    staleTime: 60 * 1000,
  });
}

export function useMyBuddyBookingsQuery() {
  return useQuery({
    queryKey: buddyQueryKeys.myBookings(),
    queryFn: () => buddyApi.getMyBuddyBookings(),
    staleTime: 30 * 1000,
  });
}

export function useMyTripRequestsQuery() {
  return useQuery({
    queryKey: buddyQueryKeys.myTripRequests(),
    queryFn: () => buddyApi.getMyTripRequests(),
    staleTime: 30 * 1000,
  });
}

export function useBuddyProfileMutations() {
  const queryClient = useQueryClient();

  const invalidateBuddyProfile = async () => {
    await queryClient.invalidateQueries({ queryKey: buddyQueryKeys.me() });
  };

  const updateBuddyProfileMutation = useMutation({
    mutationFn: (payload: UpdateBuddyProfileRequest) =>
      buddyApi.updateBuddyProfile(payload),
    onSuccess: invalidateBuddyProfile,
  });

  const uploadBuddyAvatarMutation = useMutation({
    mutationFn: (file: File) => buddyApi.uploadBuddyAvatar(file),
    onSuccess: invalidateBuddyProfile,
  });

  return {
    updateBuddyProfileMutation,
    uploadBuddyAvatarMutation,
  };
}
