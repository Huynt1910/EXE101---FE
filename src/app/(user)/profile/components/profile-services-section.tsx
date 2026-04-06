"use client";

import Link from "next/link";
import {
  BadgeCheck,
  CalendarClock,
  CreditCard,
  Package,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyServiceSubscriptionQuery } from "@/features/service-package/hooks/useServicePackage";
import { useUserProfile } from "@/features/user/hooks/useUserProfile";
import { hasRole } from "@/lib/auth/route-access";

function formatDate(value?: string | null) {
  if (!value) return "Not scheduled";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(date);
}

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString("en-US")} ${currency}`;
  }
}

function formatCommissionRate(rate: number) {
  return `${Math.round(rate * 100)}%`;
}

export function ProfileServicesSection() {
  const profileQuery = useUserProfile();
  const isBuddy = hasRole(profileQuery.data?.data?.roles ?? [], "Buddy");
  const subscriptionQuery = useMyServiceSubscriptionQuery(isBuddy);
  const subscription = subscriptionQuery.data?.data ?? null;

  if (profileQuery.isLoading || subscriptionQuery.isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Loading your service package...
        </CardContent>
      </Card>
    );
  }

  if (!isBuddy) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service package</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You need a buddy profile before subscribing to a service package.
          </p>
          <Button asChild>
            <Link href="/buddy/apply">Register as buddy</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (subscriptionQuery.isError) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-destructive">
          Unable to load your current service package.
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service package</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You do not have an active subscription package right now.
          </p>
          <Button asChild>
            <Link href="/buddy/package">Choose a package</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Service package
          </h2>
          <p className="text-sm text-muted-foreground">
            Review your active package, billing period and upcoming downgrade
            schedule.
          </p>
        </div>
        <Button asChild>
          <Link href="/buddy/package">Upgrade or downgrade</Link>
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.9fr)]">
        <Card className="rounded-[1.75rem] border-border/70">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
                  <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                  {subscription.status}
                </Badge>
                <h3 className="text-3xl font-semibold tracking-tight text-foreground">
                  {subscription.packageName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Current package ID: {subscription.servicePackageId}
                </p>
              </div>

              <div className="grid h-14 w-14 place-items-center rounded-3xl bg-primary/10 text-primary">
                <Package className="h-7 w-7" />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-3xl border border-border/70 bg-secondary/20 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Commission rate
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {formatCommissionRate(subscription.commissionRate)}
                </p>
              </div>
              <div className="rounded-3xl border border-border/70 bg-secondary/20 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Amount paid
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {formatCurrency(subscription.amountPaid, subscription.currency)}
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-3xl border border-border/70 p-4">
                <CalendarClock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Current cycle
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {formatDate(subscription.startDate)} -{" "}
                    {formatDate(subscription.endDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-3xl border border-border/70 p-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Payment method
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {subscription.paymentMethod || "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-border/70">
          <CardHeader>
            <CardTitle>Upcoming changes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-border/70 bg-secondary/20 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <TrendingDown className="h-4 w-4 text-primary" />
                Downgrade package
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {subscription.downgradeToPackageName
                  ? `${subscription.downgradeToPackageName} will be applied after this billing cycle.`
                  : "No downgrade has been scheduled."}
              </p>
            </div>

            <div className="rounded-3xl border border-border/70 bg-secondary/20 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Renewal state
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {subscription.isCancelledAtEndOfCycle
                  ? "This package will be cancelled at the end of the current cycle."
                  : "Auto-renew remains enabled for the current package."}
              </p>
            </div>

            <div className="rounded-3xl border border-border/70 bg-secondary/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Last payment reference
              </p>
              <p className="mt-2 break-all text-sm font-medium text-foreground">
                {subscription.externalPaymentRef || "No payment reference"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Paid at {formatDate(subscription.paidAt)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
