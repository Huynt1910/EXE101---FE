import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Languages,
  MapPin,
  Sparkles,
  Star,
  Wallet,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
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

function formatRating(value?: number | null) {
  if (typeof value !== "number" || value <= 0) return "New";
  return value.toFixed(1);
}

function formatCurrencyPerHour(value?: number | null) {
  if (typeof value !== "number" || value <= 0) return "Custom pricing";
  return `$${value.toFixed(0)} / hour`;
}

export function getBuddyPackagePriority(buddy: BuddyProfile) {
  const packageName = buddy.subscription?.packageName?.trim().toLowerCase();

  switch (packageName) {
    case "founder":
      return 0;
    case "pro":
      return 1;
    case "starter":
      return 2;
    case null:
    case undefined:
    case "":
      return 3;
    default:
      return 4;
  }
}

export function BuddyPackageCard({ buddy }: Readonly<{ buddy: BuddyProfile }>) {
  const heroImage = buddy.profilePicture || "/buddies-form-bg.png";

  return (
    <Link
      href={`/buddies/${buddy.id}`}
      aria-label={`View ${buddy.fullName || "buddy"} profile`}
      className="block h-full rounded-[2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
    >
      <Card className="group flex h-full flex-col overflow-hidden rounded-[2rem] border-border/70 bg-white py-0 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={heroImage}
            alt={buddy.fullName || "Buddy"}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-900/22 to-transparent" />
          <div className="absolute left-5 top-5 rounded-full  text-emerald-400 shadow-sm backdrop-blur-md">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <div className="absolute right-5 top-5 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-md">
            {formatCurrencyPerHour(buddy.costPerHour)}
          </div>

          <div className="absolute bottom-5 left-5 right-5 flex items-end gap-4">
            <Avatar className="h-16 w-16 shrink-0 overflow-hidden border-2 border-white/90 bg-white shadow-lg">
              <AvatarImage
                src={buddy.profilePicture ?? undefined}
                alt={buddy.fullName ?? "Buddy"}
                className="h-full w-full object-cover object-center"
              />
              <AvatarFallback className="bg-white text-primary">
                {getInitials(buddy.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 text-white">
              <h2 className="truncate text-[2rem] font-semibold leading-none tracking-tight">
                {buddy.fullName || "Local buddy"}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/90">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-current" />
                  {formatRating(buddy.rate)}
                </span>
                {buddy.address ? (
                  <span className="inline-flex min-w-0 items-center gap-1.5">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">{buddy.address}</span>
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <CardContent className="flex flex-1 flex-col gap-6 bg-white p-6">
          <p className="min-h-[5.25rem] line-clamp-3 text-[1.02rem] leading-8 text-muted-foreground">
            {buddy.bio ||
              buddy.aboutMe ||
              "Friendly local guide ready to help you explore the city like a local."}
          </p>

          <div className="grid auto-rows-fr gap-5 sm:grid-cols-2">
            <div className="h-full rounded-2xl bg-white p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Languages className="h-4 w-4 text-primary" />
                Languages
              </div>
              <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-[1rem] leading-8 text-muted-foreground">
                {buddy.languages.length > 0
                  ? buddy.languages.join(", ")
                  : "Language details coming soon"}
              </p>
            </div>
            <div className="h-full rounded-2xl bg-white p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Activities
              </div>
              <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-[1rem] leading-8 text-muted-foreground">
                {buddy.activities.length > 0
                  ? buddy.activities.join(", ")
                  : "Flexible trip styles"}
              </p>
            </div>
          </div>

          <div className="mt-auto flex items-center gap-2 text-[1rem] text-muted-foreground">
            <Wallet className="h-4 w-4 text-primary" />
            {formatCurrencyPerHour(buddy.costPerHour)}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
