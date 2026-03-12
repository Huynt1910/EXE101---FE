"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  DollarSign,
  MapPin,
  MoveRight,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buddiesData } from "@/lib/data/buddies";
import { getLatestTripRequest, type StoredTripRequest } from "@/lib/trip-request";

function formatDate(value: string) {
  if (!value) return "Not provided";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function TripRequestSuccessPage() {
  const [request, setRequest] = useState<StoredTripRequest | null>(null);

  useEffect(() => {
    setRequest(getLatestTripRequest());
  }, []);

  const recommendedBuddies = useMemo(() => {
    if (!request) return [];
    return request.recommendedBuddyIds
      .map((buddyId) => buddiesData[buddyId])
      .filter(Boolean);
  }, [request]);

  if (!request) {
    return (
      <main className="min-h-screen bg-background px-4 py-16 text-foreground lg:px-8">
        <Card className="mx-auto max-w-3xl rounded-[28px] border border-border bg-card p-8 text-center shadow-xl">
          <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-3xl font-semibold">No recent trip request found</h1>
          <p className="mt-3 text-muted-foreground">
            Create a new request first, then this page will show your latest
            submission and suggested buddies.
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="rounded-[28px] bg-primary px-6 py-8 text-primary-foreground shadow-xl md:px-10 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs uppercase tracking-[0.18em]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Request submitted successfully
              </p>
              <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
                Your trip request is ready and buddy suggestions are waiting below
              </h1>
              <p className="mt-4 text-sm text-primary-foreground/90 md:text-base">
                Request ID: {request.id}. Submitted on {formatDate(request.createdAt)}.
              </p>
            </div>

            <Button asChild variant="secondary" className="rounded-full px-7">
              <Link href="/trip-request">
                Create another request
                <MoveRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-[24px] border border-border bg-card p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Latest request
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {request.destination || "Destination to be confirmed"}
                </h2>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-border p-4">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    Departure city
                  </p>
                  <p className="mt-2 font-medium">
                    {request.departureCity || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl border border-border p-4">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    Travelers
                  </p>
                  <p className="mt-2 font-medium">{request.travelers}</p>
                </div>

                <div className="rounded-2xl border border-border p-4">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Travel window
                  </p>
                  <p className="mt-2 font-medium">
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                  </p>
                </div>

                <div className="rounded-2xl border border-border p-4">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Budget range
                  </p>
                  <p className="mt-2 font-medium">
                    {request.budgetRange || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-border p-4">
                <p className="text-sm text-muted-foreground">Travel styles</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {request.travelStyles.length > 0 ? (
                    request.travelStyles.map((style) => (
                      <span
                        key={style}
                        className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
                      >
                        {style}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No style selected
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border p-4">
                <p className="text-sm text-muted-foreground">Additional notes</p>
                <p className="mt-2 whitespace-pre-line text-sm leading-6">
                  {request.notes || "No additional notes."}
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Suggested buddies
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Best matches for this request
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

                      <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        <Star className="h-4 w-4 fill-current" />
                        {buddy.buddyRating} ({buddy.buddyReviews} reviews)
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {buddy.buddyBio}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {buddy.highlights.slice(0, 3).map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
