"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, Wallet } from "lucide-react";
import {
  OverviewErrorCard,
  OverviewSectionSkeleton,
  formatOverviewNumber,
} from "@/app/(admin)/admin/_components/overview/overview-shared";
import {
  useAdminOverviewBuddyTopEarners,
  useAdminOverviewBuddyTopRated,
} from "@/features/admin/hooks/useAdmin";

type TopBuddyMode = "earnings" | "rating";

function BuddyAvatar({
  name,
  profilePicture,
}: {
  name?: string | null;
  profilePicture?: string | null;
}) {
  const initials =
    name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "BD";

  if (profilePicture) {
    return (
      <div
        className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center"
        style={{ backgroundImage: `url(${profilePicture})` }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
      {initials}
    </div>
  );
}

export function OverviewTopBuddiesCard() {
  const [mode, setMode] = useState<TopBuddyMode>("earnings");
  const topEarnersQuery = useAdminOverviewBuddyTopEarners({ top: 5 });
  const topRatedQuery = useAdminOverviewBuddyTopRated({ top: 5 });

  const activeQuery = mode === "earnings" ? topEarnersQuery : topRatedQuery;

  const rows = useMemo(() => {
    if (mode === "earnings") {
      return (topEarnersQuery.data?.data ?? []).map((item, index) => ({
        rank: index + 1,
        buddyId: item.buddyId,
        fullName: item.fullName || "Unnamed buddy",
        profilePicture: item.profilePicture,
        currentPackage: item.currentPackage || "Free",
        completedBookings: item.completedBookings,
        metricLabel: "Earnings",
        metricValue: formatOverviewNumber(item.totalEarnings),
      }));
    }

    return (topRatedQuery.data?.data ?? []).map((item, index) => ({
      rank: index + 1,
      buddyId: item.buddyId,
      fullName: item.fullName || "Unnamed buddy",
      profilePicture: item.profilePicture,
      currentPackage: item.currentPackage || "Free",
      completedBookings: item.completedBookings,
      metricLabel: "Rating",
      metricValue:
        item.rating > 0
          ? `${item.rating.toFixed(item.rating % 1 === 0 ? 0 : 1)} / 5`
          : "No ratings",
    }));
  }, [mode, topEarnersQuery.data?.data, topRatedQuery.data?.data]);

  if (topEarnersQuery.isLoading && topRatedQuery.isLoading) {
    return <OverviewSectionSkeleton className="h-[420px]" />;
  }

  if (activeQuery.isError) {
    return (
      <OverviewErrorCard
        title="Unable to load top buddies"
        description="The top buddy overview endpoint did not return usable ranking data."
      />
    );
  }

  return (
    <div className="booking-muted-panel p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="type-h3 text-foreground">Top buddies</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Switch between top 5 by revenue and top 5 by rating.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-background p-1">
          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
              mode === "earnings"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setMode("earnings")}
          >
            <Wallet className="h-4 w-4" />
            Revenue
          </button>
          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
              mode === "rating"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setMode("rating")}
          >
            <Star className="h-4 w-4" />
            Rating
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border/70">
        <div className="grid grid-cols-[72px_minmax(0,1.6fr)_120px_120px] gap-3 border-b border-border/70 bg-muted/20 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <span>Rank</span>
          <span>Buddy</span>
          <span>Package</span>
          <span>{mode === "earnings" ? "Earnings" : "Rating"}</span>
        </div>

        {rows.length ? (
          rows.map((row) => (
            <div
              key={`${mode}-${row.buddyId}-${row.rank}`}
              className="grid grid-cols-[72px_minmax(0,1.6fr)_120px_120px] gap-3 border-b border-border/70 px-4 py-3 last:border-b-0"
            >
              <div className="flex items-center text-sm font-semibold text-foreground">
                #{row.rank}
              </div>
              <div className="flex min-w-0 items-center gap-3">
                <BuddyAvatar
                  name={row.fullName}
                  profilePicture={row.profilePicture}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {row.fullName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {row.completedBookings} completed bookings
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                  {row.currentPackage}
                </span>
              </div>
              <div className="flex items-center text-sm font-semibold text-foreground">
                {row.metricValue}
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No buddies returned for this ranking yet.
          </div>
        )}
      </div>
    </div>
  );
}
