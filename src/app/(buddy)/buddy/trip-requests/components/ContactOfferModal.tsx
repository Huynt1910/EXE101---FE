"use client";

import { useState } from "react";
import { DollarSign, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ContactOfferPayload {
  offeredPrice: number | null;
  isInboxOnly: boolean;
  note: string;
}

interface ContactOfferModalProps {
  open: boolean;
  travelerName?: string;
  city?: string;
  groupSize?: number;
  durationHours?: number;
  onClose: () => void;
  onSubmit: (payload: ContactOfferPayload) => Promise<void> | void;
}

function formatDuration(h?: number) {
  if (!h || !Number.isFinite(h)) return "";
  return h === 1 ? "1 hr" : `${h} hrs`;
}

export function ContactOfferModal({
  open,
  travelerName,
  city,
  groupSize,
  durationHours,
  onClose,
  onSubmit,
}: Readonly<ContactOfferModalProps>) {
  const [priceRaw, setPriceRaw] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const offeredPrice = priceRaw.trim() === "" ? null : Number.parseFloat(priceRaw);
  const isInboxOnly = offeredPrice === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ offeredPrice, isInboxOnly, note });
      handleClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setPriceRaw("");
    setNote("");
    onClose();
  };

  // Build subtitle line
  let guestLabel: string | null = null;
  if (groupSize) {
    const guestNoun = groupSize === 1 ? "guest" : "guests";
    guestLabel = `${groupSize} ${guestNoun}`;
  }

  const durationLabel = formatDuration(durationHours) || null;
  const subtitleParts = [
    city,
    guestLabel,
    durationLabel,
  ].filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        showCloseButton={true}
        className="w-full max-w-sm sm:max-w-md rounded-2xl p-0 border-0 shadow-2xl max-h-[90dvh] overflow-y-auto [&>[data-slot=dialog-close]]:top-3.5 [&>[data-slot=dialog-close]]:right-3.5 [&>[data-slot=dialog-close]]:inline-flex [&>[data-slot=dialog-close]]:h-8 [&>[data-slot=dialog-close]]:w-8 [&>[data-slot=dialog-close]]:items-center [&>[data-slot=dialog-close]]:justify-center [&>[data-slot=dialog-close]]:rounded-full [&>[data-slot=dialog-close]]:bg-white/15 [&>[data-slot=dialog-close]]:text-white [&>[data-slot=dialog-close]]:opacity-100 [&>[data-slot=dialog-close]]:ring-1 [&>[data-slot=dialog-close]]:ring-white/35 [&>[data-slot=dialog-close]]:ring-offset-0 [&>[data-slot=dialog-close]]:transition-colors [&>[data-slot=dialog-close]]:hover:bg-white/25 [&>[data-slot=dialog-close]]:hover:text-white [&>[data-slot=dialog-close]]:focus-visible:ring-2 [&>[data-slot=dialog-close]]:focus-visible:ring-white/60 [&>[data-slot=dialog-close]]:data-[state=open]:bg-white/15 [&>[data-slot=dialog-close]]:data-[state=open]:text-white"
      >
        {/* ── Header gradient banner ── */}
        <div className="relative bg-linear-to-br from-slate-800 via-slate-700 to-slate-900 pl-5 pr-14 pt-5 pb-6">
          <DialogHeader className="text-left space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              Send an Offer
            </p>
            <DialogTitle className="text-xl font-bold text-white leading-tight">
              Contact to{" "}
              <span
                className="font-semibold italic"
                style={{ color: "#d4705a", fontFamily: "Georgia, serif" }}
              >
                {travelerName || "Traveler"}
              </span>
            </DialogTitle>
            {subtitleParts.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-300">
                {city && (
                  <span className="inline-flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                    <span>{city}</span>
                  </span>
                )}
                {guestLabel && (
                  <span className="inline-flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                    <span>{guestLabel}</span>
                  </span>
                )}
                {durationLabel && (
                  <span className="inline-flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{durationLabel}</span>
                  </span>
                )}
              </div>
            )}
          </DialogHeader>
        </div>

        {/* ── Form body ── */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 bg-white">

          {/* Offered Price field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-slate-400" />
              Your Price
              <span className="ml-auto text-xs font-normal text-slate-400">
                Optional
              </span>
            </label>

            <input
              type="number"
              min={0}
              step={0.01}
              placeholder="Enter your offer price"
              value={priceRaw}
              onChange={(e) => setPriceRaw(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all"
            />

            {/* Contextual hint */}
            {!isInboxOnly && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 transition-all duration-200">
                <span>
                  You&apos;re offering{" "}
                  <strong>${priceRaw}</strong> to the traveler
                </span>
              </div>
            )}
          </div>

          {/* Note / Message field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-slate-400" />
              Message to Traveler
            </label>
            <textarea
              rows={4}
              placeholder="Hi! I'd love to be your local buddy. Let's plan your tour together."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all"
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 rounded-xl h-11 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || note.trim() === ""}
              className="flex-1 rounded-xl h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Sending...</span>
                </span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Offer
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
