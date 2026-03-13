"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileText, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { confirmTripFromBuddy, getBuddyIdentity } from "@/lib/buddy-flow";
import {
  formatBudgetRange,
  formatDurationMinutes,
  formatTripRequestDateTime,
  getBookingStatusMeta,
  getLatestTripRequest,
} from "@/lib/trip-request";

export default function BuddyChatPage() {
  const router = useRouter();
  const request = getLatestTripRequest();
  const buddy = getBuddyIdentity();
  const canOpenChat = useMemo(() => {
    if (!request) return false;
    return ["MATCHED", "PROPOSAL_SENT", "PAYMENT_PENDING", "CONFIRMED", "IN_PROGRESS"].includes(request.bookingStatus);
  }, [request]);

  if (!request || !buddy || request.selectedBuddyId !== buddy.id || !canOpenChat) {
    return (
      <main className="min-h-screen bg-background px-4 py-16 lg:px-8">
        <Card className="mx-auto max-w-3xl rounded-[28px] p-8 text-center shadow-xl">
          <h1 className="text-3xl font-semibold">Buddy chat is not available</h1>
          <div className="mt-6">
            <Button asChild className="rounded-full px-7">
              <Link href="/buddy-dashboard">Back to dashboard</Link>
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  const proposal = request.proposal;
  const messages = [
    { id: "sys", type: "system", text: "Buddy accepted the invitation." },
    { id: "proposal", type: "proposal", text: proposal?.itinerarySummary ?? "Draft proposal is being prepared." },
    { id: "payment", type: "payment", text: `Payment status: ${request.paymentStatus}.` },
  ];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f6fbfa_60%,#fffaf3_100%)] text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Buddy chat</p>
                  <h1 className="mt-2 text-3xl font-semibold">{buddy.buddy}</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Booking status: {getBookingStatusMeta(request.bookingStatus).label}
                  </p>
                </div>
                <Button asChild variant="outline" className="rounded-full px-5">
                  <Link href="/buddy-dashboard">Back to dashboard</Link>
                </Button>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-border p-4"><p className="text-sm text-muted-foreground">City</p><p className="mt-2 font-medium">{request.city}</p></div>
                <div className="rounded-2xl border border-border p-4"><p className="text-sm text-muted-foreground">Time</p><p className="mt-2 font-medium">{formatTripRequestDateTime(request.startTime)}</p></div>
                <div className="rounded-2xl border border-border p-4"><p className="text-sm text-muted-foreground">Duration</p><p className="mt-2 font-medium">{formatDurationMinutes(request.durationMinutes)}</p></div>
                <div className="rounded-2xl border border-border p-4"><p className="text-sm text-muted-foreground">Meeting point</p><p className="mt-2 font-medium">{request.meetingPoint}</p></div>
                <div className="rounded-2xl border border-border p-4 md:col-span-2"><p className="text-sm text-muted-foreground">Budget</p><p className="mt-2 font-medium">{formatBudgetRange(request.budgetMin, request.budgetMax)}</p></div>
              </div>
            </Card>

            <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Conversation</h2>
              </div>
              <div className="mt-5 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="rounded-3xl border border-border p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{message.type}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{message.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex gap-2">
                <Textarea rows={3} placeholder="Reply to the customer..." />
                <Button className="self-end rounded-full px-4">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Buddy actions</h2>
              <div className="mt-5 grid gap-3">
                <Button className="justify-start rounded-2xl px-5 py-6" onClick={() => router.push("/buddy-proposal")}>
                  <FileText className="h-4 w-4" />
                  Create proposal
                </Button>
                <Button variant="outline" className="justify-start rounded-2xl px-5 py-6" onClick={() => router.push("/booking-proposal")}>
                  <FileText className="h-4 w-4" />
                  View current proposal
                </Button>
                <Button
                  variant="outline"
                  className="justify-start rounded-2xl px-5 py-6"
                  onClick={() => {
                    confirmTripFromBuddy();
                    router.push("/booking-hub");
                  }}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Confirm trip status
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
