"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Timer,
  Users,
  Baby,
  Languages,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Helpers ────────────────────────────────────────────────────────────────

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

// ─── Summary row ─────────────────────────────────────────────────────────────
function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-2.5 border-b border-slate-100 last:border-b-0">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Icon className="h-3.5 w-3.5 flex-shrink-0" />
        <span>{label}</span>
      </div>
      <span className="text-sm font-semibold text-slate-800 text-right">{value}</span>
    </div>
  );
}

// ─── Props ───────────────────────────────────────────────────────────────────
export type TripStatus = "open" | "closed" | "applied";

interface TripDetailRightCardProps {
  startDate: string;
  startTime: string;
  durationHours: number;
  adults: number;
  childCount: number;
  preferredLanguages: string[];
  notes: string;
  status: string; // raw status from API
  isApplied?: boolean;
}

export function TripDetailRightCard({
  startDate,
  startTime,
  durationHours,
  adults,
  childCount,
  preferredLanguages,
  notes,
  status,
  isApplied: initialApplied = false,
}: TripDetailRightCardProps) {
  const router = useRouter();
  const [applied, setApplied] = useState(initialApplied);
  const [loading, setLoading] = useState(false);

  const isClosed = status?.toLowerCase() === "closed";
  const hourLabel = durationHours === 1 ? "1 hour" : `${durationHours} hours`;

  const handleApply = async () => {
    if (applied || isClosed) return;
    setLoading(true);
    // Simulate async call — swap with real API when ready
    await new Promise((res) => setTimeout(res, 800));
    setLoading(false);
    setApplied(true);
  };

  // ── CTA label / state ──────────────────────────────────────────────────────
  let ctaLabel: string;
  let ctaDisabled: boolean;
  let ctaVariant: "default" | "outline" | "secondary" = "default";

  if (isClosed) {
    ctaLabel = "Request closed";
    ctaDisabled = true;
    ctaVariant = "outline";
  } else if (applied) {
    ctaLabel = "Contacted";
    ctaDisabled = true;
    ctaVariant = "secondary";
  } else {
    ctaLabel = "Contact";
    ctaDisabled = false;
  }

  return (
    <div className="sticky top-24">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden">
        {/* Card header */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 px-5 py-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            Trip summary
          </p>
        </div>

        {/* Summary fields */}
        <div className="px-5 pt-3 pb-2">
          <SummaryRow icon={Calendar} label="Date" value={formatDate(startDate)} />
          <SummaryRow icon={Clock} label="Start time" value={formatTime(startTime)} />
          <SummaryRow icon={Timer} label="Duration" value={hourLabel} />
          <SummaryRow icon={Users} label="Adults" value={String(adults)} />
          <SummaryRow icon={Baby} label="Children" value={String(childCount)} />
          <SummaryRow
            icon={Languages}
            label="Languages"
            value={preferredLanguages.join(", ") || "—"}
          />
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-slate-100 my-2" />

        {/* Traveler note */}
        <div className="px-5 py-3">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
            Traveler note
          </p>
          <p className="mt-2 rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
            <MessageSquare className="mr-1.5 inline h-3.5 w-3.5 -mt-0.5 text-slate-400" />
            {notes?.trim() || "No additional notes from traveler."}
          </p>
        </div>

        {/* CTA section */}
        <div className="px-5 pb-5 pt-3 flex flex-col gap-3">
          <Button
            onClick={handleApply}
            disabled={ctaDisabled || loading}
            variant={ctaVariant}
            className={`w-full h-11 rounded-xl text-sm font-semibold transition-all duration-200
              ${!ctaDisabled && !loading
                ? "bg-orange-700 text-white hover:bg-orange-600 active:scale-[0.98]"
                : ""
              }
              ${applied ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}
            `}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : applied ? (
              <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" />
            ) : null}
            {loading ? "Contacting…" : ctaLabel}
          </Button>

          {/* Secondary action */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="w-full h-10 rounded-xl text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-50 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to requests
          </Button>
        </div>
      </div>
    </div>
  );
}
