"use client";

import Link from "next/link";
import { ArrowRight, CreditCard, MessageCircle, Star, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  formatBudgetRange,
  formatDurationMinutes,
  formatTripRequestDateTime,
  getBookingStatusMeta,
} from "@/lib/trip-request";
import { getBuddyDashboardData } from "@/lib/buddy-flow";

export default function BuddyDashboardPage() {
  const dashboard = getBuddyDashboardData();

  if (!dashboard.buddy) {
    return (
      <main className="min-h-screen bg-background px-4 py-16 lg:px-8">
        <Card className="mx-auto max-w-3xl rounded-[28px] p-8 text-center shadow-xl">
          <h1 className="text-3xl font-semibold">Buddy account not found</h1>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbf8f1_0%,#ffffff_50%,#f3fbfa_100%)] text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Buddy dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-5xl">{dashboard.buddy.buddy}</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
              Review matching requests, active trips, confirmation queue, and wallet health in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full px-5">
              <Link href="/buddy-requests">Available requests</Link>
            </Button>
            <Button asChild className="rounded-full px-5">
              <Link href="/buddy-wallet">Wallet</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Card className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Matching requests</p>
            <p className="mt-3 text-3xl font-semibold">{dashboard.availableRequests.length}</p>
          </Card>
          <Card className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Upcoming trips</p>
            <p className="mt-3 text-3xl font-semibold">{dashboard.upcomingTrips.length}</p>
          </Card>
          <Card className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Waiting confirmations</p>
            <p className="mt-3 text-3xl font-semibold">{dashboard.waitingConfirmations.length}</p>
          </Card>
          <Card className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Wallet balance</p>
            <p className="mt-3 text-3xl font-semibold">${dashboard.wallet.balance}</p>
          </Card>
          <Card className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Current rating</p>
            <p className="mt-3 flex items-center gap-2 text-3xl font-semibold">
              <Star className="h-5 w-5 fill-current text-amber-500" />
              {dashboard.wallet.currentRating}
            </p>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">New matching requests</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    These requests align with your city coverage, language, or style profile.
                  </p>
                </div>
                <Button asChild variant="outline" className="rounded-full px-5">
                  <Link href="/buddy-requests">View all</Link>
                </Button>
              </div>
              <div className="mt-5 space-y-4">
                {dashboard.availableRequests.slice(0, 3).map((request) => (
                  <Link key={request.id} href={`/buddy-requests/${request.id}`} className="block">
                    <div className="rounded-3xl border border-border p-5 transition hover:border-primary/40 hover:bg-muted/20">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{request.city}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{formatTripRequestDateTime(request.startTime)}</p>
                        </div>
                        <Badge variant="outline" className="rounded-full px-3 py-1">
                          {formatBudgetRange(request.budgetMin, request.budgetMax)}
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        {formatDurationMinutes(request.durationMinutes)} | {request.groupSize} pax | {request.preferredLanguage}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{request.shortNotes}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-semibold">Trips waiting for your response</h2>
              <div className="mt-5 space-y-4">
                {dashboard.waitingConfirmations.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-border p-5 text-sm text-muted-foreground">
                    No invitation is waiting for confirmation right now.
                  </div>
                ) : (
                  dashboard.waitingConfirmations.map((request) => (
                    <Link key={request.id} href={`/buddy-requests/${request.id}`} className="block">
                      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
                        <p className="font-semibold">{request.city}</p>
                        <p className="mt-2 text-sm text-amber-900">
                          Customer selected you. Review the request and accept or decline.
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Upcoming trips</h2>
              </div>
              <div className="mt-5 space-y-4">
                {dashboard.upcomingTrips.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-border p-5 text-sm text-muted-foreground">
                    No active trip yet. Accept an invitation or apply to a request.
                  </div>
                ) : (
                  dashboard.upcomingTrips.map((trip) => (
                    <div key={trip.id} className="rounded-3xl border border-border p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{trip.city}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{formatTripRequestDateTime(trip.startTime)}</p>
                        </div>
                        <Badge className="rounded-full px-3 py-1">
                          {getBookingStatusMeta(trip.bookingStatus).label}
                        </Badge>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button asChild variant="outline" className="rounded-full px-5">
                          <Link href="/buddy-chat">Open chat</Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-full px-5">
                          <Link href="/booking-hub">Booking detail</Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="rounded-[28px] border border-border bg-card p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Revenue snapshot</h2>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-border p-5">
                  <p className="text-sm text-muted-foreground">Payout pending</p>
                  <p className="mt-3 text-2xl font-semibold">${dashboard.wallet.payoutPending}</p>
                </div>
                <div className="rounded-3xl border border-border p-5">
                  <p className="text-sm text-muted-foreground">Payout completed</p>
                  <p className="mt-3 text-2xl font-semibold">${dashboard.wallet.payoutCompleted}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild className="rounded-full px-5">
                  <Link href="/buddy-wallet">
                    <CreditCard className="h-4 w-4" />
                    View wallet
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-5">
                  <Link href="/buddy-wallet">
                    Commission history
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
