"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, FileText, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  acceptBuddyInvitation,
  ACTIVE_BUDDY_ID,
  applyToBuddyRequest,
  declineBuddyInvitation,
  getBuddyAppliedRequestIds,
  getBuddyRequestById,
} from "@/lib/buddy-flow";
import {
  formatBudgetRange,
  formatDurationMinutes,
  formatTripRequestDateTime,
  getLatestTripRequest,
} from "@/lib/trip-request";

export default function BuddyRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const request = useMemo(() => getBuddyRequestById(params.id), [params.id]);
  const latest = getLatestTripRequest();
  const [applied, setApplied] = useState(() => getBuddyAppliedRequestIds().includes(params.id));
  const isInvitation =
    latest?.id === params.id &&
    latest.selectedBuddyId === ACTIVE_BUDDY_ID &&
    latest.bookingStatus === "PENDING_BUDDY_CONFIRMATION";

  if (!request) {
    return (
      <main className="min-h-screen bg-background px-4 py-16 lg:px-8">
        <Card className="mx-auto max-w-3xl rounded-[28px] p-8 text-center shadow-xl">
          <h1 className="text-3xl font-semibold">Request not found</h1>
          <div className="mt-6">
            <Button asChild className="rounded-full px-7">
              <Link href="/buddy-requests">Back to requests</Link>
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf3_0%,#ffffff_45%,#f5fbfa_100%)] text-foreground">
      <section className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Buddy request detail</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-5xl">{request.city}</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Review the full request payload, then apply or respond to the invitation.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full px-5">
            <Link href="/buddy-requests">Back to list</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-semibold">Customer request payload</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">City</p><p className="mt-3 font-semibold">{request.city}</p></div>
                <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Start time</p><p className="mt-3 font-semibold">{formatTripRequestDateTime(request.startTime)}</p></div>
                <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Duration</p><p className="mt-3 font-semibold">{formatDurationMinutes(request.durationMinutes)}</p></div>
                <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Group size</p><p className="mt-3 font-semibold">{request.groupSize}</p></div>
                <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Language</p><p className="mt-3 font-semibold">{request.preferredLanguage}</p></div>
                <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Budget range</p><p className="mt-3 font-semibold">{formatBudgetRange(request.budgetMin, request.budgetMax)}</p></div>
              </div>
              <div className="mt-4 rounded-3xl border border-border p-5">
                <p className="text-sm text-muted-foreground">Meeting point</p>
                <p className="mt-3 font-semibold">{request.meetingPoint}</p>
              </div>
              <div className="mt-4 rounded-3xl border border-border p-5">
                <p className="text-sm text-muted-foreground">Customer notes</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{request.notes || "No extra notes."}</p>
              </div>
            </Card>

            <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Rough itinerary</h2>
              </div>
              <div className="mt-5 space-y-3">
                {request.roughAgenda.map((item) => (
                  <div key={item} className="rounded-3xl border border-border p-4 text-sm text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">Action</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {isInvitation ? (
                  <>
                    <Button
                      className="rounded-full px-5"
                      onClick={() => {
                        acceptBuddyInvitation();
                        router.push("/buddy-chat");
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Accept request
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full px-5"
                      onClick={() => {
                        declineBuddyInvitation();
                        router.push("/buddy-dashboard");
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                      Decline
                    </Button>
                  </>
                ) : (
                  <Button
                    className="rounded-full px-5"
                    variant={applied ? "outline" : "default"}
                    disabled={applied}
                    onClick={() => {
                      applyToBuddyRequest(request.id);
                      setApplied(true);
                    }}
                  >
                    {applied ? "Applied" : "Apply"}
                  </Button>
                )}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  Source: {request.source}
                </Badge>
                {isInvitation && (
                  <Badge className="rounded-full px-3 py-1">Invitation received</Badge>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
