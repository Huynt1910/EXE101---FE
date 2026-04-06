"use client";

import Link from "next/link";
import { BarChart3, CreditCard } from "lucide-react";
import {
  OverviewErrorCard,
  OverviewSectionSkeleton,
  formatOverviewNumber,
} from "@/app/(admin)/admin/_components/overview/overview-shared";
import { useAdminOverviewRevenue } from "@/features/admin/hooks/useAdmin";

const REVENUE_CARDS = [
  {
    key: "booking",
    title: "Booking revenue",
    currency: "USD",
    valueKey: "totalBookingRevenue",
    helper: "Direct booking-side revenue in the current window",
    tone: "border-[#bfe8d5] bg-[#eefbf4]",
    iconBox: "bg-[#10c252]",
    icon: <BarChart3 className="h-5 w-5 text-white" />,
    href: "/admin/bookings",
  },
  {
    key: "subscription",
    title: "Subscription revenue",
    currency: "VNĐ",
    valueKey: "totalSubscriptionRevenue",
    helper: "Revenue generated from service packages",
    tone: "border-[#c6eaff] bg-[#eef9ff]",
    iconBox: "bg-[#13b4df]",
    icon: <CreditCard className="h-5 w-5 text-white" />,
    href: "/admin/service-packages",
  },
] as const;

export function OverviewRevenueCards() {
  const query = useAdminOverviewRevenue();

  if (query.isLoading) {
    return (
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <OverviewSectionSkeleton key={index} className="h-[132px]" />
        ))}
      </div>
    );
  }

  if (query.isError || !query.data?.data) {
    return (
      <OverviewErrorCard
        title="Unable to load revenue cards"
        description="The revenue endpoint did not return usable financial data."
      />
    );
  }

  const revenue = query.data.data;

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {REVENUE_CARDS.map((card) => {
        const value = revenue[card.valueKey];

        return (
          <Link
            key={card.key}
            href={card.href}
            className="group block h-full"
          >
            <div
              className={`flex h-full min-h-[104px] items-start gap-4 rounded-[16px] border px-5 py-4 transition-transform duration-200 group-hover:-translate-y-0.5 ${card.tone}`}
            >
              <div className={`rounded-xl p-3 ${card.iconBox}`}>
                {card.icon}
              </div>
              <div className="min-w-0">
                <p className="text-base font-medium text-foreground">
                  {card.title}
                </p>
                <p className="mt-3 text-[2rem] font-semibold leading-none text-foreground">
                  {formatOverviewNumber(value)} {card.currency}
                </p>
                <p className="mt-2 text-sm leading-5 text-muted-foreground">
                  {card.helper}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
