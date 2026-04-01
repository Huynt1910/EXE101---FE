"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Languages,
  MapPin,
  Search,
  Sparkles,
  Star,
  Wallet,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBuddiesQuery } from "@/features/buddy/hooks/useBuddy";
import type { BuddyProfile } from "@/features/buddy/type";

function getInitials(name?: string | null) {
  const source = name?.trim() || "Buddy";

  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatCurrencyPerHour(value?: number | null) {
  if (typeof value !== "number" || value <= 0) return "Custom pricing";
  return `$${value.toFixed(0)} / hour`;
}

function formatRating(value?: number | null) {
  if (typeof value !== "number" || value <= 0) return "New";
  return value.toFixed(1);
}

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

function BuddyCard({ buddy }: Readonly<{ buddy: BuddyProfile }>) {
  const heroImage = buddy.profilePicture || "/buddies-form-bg.png";

  return (
    <Card className="group overflow-hidden rounded-[2rem] border-border/70 bg-card py-0 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={heroImage}
          alt={buddy.fullName || "Buddy"}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" /> */}
        <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-3">
          <BadgeCheck className="text-green-500" />
          <div className="rounded-full border border-white/30 bg-white/15 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
            {formatCurrencyPerHour(buddy.costPerHour)}
          </div>
        </div>
        <div className="absolute bottom-5 left-5 right-5 flex items-end gap-4">
          <Avatar className="h-16 w-16 border-2 border-white/80 bg-white/20 shadow-lg">
            <AvatarImage
              src={buddy.profilePicture ?? undefined}
              alt={buddy.fullName ?? "Buddy"}
            />
            <AvatarFallback className="bg-white text-primary">
              {getInitials(buddy.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 text-white">
            <h2 className="truncate text-2xl font-semibold tracking-tight">
              {buddy.fullName || "Local buddy"}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-white/90">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-current" />
                {formatRating(buddy.rate)}
              </span>
              {buddy.address ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {buddy.address}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <CardContent className="space-y-5 p-6">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {buddy.bio ||
            buddy.aboutMe ||
            "Friendly local guide ready to help you explore the city like a local."}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Languages className="h-4 w-4 text-primary" />
              Languages
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {buddy.languages.length > 0
                ? buddy.languages.join(", ")
                : "Language details coming soon"}
            </p>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Activities
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {buddy.activities.length > 0
                ? buddy.activities.join(", ")
                : "Flexible trip styles"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wallet className="h-4 w-4 text-primary" />
            {formatCurrencyPerHour(buddy.costPerHour)}
          </div>
          <Button asChild className="rounded-full">
            <Link href={`/buddies/${buddy.id}`}>
              View profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
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
  const allBuddies = buddiesQuery.data?.data ?? [];
  const buddies = allBuddies.filter((buddy) => matchesSearch(buddy, search));

  return (
    <section className="min-h-screen bg-background px-4 pb-16 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-border/70 bg-card shadow-sm">
          <div className="grid gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1.1fr)_20rem] lg:px-10">
            <div className="space-y-5">
              <Badge className="rounded-full bg-primary/10 px-4 py-1.5 text-primary">
                Explore local buddies
              </Badge>
              <div className="space-y-3">
                <h1 className="max-w-3xl font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
                  Browse trusted local buddies before you book your next trip.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                  Compare personalities, languages, trip styles, and hourly
                  pricing in one place. Open a profile to review public feedback
                  and prepare a booking request.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border/70 bg-secondary/40 p-5">
              <label
                htmlFor="buddy-search"
                className="text-sm font-medium text-foreground"
              >
                Find a buddy
              </label>
              <div className="relative mt-3">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="buddy-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, language, activity..."
                  className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {allBuddies.length} buddies available right now.
              </p>
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
                <BuddyCard key={buddy.id} buddy={buddy} />
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
