"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getBuddyIdentity, submitBuddyProposal } from "@/lib/buddy-flow";
import {
  formatBudgetRange,
  formatTripRequestDateTime,
  getLatestTripRequest,
  type ProposalData,
} from "@/lib/trip-request";

export default function BuddyProposalPage() {
  const router = useRouter();
  const request = getLatestTripRequest();
  const buddy = getBuddyIdentity();
  const [formData, setFormData] = useState<ProposalData>(() => ({
    startTime: request?.proposal?.startTime ?? request?.startTime ?? "",
    durationMinutes: request?.proposal?.durationMinutes ?? request?.durationMinutes ?? 180,
    meetingPoint: request?.proposal?.meetingPoint ?? request?.meetingPoint ?? "",
    groupSize: request?.proposal?.groupSize ?? request?.groupSize ?? 1,
    preferredLanguage: request?.proposal?.preferredLanguage ?? request?.preferredLanguage ?? "English",
    itinerarySummary:
      request?.proposal?.itinerarySummary ??
      "Introduce the city context, align route preferences, and confirm the final pacing together.",
    finalPrice: request?.proposal?.finalPrice ?? request?.budgetMax ?? 80,
    cancellationPolicy:
      request?.proposal?.cancellationPolicy ?? "Free cancellation 24 hours before start time.",
    notes: request?.proposal?.notes ?? "",
  }));
  const [error, setError] = useState("");
  const requestSummary = useMemo(() => {
    if (!request) return null;
    return {
      city: request.city,
      budget: formatBudgetRange(request.budgetMin, request.budgetMax),
      startTime: formatTripRequestDateTime(request.startTime),
    };
  }, [request]);

  if (!request || !buddy || request.selectedBuddyId !== buddy.id) {
    return (
      <main className="min-h-screen bg-background px-4 py-16 lg:px-8">
        <Card className="mx-auto max-w-3xl rounded-[28px] p-8 text-center shadow-xl">
          <h1 className="text-3xl font-semibold">Proposal cannot be created yet</h1>
          <div className="mt-6">
            <Button asChild className="rounded-full px-7">
              <Link href="/buddy-dashboard">Back to dashboard</Link>
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  const handleSubmit = () => {
    if (!formData.startTime) {
      setError("Start time is required.");
      return;
    }
    if (formData.durationMinutes <= 0) {
      setError("Duration must be greater than 0.");
      return;
    }
    if (formData.finalPrice <= 0) {
      setError("Total price must be greater than 0.");
      return;
    }
    if (formData.meetingPoint.trim().length < 8) {
      setError("Meeting point is too short.");
      return;
    }
    if (!formData.itinerarySummary.trim()) {
      setError("Agenda summary is required.");
      return;
    }

    submitBuddyProposal(formData);
    router.push("/buddy-chat");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf3_0%,#ffffff_45%,#f5fbfa_100%)] text-foreground">
      <section className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm md:p-8">
            <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Buddy proposal</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-5xl">Create final trip plan</h1>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm">
                Start time
                <Input type="datetime-local" value={formData.startTime} onChange={(event) => setFormData((current) => ({ ...current, startTime: event.target.value }))} />
              </label>
              <label className="grid gap-2 text-sm">
                Duration (minutes)
                <Input type="number" min={30} step={30} value={formData.durationMinutes} onChange={(event) => setFormData((current) => ({ ...current, durationMinutes: Number(event.target.value) }))} />
              </label>
              <label className="grid gap-2 text-sm md:col-span-2">
                Meeting point
                <Input value={formData.meetingPoint} onChange={(event) => setFormData((current) => ({ ...current, meetingPoint: event.target.value }))} />
              </label>
              <label className="grid gap-2 text-sm md:col-span-2">
                Agenda summary
                <Textarea rows={5} value={formData.itinerarySummary} onChange={(event) => setFormData((current) => ({ ...current, itinerarySummary: event.target.value }))} />
              </label>
              <label className="grid gap-2 text-sm">
                Total price
                <Input type="number" min={1} value={formData.finalPrice} onChange={(event) => setFormData((current) => ({ ...current, finalPrice: Number(event.target.value) }))} />
              </label>
              <label className="grid gap-2 text-sm">
                Language
                <Input value={formData.preferredLanguage} onChange={(event) => setFormData((current) => ({ ...current, preferredLanguage: event.target.value }))} />
              </label>
              <label className="grid gap-2 text-sm md:col-span-2">
                Notes
                <Textarea rows={4} value={formData.notes} onChange={(event) => setFormData((current) => ({ ...current, notes: event.target.value }))} />
              </label>
              <label className="grid gap-2 text-sm md:col-span-2">
                Cancellation policy
                <Textarea rows={3} value={formData.cancellationPolicy} onChange={(event) => setFormData((current) => ({ ...current, cancellationPolicy: event.target.value }))} />
              </label>
            </div>
            {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="rounded-full px-6" onClick={handleSubmit}>
                Send proposal
              </Button>
              <Button variant="outline" className="rounded-full px-6" onClick={() => router.push("/buddy-chat")}>
                Keep editing later
              </Button>
            </div>
          </Card>

          <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-semibold">Request reference</h2>
            {requestSummary ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-3xl border border-border p-5">
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="mt-3 font-semibold">{requestSummary.city}</p>
                </div>
                <div className="rounded-3xl border border-border p-5">
                  <p className="text-sm text-muted-foreground">Original time</p>
                  <p className="mt-3 font-semibold">{requestSummary.startTime}</p>
                </div>
                <div className="rounded-3xl border border-border p-5">
                  <p className="text-sm text-muted-foreground">Budget range</p>
                  <p className="mt-3 font-semibold">{requestSummary.budget}</p>
                </div>
              </div>
            ) : null}
          </Card>
        </div>
      </section>
    </main>
  );
}
