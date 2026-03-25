'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useCreateBookingMutation } from '@/features/booking/hooks/useCreateBookingOffer';

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

const CURRENCIES = ['USD', 'VND', 'EUR', 'SGD', 'THB'];
const INITIAL_FORM: OfferForm = {
  bookedDate: '',
  bookedStartTime: '',
  bookedDurationHours: '',
  bookedAdults: 1,
  bookedChildren: 0,
  price: '',
  currency: 'USD',
  includes: '',
  excludes: '',
  noteForCustomer: '',
};

function normalizeStartTime(value: string) {
  if (!value) return value;
  return value.length === 5 ? `${value}:00` : value;
}

export default function CreateOfferModal({
  open,
  onClose,
  buddyName = 'You',
  buddyAvatar,
  tripRequestId,
  chatRoomId,
}: Readonly<Props>) {
  const [form, setForm] = useState<OfferForm>(INITIAL_FORM);
  const [sent, setSent] = useState(false);
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
    if (!isRequiredFilled) return;
    if (isSending) return;

    if (!tripRequestId && !chatRoomId) {
      toast.error('Cannot create booking offer because trip request and chat room are missing.');
      return;
    }

    const bookedDurationHours = Number(form.bookedDurationHours);
    const price = Number(form.price);

    if (!Number.isFinite(bookedDurationHours) || bookedDurationHours <= 0) {
      toast.error('Please select a valid booking duration.');
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      toast.error('Please enter a valid total price.');
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

      setSent(true);
      toast.success(response.data.message ?? response.message ?? 'Booking offer sent to traveler.');

      setTimeout(() => {
        setSent(false);
        onClose();
        setForm(INITIAL_FORM);
      }, 1200);
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? String((error as { message?: string }).message ?? 'Failed to create booking offer.')
          : 'Failed to create booking offer.';
      toast.error(message);
    }
  }

  function handleClose() {
    onClose();
    setSent(false);
  }

  if (!open) return null;

  const buddyInitial = buddyName.charAt(0).toUpperCase();
  const adultsLabel = `${form.bookedAdults} adult${form.bookedAdults === 1 ? '' : 's'}`;
  let childrenLabel = '';
  if (form.bookedChildren > 0) {
    const childrenText = form.bookedChildren === 1 ? 'child' : 'children';
    childrenLabel = `, ${form.bookedChildren} ${childrenText}`;
  }
  const guestsSummary = `${adultsLabel}${childrenLabel}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div
        className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl flex flex-col"
        style={{ maxHeight: '92vh' }}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create final booking offer</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              This offer will be sent to the traveler in chat for review and payment.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSending}
            className="ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Success Banner */}
        {sent && (
          <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-700 text-sm font-medium shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Booking offer sent to traveler
          </div>
        )}

        {/* Body */}
        <div className="flex flex-col md:flex-row gap-0 flex-1 overflow-hidden">
          {/* Left: Form */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 scrollbar-hide">

            {/* A. Schedule */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Schedule</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="offer-booked-date" className="text-xs font-medium text-gray-600">Date <span className="text-primary">*</span></label>
                  <input
                    id="offer-booked-date"
                    type="date"
                    value={form.bookedDate}
                    onChange={(e) => handleChange('bookedDate', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="offer-booked-start-time" className="text-xs font-medium text-gray-600">Start time <span className="text-primary">*</span></label>
                  <input
                    id="offer-booked-start-time"
                    type="time"
                    value={form.bookedStartTime}
                    onChange={(e) => handleChange('bookedStartTime', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="offer-booked-duration" className="text-xs font-medium text-gray-600">Duration <span className="text-primary">*</span></label>
                  <select
                    id="offer-booked-duration"
                    value={form.bookedDurationHours}
                    onChange={(e) => handleChange('bookedDurationHours', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select hours</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                      <option key={h} value={h}>{h} {h === 1 ? 'hour' : 'hours'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* B. Guests */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Guests</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="offer-booked-adults" className="text-xs font-medium text-gray-600">Adults <span className="text-primary">*</span></label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleChange('bookedAdults', Math.max(1, form.bookedAdults - 1))}
                      className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors"
                    >−</button>
                    <span id="offer-booked-adults" className="w-8 text-center text-sm font-semibold text-gray-900">{form.bookedAdults}</span>
                    <button
                      type="button"
                      onClick={() => handleChange('bookedAdults', form.bookedAdults + 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors"
                    >+</button>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="offer-booked-children" className="text-xs font-medium text-gray-600">Children</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleChange('bookedChildren', Math.max(0, form.bookedChildren - 1))}
                      className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors"
                    >−</button>
                    <span id="offer-booked-children" className="w-8 text-center text-sm font-semibold text-gray-900">{form.bookedChildren}</span>
                    <button
                      type="button"
                      onClick={() => handleChange('bookedChildren', form.bookedChildren + 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* C. Price */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Total price</p>
              <div className="flex items-center gap-2">
                <input
                  id="offer-price"
                  type="number"
                  min={0}
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-primary/20 bg-white text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-300"
                />
                <select
                  id="offer-currency"
                  value={form.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="px-3 py-3 rounded-xl border border-primary/20 bg-white text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-primary/70">Required · This is the final agreed price</p>
            </div>

            {/* D. Includes / Excludes */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">What&apos;s included</p>
              <div className="flex flex-col gap-1">
                <label htmlFor="offer-includes" className="text-xs font-medium text-gray-600">Includes</label>
                <textarea
                  id="offer-includes"
                  rows={3}
                  placeholder="e.g. Transportation, entrance fees, meal, guide…"
                  value={form.includes}
                  onChange={(e) => handleChange('includes', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="offer-excludes" className="text-xs font-medium text-gray-600">Excludes</label>
                <textarea
                  id="offer-excludes"
                  rows={2}
                  placeholder="e.g. Personal shopping, tips, extra drinks…"
                  value={form.excludes}
                  onChange={(e) => handleChange('excludes', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* E. Message to traveler */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Message to traveler</p>
              <textarea
                id="offer-note-for-customer"
                rows={3}
                placeholder="Share a warm personal note about the plan, what to expect, and why they'll love it…"
                value={form.noteForCustomer}
                onChange={(e) => handleChange('noteForCustomer', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-gray-100 shrink-0" />

          {/* Right: Live Preview */}
          <div className="hidden md:flex w-80 xl:w-96 flex-col px-5 py-5 shrink-0 overflow-y-auto scrollbar-hide">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Live preview</p>
            <div className="rounded-2xl border border-primary/20 bg-white shadow-lg overflow-hidden">
              {/* Card header */}
              <div className="bg-primary px-4 pt-4 pb-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden shrink-0">
                    {buddyAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={buddyAvatar} alt={buddyName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-white">{buddyInitial}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-primary-foreground/70">From</p>
                    <p className="text-sm font-semibold text-primary-foreground">{buddyName}</p>
                  </div>
                  <span className="ml-auto text-[10px] font-semibold bg-white/20 text-primary-foreground px-2.5 py-1 rounded-full">
                    Final booking offer
                  </span>
                </div>
                <p className="text-2xl font-bold text-primary-foreground">
                  {form.price ? `${Number(form.price).toLocaleString()} ${form.currency}` : <span className="opacity-40">Price TBD</span>}
                </p>
              </div>

              {/* Card body */}
              <div className="px-4 py-3 space-y-2.5 text-sm">
                <PreviewRow
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  }
                  label="Date"
                  value={form.bookedDate || '—'}
                />
                <PreviewRow
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  }
                  label="Start"
                  value={form.bookedStartTime || '—'}
                />
                <PreviewRow
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  }
                  label="Duration"
                  value={form.bookedDurationHours ? `${form.bookedDurationHours}h` : '—'}
                />
                <PreviewRow
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  }
                  label="Guests"
                  value={guestsSummary}
                />

                {form.includes && (
                  <div className="pt-1 border-t border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Includes</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{form.includes}</p>
                  </div>
                )}
                {form.excludes && (
                  <div className="pt-1 border-t border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Excludes</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{form.excludes}</p>
                  </div>
                )}
                {form.noteForCustomer && (
                  <div className="pt-1 border-t border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Message</p>
                    <p className="text-xs text-gray-600 leading-relaxed italic">&ldquo;{form.noteForCustomer}&rdquo;</p>
                  </div>
                )}
              </div>

              {/* Card footer */}
              <div className="px-4 py-3 bg-amber-50 border-t border-amber-100 flex items-center gap-2">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-[11px] text-amber-600 font-medium">Awaiting traveler review</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSending}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={!isRequiredFilled || sent || isSending}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
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
      <span className="text-gray-400 shrink-0">{icon}</span>
      <span className="text-gray-400 text-xs w-14 shrink-0">{label}</span>
      <span className="text-gray-700 text-xs font-medium">{value}</span>
    </div>
  );
}
