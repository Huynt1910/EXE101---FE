"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { servicePackageQueryKeys } from "@/features/service-package/api/service-package.query-key";
import { servicePackageApi } from "@/features/service-package/api/service-package.services";
import type { SubscribeServicePackageRequest } from "@/features/service-package/type";

export function useServicePackages() {
  return useQuery({
    queryKey: servicePackageQueryKeys.list(),
    queryFn: () => servicePackageApi.getServicePackages(),
    staleTime: 60 * 1000,
  });
}

export function useSubscribeServicePackageMutation() {
  return useMutation({
    mutationFn: (payload: SubscribeServicePackageRequest) =>
      servicePackageApi.subscribeServicePackage(payload),
  });
}

export function useUnsubscribeMyServicePackageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => servicePackageApi.unsubscribeMySubscription(),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: servicePackageQueryKeys.mySubscription(),
        }),
        queryClient.invalidateQueries({
          queryKey: servicePackageQueryKeys.list(),
        }),
      ]);
    },
  });
}

export function useMyServiceSubscriptionQuery(enabled = true) {
  return useQuery({
    queryKey: servicePackageQueryKeys.mySubscription(),
    queryFn: () => servicePackageApi.getMySubscription(),
    enabled,
    staleTime: 30 * 1000,
  });
}
