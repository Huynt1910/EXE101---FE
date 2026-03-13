"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Globe2,
  MapPin,
  PencilLine,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buddiesData } from "@/lib/data/buddies";
import {
  formatBudgetRange,
  formatDurationMinutes,
  formatTripRequestDateTime,
  getLatestTripRequest,
  getBookingStatusMeta,
  saveTripRequestDraft,
  type StoredTripRequest,
} from "@/lib/trip-request";

export default function TripRequestDetailsPage() {
  const router = useRouter();
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
      <main className="min-h-screen bg-background px-4 py-16 lg:px-8">
        <Card className="mx-auto max-w-3xl rounded-[28px] p-8 text-center shadow-xl">
          <h1 className="text-3xl font-semibold">No request available</h1>
          <p className="mt-3 text-muted-foreground">
            Create a request first, then this page will show the latest request details.
          </p>
          <div className="mt-6">
            <Button asChild className="rounded-full px-7">
              <Link href="/trip-request">Create request</Link>
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  const statusMeta = getBookingStatusMeta(request.bookingStatus);

  const handleEditRequest = () => {
    saveTripRequestDraft({
      city: request.city,
      startTime: request.startTime,
      durationMinutes: request.durationMinutes,
      groupSize: request.groupSize,
      preferredLanguage: request.preferredLanguage,
      budgetMin: request.budgetMin,
      budgetMax: request.budgetMax,
      meetingPoint: request.meetingPoint,
      notes: request.notes,
    });
    router.push("/trip-request");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8fcfb_45%,#fff9f2_100%)] text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Request details</p>
                  <h1 className="mt-2 text-3xl font-semibold">{request.id}</h1>
                  <p className="mt-3 text-sm text-muted-foreground">Created at {formatTripRequestDateTime(request.createdAt)}</p>
                </div>
                <Button type="button" variant="outline" className="rounded-full px-6" onClick={handleEditRequest}>
                  <PencilLine className="h-4 w-4" />Edit request
                </Button>
              </div>

              <div className="mt-6 rounded-3xl border border-border bg-muted/30 p-5">
                <p className="text-sm text-muted-foreground">Current status</p>
                <p className="mt-2 text-xl font-semibold">{statusMeta.label}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{statusMeta.description}</p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-border p-5"><p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-primary" />City</p><p className="mt-3 text-lg font-semibold">{request.city}</p></div>
                <div className="rounded-3xl border border-border p-5"><p className="flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="h-4 w-4 text-primary" />Start time</p><p className="mt-3 text-lg font-semibold">{formatTripRequestDateTime(request.startTime)}</p></div>
                <div className="rounded-3xl border border-border p-5"><p className="flex items-center gap-2 text-sm text-muted-foreground"><Clock3 className="h-4 w-4 text-primary" />Duration</p><p className="mt-3 text-lg font-semibold">{formatDurationMinutes(request.durationMinutes)}</p></div>
                <div className="rounded-3xl border border-border p-5"><p className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4 text-primary" />Group size</p><p className="mt-3 text-lg font-semibold">{request.groupSize} people</p></div>
                <div className="rounded-3xl border border-border p-5"><p className="flex items-center gap-2 text-sm text-muted-foreground"><Globe2 className="h-4 w-4 text-primary" />Preferred language</p><p className="mt-3 text-lg font-semibold">{request.preferredLanguage}</p></div>
                <div className="rounded-3xl border border-border p-5"><p className="flex items-center gap-2 text-sm text-muted-foreground"><Sparkles className="h-4 w-4 text-primary" />Budget</p><p className="mt-3 text-lg font-semibold">{formatBudgetRange(request.budgetMin, request.budgetMax)}</p></div>
              </div>

              <div className="mt-4 grid gap-4">
                <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Meeting point</p><p className="mt-3 text-lg font-semibold">{request.meetingPoint}</p></div>
                <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Notes</p><p className="mt-3 whitespace-pre-line text-sm leading-6">{request.notes || "No extra notes."}</p></div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Suggested buddies</p>
              <h2 className="mt-2 text-2xl font-semibold">{recommendedBuddies.length} buddies currently match this request</h2>

              <div className="mt-5 space-y-4">
                {recommendedBuddies.map((buddy) => (
                  <div key={buddy.id} className="rounded-3xl border border-border p-4">
                    <div className="flex items-center gap-3">
                      <img src={buddy.buddyImage || "/placeholder-user.png"} alt={buddy.buddy} className="h-14 w-14 rounded-2xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{buddy.buddy}</p>
                        <p className="truncate text-sm text-muted-foreground">{buddy.location}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button asChild className="rounded-full px-5"><Link href={`/buddies/${buddy.id}`}>View profile</Link></Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}