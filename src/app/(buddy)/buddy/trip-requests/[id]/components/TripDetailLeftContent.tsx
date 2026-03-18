"use client";

import {
  Languages,
  User,
  CheckCircle2,
} from "lucide-react";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(timeStr: string) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
}

// ─── Section helper ──────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-slate-900 mb-4">{children}</h2>
  );
}

// ─── Props ───────────────────────────────────────────────────────────────────
interface TripDetailLeftContentProps {
  city: string;
  startDate: string;
  startTime: string;
  durationHours: number;
  adults: number;
  childCount: number;
  preferredLanguages: string[];
  travelerName: string;
  createdAt: string;
}

export function TripDetailLeftContent({
  city,
  startDate,
  startTime,
  durationHours,
  adults,
  childCount,
  preferredLanguages,
  travelerName,
  createdAt,
}: TripDetailLeftContentProps) {
  const timeLabel = formatTime(startTime);
  const hourLabel = `${durationHours === 1 ? "1 hour" : `${durationHours} hours`}`;
  const daytime = (() => {
    const h = parseInt((startTime ?? "").split(":")[0], 10);
    if (h < 12) return "morning";
    if (h < 17) return "afternoon";
    return "evening";
  })();

  return (
    <div className="flex flex-col gap-8">
      {/* ─── Section 1: Traveler overview ──────────────────────────────── */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <SectionTitle>Traveler overview</SectionTitle>
        <div className="flex items-center gap-3 mb-4">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
            <User className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {travelerName || "Unknown Traveler"}
            </p>
            <p className="text-xs text-slate-500">Traveler</p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-700">Requested by: </span>
            {travelerName}
          </p>
          <p>
            <span className="font-medium text-slate-700">Created on: </span>
            {formatDate(createdAt)}
          </p>
        </div>
      </section>

      {/* ─── Section 2: About this trip request ────────────────────────── */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <SectionTitle>About this trip request</SectionTitle>
        <p className="text-sm leading-relaxed text-slate-600">
          Traveler is looking for a local buddy in{" "}
          <span className="font-semibold text-slate-800">{city}</span> for a{" "}
          <span className="font-semibold text-slate-800">{hourLabel}</span> trip on{" "}
          <span className="font-semibold text-slate-800">{formatDate(startDate)}</span>{" "}
          starting at{" "}
          <span className="font-semibold text-slate-800">{timeLabel}</span>.{" "}
          {preferredLanguages.length > 0 && (
            <>
              They prefer communication in{" "}
              <span className="font-semibold text-slate-800">
                {preferredLanguages.join(" and ")}
              </span>
              .
            </>
          )}
        </p>
      </section>

      {/* ─── Section 3: Preferred languages ─────────────────────────────── */}
      {preferredLanguages.length > 0 && (
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <SectionTitle>Preferred languages</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {preferredLanguages.map((lang) => (
              <span
                key={lang}
                className="rounded-full border bg-slate-100 px-3.5 py-1.5 text-sm font-medium text-slate-700"
              >
                <Languages className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                {lang}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ─── Section 4: Why this may fit you ────────────────────────────── */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <SectionTitle>Why this request may fit you</SectionTitle>
        <ul className="flex flex-col gap-3">
          {[
            `Suitable for a short ${hourLabel} trip`,
            preferredLanguages.length > 0
              ? `Traveler prefers ${preferredLanguages.join(" and ")}`
              : null,
            `Starts at ${timeLabel} during the ${daytime}`,
            `Located in ${city}`,
            adults + childCount <= 4
              ? `Small group of ${adults + childCount} people — easy to manage`
              : `Larger group of ${adults + childCount} — great earning opportunity`,
          ]
            .filter(Boolean)
            .map((item) => (
              <li key={item as string} className="flex items-start gap-2.5 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                <span dangerouslySetInnerHTML={{ __html: (item as string).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
