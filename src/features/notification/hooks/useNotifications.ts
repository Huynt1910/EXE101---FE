"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationQueryKeys } from "@/features/notification/api/notification.query-key";
import { notificationApi } from "@/features/notification/api/notification.services";
import type { GetNotificationsQuery } from "@/features/notification/type";

export function useNotifications(params?: GetNotificationsQuery) {
  return useQuery({
    queryKey: notificationQueryKeys.list(params),
    queryFn: () => notificationApi.getNotifications(params),
    staleTime: 30 * 1000,
  });
}

export function useNotificationUnreadCount() {
  return useQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: () => notificationApi.getUnreadCount(),
    staleTime: 30 * 1000,
  });
}

export function useNotificationMutations() {
  const queryClient = useQueryClient();

  const invalidateAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all }),
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount() }),
    ]);
  };

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => notificationApi.markAsRead(notificationId),
    onSuccess: invalidateAll,
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: invalidateAll,
  });

  return {
    markAsReadMutation,
    markAllAsReadMutation,
  };
}
