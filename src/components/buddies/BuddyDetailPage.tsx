"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Clock3,
  Languages,
  LoaderCircle,
  MapPin,
  MessageSquareQuote,
  Sparkles,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDirectBuddyRoomMutation } from "@/features/chat/hooks/useChat";
import { useBuddyDetailQuery, useBuddyReviewsQuery } from "@/features/buddy/hooks/useBuddy";
import type { BuddyProfile, BuddyReview } from "@/features/buddy/type";
import { buildAuthUrl } from "@/lib/callback-url";
import { handleApiError } from "@/lib/error-handler";
import { useAuthStore } from "@/lib/store/authStore";

function getInitials(name?: string | null) {
  const source = name?.trim() || "Buddy";

  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatCurrencyPerHour(value?: number | null) {
  if (typeof value !== "number" || value <= 0) return "Custom pricing";
  return `$${value.toFixed(0)} / hour`;
}

function formatRating(value?: number | null) {
  if (typeof value !== "number" || value <= 0) return "New";
  return value.toFixed(1);
}

function formatDateLabel(value?: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date);
}

function renderStars(rating: number) {
  const rounded = Math.round(Math.max(0, Math.min(5, rating)));

  return Array.from({ length: 5 }).map((_, index) => (
    <Star
      key={index}
      className={`h-4 w-4 ${index < rounded ? "fill-amber-400 text-amber-400" : "text-border"}`}
    />
  ));
}

function ReviewCard({ review }: Readonly<{ review: BuddyReview }>) {
  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-secondary/25 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-foreground">
            {review.reviewerName || "Traveler"}
          </p>
          <div className="mt-2 flex items-center gap-1">
            {renderStars(review.rating)}
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDateLabel(review.createdAt)}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {review.comment || "This traveler left a rating without a written review."}
      </p>
    </div>
  );
}

function BookingIntentCard({ buddy }: Readonly<{ buddy: BuddyProfile }>) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const directBuddyRoomMutation = useDirectBuddyRoomMutation();
  const profileHref = `/buddies/${encodeURIComponent(buddy.id)}`;

  const handleContinue = async () => {
    if (!buddy.userId) {
      toast.error("This buddy cannot be contacted right now.");
      return;
    }

    if (!isAuthenticated) {
      router.push(buildAuthUrl("/login", profileHref));
      return;
    }

    const toastId = toast.loading("Opening direct chat...");

    try {
      const response = await directBuddyRoomMutation.mutateAsync(buddy.userId);
      const roomId = response.data?.id;

      toast.success("Direct chat is ready.", { id: toastId });

      if (roomId) {
        router.push(`/messages?roomId=${encodeURIComponent(roomId)}`);
        return;
      }

      router.push("/messages");
    } catch (error) {
      toast.dismiss(toastId);
      handleApiError(error);
    }
  };

  return (
    <Card className="sticky top-28 overflow-hidden rounded-[2rem] border-border/70 bg-card py-0 shadow-xl">
      <div className="bg-gradient-to-br from-primary to-primary/80 px-6 py-6 text-primary-foreground">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border border-white/30 bg-white/10">
            <AvatarImage src={buddy.profilePicture ?? undefined} alt={buddy.fullName ?? "Buddy"} />
            <AvatarFallback className="bg-white text-primary">
              {getInitials(buddy.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm text-primary-foreground/80">
              Contact directly
            </p>
            <h2 className="truncate text-2xl font-semibold">
              {buddy.fullName || "Local buddy"}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-primary-foreground/85">
              <Star className="h-4 w-4 fill-current" />
              {formatRating(buddy.rate)}
              <span className="text-primary-foreground/60">|</span>
              {formatCurrencyPerHour(buddy.costPerHour)}
            </div>
          </div>
        </div>
      </div>

      <CardContent className="space-y-4 p-6">
        <div className="rounded-[1.5rem] border border-border/70 bg-secondary/25 p-5">
          <p className="text-sm leading-6 text-muted-foreground">
            Open a direct 1:1 chat room with this buddy right away. This flow
            skips the trip request step and lets you start the conversation
            first.
          </p>
        </div>

        <div className="space-y-3 rounded-[1.5rem] border border-border/70 bg-secondary/15 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">Chat type</span>
            <span className="text-sm font-semibold text-foreground">
              Direct 1:1 room
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">Languages</span>
            <span className="text-right text-sm font-medium text-foreground">
              {buddy.languages.length > 0
                ? buddy.languages.join(", ")
                : "To be updated"}
            </span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm text-muted-foreground">Activities</span>
            <span className="text-right text-sm font-medium text-foreground">
              {buddy.activities.length > 0
                ? buddy.activities.join(", ")
                : "Flexible plans"}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-secondary/35 p-4 text-sm text-muted-foreground">
          We will create or reuse an existing direct room for this buddy and
          open the chat immediately.
        </div>

        <Button
          onClick={handleContinue}
          disabled={directBuddyRoomMutation.isPending || !buddy.userId}
          className="h-11 w-full rounded-xl"
        >
          {directBuddyRoomMutation.isPending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              Contact this buddy
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

function BuddyDetailSkeleton() {
  return (
    <section className="min-h-screen bg-background px-4 pb-16 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-6">
          <Skeleton className="h-80 w-full rounded-[2rem]" />
          <Skeleton className="h-40 w-full rounded-[2rem]" />
          <Skeleton className="h-40 w-full rounded-[2rem]" />
          <Skeleton className="h-64 w-full rounded-[2rem]" />
        </div>
        <Skeleton className="h-[38rem] w-full rounded-[2rem]" />
      </div>
    </section>
  );
}

export default function BuddyDetailPage({
  buddyId,
}: Readonly<{ buddyId: string }>) {
  const buddyQuery = useBuddyDetailQuery(buddyId);
  const reviewsQuery = useBuddyReviewsQuery(buddyId, { page: 1, pageSize: 6 });

  if (buddyQuery.isLoading) {
    return <BuddyDetailSkeleton />;
  }

  if (buddyQuery.isError || !buddyQuery.data?.data.id) {
    return (
      <section className="min-h-screen bg-background px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Card className="rounded-[2rem] border-destructive/20 py-0">
            <CardContent className="space-y-4 p-8 text-center">
              <p className="text-lg font-medium text-foreground">Buddy profile not found.</p>
              <p className="text-sm text-muted-foreground">
                The profile may have been removed or is temporarily unavailable.
              </p>
              <Button asChild className="rounded-full">
                <Link href="/buddies">
                  <ArrowLeft className="h-4 w-4" />
                  Back to buddy list
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const buddy = buddyQuery.data.data;
  const reviews = reviewsQuery.data?.data.items ?? [];
  const heroImage = buddy.profilePicture || "/buddies-form-bg.png";

  return (
    <section className="min-h-screen bg-background px-4 pb-16 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Button asChild variant="ghost" className="rounded-full pl-0 text-muted-foreground hover:bg-transparent">
          <Link href="/buddies">
            <ArrowLeft className="h-4 w-4" />
            All buddies
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-6">
            <Card className="overflow-hidden rounded-[2rem] border-border/70 bg-card py-0 shadow-sm">
              <div className="relative h-80">
                <Image
                  src={heroImage}
                  alt={buddy.fullName || "Buddy"}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/15 to-transparent" />
                <div className="absolute left-6 right-6 top-6 flex items-start justify-between gap-3">
                  <Badge className="rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-white backdrop-blur-md">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {buddy.isActive ? "Available for new requests" : "Profile available"}
                  </Badge>
                  <Badge className="rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-white backdrop-blur-md">
                    {formatCurrencyPerHour(buddy.costPerHour)}
                  </Badge>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex items-end gap-4">
                  <Avatar className="h-20 w-20 border-2 border-white/80 bg-white/20 shadow-lg">
                    <AvatarImage src={buddy.profilePicture ?? undefined} alt={buddy.fullName ?? "Buddy"} />
                    <AvatarFallback className="bg-white text-lg text-primary">
                      {getInitials(buddy.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 text-white">
                    <h1 className="truncate text-4xl font-semibold tracking-tight">
                      {buddy.fullName || "Local buddy"}
                    </h1>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/90">
                      <span className="inline-flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-current" />
                        {formatRating(buddy.rate)}
                      </span>
                      {buddy.address ? (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {buddy.address}
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" />
                        Joined {formatDateLabel(buddy.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="space-y-6 p-6">
                <p className="text-base leading-7 text-muted-foreground">
                  {buddy.bio || buddy.aboutMe || "Friendly local buddy ready to build a personalized city experience for travelers."}
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-border/70 bg-secondary/35 p-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Wallet className="h-4 w-4 text-primary" />
                      Hourly rate
                    </div>
                    <p className="mt-3 text-lg font-semibold text-foreground">
                      {formatCurrencyPerHour(buddy.costPerHour)}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-border/70 bg-secondary/35 p-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Languages className="h-4 w-4 text-primary" />
                      Languages
                    </div>
                    <p className="mt-3 text-lg font-semibold text-foreground">
                      {buddy.languages.length > 0 ? buddy.languages.length : 0}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {buddy.languages.length > 0 ? buddy.languages.join(", ") : "To be updated"}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-border/70 bg-secondary/35 p-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Trip styles
                    </div>
                    <p className="mt-3 text-lg font-semibold text-foreground">
                      {buddy.activities.length > 0 ? buddy.activities.length : 0}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {buddy.activities.length > 0 ? buddy.activities.join(", ") : "Flexible plans"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-border/70 bg-card py-0 shadow-sm">
              <CardContent className="space-y-5 p-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Sparkles className="h-5 w-5 text-primary" />
                  What this buddy can help with
                </div>
                {buddy.activities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {buddy.activities.map((activity) => (
                      <Badge
                        key={activity}
                        variant="secondary"
                        className="rounded-full px-4 py-2 text-sm"
                      >
                        {activity}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Activity specialties will appear here once this buddy updates the profile.
                  </p>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-border/70 bg-secondary/25 p-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Languages className="h-4 w-4 text-primary" />
                      Spoken languages
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {buddy.languages.length > 0 ? buddy.languages.join(", ") : "No language list yet."}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-border/70 bg-secondary/25 p-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      Based in
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {buddy.address || "Location details will be shared during planning."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-border/70 bg-card py-0 shadow-sm">
              <CardContent className="space-y-5 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <MessageSquareQuote className="h-5 w-5 text-primary" />
                    Public reviews
                  </div>
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    {reviewsQuery.data?.data.totalCount ?? reviews.length} reviews
                  </Badge>
                </div>

                {reviewsQuery.isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full rounded-[1.75rem]" />
                    <Skeleton className="h-32 w-full rounded-[1.75rem]" />
                  </div>
                ) : null}

                {reviewsQuery.isError ? (
                  <p className="text-sm text-muted-foreground">
                    Reviews are temporarily unavailable.
                  </p>
                ) : null}

                {!reviewsQuery.isLoading && !reviewsQuery.isError ? (
                  reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[1.75rem] border border-dashed border-border/70 bg-secondary/20 p-6 text-sm text-muted-foreground">
                      No public reviews yet. This buddy is still building their track record.
                    </div>
                  )
                ) : null}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <BookingIntentCard buddy={buddy} />

            <Card className="rounded-[2rem] border-border/70 bg-card py-0 shadow-sm">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Users className="h-5 w-5 text-primary" />
                  Contact flow
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3 rounded-2xl bg-secondary/25 p-4">
                    <CalendarDays className="mt-0.5 h-4 w-4 text-primary" />
                    Start from the buddy profile you already reviewed.
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl bg-secondary/25 p-4">
                    <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
                    We create or reopen the direct room linked to this buddy user.
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl bg-secondary/25 p-4">
                    <MessageSquareQuote className="mt-0.5 h-4 w-4 text-primary" />
                    Trip details can be discussed inside chat instead of a separate request first.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
