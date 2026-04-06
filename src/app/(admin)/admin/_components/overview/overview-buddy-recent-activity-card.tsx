"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarClock, CreditCard, UserPlus } from "lucide-react";
import { formatCurrency } from "@/app/(admin)/admin/_components/admin-shared";
import {
  OverviewErrorCard,
  OverviewSectionSkeleton,
} from "@/app/(admin)/admin/_components/overview/overview-shared";
import { useAdminOverviewBuddyRecentActivity } from "@/features/admin/hooks/useAdmin";
import { formatDateTime } from "@/utils/formatDateAndTime";

type ActivityMode = "registrations" | "bookings" | "subscriptions";

function formatBookingStatusLabel(statusName?: string | null) {
  switch (statusName) {
    case "PendingCustomerConfirm":
      return "Waiting for confirmation";
    case "PendingPayment":
      return "Waiting for payment";
    case "CancelledByTimeout":
      return "Cancelled by timeout";
    case "InProgress":
      return "In progress";
    default:
      if (!statusName) return "Unknown";
      return statusName.replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  }
}

export function OverviewBuddyRecentActivityCard() {
  const [mode, setMode] = useState<ActivityMode>("registrations");
  const query = useAdminOverviewBuddyRecentActivity();

  const tableConfig = useMemo(() => {
    const data = query.data?.data;

    switch (mode) {
      case "bookings":
        return {
          title: "Recent bookings",
          description: "Latest buddy-related bookings from the overview API.",
          headers: ["Buddy", "Traveler", "Status", "Amount", "Created at"],
          rows: (data?.recentBookings ?? []).map((item) => [
            item.buddyName || "Unknown buddy",
            item.travelerName || "Unknown traveler",
            formatBookingStatusLabel(item.statusName),
            formatCurrency(item.totalAmount, "USD"),
            formatDateTime(item.createdAt),
          ]),
        };
      case "subscriptions":
        return {
          title: "Recent subscriptions",
          description:
            "Latest package purchases and renewals from the overview API.",
          headers: ["Buddy", "Package", "Amount paid", "Paid at"],
          rows: (data?.recentSubscriptions ?? []).map((item) => [
            item.buddyName || "Unknown buddy",
            item.packageName || "Unknown package",
            formatCurrency(item.amountPaid, item.currency || "VND"),
            formatDateTime(item.paidAt),
          ]),
        };
      default:
        return {
          title: "Recent registrations",
          description: "Newest buddy registrations",
          headers: ["Buddy", "Email", "Registered at"],
          rows: (data?.recentRegistrations ?? []).map((item) => [
            item.fullName || "Unnamed buddy",
            item.email || "No email",
            formatDateTime(item.registeredAt),
          ]),
        };
    }
  }, [mode, query.data?.data]);

  if (query.isLoading) {
    return <OverviewSectionSkeleton className="h-[420px]" />;
  }

  if (query.isError || !query.data?.data) {
    return (
      <OverviewErrorCard
        title="Unable to load recent buddy activity"
        description="The buddy recent activity endpoint did not return usable data."
      />
    );
  }

  return (
    <div className="booking-muted-panel p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="type-h3 text-foreground">{tableConfig.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {tableConfig.description}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-background p-1">
          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
              mode === "registrations"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setMode("registrations")}
          >
            <UserPlus className="h-4 w-4" />
            Registrations
          </button>
          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
              mode === "bookings"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setMode("bookings")}
          >
            <CalendarClock className="h-4 w-4" />
            Bookings
          </button>
          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
              mode === "subscriptions"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setMode("subscriptions")}
          >
            <CreditCard className="h-4 w-4" />
            Subscriptions
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border/70">
        <div
          className="grid gap-3 border-b border-border/70 bg-muted/20 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
          style={{
            gridTemplateColumns: `repeat(${tableConfig.headers.length}, minmax(0, 1fr))`,
          }}
        >
          {tableConfig.headers.map((header) => (
            <span key={header}>{header}</span>
          ))}
        </div>

        {tableConfig.rows.length ? (
          tableConfig.rows.map((row, index) => (
            <div
              key={`${mode}-${index}`}
              className="grid gap-3 border-b border-border/70 px-4 py-3 text-sm last:border-b-0"
              style={{
                gridTemplateColumns: `repeat(${tableConfig.headers.length}, minmax(0, 1fr))`,
              }}
            >
              {row.map((cell, cellIndex) => (
                <div
                  key={`${mode}-${index}-${cellIndex}`}
                  className="min-w-0 truncate text-foreground"
                  title={typeof cell === "string" ? cell : undefined}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No recent records returned for this section yet.
          </div>
        )}
      </div>
    </div>
  );
}
