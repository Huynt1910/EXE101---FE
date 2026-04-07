"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DetailItem,
  EmptyState,
  StatusPill,
  formatCurrency,
  getErrorMessage,
  getInitials,
  selectClassName,
} from "@/app/(admin)/admin/_components/admin-shared";
import { useAdminBuddiesWithSubscription } from "@/features/admin/hooks/useAdmin";
import { formatDate, formatDateTime } from "@/utils/formatDateAndTime";
import { formatStringList } from "@/utils/formatListData";

function formatCommissionRate(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return "N/A";

  const percentage = value <= 1 ? value * 100 : value;
  return `${percentage}%`;
}

export function ServicePackageSubscribersPanel() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [packageFilter, setPackageFilter] = useState("all");
  const [selectedBuddyId, setSelectedBuddyId] = useState<string | null>(null);
  const tabsListClassName =
    "h-auto flex-wrap rounded-2xl border border-border/70 bg-background p-1";

  const buddiesWithSubscriptionQuery = useAdminBuddiesWithSubscription();

  const buddies = useMemo(
    () => buddiesWithSubscriptionQuery.data?.data ?? [],
    [buddiesWithSubscriptionQuery.data?.data],
  );

  const packageOptions = useMemo(
    () =>
      [
        ...new Set(
          buddies
            .map((buddy) => buddy.subscription?.packageName)
            .filter((value): value is string => Boolean(value)),
        ),
      ].sort((left, right) => left.localeCompare(right)),
    [buddies],
  );

  const filteredBuddies = useMemo(() => {
    const keyword = deferredSearch.trim().toLowerCase();

    return buddies
      .filter((buddy) => {
        const packageName = buddy.subscription?.packageName ?? "";

        if (packageFilter !== "all" && packageName !== packageFilter) {
          return false;
        }

        if (!keyword) return true;

        const haystacks = [
          buddy.fullName,
          buddy.email,
          buddy.userId,
          buddy.phoneNumber,
          buddy.address,
          packageName,
          ...(buddy.languages ?? []),
          ...(buddy.activities ?? []),
        ];

        return haystacks
          .filter((value): value is string => typeof value === "string")
          .some((value) => value.toLowerCase().includes(keyword));
      })
      .sort((left, right) => {
        const rightTimestamp = new Date(
          right.subscription?.paidAt ?? right.createdAt ?? 0,
        ).getTime();
        const leftTimestamp = new Date(
          left.subscription?.paidAt ?? left.createdAt ?? 0,
        ).getTime();

        return rightTimestamp - leftTimestamp;
      });
  }, [buddies, deferredSearch, packageFilter]);

  const selectedBuddy = useMemo(
    () =>
      filteredBuddies.find((buddy) => buddy.id === selectedBuddyId) ??
      filteredBuddies[0] ??
      null,
    [filteredBuddies, selectedBuddyId],
  );

  const summary = useMemo(() => {
    const activeCount = buddies.filter(
      (buddy) => buddy.subscription?.status === "Active",
    ).length;
    const totalRevenue = buddies.reduce(
      (sum, buddy) => sum + (buddy.subscription?.amountPaid ?? 0),
      0,
    );
    const currency =
      buddies.find((buddy) => buddy.subscription?.currency)?.subscription
        ?.currency ?? "VND";

    return {
      total: buddies.length,
      activeCount,
      packageCount: packageOptions.length,
      totalRevenue,
      currency,
    };
  }, [buddies, packageOptions.length]);

  useEffect(() => {
    const firstBuddyId = filteredBuddies[0]?.id ?? null;

    if (!firstBuddyId) {
      setSelectedBuddyId(null);
      return;
    }

    if (
      !selectedBuddyId ||
      !filteredBuddies.some((buddy) => buddy.id === selectedBuddyId)
    ) {
      setSelectedBuddyId(firstBuddyId);
    }
  }, [filteredBuddies, selectedBuddyId]);

  if (
    buddiesWithSubscriptionQuery.isLoading &&
    !buddiesWithSubscriptionQuery.data
  ) {
    return (
      <div className="booking-muted-panel p-6">
        <p className="text-sm text-muted-foreground">
          Loading buddy subscription records...
        </p>
      </div>
    );
  }

  if (buddiesWithSubscriptionQuery.isError) {
    return (
      <div className="booking-muted-panel p-6">
        <EmptyState
          title="Unable to load subscribed buddies"
          description={getErrorMessage(buddiesWithSubscriptionQuery.error)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="booking-muted-panel">
        <div className="space-y-1.5 p-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Buddy package subscribers
          </h2>
          <p className="text-sm text-muted-foreground">
            Inspect buddies who have purchased a service package and review
            their current subscription details.
          </p>
        </div>

        <div className="grid gap-4 px-6 pb-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="subscription-buddy-search">Search</Label>
            <Input
              id="subscription-buddy-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by buddy, email, package or language"
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subscription-package-filter">Package</Label>
            <select
              id="subscription-package-filter"
              className={selectClassName}
              value={packageFilter}
              onChange={(event) => setPackageFilter(event.target.value)}
            >
              <option value="all">All packages</option>
              {packageOptions.map((packageName) => (
                <option key={packageName} value={packageName}>
                  {packageName}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-xl border border-border/70 bg-background p-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Subscription revenue
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {formatCurrency(summary.totalRevenue, summary.currency)}
            </p>
          </div>
        </div>
      </div>

      <TabsList className={tabsListClassName}>
        <TabsTrigger value="packages" className="min-w-[160px]">
          Packages
        </TabsTrigger>
        <TabsTrigger value="subscribers" className="min-w-[180px]">
          Subscribed buddies
        </TabsTrigger>
      </TabsList>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.95fr)]">
        <div className="booking-muted-panel">
          <div className="space-y-1.5 p-6">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Purchased buddies
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredBuddies.length} / {buddies.length} buddies visible.
            </p>
          </div>
          <div className="px-0">
            {filteredBuddies.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6">Buddy</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Amount paid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Paid at</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBuddies.map((buddy) => (
                    <TableRow
                      key={buddy.id}
                      data-state={
                        buddy.id === selectedBuddy?.id ? "selected" : undefined
                      }
                      className="cursor-pointer"
                      onClick={() => setSelectedBuddyId(buddy.id)}
                    >
                      <TableCell className="px-6">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={buddy.profilePicture ?? undefined}
                              alt={
                                buddy.fullName || buddy.email || "Buddy avatar"
                              }
                            />
                            <AvatarFallback>
                              {getInitials(buddy.fullName || buddy.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">
                              {buddy.fullName || "Unnamed buddy"}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {buddy.email || buddy.userId || "No email"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {buddy.subscription?.packageName || "Unknown package"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatCurrency(
                          buddy.subscription?.amountPaid,
                          buddy.subscription?.currency || "VND",
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusPill label={buddy.subscription?.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(buddy.subscription?.paidAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="px-6 pb-6">
                <EmptyState
                  title="No subscribed buddies found"
                  description="Adjust the current search or package filter and try again."
                />
              </div>
            )}
          </div>
        </div>

        <div className="booking-muted-panel">
          <div className="space-y-1.5 p-6">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Subscription details
            </h2>
            <p className="text-sm text-muted-foreground">
              Review the selected buddy profile together with the purchased
              package.
            </p>
          </div>
          <div className="px-6 pb-6">
            {selectedBuddy ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarImage
                      src={selectedBuddy.profilePicture ?? undefined}
                      alt={
                        selectedBuddy.fullName ||
                        selectedBuddy.email ||
                        "Buddy avatar"
                      }
                    />
                    <AvatarFallback>
                      {getInitials(
                        selectedBuddy.fullName || selectedBuddy.email,
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-foreground">
                      {selectedBuddy.fullName || "Unnamed buddy"}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {selectedBuddy.email || "No email"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <DetailItem
                    label="Package"
                    value={
                      selectedBuddy.subscription?.packageName ||
                      "Unknown package"
                    }
                  />
                  <DetailItem
                    label="Subscription status"
                    value={
                      <StatusPill label={selectedBuddy.subscription?.status} />
                    }
                  />
                  <DetailItem
                    label="Amount paid"
                    value={formatCurrency(
                      selectedBuddy.subscription?.amountPaid,
                      selectedBuddy.subscription?.currency || "VND",
                    )}
                  />
                  <DetailItem
                    label="Commission rate"
                    value={formatCommissionRate(
                      selectedBuddy.subscription?.commissionRate,
                    )}
                  />
                  <DetailItem
                    label="Start date"
                    value={formatDateTime(
                      selectedBuddy.subscription?.startDate,
                    )}
                  />
                  <DetailItem
                    label="End date"
                    value={formatDateTime(selectedBuddy.subscription?.endDate)}
                  />
                  <DetailItem
                    label="Paid at"
                    value={formatDateTime(selectedBuddy.subscription?.paidAt)}
                  />
                  <DetailItem
                    label="Profile status"
                    value={
                      <StatusPill
                        label={
                          selectedBuddy.isActive === false
                            ? "Inactive"
                            : "Active"
                        }
                      />
                    }
                  />
                  <DetailItem
                    label="Cost per hour"
                    value={
                      typeof selectedBuddy.costPerHour === "number"
                        ? `${selectedBuddy.costPerHour} USD/hr`
                        : "N/A"
                    }
                  />
                  <DetailItem
                    label="Rating"
                    value={
                      typeof selectedBuddy.rate === "number"
                        ? selectedBuddy.rate.toFixed(1)
                        : "N/A"
                    }
                  />
                  <DetailItem
                    label="Languages"
                    value={formatStringList(selectedBuddy.languages) || "N/A"}
                  />
                  <DetailItem
                    label="Activities"
                    value={formatStringList(selectedBuddy.activities) || "N/A"}
                  />
                  <DetailItem
                    label="Phone"
                    value={selectedBuddy.phoneNumber || "N/A"}
                  />
                  <DetailItem
                    label="Gender"
                    value={selectedBuddy.gender || "N/A"}
                  />
                  <DetailItem
                    label="Date of birth"
                    value={formatDate(selectedBuddy.dateOfBirth)}
                  />
                  <DetailItem
                    label="Address"
                    value={selectedBuddy.address || "N/A"}
                  />
                  <DetailItem
                    label="Bio"
                    value={selectedBuddy.bio || "No biography provided."}
                  />
                  <DetailItem
                    label="About me"
                    value={selectedBuddy.aboutMe || "No about me provided."}
                  />
                  <DetailItem
                    label="Buddy created"
                    value={formatDateTime(selectedBuddy.createdAt)}
                  />
                  <DetailItem
                    label="Buddy updated"
                    value={formatDateTime(selectedBuddy.updatedAt)}
                  />
                </div>
              </div>
            ) : (
              <EmptyState
                title="No subscribed buddy selected"
                description="Select a buddy row to inspect the purchased package details."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
