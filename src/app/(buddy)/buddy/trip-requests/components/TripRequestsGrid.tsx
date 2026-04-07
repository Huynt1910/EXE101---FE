"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageSquare,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TripRequestViewModel } from "./types";
import {
  ContactOfferModal,
  type ContactOfferPayload,
} from "./ContactOfferModal";

// ─── City cover images (local districts) ───────────────────────────────────────
const DISTRICT_COVERS: Array<{ pattern: RegExp; covers: string[] }> = [
  {
    pattern: /\b(quan\s*1|district\s*1|q\.?\s*1)\b/i,
    covers: ["/trip-request/district_1.jpg", "/trip-request/district_1_a.jpg"],
  },
  {
    pattern: /\b(quan\s*2|district\s*2|q\.?\s*2)\b/i,
    covers: ["/trip-request/district_2_a.jpg", "/trip-request/district_2.png"],
  },
  {
    pattern: /\b(quan\s*3|district\s*3|q\.?\s*3)\b/i,
    covers: ["/trip-request/district_3.jpg"],
  },
  {
    pattern: /\b(quan\s*4|district\s*4|q\.?\s*4)\b/i,
    covers: ["/trip-request/district_4.jpg"],
  },
  {
    pattern: /\b(quan\s*5|district\s*5|q\.?\s*5)\b/i,
    covers: ["/trip-request/district_5.webp"],
  },
  {
    pattern: /\b(quan\s*6|district\s*6|q\.?\s*6)\b/i,
    covers: ["/trip-request/district_6.jpg"],
  },
  {
    pattern: /\b(quan\s*7|district\s*7|q\.?\s*7)\b/i,
    covers: ["/trip-request/district_7.jpg"],
  },
  {
    pattern: /\b(quan\s*9|district\s*9|q\.?\s*9)\b/i,
    covers: ["/trip-request/district_9.jpg"],
  },
  {
    pattern: /\b(thu\s*duc|tp\.?\s*thu\s*duc)\b/i,
    covers: ["/trip-request/thu_duc_district.jpg"],
  },
];

const FALLBACK_COVERS = ["/trip-request/district_1.jpg"];

function normalizeCityName(value: string) {
  return value
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getCoversByCity(city: string) {
  const normalizedCity = normalizeCityName(city);
  const match = DISTRICT_COVERS.find(({ pattern }) =>
    pattern.test(normalizedCity),
  );
  return match?.covers ?? FALLBACK_COVERS;
}

// ─── Tag colours ───────────────────────────────────────────────────────────────
const TAG_COLORS: Record<string, string> = {
  food: "bg-amber-100 text-amber-700",
  adventure: "bg-cyan-100 text-cyan-700",
  art: "bg-violet-100 text-violet-700",
  culture: "bg-rose-100 text-rose-700",
  english: "bg-blue-100 text-blue-700",
  vietnamese: "bg-green-100 text-green-700",
};

function tagColor(tag: string) {
  const key = Object.keys(TAG_COLORS).find((k) =>
    tag.toLowerCase().includes(k),
  );
  return key ? TAG_COLORS[key] : "bg-slate-100 text-slate-600";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDuration(h: number) {
  if (!Number.isFinite(h)) return "N/A";
  return h === 1 ? "1 hr" : `${h} hrs`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(timeStr: string) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = Number.parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
}

// ─── RequestCard ───────────────────────────────────────────────────────────────
function RequestCard({
  request,
  onApplyContact,
}: Readonly<{
  request: TripRequestViewModel;
  onApplyContact: (
    id: string,
    payload: ContactOfferPayload,
  ) => Promise<void> | void;
}>) {
  const router = useRouter();
  const covers = getCoversByCity(request.city);
  const [imgIdx, setImgIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const groupSize = request.adults + request.children;
  const detailHref = `/buddy/trip-requests/${request.id}`;

  // Derive tags from languages + group info
  const tags: string[] = [
    ...request.preferredLanguages.slice(0, 2).map((l) => l.toLowerCase()),
    groupSize <= 2
      ? "solo/couple"
      : groupSize <= 5
        ? "small group"
        : "large group",
  ].slice(0, 3);

  const description = request.notes?.trim()
    ? request.notes.slice(0, 80) + (request.notes.length > 80 ? ".." : "")
    : `Explore ${request.city} with a local buddy for ${formatDuration(request.durationHours)}.`;

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((i) => (i - 1 + covers.length) % covers.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((i) => (i + 1) % covers.length);
  };

  return (
    <>
      <article
        className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 transition-all duration-200 hover:shadow-md cursor-pointer"
        role="link"
        tabIndex={0}
        onClick={() => router.push(detailHref)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push(detailHref);
          }
        }}
      >
        {/* ── Cover photo with carousel ── */}
        <div className="relative h-52 overflow-hidden bg-slate-100 flex-shrink-0">
          <img
            src={covers[imgIdx]}
            alt={request.city}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Prev / Next arrows */}
          {covers.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow transition-opacity opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-4 w-4 text-slate-700" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow transition-opacity opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-4 w-4 text-slate-700" />
              </button>
            </>
          )}

          {/* Carousel dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {covers.map((_, i) => (
              <button
                key={`dot-${i}`}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setImgIdx(i);
                }}
                aria-label={`Photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-200 focus:outline-none
                  ${i === imgIdx ? "w-4 bg-white" : "w-1.5 bg-white/60"}`}
              />
            ))}
          </div>
        </div>

        {/* ── Card body ── */}
        <div className="flex flex-1 flex-col gap-2.5 p-4">
          {/* Name + guests row */}
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-[15px] font-semibold text-slate-900 leading-5 line-clamp-1">
              {request.travelerName || "Traveler"}
            </h2>
            <span className="flex-shrink-0 text-[13px] font-semibold text-slate-800 whitespace-nowrap">
              {groupSize} {groupSize === 1 ? "guest" : "guests"}
            </span>
          </div>

          {/* Date and time */}
          <div className="flex flex-col gap-1.5 text-[12px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <span className="truncate">{formatDate(request.startDate)}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 min-w-0">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span className="truncate">{formatTime(request.startTime)}</span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <Timer className="h-3.5 w-3.5 text-slate-500" />
                <span className="truncate">{formatDuration(request.durationHours)}</span>
              </div>
            </div>
          </div>


          {/* Description */}
          <p className="text-[13px] leading-5 text-slate-500 line-clamp-2">
            <span className="font-semibold text-slate-700 text-sm">Note:</span>{" "}
            {description}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${tagColor(tag)}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-auto pt-1">
            <Button
              className="w-full rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 h-10 gap-2"
              variant={request.isApplied ? "outline" : "default"}
              disabled={request.isApplied}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setModalOpen(true);
              }}
            >
              <MessageSquare className="h-4 w-4" />
              {request.isApplied ? "Applied" : "Contact"}
            </Button>
          </div>
        </div>
      </article>

      {/* ── Offer Modal ── */}
      <ContactOfferModal
        open={modalOpen}
        travelerName={request.travelerName}
        city={request.city}
        groupSize={request.adults + request.children}
        durationHours={request.durationHours}
        onClose={() => setModalOpen(false)}
        onSubmit={(payload) => onApplyContact(request.id, payload)}
      />
    </>
  );
}

// ─── TripRequestsGrid ──────────────────────────────────────────────────────────
type TripRequestsGridProps = {
  requests: TripRequestViewModel[];
  onApplyContact: (
    requestId: string,
    payload: ContactOfferPayload,
  ) => Promise<void> | void;
};

export function TripRequestsGrid({
  requests,
  onApplyContact,
}: Readonly<TripRequestsGridProps>) {
  if (requests.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <p className="text-xl font-semibold text-slate-800">
          No trip requests found
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Try adjusting your filters or reset to see all requests.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onApplyContact={onApplyContact}
        />
      ))}
    </section>
  );
}
