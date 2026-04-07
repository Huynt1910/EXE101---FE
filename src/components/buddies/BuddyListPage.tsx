"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BuddyPackageCard,
  getBuddyPackagePriority,
} from "@/components/buddies/buddy-package-cards";
import { useBuddiesQuery } from "@/features/buddy/hooks/useBuddy";
import type { BuddyProfile } from "@/features/buddy/type";

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
  { value: "price-asc", label: "Price low to high" },
  { value: "price-desc", label: "Price high to low" },
] as const;

type BuddySortValue = (typeof SORT_OPTIONS)[number]["value"];

function matchesSearch(buddy: BuddyProfile, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const haystack = [
    buddy.fullName,
    buddy.address,
    buddy.bio,
    buddy.aboutMe,
    ...buddy.languages,
    ...buddy.activities,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

function BuddiesSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-sm"
        >
          <Skeleton className="h-56 w-full" />
          <div className="space-y-4 p-6">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-10 w-36 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BuddyListPage() {
  const buddiesQuery = useBuddiesQuery();
  const [search, setSearch] = useState("");
  const [sortValue, setSortValue] = useState<BuddySortValue>("recommended");
  const allBuddies = buddiesQuery.data?.data ?? [];
  const buddies = useMemo(
    () =>
      allBuddies
        .map((buddy, index) => ({ buddy, index }))
        .filter(({ buddy }) => matchesSearch(buddy, search))
        .sort((left, right) => {
          switch (sortValue) {
            case "name-asc": {
              const leftName = left.buddy.fullName?.trim() || "";
              const rightName = right.buddy.fullName?.trim() || "";
              const diff = leftName.localeCompare(rightName);
              if (diff !== 0) return diff;
              break;
            }
            case "name-desc": {
              const leftName = left.buddy.fullName?.trim() || "";
              const rightName = right.buddy.fullName?.trim() || "";
              const diff = rightName.localeCompare(leftName);
              if (diff !== 0) return diff;
              break;
            }
            case "price-asc": {
              const leftPrice =
                typeof left.buddy.costPerHour === "number"
                  ? left.buddy.costPerHour
                  : Number.POSITIVE_INFINITY;
              const rightPrice =
                typeof right.buddy.costPerHour === "number"
                  ? right.buddy.costPerHour
                  : Number.POSITIVE_INFINITY;
              const diff = leftPrice - rightPrice;
              if (diff !== 0) return diff;
              break;
            }
            case "price-desc": {
              const leftPrice =
                typeof left.buddy.costPerHour === "number"
                  ? left.buddy.costPerHour
                  : Number.NEGATIVE_INFINITY;
              const rightPrice =
                typeof right.buddy.costPerHour === "number"
                  ? right.buddy.costPerHour
                  : Number.NEGATIVE_INFINITY;
              const diff = rightPrice - leftPrice;
              if (diff !== 0) return diff;
              break;
            }
            default: {
              const priorityDiff =
                getBuddyPackagePriority(left.buddy) -
                getBuddyPackagePriority(right.buddy);
              if (priorityDiff !== 0) return priorityDiff;
            }
          }

          return left.index - right.index;
        })
        .map(({ buddy }) => buddy),
    [allBuddies, search, sortValue],
  );

  return (
    <section className="min-h-screen bg-background px-4 pb-16 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-border/70 bg-card shadow-sm">
          <div className="space-y-6 px-6 py-10 lg:px-10">
            <div className="space-y-3">
              <Badge className="rounded-full bg-primary/10 px-4 py-1.5 text-primary">
                Explore local buddies
              </Badge>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="buddy-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, language, activity"
                  className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>

              <div className="relative w-full lg:w-[240px]">
                <ArrowUpDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  id="buddy-sort"
                  value={sortValue}
                  onChange={(event) =>
                    setSortValue(event.target.value as BuddySortValue)
                  }
                  className="h-12 w-full appearance-none rounded-full border border-border bg-background pl-11 pr-10 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              {allBuddies.length} buddies available
            </div>
          </div>
        </div>

        {buddiesQuery.isLoading ? <BuddiesSkeleton /> : null}

        {buddiesQuery.isError ? (
          <Card className="rounded-[2rem] border-destructive/20 py-0">
            <CardContent className="p-6 text-sm text-destructive">
              Unable to load buddies right now. Please try again later.
            </CardContent>
          </Card>
        ) : null}

        {!buddiesQuery.isLoading && !buddiesQuery.isError ? (
          buddies.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {buddies.map((buddy) => (
                <BuddyPackageCard key={buddy.id} buddy={buddy} />
              ))}
            </div>
          ) : (
            <Card className="rounded-[2rem] border-border/70 bg-card py-0">
              <CardContent className="p-10 text-center">
                <p className="text-lg font-medium text-foreground">
                  No buddies matched that search.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try another keyword such as a district, language, or activity.
                </p>
              </CardContent>
            </Card>
          )
        ) : null}
      </div>
    </section>
  );
}
