"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Globe2,
  MapPin,
  MoveRight,
  Sparkles,
  Users,
} from "lucide-react";
import { Timeline } from "@/components/common/timeline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buddiesData } from "@/lib/data/buddies";
import {
  formatBudgetRange,
  formatDurationMinutes,
  formatTripRequestDateTime,
  getLatestTripRequest,
  getBookingStatusMeta,
  type StoredTripRequest,
  advanceBookingStatus,
} from "@/lib/trip-request";

export default function TripRequestSuccessPage() {
  const [request, setRequest] = useState<StoredTripRequest | null>(null);

  useEffect(() => {
    setRequest(getLatestTripRequest());
  }, []);

  const recommendedBuddies = useMemo(() => {
    if (!request) return [];
    return request.recommendedBuddyIds
      .map((buddyId) => buddiesData[buddyId])
      .filter(Boolean)
      .slice(0, 3);
  }, [request]);

  if (!request) {
    return (
      <main className="min-h-screen bg-background px-4 py-16 text-foreground lg:px-8">
        <Card className="mx-auto max-w-3xl rounded-[28px] border border-border bg-card p-8 text-center shadow-xl">
          <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-3xl font-semibold">
            No recent request found
          </h1>
          <p className="mt-3 text-muted-foreground">
            Create a new request first to see the next-step flow and buddy
            suggestions.
          </p>
          <div className="mt-6">
            <Button asChild className="rounded-full px-7">
              <Link href="/trip-request">Create trip request</Link>
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  const statusMeta = getBookingStatusMeta(request.bookingStatus);
  const timelineItems = [
    {
      id: "created",
      title: "Request created",
      description:
        "Trip details are saved and the request is now visible in the matching flow.",
      icon: CheckCircle2,
      status: "completed" as const,
    },
    {
      id: "buddy",
      title: "Buddy review",
      description:
        "Compare suggested buddies and send an invite to the best match.",
      icon: Users,
      status:
        request.bookingStatus === "OPEN" ||
        request.bookingStatus === "PENDING_BUDDY_CONFIRMATION"
          ? ("current" as const)
          : ("completed" as const),
    },
    {
      id: "proposal",
      title: "Proposal and payment",
      description:
        "Once a buddy confirms, align the plan, review the proposal, and complete payment.",
      icon: request.bookingStatus === "PAYMENT_PENDING" ? CreditCard : FileText,
      status:
        request.bookingStatus === "MATCHED" ||
        request.bookingStatus === "PROPOSAL_SENT" ||
        request.bookingStatus === "PAYMENT_PENDING"
          ? ("current" as const)
          : request.bookingStatus === "CONFIRMED" ||
              request.bookingStatus === "IN_PROGRESS" ||
              request.bookingStatus === "COMPLETED"
            ? ("completed" as const)
            : ("upcoming" as const),
    },
    {
      id: "confirmed",
      title: "Trip confirmed",
      description:
        "The booking is locked in and the trip can move toward the scheduled date.",
      icon: Sparkles,
      status:
        request.bookingStatus === "CONFIRMED" ||
        request.bookingStatus === "IN_PROGRESS"
          ? ("current" as const)
          : request.bookingStatus === "COMPLETED"
            ? ("completed" as const)
            : ("upcoming" as const),
    },
  ];

  const handleWaitForMoreBuddies = () => {
    const updated = advanceBookingStatus(
      "OPEN",
      "The user decided to keep the request open for more buddy applications.",
    );

    if (updated) {
      setRequest(updated);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f5fbfa_0%,#ffffff_40%,#fff8f1_100%)] text-foreground">
      {/* <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="rounded-[28px] bg-[#12372a] px-6 py-8 text-white shadow-xl md:px-10 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Request created
              </p>
              <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
                The request is live. Next step: review suggested buddies.
              </h1>
              <p className="mt-4 text-sm text-white/80 md:text-base">
                Request ID: {request.id}. Created at {formatTripRequestDateTime(request.createdAt)}.
              </p>
            </div>

            <Button asChild variant="secondary" className="rounded-full px-7">
              <Link href="/trip-request/buddies">
                View suggested buddies
                <MoveRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section> */}

      <section className="mx-auto max-w-7xl px-4 py-10 pb-8 lg:px-8">
        <Card className="rounded-[24px] border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Request timeline
            </p>
            <h2 className="text-2xl font-semibold">What happens next</h2>
          </div>
          <Timeline className="mt-6" items={timelineItems} />
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <Card className="rounded-[24px] border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Current status
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    {statusMeta.label}
                  </h2>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Active
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {statusMeta.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full px-6"
                  onClick={handleWaitForMoreBuddies}
                >
                  Wait for more buddy apply
                </Button>
                <Button asChild className="rounded-full px-6">
                  <Link href="/trip-request/details">View request details</Link>
                </Button>
              </div>
            </Card>

            <Card className="rounded-[24px] border border-border bg-card p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Trip summary
              </p>

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-border p-4">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    City
                  </p>
                  <p className="mt-2 font-medium">{request.city}</p>
                </div>
                <div className="rounded-2xl border border-border p-4">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Start time
                  </p>
                  <p className="mt-2 font-medium">
                    {formatTripRequestDateTime(request.startTime)}
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-border p-4">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock3 className="h-4 w-4 text-primary" />
                      Duration
                    </p>
                    <p className="mt-2 font-medium">
                      {formatDurationMinutes(request.durationMinutes)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border p-4">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      Group size
                    </p>
                    <p className="mt-2 font-medium">
                      {request.groupSize} people
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-border p-4">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe2 className="h-4 w-4 text-primary" />
                      Preferred language
                    </p>
                    <p className="mt-2 font-medium">
                      {request.preferredLanguage}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border p-4">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Budget
                    </p>
                    <p className="mt-2 font-medium">
                      {formatBudgetRange(request.budgetMin, request.budgetMax)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Suggested buddies
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Review and choose one buddy for this request
              </h2>
            </div>

            {recommendedBuddies.map((buddy) => (
              <Card
                key={buddy.id}
                className="rounded-[24px] border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row">
                  <img
                    src={buddy.buddyImage || "/placeholder-user.png"}
                    alt={buddy.buddy}
                    className="h-28 w-28 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{buddy.buddy}</h3>
                        <p className="text-sm text-muted-foreground">
                          {buddy.location}
                        </p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        {buddy.buddyRating} stars
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {buddy.buddyBio}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button asChild className="rounded-full px-5">
                        <Link href={`/buddies/${buddy.id}`}>View profile</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <div className="pt-2">
              <Button asChild variant="outline" className="rounded-full px-6">
                <Link href="/trip-request/buddies">
                  Show more
                  <MoveRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
