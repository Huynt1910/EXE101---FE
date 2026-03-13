"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  advanceBookingStatus,
  formatDurationMinutes,
  formatTripRequestDateTime,
  getLatestTripRequest,
} from "@/lib/trip-request";
import { buddiesData } from "@/lib/data/buddies";

export default function ProposalPage() {
  const router = useRouter();
  const request = getLatestTripRequest();
  const buddy = request?.selectedBuddyId ? buddiesData[request.selectedBuddyId] : null;

  if (!request || !buddy || !request.proposal) {
    return (
      <main className="min-h-screen bg-background px-4 py-16 lg:px-8"><Card className="mx-auto max-w-3xl rounded-[28px] p-8 text-center shadow-xl"><h1 className="text-3xl font-semibold">Proposal not available</h1><div className="mt-6"><Button asChild className="rounded-full px-7"><Link href="/booking-hub">Back to booking</Link></Button></div></Card></main>
    );
  }

  const proposal = request.proposal;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf3_0%,#ffffff_45%,#f5fbfa_100%)] text-foreground">
      <section className="mx-auto max-w-5xl px-4 py-8 lg:px-8 lg:py-10">
        <Card className="rounded-[32px] border border-border bg-card p-6 shadow-sm md:p-8">
          <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Proposal</p>
          <h1 className="mt-2 text-3xl font-semibold md:text-5xl">Review the proposed trip plan</h1>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Buddy</p><p className="mt-3 text-lg font-semibold">{buddy.buddy}</p></div>
            <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Final price</p><p className="mt-3 text-lg font-semibold">${proposal.finalPrice}</p></div>
            <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Start time</p><p className="mt-3 text-lg font-semibold">{formatTripRequestDateTime(proposal.startTime)}</p></div>
            <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Duration</p><p className="mt-3 text-lg font-semibold">{formatDurationMinutes(proposal.durationMinutes)}</p></div>
            <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Meeting point</p><p className="mt-3 text-lg font-semibold">{proposal.meetingPoint}</p></div>
            <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Participants</p><p className="mt-3 text-lg font-semibold">{proposal.groupSize}</p></div>
            <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Language</p><p className="mt-3 text-lg font-semibold">{proposal.preferredLanguage}</p></div>
            <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Cancellation policy</p><p className="mt-3 text-lg font-semibold">{proposal.cancellationPolicy}</p></div>
          </div>
          <div className="mt-4 grid gap-4">
            <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Itinerary summary</p><p className="mt-3 text-sm leading-6">{proposal.itinerarySummary}</p></div>
            <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Notes</p><p className="mt-3 text-sm leading-6">{proposal.notes}</p></div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button className="rounded-full px-6" onClick={() => { advanceBookingStatus("PAYMENT_PENDING", "Proposal accepted and waiting for payment."); router.push("/booking-payment"); }}>Agree and pay</Button>
            <Button variant="outline" className="rounded-full px-6" onClick={() => { advanceBookingStatus("MATCHED", "User requested edits on the proposal and returned to inbox."); router.push("/inbox"); }}>Request changes</Button>
            <Button variant="outline" className="rounded-full px-6" onClick={() => { advanceBookingStatus("PROPOSAL_REJECTED", "The proposal was rejected by the customer."); router.push("/booking-hub"); }}>Reject proposal</Button>
          </div>
        </Card>
      </section>
    </main>
  );
}
