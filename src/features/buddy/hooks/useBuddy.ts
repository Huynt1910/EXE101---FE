"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { buddyQueryKeys } from "@/features/buddy/api/buddy.query-key";
import { buddyApi } from "@/features/buddy/api/buddy.services";
import type { RegisterAsBuddyRequest } from "@/features/buddy/type";

export function useBuddiesQuery() {
  return useQuery({
    queryKey: buddyQueryKeys.list(),
    queryFn: () => buddyApi.getBuddies(),
    staleTime: 60 * 1000,
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
