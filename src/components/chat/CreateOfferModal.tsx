"use client";

import Image from "next/image";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCreateBookingMutation } from "@/features/booking/hooks/useCreateBookingOffer";
import { chatQueryKeys } from "@/features/chat/api/chat.query-key";

type OfferForm = {
  bookedDate: string;
  bookedStartTime: string;
  bookedDurationHours: string;
  bookedAdults: number;
  bookedChildren: number;
  price: string;
  currency: string;
  includes: string;
  excludes: string;
  noteForCustomer: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  buddyName?: string;
  buddyAvatar?: string;
  tripRequestId?: string | null;
  chatRoomId?: string | null;
};

const CURRENCIES = ["USD", "VND", "EUR", "SGD", "THB"];
const INITIAL_FORM: OfferForm = {
  bookedDate: "",
  bookedStartTime: "",
  bookedDurationHours: "",
  bookedAdults: 1,
  bookedChildren: 0,
  price: "",
  currency: "USD",
  includes: "",
  excludes: "",
  noteForCustomer: "",
};

function normalizeStartTime(value: string) {
  if (!value) return value;
  return value.length === 5 ? `${value}:00` : value;
}

function PreviewRow({
  icon,
  label,
  value,
}: Readonly<{
  icon: React.ReactNode;
  label: string;
  value: string;
}>) {
  return (
    <div className="flex items-center gap-2">
      <span className="shrink-0 text-muted-foreground">{icon}</span>
      <span className="w-14 shrink-0 text-xs text-muted-foreground">
        {label}
      </span>
      <span className="text-xs font-medium text-foreground">{value}</span>
    </div>
  );
}

export default function CreateOfferModal({
  open,
  onClose,
  buddyName = "You",
  buddyAvatar,
  tripRequestId,
  chatRoomId,
}: Readonly<Props>) {
  const [form, setForm] = useState<OfferForm>(INITIAL_FORM);
  const [sent, setSent] = useState(false);
  const queryClient = useQueryClient();
  const createBookingMutation = useCreateBookingMutation();

  const isSending = createBookingMutation.isPending;
  const isRequiredFilled = Boolean(
    form.bookedDate &&
    form.bookedStartTime &&
    form.bookedDurationHours &&
    form.bookedAdults >= 1 &&
    form.price &&
    form.currency,
  );

  function handleChange(field: keyof OfferForm, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSend() {
    if (!isRequiredFilled || isSending) return;

    if (!tripRequestId && !chatRoomId) {
      toast.error(
        "Cannot create booking offer because trip request and chat room are missing.",
      );
      return;
    }

    const bookedDurationHours = Number(form.bookedDurationHours);
    const price = Number(form.price);

    if (!Number.isFinite(bookedDurationHours) || bookedDurationHours <= 0) {
      toast.error("Please select a valid booking duration.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      toast.error("Please enter a valid total price.");
      return;
    }

    try {
      const response = await createBookingMutation.mutateAsync({
        payload: {
          tripRequestId: tripRequestId ?? null,
          chatRoomId: tripRequestId ? null : (chatRoomId ?? null),
          bookedDate: form.bookedDate,
          bookedStartTime: normalizeStartTime(form.bookedStartTime),
          bookedDurationHours,
          bookedAdults: form.bookedAdults,
          bookedChildren: form.bookedChildren,
          price,
          currency: form.currency,
          includes: form.includes.trim(),
          excludes: form.excludes.trim(),
          noteForCustomer: form.noteForCustomer.trim(),
        },
      });

      const createdBookingRoomId = response.data?.data?.chatRoomId ?? chatRoomId ?? null;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() }),
        queryClient.invalidateQueries({ queryKey: chatQueryKeys.unreadSummary() }),
        createdBookingRoomId
          ? queryClient.invalidateQueries({
              queryKey: [...chatQueryKeys.messages(), createdBookingRoomId],
            })
          : queryClient.invalidateQueries({ queryKey: chatQueryKeys.messages() }),
      ]);

      await queryClient.refetchQueries({
        queryKey: createdBookingRoomId
          ? [...chatQueryKeys.messages(), createdBookingRoomId]
          : chatQueryKeys.messages(),
        type: "active",
      });

      setSent(true);
      toast.success(
        response.data.message ??
          response.message ??
          "Booking offer sent to traveler.",
      );

      setTimeout(() => {
        setSent(false);
        onClose();
        setForm(INITIAL_FORM);
      }, 1200);
    } catch (error) {
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String(
              (error as { message?: string }).message ??
                "Failed to create booking offer.",
            )
          : "Failed to create booking offer.";
      toast.error(message);
    }
  }

  function handleClose() {
    onClose();
    setSent(false);
  }

  if (!open) return null;

  const buddyInitial = buddyName.charAt(0).toUpperCase();
  const adultsLabel = `${form.bookedAdults} adult${form.bookedAdults === 1 ? "" : "s"}`;
  const childrenLabel =
    form.bookedChildren > 0
      ? `, ${form.bookedChildren} ${form.bookedChildren === 1 ? "child" : "children"}`
      : "";
  const guestsSummary = `${adultsLabel}${childrenLabel}`;
  const titleId = "create-offer-modal-title";
  const descriptionId = "create-offer-modal-description";
  const fieldClassName =
    "rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20";
  const stepperButtonClassName =
    "flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overscroll-contain bg-background/80 p-4 backdrop-blur-sm"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-secondary shadow-2xl"
      >
        <div className="flex shrink-0 items-start justify-between border-b border-border px-6 pb-4 pt-6">
          <div>
            <h2 id={titleId} className="text-xl font-bold text-foreground">
              Create final booking offer
            </h2>
            <p
              id={descriptionId}
              className="mt-0.5 text-sm text-muted-foreground"
            >
              This offer will be sent to the traveler in chat for review and
              payment.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSending}
            className="ml-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            aria-label="Close"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {sent ? (
          <div className="mx-6 mt-4 flex shrink-0 items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Booking offer sent to traveler
          </div>
        ) : null}

        <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5 scrollbar-hide">
            <div className="space-y-3 rounded-xl border border-border bg-secondary/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Schedule
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="offer-booked-date"
                    className="text-xs font-medium text-foreground"
                  >
                    Date <span className="text-primary">*</span>
                  </label>
                  <input
                    id="offer-booked-date"
                    name="offer-booked-date"
                    type="date"
                    value={form.bookedDate}
                    onChange={(e) => handleChange("bookedDate", e.target.value)}
                    autoComplete="off"
                    className={fieldClassName}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="offer-booked-start-time"
                    className="text-xs font-medium text-foreground"
                  >
                    Start time <span className="text-primary">*</span>
                  </label>
                  <input
                    id="offer-booked-start-time"
                    name="offer-booked-start-time"
                    type="time"
                    value={form.bookedStartTime}
                    onChange={(e) =>
                      handleChange("bookedStartTime", e.target.value)
                    }
                    autoComplete="off"
                    className={fieldClassName}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="offer-booked-duration"
                    className="text-xs font-medium text-foreground"
                  >
                    Duration <span className="text-primary">*</span>
                  </label>
                  <select
                    id="offer-booked-duration"
                    name="offer-booked-duration"
                    value={form.bookedDurationHours}
                    onChange={(e) =>
                      handleChange("bookedDurationHours", e.target.value)
                    }
                    autoComplete="off"
                    className={fieldClassName}
                  >
                    <option value="">Select hours</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
                      <option key={hour} value={hour}>
                        {hour} {hour === 1 ? "hour" : "hours"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-border bg-secondary/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Guests
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="offer-booked-adults"
                    className="text-xs font-medium text-foreground"
                  >
                    Adults <span className="text-primary">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleChange(
                          "bookedAdults",
                          Math.max(1, form.bookedAdults - 1),
                        )
                      }
                      className={stepperButtonClassName}
                      aria-label="Decrease adult guests"
                    >
                      -
                    </button>
                    <span
                      id="offer-booked-adults"
                      className="w-8 text-center text-sm font-semibold text-foreground"
                    >
                      {form.bookedAdults}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleChange("bookedAdults", form.bookedAdults + 1)
                      }
                      className={stepperButtonClassName}
                      aria-label="Increase adult guests"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="offer-booked-children"
                    className="text-xs font-medium text-foreground"
                  >
                    Children
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleChange(
                          "bookedChildren",
                          Math.max(0, form.bookedChildren - 1),
                        )
                      }
                      className={stepperButtonClassName}
                      aria-label="Decrease child guests"
                    >
                      -
                    </button>
                    <span
                      id="offer-booked-children"
                      className="w-8 text-center text-sm font-semibold text-foreground"
                    >
                      {form.bookedChildren}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleChange("bookedChildren", form.bookedChildren + 1)
                      }
                      className={stepperButtonClassName}
                      aria-label="Increase child guests"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Total price
              </p>
              <div className="flex items-center gap-2">
                <input
                  id="offer-price"
                  name="offer-price"
                  type="number"
                  min={0}
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  autoComplete="off"
                  className="min-w-0 flex-1 rounded-xl border border-primary/20 bg-background px-4 py-3 text-2xl font-bold text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                />
                <select
                  id="offer-currency"
                  name="offer-currency"
                  value={form.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  autoComplete="off"
                  className="rounded-xl border border-primary/20 bg-background px-3 py-3 text-sm font-semibold text-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-primary/70">
                Required - This is the final agreed price
              </p>
            </div>

            <div className="space-y-3 rounded-xl border border-border bg-secondary/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                What&apos;s included
              </p>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="offer-includes"
                  className="text-xs font-medium text-foreground"
                >
                  Includes
                </label>
                <textarea
                  id="offer-includes"
                  name="offer-includes"
                  rows={3}
                  placeholder="e.g. Transportation, entrance fees, meal, guide…"
                  value={form.includes}
                  onChange={(e) => handleChange("includes", e.target.value)}
                  autoComplete="off"
                  className={`${fieldClassName} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="offer-excludes"
                  className="text-xs font-medium text-foreground"
                >
                  Excludes
                </label>
                <textarea
                  id="offer-excludes"
                  name="offer-excludes"
                  rows={2}
                  placeholder="e.g. Personal shopping, tips, extra drinks…"
                  value={form.excludes}
                  onChange={(e) => handleChange("excludes", e.target.value)}
                  autoComplete="off"
                  className={`${fieldClassName} resize-none`}
                />
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-border bg-secondary/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Message to traveler
              </p>
              <textarea
                id="offer-note-for-customer"
                name="offer-note-for-customer"
                rows={3}
                placeholder="Share a warm personal note about the plan, what to expect, and why they will love it…"
                value={form.noteForCustomer}
                onChange={(e) =>
                  handleChange("noteForCustomer", e.target.value)
                }
                autoComplete="off"
                className={`${fieldClassName} w-full resize-none`}
              />
            </div>
          </div>

          <div className="hidden w-px shrink-0 bg-border md:block" />

          <div className="hidden w-80 shrink-0 flex-col overflow-y-auto px-5 py-5 scrollbar-hide md:flex xl:w-96">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Live preview
            </p>
            <div className="overflow-hidden rounded-2xl border border-primary/20 bg-secondary shadow-lg">
              <div className="bg-primary px-4 pb-5 pt-4">
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/20">
                    {buddyAvatar ? (
                      <Image
                        src={buddyAvatar}
                        alt={buddyName}
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-sm font-bold text-white">
                        {buddyInitial}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-primary-foreground/70">From</p>
                    <p className="text-sm font-semibold text-primary-foreground">
                      {buddyName}
                    </p>
                  </div>
                  <span className="ml-auto rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
                    Final booking offer
                  </span>
                </div>
                <p className="text-2xl font-bold text-primary-foreground">
                  {form.price ? (
                    `${Number(form.price).toLocaleString()} ${form.currency}`
                  ) : (
                    <span className="opacity-40">Price TBD</span>
                  )}
                </p>
              </div>

              <div className="space-y-2.5 px-4 py-3 text-sm">
                <PreviewRow
                  icon={
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  }
                  label="Date"
                  value={form.bookedDate || "Not set"}
                />
                <PreviewRow
                  icon={
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  }
                  label="Start"
                  value={form.bookedStartTime || "Not set"}
                />
                <PreviewRow
                  icon={
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  }
                  label="Duration"
                  value={
                    form.bookedDurationHours
                      ? `${form.bookedDurationHours}h`
                      : "Not set"
                  }
                />
                <PreviewRow
                  icon={
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  }
                  label="Guests"
                  value={guestsSummary}
                />

                {form.includes ? (
                  <div className="border-t border-border pt-1">
                    <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Includes
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {form.includes}
                    </p>
                  </div>
                ) : null}
                {form.excludes ? (
                  <div className="border-t border-border pt-1">
                    <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Excludes
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {form.excludes}
                    </p>
                  </div>
                ) : null}
                {form.noteForCustomer ? (
                  <div className="border-t border-border pt-1">
                    <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Message
                    </p>
                    <p className="text-xs italic leading-relaxed text-muted-foreground">
                      &ldquo;{form.noteForCustomer}&rdquo;
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2 border-t border-amber-100 bg-amber-50 px-4 py-3">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-amber-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-[11px] font-medium text-amber-600">
                  Awaiting traveler review
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSending}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={!isRequiredFilled || sent || isSending}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
