"use client";

import Link from "next/link";
import { ArrowRight, BadgeDollarSign, ClipboardList, ShieldAlert } from "lucide-react";
import { formatCurrency } from "@/app/(admin)/admin/_components/admin-shared";
import {
  OverviewErrorCard,
  OverviewSectionSkeleton,
  formatOverviewPercent,
} from "@/app/(admin)/admin/_components/overview/overview-shared";
import { useAdminOverviewBottomStats } from "@/features/admin/hooks/useAdmin";

export function OverviewBottomStatsCards() {
  const query = useAdminOverviewBottomStats();

  if (query.isLoading) {
    return (
      <div className="grid gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <OverviewSectionSkeleton key={index} className="h-[152px]" />
        ))}
      </div>
    );
  }

  if (query.isError || !query.data?.data) {
    return (
      <OverviewErrorCard
        title="Unable to load bottom stats"
        description="The bottom stats endpoint did not return usable operations data."
      />
    );
  }

  const stats = query.data.data;
  const currency = stats.currency || "USD";
  const cards = [
    {
      key: "revenue",
      title: "Total revenue",
      value: formatCurrency(stats.totalRevenue, currency),
      helper: `${formatCurrency(stats.platformFeeRevenue, currency)} platform fee revenue`,
      icon: <BadgeDollarSign className="h-5 w-5 text-[#f0693c]" />,
      href: "/admin/bookings",
    },
    {
      key: "bookings",
      title: "Active bookings",
      value: String(stats.totalActiveBookings),
      helper: `${stats.directBookings} direct bookings`,
      icon: <ClipboardList className="h-5 w-5 text-[#ff3b30]" />,
      href: "/admin/bookings",
    },
    {
      key: "incidents",
      title: "Resolution rate",
      value: formatOverviewPercent(stats.resolutionRate),
      helper: `${stats.resolvedIncidents} resolved, ${stats.closedIncidents} closed`,
      icon: <ShieldAlert className="h-5 w-5 text-[#f4b000]" />,
      href: "/admin/incidents",
    },
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.key}
          className="rounded-[16px] border border-border/70 bg-background"
        >
          <div className="flex h-full flex-col justify-between gap-5 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[1.9rem] font-semibold leading-none text-foreground">
                  {card.value}
                </p>
                <p className="mt-2.5 text-base font-medium text-foreground">
                  {card.title}
                </p>
              </div>
              <div className="rounded-xl border border-border/70 p-2.5">
                {card.icon}
              </div>
            </div>
            <div className="border-t border-border/70 pt-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">{card.helper}</span>
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-2 text-[#f0693c] transition-opacity hover:opacity-80"
                >
                  View
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
