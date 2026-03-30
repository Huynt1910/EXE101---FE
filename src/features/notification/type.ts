import type { RequestParams } from "@/lib/http/client";

export interface NotificationItem {
  id: string;
  type: string | null;
  title: string | null;
  body: string | null;
  dataJson: string | null;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationListResponse {
  items: NotificationItem[] | null;
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface UnreadNotificationCount {
  unreadCount: number;
}

export interface GetNotificationsQuery extends RequestParams {
  page?: number;
  pageSize?: number;
}
