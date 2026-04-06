"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  AdminBooking,
  AdminBookingStatus,
  AdminIncident,
  AdminIncidentStatus,
  AdminIncidentType,
  AdminTrip,
  AdminTripStatus,
} from "@/features/admin/type";
import { cn } from "@/lib/utils";

export const BOOKING_STATUS_OPTIONS: AdminBookingStatus[] = [
  "PendingCustomerConfirm",
  "PendingPayment",
  "Confirmed",
  "InProgress",
  "Completed",
  "Cancelled",
  "CancelledByTimeout",
  "Expired",
];

export const INCIDENT_STATUS_OPTIONS: AdminIncidentStatus[] = [
  "Open",
  "InReview",
  "Resolved",
  "Closed",
];

export const INCIDENT_TYPE_OPTIONS: AdminIncidentType[] = [
  "NoShow",
  "LateArrival",
  "QualityIssue",
  "SafetyIssue",
  "PaymentIssue",
  "Other",
];

export const TRIP_STATUS_OPTIONS: AdminTripStatus[] = [
  "Draft",
  "Open",
  "Closed",
  "Expired",
  "Deleted",
];

export const GENDER_OPTIONS = ["Male", "Female", "Other"];

export const selectClassName =
  "flex h-9 w-full text-primary rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

export const BOOKING_CHART_COLORS = [
  "#fb923c",
  "#8b5cf6",
  "#7dd3fc",
  "#34d399",
  "#f472b6",
];

export function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Something went wrong.";
}

export function formatCurrency(amount?: number | null, currency = "USD") {
  if (typeof amount !== "number") return "N/A";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString("en-US")} ${currency}`;
  }
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function toDateInputValue(value?: string | null) {
  return value ? value.slice(0, 10) : "";
}

export function toDateTimePayload(value: string) {
  return value ? `${value}T00:00:00` : null;
}

export function splitCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getInitials(value?: string | null) {
  const name = value?.trim() || "AD";
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getWeekBucketLabel(index: number) {
  return `Week ${index + 1}`;
}

function getWeekBucket(value?: string | null) {
  if (!value) return 0;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 0;

  return Math.min(3, Math.max(0, Math.ceil(date.getDate() / 7) - 1));
}

export function buildTripTrendData(trips: AdminTrip[]) {
  const buckets = Array.from({ length: 4 }, (_, index) => ({
    label: getWeekBucketLabel(index),
    trips: 0,
    openTrips: 0,
  }));

  trips.forEach((trip) => {
    const bucketIndex = getWeekBucket(trip.createdAt);
    buckets[bucketIndex].trips += 1;
    if (trip.status === "Open") {
      buckets[bucketIndex].openTrips += 1;
    }
  });

  return buckets;
}

export function buildBookingStatusData(bookings: AdminBooking[]) {
  const counts = new Map<string, number>();

  bookings.forEach((booking) => {
    const label = booking.statusName || booking.status || "Unknown";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([name, value], index) => ({
      name,
      value,
      fill: BOOKING_CHART_COLORS[index % BOOKING_CHART_COLORS.length],
    }));
}

export function countResolvedIncidents(incidents: AdminIncident[]) {
  return incidents.filter(
    (incident) =>
      incident.status === "Resolved" || incident.status === "Closed",
  ).length;
}

function getStatusTone(status?: string | null) {
  switch (status) {
    case "Completed":
    case "Resolved":
    case "Closed":
    case "Confirmed":
    case "Active":
    case "Verified":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "PendingPayment":
    case "PendingCustomerConfirm":
    case "InReview":
    case "InProgress":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "Cancelled":
    case "CancelledByTimeout":
    case "Expired":
    case "Deleted":
    case "Inactive":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "Open":
      return "border-sky-200 bg-sky-50 text-sky-700";
    default:
      return "border-border bg-muted text-foreground";
  }
}

export function StatusPill({ label }: { label?: string | null }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", getStatusTone(label))}
    >
      {label ?? "Unknown"}
    </Badge>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function DetailItem({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="space-y-1 p-3">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  );
}

export function PaginationControls({
  page,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  onPrevious,
  onNext,
}: {
  page: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border/70 px-6 py-4">
      <p className="text-sm text-muted-foreground">
        Page {page} of {Math.max(totalPages, 1)}
      </p>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onPrevious}
          disabled={!hasPreviousPage}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onNext}
          disabled={!hasNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
