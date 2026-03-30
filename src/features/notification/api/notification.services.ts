import type { ApiResponse } from "@/features/api-type";
import type {
  GetNotificationsQuery,
  NotificationListResponse,
  UnreadNotificationCount,
} from "@/features/notification/type";
import { httpClient } from "@/lib/http/client";

const NOTIFICATION_BASE_PATH = "/api/Notifications";

export const notificationApi = {
  async getNotifications(params?: GetNotificationsQuery) {
    const res = await httpClient.get<ApiResponse<NotificationListResponse>>(
      NOTIFICATION_BASE_PATH,
      params,
    );
    return res.data;
  },

  async getUnreadCount() {
    const res = await httpClient.get<ApiResponse<UnreadNotificationCount>>(
      `${NOTIFICATION_BASE_PATH}/unread-count`,
    );
    return res.data;
  },

  async markAsRead(notificationId: string) {
    const res = await httpClient.post<ApiResponse<null>>(
      `${NOTIFICATION_BASE_PATH}/${notificationId}/read`,
    );
    return res.data;
  },

  async markAllAsRead() {
    const res = await httpClient.post<ApiResponse<null>>(
      `${NOTIFICATION_BASE_PATH}/read-all`,
    );
    return res.data;
  },
};
