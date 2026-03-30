import type { GetNotificationsQuery } from "@/features/notification/type";

export const notificationQueryKeys = {
  all: ["notifications"] as const,
  list: (params?: GetNotificationsQuery) =>
    [...notificationQueryKeys.all, "list", params] as const,
  unreadCount: () => [...notificationQueryKeys.all, "unread-count"] as const,
};
