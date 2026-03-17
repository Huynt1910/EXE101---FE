"use client";

import { MapPin } from "lucide-react";

// ─── City cover images (Unsplash) ────────────────────────────────────────────
const CITY_COVERS: Record<string, string> = {
  "Ho Chi Minh City": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1400&q=80",
  "Hanoi": "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=1400&q=80",
  "Ha Long": "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1400&q=80",
  "Da Nang": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1400&q=80",
  "Hoi An": "https://images.unsplash.com/photo-1568454537842-d933259bb258?w=1400&q=80",
  "TP Hồ Chí Minh": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1400&q=80",
};

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80";

const STATUS_BADGE: Record<string, string> = {
  Open: "bg-emerald-700 text-white border border-emerald-600",
  Closed: "bg-slate-700 text-white border border-slate-200",
  Applied: "bg-blue-700 text-white border border-blue-200",
};

function getStatusClass(status: string) {
  return (
    STATUS_BADGE[status] ?? "bg-amber-800 text-white border border-amber-200"
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(timeStr: string) {
  if (!timeStr) return "";
  // timeStr may be "HH:mm:ss" or "HH:mm"
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
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
    <div className="relative w-full h-[340px] md:h-[420px] rounded-2xl overflow-hidden shadow-sm">
      {/* Background image */}
      <img
        src={cover}
        alt={city}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col gap-3">
        {/* Status badge */}
        <span
          className={`inline-flex self-start rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(status)}`}
        >
          {status}
        </span>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-sm">
          Trip request in {city}
        </h1>

        {/* Meta line */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-white/90">
          <MapPin className="h-3.5 w-3.5 text-white/70 flex-shrink-0" />
          <span>{city}</span>
          <span className="text-white/40">·</span>
          <span>{formatDate(startDate)}</span>
        </div>
      </div>
    </div>
  );
}
