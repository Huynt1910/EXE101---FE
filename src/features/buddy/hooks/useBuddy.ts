"use client";

import { useQuery } from "@tanstack/react-query";
import { buddyApi } from "@/features/buddy/api/buddy.services";
import { buddyQueryKeys } from "@/features/buddy/api/buddy.query-key";

export function useBuddy(id: string) {
  return useQuery({
    queryKey: buddyQueryKeys.detail(id),
    queryFn: () => buddyApi.getBuddyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
