"use client";

import { MapPin } from "lucide-react";

const CITY_COVERS: Record<string, string> = {
  "Ho Chi Minh City":
    "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1400&q=80",
  Hanoi: "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=1400&q=80",
  "Ha Long": "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1400&q=80",
  "Da Nang": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1400&q=80",
  "Hoi An": "https://images.unsplash.com/photo-1568454537842-d933259bb258?w=1400&q=80",
};

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80";

const STATUS_BADGE: Record<string, string> = {
  Open: "border border-emerald-600 bg-emerald-700 text-white",
  Closed: "border border-slate-200 bg-slate-700 text-white",
  Applied: "border border-blue-200 bg-blue-700 text-white",
};

function getStatusClass(status: string) {
  return STATUS_BADGE[status] ?? "border border-amber-200 bg-amber-800 text-white";
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface TripDetailHeroProps {
  city: string;
  status: string;
  startDate: string;
  startTime: string;
  durationHours: number;
}

export function TripDetailHero({
  city,
  status,
  startDate,
}: TripDetailHeroProps) {
  const cover = CITY_COVERS[city] ?? FALLBACK_COVER;

  return (
    <div className="relative h-[340px] w-full overflow-hidden rounded-2xl shadow-sm md:h-[420px]">
      <img
        src={cover}
        alt={city}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 p-6 md:p-8">
        <span
          className={`inline-flex self-start rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(status)}`}
        >
          {status}
        </span>

        <h1 className="text-2xl font-bold leading-tight text-white drop-shadow-sm md:text-3xl">
          Trip request in {city}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-sm text-white/90">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-white/70" />
          <span>{city}</span>
          <span className="text-white/40">·</span>
          <span>{formatDate(startDate)}</span>
        </div>
      </div>
    </div>
  );
}
