"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyTravelerBookingsQuery } from "@/features/booking/hooks/useCreateBookingOffer";
import {
  useChatRooms,
  useChatUnreadSummary,
} from "@/features/chat/hooks/useChat";
import {
  useNotificationUnreadCount,
  useNotifications,
} from "@/features/notification/hooks/useNotifications";
import { useMyTrips } from "@/features/trip/hooks/useTripRequest";
import { useUserProfile } from "@/features/user/hooks/useUserProfile";

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.split("@")[0] || "U";

  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(value?: string | null) {
  if (!value) return "Not updated yet";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not updated yet";

  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date);
}

function formatRelativeTime(value?: string | null) {
  if (!value) return "No recent activity";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No recent activity";

  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(value);
}

function OverviewSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,1fr)]">
        <Card className="rounded-[1.75rem] border-border/70 py-0">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-start">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="min-w-0 flex-1 space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-16 w-full rounded-2xl" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="rounded-[1.75rem] border-border/70 py-0"
            >
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-10 w-10 rounded-2xl" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <Card className="rounded-[1.75rem] border-border/70 py-0">
          <CardContent className="space-y-3 p-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full rounded-2xl" />
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-[1.75rem] border-border/70 py-0">
            <CardContent className="space-y-3 p-6">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
            </CardContent>
          </Card>
          <Card className="rounded-[1.75rem] border-border/70 py-0">
            <CardContent className="space-y-3 p-6">
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getBookingStatusClasses(status?: string | null) {
  switch (status) {
    case "Confirmed":
    case "Completed":
    case "In Progress":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "PendingPayment":
    case "PendingCustomerConfirm":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "Cancelled":
    case "CancelledByTimeout":
    case "Expired":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-border/70 bg-secondary/50 text-muted-foreground";
  }
}

export function ProfileOverviewSection() {
  const profileQuery = useUserProfile();
  const bookingsQuery = useMyTravelerBookingsQuery();
  const tripsQuery = useMyTrips({ Page: 1, PageSize: 3 });
  const roomsQuery = useChatRooms();
  const chatUnreadQuery = useChatUnreadSummary();
  const notificationsQuery = useNotifications({ page: 1, pageSize: 3 });
  const notificationUnreadQuery = useNotificationUnreadCount();

  if (profileQuery.isLoading) {
    return <OverviewSkeleton />;
  }

  if (profileQuery.isError || !profileQuery.data?.data) {
    return (
      <Card className="rounded-[1.75rem] border-destructive/20 py-0">
        <CardContent className="p-6 text-sm text-destructive">
          Unable to load your profile dashboard right now.
        </CardContent>
      </Card>
    );
  }

  const profile = profileQuery.data.data;
  const bookings = bookingsQuery.data?.data.items ?? [];
  const trips = tripsQuery.data?.data.items ?? [];
  const rooms = roomsQuery.data?.data ?? [];
  const notifications = notificationsQuery.data?.data.items ?? [];
  const totalBookings = bookingsQuery.data?.data.totalCount ?? 0;
  const totalTrips = tripsQuery.data?.data.totalCount ?? 0;
  const unreadMessages = chatUnreadQuery.data?.data.totalUnread ?? 0;
  const unreadNotifications =
    notificationUnreadQuery.data?.data.unreadCount ?? 0;

  const statCards = [
    {
      label: "Bookings",
      value: totalBookings,
      icon: CalendarClock,
      href: "/profile?section=bookings",
      tone: "bg-[#fff6df] text-[#8a6a18]",
    },
    {
      label: "Trips",
      value: totalTrips,
      icon: BookOpen,
      href: "/profile?section=trips",
      tone: "bg-[#eef6ff] text-[#1d4e89]",
    },
    {
      label: "Unread messages",
      value: unreadMessages,
      icon: MessageCircle,
      href: "/messages",
      tone: "bg-[#eefbf6] text-[#18794e]",
    },
    {
      label: "Notifications",
      value: unreadNotifications,
      icon: Bell,
      href: "/profile?section=notifications",
      tone: "bg-[#fff0ef] text-[#b33a32]",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,1fr)]">
        <Card className="overflow-hidden rounded-[1.75rem] border-border/70 bg-card py-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
              <Avatar className="h-24 w-24 border border-white/80 shadow-sm">
                <AvatarImage
                  src={profile.profilePicture ?? undefined}
                  alt={profile.fullName ?? "Profile"}
                />
                <AvatarFallback className="bg-white text-lg font-semibold text-primary">
                  {getInitials(profile.fullName, profile.email)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1 space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* <Badge className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-primary">
                      Traveler profile
                    </Badge> */}
                    {profile.isEmailVerified ? (
                      <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                        Verified
                      </Badge>
                    ) : null}
                  </div>

                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                      {profile.fullName || "Your profile"}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        {profile.email || "No email"}
                      </span>
                      {/* <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {profile.address?.trim() || "Add your location"}
                      </span> */}
                    </div>
                  </div>

                  <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                    {profile.aboutMe?.trim() ||
                      "Build trust with buddies by adding a short introduction, travel preferences, and a little context about how you like to explore a city."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(profile.roles?.length ? profile.roles : ["User"]).map(
                    (role) => (
                      <Badge
                        key={role}
                        variant="secondary"
                        className="rounded-full border border-border/60 bg-secondary/50 px-3 py-1"
                      >
                        <ShieldCheck className="mr-1 h-3.5 w-3.5 text-primary" />
                        {role}
                      </Badge>
                    ),
                  )}
                </div>

                {/* <div className="flex flex-wrap gap-3">
                  <Button asChild className="rounded-xl">
                    <Link href="/profile?section=personal">
                      Edit personal info
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-xl">
                    <Link href="/profile?section=bookings">View bookings</Link>
                  </Button>
                </div> */}

                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground/80">
                      Member since
                    </p>
                    <p className="mt-2 font-medium text-foreground">
                      {formatDate(profile.createdAt)}
                    </p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground/80">
                      Last profile update
                    </p>
                    <p className="mt-2 font-medium text-foreground">
                      {formatDate(profile.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <Card
                key={card.label}
                className="rounded-[1.75rem] border-border/70 py-0"
              >
                <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-2xl ${card.tone}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="rounded-xl px-2 text-primary"
                    >
                      <Link href={card.href}>Open</Link>
                    </Button>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold text-foreground">
                      {card.value}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {card.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader className="border-b border-border/70">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xl">Travel activity</CardTitle>
                <CardDescription>
                  Keep an eye on recent bookings and trip requests from one
                  place.
                </CardDescription>
              </div>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/profile?section=bookings">All bookings</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {bookings.length > 0 ? (
              bookings.slice(0, 3).map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-border/70 bg-secondary/20 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`rounded-full px-3 py-1 ${getBookingStatusClasses(
                            booking.statusName || booking.status,
                          )}`}
                        >
                          {booking.statusName || booking.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(booking.createdAt)}
                        </span>
                      </div>
                      <p className="text-base font-semibold text-foreground">
                        {booking.buddyName || "Local buddy booking"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.bookedDate} at{" "}
                        {booking.bookedStartTime?.slice(0, 5)}
                        {" · "}
                        {booking.bookedDurationHours}h
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-lg font-semibold text-foreground">
                        {booking.totalAmount} {booking.currency}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 bg-secondary/20 p-6 text-sm text-muted-foreground">
                You do not have any bookings yet. Once you confirm a local
                buddy, the trip agreement and payment status will appear here.
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <BookOpen className="h-4 w-4 text-primary" />
                Recent trips
              </div>
              <div className="mt-4">
                <div className="mt-4 space-y-3">
                  {trips.length > 0 ? (
                    trips.map((trip) => {
                      const preferredLanguages = trip.preferredLanguages ?? [];

                      return (
                        <div
                          key={trip.id}
                          className="rounded-2xl border border-border/70 bg-secondary/30 p-4"
                        >
                          <p className="font-medium text-foreground">
                            {trip.city}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Starts {trip.startDate} at{" "}
                            {trip.startTime.slice(0, 5)}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {preferredLanguages.length > 0
                              ? preferredLanguages.join(", ")
                              : "No language preference"}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No trips created yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="border-b border-border/70">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-xl">Messages</CardTitle>
                  <CardDescription>
                    Quick pulse on active conversations with buddies.
                  </CardDescription>
                </div>
                <Badge className="bg-primary/10 px-3 py-1 text-primary">
                  {unreadMessages} unread
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {rooms.length > 0 ? (
                rooms.slice(0, 3).map((room) => (
                  <div
                    key={room.id}
                    className="border border-border/70 bg-secondary/20 p-4"
                  >
                    <p className="font-medium text-foreground">
                      {room.otherUserName || "Conversation"}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {room.lastMessage || "No messages yet"}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatRelativeTime(room.lastMessageAt)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border/70 bg-secondary/20 p-4 text-sm text-muted-foreground">
                  No conversations yet.
                </div>
              )}
            </CardContent>
            <Button
              asChild
              variant="outline"
              className="rounded-xl w-1/2 mx-auto"
            >
              <Link href="/messages">Open inbox</Link>
            </Button>
          </Card>

          <Card className="rounded-[1.75rem] border-border/70">
            <CardHeader className="border-b border-border/70">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-xl">Notifications</CardTitle>
                  <CardDescription>
                    Recent account and travel activity alerts.
                  </CardDescription>
                </div>
                <Badge className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                  {unreadNotifications} unread
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="border border-border/70  bg-secondary/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">
                          {notification.title || "Notification"}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {notification.body ||
                            "Open your notification center to see more details."}
                        </p>
                      </div>
                      {!notification.isRead ? (
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border/70 bg-secondary/20 p-4 text-sm text-muted-foreground">
                  No notifications yet.
                </div>
              )}
            </CardContent>
            <Button
              asChild
              variant="outline"
              className="w-1/2 rounded-xl mx-auto"
            >
              <Link href="/profile?section=notifications">
                View notifications
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
