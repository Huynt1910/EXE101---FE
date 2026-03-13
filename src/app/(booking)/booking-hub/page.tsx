"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  CircleEllipsis,
  Clock3,
  CreditCard,
  FileText,
  MessageCircle,
  MoveRight,
  Sparkles,
  Users,
} from "lucide-react";
import { Timeline } from "@/components/common/timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buddiesData } from "@/lib/data/buddies";
import { getBuddyMeta } from "@/lib/buddy-profile";
import {
  advanceBookingStatus,
  formatBudgetRange,
  formatDurationMinutes,
  formatTripRequestDateTime,
  getBookingStatusMeta,
  getLatestTripRequest,
} from "@/lib/trip-request";

export default function BookingHubPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const request = getLatestTripRequest();
  const buddy = request?.selectedBuddyId ? buddiesData[request.selectedBuddyId] : null;
  const statusMeta = useMemo(() => (request ? getBookingStatusMeta(request.bookingStatus) : null), [request]);
  const waitingPopup = searchParams.get("popup") === "waiting";

  if (!request) {
    return (
      <main className="booking-page px-4 py-16 lg:px-8"><Card className="booking-card-empty"><h1 className="text-3xl font-semibold">No booking found</h1><p className="mt-3 text-muted-foreground">Create a trip request first, then booking details will appear here.</p><div className="mt-6"><Button asChild className="rounded-full px-7"><Link href="/trip-request">Create request</Link></Button></div></Card></main>
    );
  }

  const actionsByStatus = {
    OPEN: <Button asChild className="rounded-full px-6"><Link href="/trip-request/buddies">View suggested buddies</Link></Button>,
    PENDING_BUDDY_CONFIRMATION: (
      <div className="flex flex-wrap gap-3">
        <Button className="rounded-full px-6" onClick={() => { advanceBookingStatus("MATCHED", "Buddy confirmed the invitation. Chat is now open in inbox."); router.push("/inbox"); }}>Mark buddy confirmed</Button>
        <Button asChild variant="outline" className="rounded-full px-6"><Link href="/trip-request/buddies">Choose another buddy</Link></Button>
      </div>
    ),
    MATCHED: (
      <div className="flex flex-wrap gap-3">
        <Button asChild className="rounded-full px-6"><Link href="/inbox">Open chat</Link></Button>
        <Button variant="outline" className="rounded-full px-6" onClick={() => { advanceBookingStatus("PROPOSAL_SENT", "A proposal was sent after the initial chat."); router.push("/booking-proposal"); }}>Send proposal</Button>
      </div>
    ),
    PROPOSAL_SENT: <Button asChild className="rounded-full px-6"><Link href="/booking-proposal">View proposal</Link></Button>,
    PAYMENT_PENDING: <Button asChild className="rounded-full px-6"><Link href="/booking-payment">Pay now</Link></Button>,
    CONFIRMED: (
      <div className="flex flex-wrap gap-3">
        <Button asChild className="rounded-full px-6"><Link href="/inbox">Open chat</Link></Button>
        <Button variant="outline" className="rounded-full px-6" onClick={() => advanceBookingStatus("IN_PROGRESS")}>Mark trip in progress</Button>
      </div>
    ),
    IN_PROGRESS: <Button className="rounded-full px-6" onClick={() => advanceBookingStatus("COMPLETED")}>Mark completed</Button>,
    COMPLETED: <Button variant="outline" className="rounded-full px-6">Leave review</Button>,
    PROPOSAL_REJECTED: (
      <div className="flex flex-wrap gap-3">
        <Button asChild className="rounded-full px-6"><Link href="/inbox">Back to chat</Link></Button>
        <Button asChild variant="outline" className="rounded-full px-6"><Link href="/trip-request/buddies">Re-open shortlist</Link></Button>
      </div>
    ),
  } as const;

  const timelineConfig = [
    {
      id: "created",
      title: "Create request",
      fallbackDescription: "Your trip request is created and ready for the next step.",
      icon: CheckCircle2,
      matches: ["Request created"],
      status: "completed" as const,
    },
    {
      id: "match-buddy",
      title: "Match your buddy",
      fallbackDescription: "Choose a buddy and connect with them in inbox to start planning.",
      icon: Users,
      matches: ["Buddy selected", "Buddy confirmed"],
      status:
        request.bookingStatus === "OPEN"
          || request.bookingStatus === "PENDING_BUDDY_CONFIRMATION"
          ? ("current" as const)
          : request.bookingStatus === "MATCHED" ||
              request.bookingStatus === "PROPOSAL_SENT" ||
              request.bookingStatus === "PAYMENT_PENDING" ||
              request.bookingStatus === "CONFIRMED" ||
              request.bookingStatus === "IN_PROGRESS" ||
              request.bookingStatus === "COMPLETED"
            ? ("completed" as const)
            : ("upcoming" as const),
    },
    {
      id: "review-proposal",
      title: "Review proposal",
      fallbackDescription: "The proposal is sent in inbox and the customer confirms or rejects it there.",
      icon: FileText,
      matches: ["Proposal sent", "Payment pending"],
      status:
        request.bookingStatus === "MATCHED" ||
        request.bookingStatus === "PROPOSAL_SENT"
          ? ("current" as const)
          : request.bookingStatus === "PAYMENT_PENDING" ||
              request.bookingStatus === "CONFIRMED" ||
              request.bookingStatus === "IN_PROGRESS" ||
              request.bookingStatus === "COMPLETED"
            ? ("completed" as const)
            : ("upcoming" as const),
    },
    {
      id: "payment",
      title: "Complete payment",
      fallbackDescription: "After proposal confirmation, payment unlocks the final booking.",
      icon: CreditCard,
      matches: ["Payment pending", "Trip confirmed"],
      status:
        request.bookingStatus === "PAYMENT_PENDING"
          ? ("current" as const)
          : request.bookingStatus === "CONFIRMED" ||
              request.bookingStatus === "IN_PROGRESS" ||
              request.bookingStatus === "COMPLETED"
            ? ("completed" as const)
            : ("upcoming" as const),
    },
    {
      id: "during-trip",
      title: "During a trip",
      fallbackDescription: "The trip is happening and both sides can keep coordinating in inbox.",
      icon: Clock3,
      matches: ["Trip in progress", "Trip completed"],
      status:
        request.bookingStatus === "IN_PROGRESS"
          ? ("current" as const)
          : request.bookingStatus === "COMPLETED"
            ? ("completed" as const)
            : ("upcoming" as const),
    },
    {
      id: "complete-feedback",
      title: "Complete and feedback",
      fallbackDescription: "The trip is complete and the customer can leave feedback.",
      icon: Sparkles,
      matches: ["Trip completed"],
      status:
        request.bookingStatus === "COMPLETED"
          ? ("current" as const)
          : ("upcoming" as const),
    },
  ];

  const timelineItems = timelineConfig.map((step) => {
    const matchedEvent = request.timeline.find((item) =>
      step.matches.includes(item.title),
    );

    return {
      id: step.id,
      title: step.title,
      description: matchedEvent?.description ?? step.fallbackDescription,
      icon: step.icon,
      status: step.status,
    };
  });

  return (
    <main className="booking-page">
      <section className="booking-section">
        {waitingPopup && request.bookingStatus === "PENDING_BUDDY_CONFIRMATION" && (
          <Card className="mb-6 rounded-[24px] border border-amber-200 bg-amber-50 p-4 shadow-sm"><p className="text-sm font-medium text-amber-900">Waiting for buddy confirmation</p><p className="mt-1 text-sm text-amber-800">The invitation was sent successfully. The current status is pending buddy confirmation.</p></Card>
        )}

        <Card className="booking-card-large mb-6">
          <div className="flex items-center gap-2"><CircleEllipsis className="h-5 w-5 text-primary" /><h2 className="text-2xl font-semibold">Customer journey</h2></div>
          <p className="mt-2 text-sm text-muted-foreground">
            This timeline tracks which step the customer is currently in across the booking flow.
          </p>
          <Timeline className="mt-5" items={timelineItems} />
        </Card>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <Card className="booking-card-large">
              <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Booking hub</p>
              <h1 className="mt-2 text-3xl font-semibold md:text-5xl">{request.id}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-3"><Badge className="rounded-full px-3 py-1">{statusMeta?.label}</Badge><Badge variant="outline" className="rounded-full px-3 py-1">Payment: {request.paymentStatus}</Badge></div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{statusMeta?.description}</p>
              <div className="mt-6">{actionsByStatus[request.bookingStatus]}</div>
            </Card>

            <Card className="booking-card-large">
              <h2 className="text-2xl font-semibold">Request summary</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">City</p><p className="mt-3 font-semibold">{request.city}</p></div>
                <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Start time</p><p className="mt-3 font-semibold">{formatTripRequestDateTime(request.startTime)}</p></div>
                <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Duration</p><p className="mt-3 font-semibold">{formatDurationMinutes(request.durationMinutes)}</p></div>
                <div className="rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Budget</p><p className="mt-3 font-semibold">{formatBudgetRange(request.budgetMin, request.budgetMax)}</p></div>
              </div>
              <div className="mt-4 rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Meeting point</p><p className="mt-3 font-semibold">{request.meetingPoint}</p></div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="booking-card-large">
              <h2 className="text-2xl font-semibold">Selected buddy</h2>
              {buddy ? (
                <div className="mt-5">
                  <div className="flex items-center gap-4"><img src={buddy.buddyImage || "/placeholder-user.png"} alt={buddy.buddy} className="h-16 w-16 rounded-2xl object-cover" /><div><p className="font-semibold">{buddy.buddy}</p><p className="text-sm text-muted-foreground">{buddy.location}</p><p className="mt-1 text-sm text-muted-foreground">{getBuddyMeta(buddy.id).languages.join(", ")}</p></div></div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button asChild variant="outline" className="rounded-full px-5"><Link href={`/buddies/${buddy.id}`}>View profile<MoveRight className="h-4 w-4" /></Link></Button>
                    <Button asChild variant="outline" className="rounded-full px-5"><Link href="/inbox"><MessageCircle className="h-4 w-4" />Chat</Link></Button>
                    <Button asChild variant="outline" className="rounded-full px-5"><Link href="/booking-proposal"><FileText className="h-4 w-4" />Proposal</Link></Button>
                    <Button asChild variant="outline" className="rounded-full px-5"><Link href="/booking-payment"><CreditCard className="h-4 w-4" />Payment</Link></Button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-3xl border border-dashed border-border p-5 text-sm text-muted-foreground">No buddy selected yet.</div>
              )}

              {request.bookingStatus === "COMPLETED" && (
                <div className="mt-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900"><div className="flex items-center gap-2 font-medium"><CheckCircle2 className="h-4 w-4" />Trip completed</div><p className="mt-2">The trip is completed. A review flow can be added here next.</p></div>
              )}

              {request.proposal && <div className="mt-5 rounded-3xl border border-border p-5"><p className="text-sm text-muted-foreground">Current proposal</p><p className="mt-3 text-sm leading-6">{request.proposal.itinerarySummary}</p></div>}
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
