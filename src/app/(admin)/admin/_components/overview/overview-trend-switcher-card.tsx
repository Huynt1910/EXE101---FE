"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  EmptyState,
  selectClassName,
} from "@/app/(admin)/admin/_components/admin-shared";
import {
  OverviewErrorCard,
  OverviewSectionSkeleton,
} from "@/app/(admin)/admin/_components/overview/overview-shared";
import {
  useAdminOverviewBuddyGrowthTrend,
  useAdminOverviewTripDemandTrend,
} from "@/features/admin/hooks/useAdmin";

type TrendMode = "trip" | "buddy";

type TrendSeries = {
  key: string;
  label: string;
  color: string;
};

type TrendViewModel = {
  title: string;
  rows: Array<Record<string, string | number>>;
  series: TrendSeries[];
};

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
            <span
              className="inline-flex items-center gap-2 text-white/80"
              style={{ color: entry.color }}
            >
              {entry.name}
            </span>
            <span className="font-medium text-white">{entry.value ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OverviewTrendSwitcherCard() {
  const [mode, setMode] = useState<TrendMode>("trip");
  const tripQuery = useAdminOverviewTripDemandTrend();
  const buddyQuery = useAdminOverviewBuddyGrowthTrend();

  const activeQuery = mode === "trip" ? tripQuery : buddyQuery;

  const viewModel = useMemo<TrendViewModel>(() => {
    if (mode === "trip") {
      return {
        title: "Trip demand trend",
        rows: (tripQuery.data?.data.weeks ?? []).map((week) => ({
          label: week.weekLabel,
          totalTrips: week.totalTrips,
          openTrips: week.openTrips,
        })),
        series: [
          { key: "totalTrips", label: "Trips", color: "#16a34a" },
          { key: "openTrips", label: "Open trips", color: "#2563eb" },
        ],
      };
    }

    return {
      title: "Buddy growth trend",
      rows: (buddyQuery.data?.data.weeks ?? []).map((week) => ({
        label: week.weekLabel,
        newBuddies: week.newBuddies,
        newSubscriptions: week.newSubscriptions,
        completedBookings: week.completedBookings,
      })),
      series: [
        { key: "newBuddies", label: "New buddies", color: "#16a34a" },
        { key: "newSubscriptions", label: "Subscriptions", color: "#2563eb" },
        {
          key: "completedBookings",
          label: "Completed bookings",
          color: "#ea580c",
        },
      ],
    };
  }, [buddyQuery.data?.data.weeks, mode, tripQuery.data?.data.weeks]);

  if (tripQuery.isLoading && buddyQuery.isLoading) {
    return <OverviewSectionSkeleton className="h-[420px]" />;
  }

  if (activeQuery.isError) {
    return (
      <OverviewErrorCard
        title="Unable to load overview trend"
        description="The selected overview trend endpoint did not return usable chart data."
      />
    );
  }

  return (
    <div className="booking-muted-panel p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="type-h3 text-foreground">{viewModel.title}</p>
        </div>
        <div className="flex items-end gap-3">
          <div className="space-y-2">
            <Label htmlFor="overview-trend-switch">Chart</Label>
            <select
              id="overview-trend-switch"
              className={`${selectClassName} min-w-[210px]`}
              value={mode}
              onChange={(event) => setMode(event.target.value as TrendMode)}
            >
              <option value="trip">Trip demand trend</option>
              <option value="buddy">Buddy growth trend</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
        {viewModel.series.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </div>
        ))}
      </div>

      <div className="mt-6 h-[320px]">
        {viewModel.rows.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={viewModel.rows} barGap={10}>
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
              {viewModel.series.map((series) => (
                <Bar
                  key={series.key}
                  dataKey={series.key}
                  name={series.label}
                  fill={series.color}
                  radius={[10, 10, 0, 0]}
                  maxBarSize={48}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Card className="flex h-full items-center justify-center border-dashed bg-background/70 p-6 text-center shadow-none">
            <CardContent className="p-0">
              <EmptyState
                title="No trend data"
                description="The selected overview trend endpoint returned no weekly chart rows."
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
