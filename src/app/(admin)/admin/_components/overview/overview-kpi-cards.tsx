"use client";

import Link from "next/link";
import {
  AlertTriangle,
  BookOpen,
  MapPinned,
  Users,
} from "lucide-react";
import { formatCompactNumber } from "@/app/(admin)/admin/_components/admin-shared";
import {
  OverviewErrorCard,
  OverviewSectionSkeleton,
} from "@/app/(admin)/admin/_components/overview/overview-shared";
import { useAdminOverviewKpiCards } from "@/features/admin/hooks/useAdmin";
import type { AdminOverviewKpiCards as AdminOverviewKpiCardsData } from "@/features/admin/type";

const KPI_CARD_CONFIG = [
  {
    key: "users",
    title: "Total users",
    getValue: (data: AdminOverviewKpiCardsData) =>
      formatCompactNumber(data.totalUsers),
    getDescription: (data: AdminOverviewKpiCardsData) =>
      `${formatCompactNumber(data.verifiedUsers)} verified users`,
    getFooter: (data: AdminOverviewKpiCardsData) =>
      `${formatCompactNumber(data.newUsersThisWindow)} new in this week`,
    icon: <Users className="h-5 w-5 text-white" />,
    panelClass: "border-[#9de6c4] bg-[#eefbf4]",
    titleClass: "text-emerald-950",
    valueClass: "text-emerald-950",
    bodyClass: "text-emerald-700",
    mutedClass: "text-emerald-500",
    iconBoxClass: "bg-[#10c252]",
    href: "/admin/users",
  },
  {
    key: "buddies",
    title: "Total buddies",
    getValue: (data: AdminOverviewKpiCardsData) =>
      formatCompactNumber(data.totalBuddies),
    getDescription: (data: AdminOverviewKpiCardsData) =>
      `${formatCompactNumber(data.activeBuddies)} active buddies`,
    getFooter: (data: AdminOverviewKpiCardsData) =>
      `${formatCompactNumber(data.buddiesWithSubscription)} with subscription`,
    icon: <MapPinned className="h-5 w-5 text-white" />,
    panelClass: "border-[#d2b8ff] bg-[#f5efff]",
    titleClass: "text-violet-950",
    valueClass: "text-violet-950",
    bodyClass: "text-violet-700",
    mutedClass: "text-violet-500",
    iconBoxClass: "bg-[#7c3aed]",
    href: "/admin/buddies",
  },
  {
    key: "trips",
    title: "Trip requests",
    getValue: (data: AdminOverviewKpiCardsData) =>
      formatCompactNumber(data.totalTrips),
    getDescription: (data: AdminOverviewKpiCardsData) =>
      `${formatCompactNumber(data.openTrips)} open trips`,
    getFooter: () => "View trip-side demand details",
    icon: <BookOpen className="h-5 w-5 text-white" />,
    panelClass: "border-[#9fdcff] bg-[#eef9ff]",
    titleClass: "text-sky-950",
    valueClass: "text-sky-950",
    bodyClass: "text-sky-700",
    mutedClass: "text-sky-500",
    iconBoxClass: "bg-[#13b4df]",
    href: "/admin/trips",
  },
  {
    key: "incidents",
    title: "Incident queue",
    getValue: (data: AdminOverviewKpiCardsData) =>
      formatCompactNumber(data.totalIncidents),
    getDescription: (data: AdminOverviewKpiCardsData) =>
      `${formatCompactNumber(data.unresolvedIncidents)} unresolved incidents`,
    getFooter: () => "View support and resolution queue",
    icon: <AlertTriangle className="h-5 w-5 text-white" />,
    panelClass: "border-[#ffd28a] bg-[#fff9ea]",
    titleClass: "text-amber-950",
    valueClass: "text-amber-950",
    bodyClass: "text-amber-700",
    mutedClass: "text-amber-500",
    iconBoxClass: "bg-[#f4b000]",
    href: "/admin/incidents",
  },
] as const;

export function OverviewKpiCards() {
  const query = useAdminOverviewKpiCards();

  if (query.isLoading) {
    return (
      <div className="grid gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <OverviewSectionSkeleton key={index} className="h-44" />
        ))}
      </div>
    );
  }

  if (query.isError || !query.data?.data) {
    return (
      <OverviewErrorCard
        title="Unable to load KPI cards"
        description="The KPI overview endpoint did not return usable dashboard data."
      />
    );
  }

  const kpi = query.data.data;

  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {KPI_CARD_CONFIG.map((card) => (
        <Link
          key={card.key}
          href={card.href}
          className="group block h-full"
        >
          <div
            className={`flex h-full min-h-[104px] items-start gap-4 rounded-[16px] border px-5 py-4 transition-transform duration-200 group-hover:-translate-y-0.5 ${card.panelClass}`}
          >
            <div className={`rounded-xl p-3 ${card.iconBoxClass}`}>
              {card.icon}
            </div>
            <div className="min-w-0">
              <p className={`text-base font-medium ${card.titleClass}`}>
                {card.title}
              </p>
              <p className={`mt-3 text-[2rem] font-semibold leading-none ${card.valueClass}`}>
                {card.getValue(kpi)}
              </p>
              <div className={`mt-2 space-y-1 text-sm ${card.bodyClass}`}>
                <p className="leading-5">{card.getDescription(kpi)}</p>
                <p className={`leading-5 ${card.mutedClass}`}>{card.getFooter(kpi)}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
