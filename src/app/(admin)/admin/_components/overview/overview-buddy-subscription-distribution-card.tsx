"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  EmptyState,
  formatCurrency,
} from "@/app/(admin)/admin/_components/admin-shared";
import {
  OVERVIEW_DONUT_COLORS,
  OverviewErrorCard,
  OverviewSectionSkeleton,
  formatOverviewNumber,
  formatOverviewPercent,
} from "@/app/(admin)/admin/_components/overview/overview-shared";
import { useAdminOverviewBuddySubscriptionDistribution } from "@/features/admin/hooks/useAdmin";

function DistributionTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { label: string; count: number } }>;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1b2430] px-4 py-3 shadow-xl">
      <p className="text-sm font-semibold text-white">
        {item.label}: {formatOverviewNumber(item.count)}
      </p>
    </div>
  );
}

function renderDistributionLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}) {
  if (
    typeof cx !== "number" ||
    typeof cy !== "number" ||
    typeof midAngle !== "number" ||
    typeof innerRadius !== "number" ||
    typeof outerRadius !== "number" ||
    typeof percent !== "number" ||
    percent <= 0
  ) {
    return null;
  }

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {(percent * 100).toFixed(1)}%
    </text>
  );
}

export function OverviewBuddySubscriptionDistributionCard() {
  const query = useAdminOverviewBuddySubscriptionDistribution();

  if (query.isLoading) {
    return <OverviewSectionSkeleton className="h-[420px]" />;
  }

  if (query.isError || !query.data?.data) {
    return (
      <OverviewErrorCard
        title="Unable to load subscription distribution"
        description="The buddy subscription distribution endpoint did not return usable chart data."
      />
    );
  }

  const data = query.data.data;
  const total = data.totalSubscribed + data.totalFree;
  const chartData = [
    ...(data.totalFree > 0
      ? [
          {
            key: "free",
            label: "Free",
            count: data.totalFree,
            percentage: total > 0 ? (data.totalFree / total) * 100 : 0,
            fill: OVERVIEW_DONUT_COLORS[0],
            detail: ``,
          },
        ]
      : []),
    ...data.packages.map((item, index) => ({
      key: item.packageId || item.packageName,
      label: item.packageName,
      count: item.activeCount,
      percentage: total > 0 ? (item.activeCount / total) * 100 : 0,
      fill: OVERVIEW_DONUT_COLORS[(index + 1) % OVERVIEW_DONUT_COLORS.length],
      detail: formatCurrency(item.pricePerMonth, item.currency),
    })),
  ];

  return (
    <div className="booking-muted-panel h-full p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="type-h3 text-foreground">Buddy subscription</p>
        </div>
        <Link
          href="/admin/service-packages"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-opacity hover:opacity-80"
        >
          View
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-2 h-[320px]">
        {chartData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip cursor={false} content={<DistributionTooltip />} />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="label"
                innerRadius={74}
                outerRadius={116}
                paddingAngle={0}
                strokeWidth={0}
                labelLine={false}
                label={renderDistributionLabel}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.key} fill={entry.fill} />
                ))}
              </Pie>
              <text
                x="50%"
                y="47%"
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-foreground text-[14px] font-medium"
              >
                Total
              </text>
              <text
                x="50%"
                y="56%"
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-foreground text-[24px] font-semibold"
              >
                {total}
              </text>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <EmptyState
              title="No subscription distribution data"
              description="The subscription distribution endpoint returned no package rows."
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        {chartData.length ? (
          chartData.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="truncate font-medium text-foreground">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-right">
                {item.detail ? (
                  <span className="text-xs text-muted-foreground">
                    {item.detail}
                  </span>
                ) : null}
                <span className="font-medium text-foreground">
                  {item.count}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">
            Subscription distribution is not available.
          </div>
        )}
      </div>
    </div>
  );
}
