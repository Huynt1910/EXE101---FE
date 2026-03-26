"use client";

import { useState } from "react";
import { X, DollarSign, Send, Inbox, MessageSquare } from "lucide-react";
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

  const subtitleParts = [
    city,
    guestLabel,
    formatDuration(durationHours) || null,
  ].filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="w-full max-w-sm sm:max-w-md rounded-2xl p-0 border-0 shadow-2xl max-h-[90dvh] overflow-y-auto">
        {/* ── Header gradient banner ── */}
        <div className="relative bg-linear-to-br from-slate-800 via-slate-700 to-slate-900 px-5 pt-5 pb-6">
          {/* Close button */}
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full bg-white/10 hover:bg-white/20 p-1.5 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>

          <DialogHeader className="text-left space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              Send an Offer
            </p>
            <DialogTitle className="text-xl font-bold text-white leading-tight">
              Contact to {travelerName || "Traveler"}
            </DialogTitle>
            {subtitleParts.length > 0 && (
              <p className="text-sm text-slate-300">
                {subtitleParts.join(" · ")}
              </p>
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

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm select-none">
                $
              </span>
              <input
                type="number"
                min={0}
                step={0.01}
                placeholder="Leave empty to reply in inbox"
                value={priceRaw}
                onChange={(e) => setPriceRaw(e.target.value)}
                className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all"
              />
            </div>

            {/* Contextual hint */}
            <div
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ${isInboxOnly
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
            >
              {isInboxOnly ? (
                <>
                  <Inbox className="h-3.5 w-3.5 shrink-0" />
                  <span>No price set — this will be an inbox-only message</span>
                </>
              ) : (
                <>
                  <DollarSign className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    You&apos;re offering{" "}
                    <strong>{Number.parseFloat(priceRaw).toFixed(2)}</strong> to the traveler
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Note / Message field */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-slate-400" />
              Message to Traveler
            </label>
            <textarea
              rows={4}
              placeholder="Hi bạn, tôi có thể giúp gì ?"
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
