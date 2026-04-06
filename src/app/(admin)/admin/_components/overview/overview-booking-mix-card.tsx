"use client";

import Link from "next/link";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { EmptyState } from "@/app/(admin)/admin/_components/admin-shared";
import {
  OVERVIEW_DONUT_COLORS,
  OverviewErrorCard,
  OverviewSectionSkeleton,
  formatOverviewNumber,
} from "@/app/(admin)/admin/_components/overview/overview-shared";
import { useAdminOverviewBookingMix } from "@/features/admin/hooks/useAdmin";
import { ArrowRight } from "lucide-react";

function formatBookingStatusLabel(statusName?: string | null) {
  switch (statusName) {
    case "PendingCustomerConfirm":
      return "Waiting for confirmation";
    case "PendingPayment":
      return "Waiting for payment";
    case "Confirmed":
      return "Confirmed";
    case "Cancelled":
      return "Cancelled";
    case "CancelledByTimeout":
      return "Cancelled by timeout";
    case "Expired":
      return "Expired";
    case "Completed":
      return "Completed";
    case "InProgress":
      return "In progress";
    default:
      if (!statusName) return "Unknown";

      return statusName
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\s+/g, " ")
        .trim();
  }
}

function BookingMixTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { name: string; value: number } }>;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1b2430] px-4 py-3 shadow-xl">
      <p className="text-sm font-semibold text-white">
        {formatBookingStatusLabel(item.name)}: {formatOverviewNumber(item.value)}
      </p>
    </div>
  );
}

function renderBookingMixLabel({
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

export function OverviewBookingMixCard() {
  const query = useAdminOverviewBookingMix();

  if (query.isLoading) {
    return <OverviewSectionSkeleton className="h-[420px]" />;
  }

  if (query.isError || !query.data?.data) {
    return (
      <OverviewErrorCard
        title="Unable to load booking mix"
        description="The booking mix endpoint did not return usable chart data."
      />
    );
  }

  const data = query.data.data;
  const chartData = data.statusBreakdown.map((item, index) => ({
    name: item.statusName,
    label: formatBookingStatusLabel(item.statusName),
    value: item.count,
    percentage: item.percentage,
    fill: OVERVIEW_DONUT_COLORS[index % OVERVIEW_DONUT_COLORS.length],
  }));

  return (
    <div className="booking-muted-panel h-full p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="type-h3 text-foreground">Booking</p>
        </div>
        <Link
          href="/admin/bookings"
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
              <Tooltip cursor={false} content={<BookingMixTooltip />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={74}
                outerRadius={116}
                paddingAngle={0}
                strokeWidth={0}
                labelLine={false}
                label={renderBookingMixLabel}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
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
                {data.totalBookings}
              </text>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <EmptyState
              title="No booking mix data"
              description="The booking mix endpoint returned no status breakdown."
            />
          </div>
        )}
      </div>
      <div className="space-y-3">
        {chartData.length ? (
          chartData.map((item) => (
            <div
              key={item.name}
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
                <span className="font-medium text-foreground">
                  {item.value}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">
            Booking status breakdown is not available.
          </div>
        )}
      </div>
    </div>
  );
}
