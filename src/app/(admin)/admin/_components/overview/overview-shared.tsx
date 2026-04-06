"use client";

import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const OVERVIEW_DONUT_COLORS = [
  "#059669",
  "#d97706",
  "#0891b2",
  "#dc2626",
  "#7c3aed",
];

export function formatOverviewPercent(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "0%";

  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

export function formatOverviewNumber(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "N/A";

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function formatSignedOverviewPercent(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "0%";

  const prefix = value > 0 ? "+" : "";
  return `${prefix}${formatOverviewPercent(value)}`;
}

export function getOverviewGrowthTone(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "text-muted-foreground";
  }

  if (value > 0) return "text-emerald-600";
  if (value < 0) return "text-rose-600";
  return "text-muted-foreground";
}

export function OverviewSectionSkeleton({
  className,
}: {
  className: string;
}) {
  return <div className={`booking-card animate-pulse ${className}`} />;
}

export function OverviewErrorCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  );
}

export function OverviewMiniStat({
  label,
  value,
  helper,
}: {
  label: string;
  value: ReactNode;
  helper?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      {helper ? <div className="mt-1 text-sm text-muted-foreground">{helper}</div> : null}
    </div>
  );
}
