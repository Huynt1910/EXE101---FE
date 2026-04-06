"use client";

import { toast } from "sonner";
import { Bell, CheckCheck, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookingPanel,
  BookingPanelContent,
  BookingPanelDescription,
  BookingPanelHeader,
  BookingPanelTitle,
} from "@/components/ui/booking-panel";
import {
  useNotificationMutations,
  useNotificationUnreadCount,
  useNotifications,
} from "@/features/notification/hooks/useNotifications";

function formatRelativeTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-GB", { dateStyle: "medium" });
}

function getNotificationTone(type?: string | null) {
  switch (type?.toLowerCase()) {
    case "booking":
      return "bg-[#eef6ff] text-[#1d4e89]";
    case "payment":
      return "bg-[#fff6df] text-[#8a6a18]";
    case "message":
      return "bg-[#eefbf6] text-[#18794e]";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

export function ProfileNotificationsSection() {
  const notificationsQuery = useNotifications({ page: 1, pageSize: 20 });
  const unreadCountQuery = useNotificationUnreadCount();
  const { markAllAsReadMutation, markAsReadMutation } = useNotificationMutations();

  const handleMarkAll = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      toast.success("All notifications marked as read.");
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "Unable to update notifications.";
      toast.error(message);
    }
  };

  const handleMarkOne = async (notificationId: string) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId);
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "Unable to update this notification.";
      toast.error(message);
    }
  };

  if (notificationsQuery.isLoading) {
    return (
      <BookingPanel>
        <BookingPanelContent className="text-sm text-muted-foreground">
          Loading notifications…
        </BookingPanelContent>
      </BookingPanel>
    );
  }

  if (notificationsQuery.isError) {
    return (
      <BookingPanel className="border-destructive/20">
        <BookingPanelContent className="text-sm text-destructive">
          Unable to load notifications right now.
        </BookingPanelContent>
      </BookingPanel>
    );
  }

  const items = notificationsQuery.data?.data.items ?? [];
  const unreadCount = unreadCountQuery.data?.data.unreadCount ?? 0;

  return (
    <BookingPanel>
      <BookingPanelHeader className="border-b border-border/70">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <BookingPanelTitle className="text-2xl">Notifications</BookingPanelTitle>
            <BookingPanelDescription>
              Review recent account and travel events without leaving your
              profile.
            </BookingPanelDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-primary">
              {unreadCount} unread
            </Badge>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => notificationsQuery.refetch()}
              disabled={notificationsQuery.isFetching}
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                void handleMarkAll();
              }}
              disabled={markAllAsReadMutation.isPending || unreadCount === 0}
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </Button>
          </div>
        </div>
      </BookingPanelHeader>
      <BookingPanelContent className="space-y-4">
        {items.length > 0 ? (
          items.map((notification) => (
            <div
              key={notification.id}
              className="rounded-[1.5rem] border border-border/70 bg-background p-5"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary/50 text-primary">
                      <Bell className="h-4 w-4" />
                    </span>
                    {notification.type ? (
                      <Badge
                        className={`rounded-full border-0 px-3 py-1 ${getNotificationTone(notification.type)}`}
                      >
                        {notification.type}
                      </Badge>
                    ) : null}
                    {!notification.isRead ? (
                      <Badge variant="outline" className="rounded-full px-3 py-1 text-primary">
                        New
                      </Badge>
                    ) : null}
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {notification.title || "Notification"}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {notification.body || "Open the related screen for more details."}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>

                {!notification.isRead ? (
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => {
                      void handleMarkOne(notification.id);
                    }}
                    disabled={markAsReadMutation.isPending}
                  >
                    Mark as read
                  </Button>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-border/70 bg-secondary/20 p-8 text-center">
            <p className="text-base font-medium text-foreground">
              No notifications yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Booking updates, payment events, and system reminders will appear
              here.
            </p>
          </div>
        )}
      </BookingPanelContent>
    </BookingPanel>
  );
}
