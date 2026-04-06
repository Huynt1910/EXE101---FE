"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OverviewBookingMixCard } from "@/app/(admin)/admin/_components/overview/overview-booking-mix-card";
import { OverviewBottomStatsCards } from "@/app/(admin)/admin/_components/overview/overview-bottom-stats-cards";
import { OverviewBuddyGrowthTrendCard } from "@/app/(admin)/admin/_components/overview/overview-buddy-growth-trend-card";
import { OverviewBuddyRecentActivityCard } from "@/app/(admin)/admin/_components/overview/overview-buddy-recent-activity-card";
import { OverviewBuddySubscriptionDistributionCard } from "@/app/(admin)/admin/_components/overview/overview-buddy-subscription-distribution-card";
import { OverviewKpiCards } from "@/app/(admin)/admin/_components/overview/overview-kpi-cards";
import { OverviewRevenueCards } from "@/app/(admin)/admin/_components/overview/overview-revenue-cards";
import { OverviewTopBuddiesCard } from "@/app/(admin)/admin/_components/overview/overview-top-buddies-card";
import { OverviewTripDemandTrendCard } from "@/app/(admin)/admin/_components/overview/overview-trip-demand-trend-card";

export function OverviewClient() {
  return (
    <div className="space-y-6">
      <section className="space-y-4 overflow-hidden p-6">
        <OverviewKpiCards />
        <OverviewRevenueCards />
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
          <OverviewTripDemandTrendCard />
          <OverviewBookingMixCard />
          <OverviewBuddyGrowthTrendCard />
          <OverviewBuddySubscriptionDistributionCard />
        </div>
      </section>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
        <OverviewBuddyRecentActivityCard />
        <OverviewTopBuddiesCard />
      </div>

      <OverviewBottomStatsCards />
    </div>
  );
}
