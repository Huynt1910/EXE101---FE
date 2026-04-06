"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/app/(admin)/admin/_components/admin-shared";
import {
  OverviewErrorCard,
  OverviewSectionSkeleton,
} from "@/app/(admin)/admin/_components/overview/overview-shared";
import { useAdminOverviewTripDemandTrend } from "@/features/admin/hooks/useAdmin";

function TrendTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  label?: string;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1b2430] px-4 py-3 shadow-xl">
      <p className="text-sm font-semibold text-white">{label}</p>
      <div className="mt-2 space-y-1">
        {payload.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span style={{ color: entry.color }} className="font-medium">
              {entry.name}
            </span>
            <span className="font-medium text-white">{entry.value ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OverviewTripDemandTrendCard() {
  const query = useAdminOverviewTripDemandTrend();

  if (query.isLoading) {
    return <OverviewSectionSkeleton className="h-[420px]" />;
  }

  if (query.isError || !query.data?.data) {
    return (
      <OverviewErrorCard
        title="Unable to load trip demand trend"
        description="The trip demand trend endpoint did not return usable chart data."
      />
    );
  }

  const rows = query.data.data.weeks.map((week) => ({
    label: week.weekLabel,
    totalTrips: week.totalTrips,
    openTrips: week.openTrips,
  }));

  return (
    <div className="booking-muted-panel h-full p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="type-h3 text-foreground">Trip demand trend</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Weekly trip creation and open-trip backlog.
          </p>
        </div>
        <Link
          href="/admin/trips"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-opacity hover:opacity-80"
        >
          View
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 h-[320px]">
        {rows.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} barGap={10}>
              <CartesianGrid
                vertical={false}
                stroke="color-mix(in srgb, var(--foreground) 12%, transparent)"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip cursor={false} content={<TrendTooltip />} />
              <Bar
                dataKey="totalTrips"
                name="Trips"
                fill="#16a34a"
                radius={[10, 10, 0, 0]}
                maxBarSize={48}
              />
              <Bar
                dataKey="openTrips"
                name="Open trips"
                fill="#2563eb"
                radius={[10, 10, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Card className="flex h-full items-center justify-center border-dashed bg-background/70 p-6 text-center shadow-none">
            <CardContent className="p-0">
              <EmptyState
                title="No trip trend data"
                description="The trip demand trend endpoint returned no weekly chart rows."
              />
            </CardContent>
          </Card>
        )}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#16a34a]" />
          Trips
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#2563eb]" />
          Open trips
        </div>
      </div>
    </div>
  );
}
