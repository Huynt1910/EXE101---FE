'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  useBookingDetailQuery,
  useConfirmAndCreatePaypalOrderMutation,
} from '@/features/booking/hooks/useCreateBookingOffer';
import { useTripDetail } from '@/features/trip/hooks/useTripRequest';

type PaymentMethod = 'paypal' | 'bank_transfer';

function formatBookingDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function formatTime(value: string) {
  if (!value) return '—';
  return value.slice(0, 5);
}

function formatCurrency(amount: number | string, currency: string) {
  if (currency === 'USD') return `$${amount}`;
  if (currency === 'VND') return `${amount} VND`;
  return `${currency}${amount}`;
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = typeof params.id === 'string' ? params.id : null;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('paypal');

  const bookingQuery = useBookingDetailQuery(bookingId);
  const confirmAndPayMutation = useConfirmAndCreatePaypalOrderMutation();

  const booking = bookingQuery.data?.data;
  const tripQuery = useTripDetail(booking?.tripId ?? '', {
    enabled: Boolean(booking?.tripId),
  });

  const tripCity = tripQuery.data?.data?.city;
  const tripTitle = tripCity ? `Trip to ${tripCity}` : `Trip with ${booking?.buddyName ?? ''}`;
  const totalPeople = (booking?.bookedAdults ?? 0) + (booking?.bookedChildren ?? 0);

  async function handlePay() {
    if (!bookingId || confirmAndPayMutation.isPending) return;

    if (selectedMethod === 'bank_transfer') {
      toast.info('Bank transfer payment is coming soon.');
      return;
    }

    try {
      const response = await confirmAndPayMutation.mutateAsync({ bookingId });
      const paymentOrder = response.data.paymentOrder;

      sessionStorage.setItem('pendingPaymentId', paymentOrder.paymentId);
      sessionStorage.setItem('pendingOrderId', paymentOrder.orderId);
      sessionStorage.setItem('pendingBookingId', paymentOrder.bookingId);

      if (!paymentOrder.approveUrl) {
        toast.error('Missing PayPal approval URL.');
        return;
      }

      globalThis.location.href = paymentOrder.approveUrl;
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? String((error as { message?: string }).message ?? 'Failed to initialize payment.')
          : 'Failed to initialize payment.';
      toast.error(message);
    }
  }

  if (bookingQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#1a2b4a]" />
      </div>
    );
  }

  if (bookingQuery.isError || !booking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          Unable to load booking details. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 active:scale-95 transition-transform"
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Mobile: summary first → payment below. Desktop: flex-row-reverse → payment left, summary right */}
      <div className="flex flex-col gap-8 lg:flex-row-reverse lg:items-start">
        {/* ── Right on desktop / Bottom on mobile: Booking summary card ── */}
        <div className="w-full lg:w-90 lg:shrink-0">
          <div className="rounded-3xl border border-gray-200 bg-white shadow-lg">
            {/* Image banner */}
            <div className="relative h-36 overflow-hidden rounded-t-3xl bg-linear-to-br from-[#1a2b4a] to-[#2d6a4f]">
              {booking.buddyAvatar ? (
                <img
                  src={booking.buddyAvatar}
                  alt={booking.buddyName}
                  className="h-full w-full object-cover opacity-60"
                />
              ) : null}
              <div className="absolute left-3 top-3 rounded-full bg-[#2d6a4f] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                Instantly confirmed
              </div>
            </div>

            {/* Buddy avatar — outside overflow-hidden so it's not clipped */}
            <div className="relative flex justify-center">
              <div className="absolute -top-7 h-14 w-14 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-md">
                {booking.buddyAvatar ? (
                  <img
                    src={booking.buddyAvatar}
                    alt={booking.buddyName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#1a2b4a] text-lg font-bold text-white">
                    {booking.buddyName?.[0] ?? '?'}
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 pb-5 pt-10">
              {/* Trip title */}
              <div className="text-center">
                <h2 className="text-lg font-bold leading-tight text-gray-900">{tripTitle}</h2>
                <p
                  className="mt-0.5 font-semibold italic"
                  style={{ color: '#d4705a', fontFamily: 'Georgia, serif' }}
                >
                  with {booking.buddyName}
                </p>
              </div>

              {/* Details row */}
              <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatBookingDate(booking.bookedDate)}
                </span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatTime(booking.bookedStartTime)}
                </span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  {totalPeople} {totalPeople === 1 ? 'person' : 'people'}
                </span>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>Subtotal ({formatCurrency(booking.price, booking.currency)} pp)</span>
                  <span>{formatCurrency(booking.price, booking.currency)}</span>
                </div>

                {/* Service fee */}
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span className="flex items-center gap-1">
                    Service fee
                    <span className="group relative inline-flex">
                      <button type="button" className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-[10px] text-gray-400 hover:border-gray-400">
                        ?
                      </button>
                      <div className="pointer-events-none absolute left-0 top-6 z-50 w-64 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-xs text-gray-700 shadow-2xl opacity-0 transition-opacity group-hover:opacity-100">
                        <p>This helps us run our platform and offer services like support on your trip</p>
                        <p className="mt-1">It includes VAT</p>
                      </div>
                    </span>
                  </span>
                  <span>{formatCurrency(booking.platformFeeAmount, booking.currency)}</span>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-sm font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(booking.totalAmount, booking.currency)}</span>
                </div>
              </div>

              {/* Redeem coupon */}
              <button type="button" className="mt-3 text-sm font-medium text-[#2d6a4f] hover:underline">
                + Redeem your coupon
              </button>

              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pay online now:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(booking.totalAmount, booking.currency)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                  <button type="button" className="hover:underline">cancellation policy</button>
                  <span>Prices in {booking.currency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Left on desktop / Top on mobile: Choose payment ── */}
        <div className="flex-1">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Choose payment</h1>

          {/* PayPal */}
          <div
            className={`mb-3 w-full rounded-2xl border-2 text-left transition-colors ${
              selectedMethod === 'paypal'
                ? 'border-[#003087] bg-white'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            {/* Header row — clickable */}
            <button
              type="button"
              onClick={() => setSelectedMethod('paypal')}
              className="flex w-full items-center gap-3 px-4 py-4"
            >
              <div
                className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                  selectedMethod === 'paypal'
                    ? 'border-[#003087] bg-[#003087]'
                    : 'border-gray-400'
                } flex items-center justify-center`}
              >
                {selectedMethod === 'paypal' && (
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </div>
              {/* PayPal logo */}
              <svg viewBox="0 0 101 32" className="h-5 w-14" xmlns="http://www.w3.org/2000/svg">
                <path fill="#003087" d="M12.237 2.8H5.388C4.9 2.8 4.48 3.16 4.4 3.64L1.63 21.24c-.06.36.22.68.58.68h3.35c.48 0 .9-.36.97-.84l.76-4.8c.07-.48.49-.84.97-.84h2.17c4.52 0 7.13-2.18 7.81-6.51.31-1.89.01-3.38-.88-4.42-.98-1.15-2.72-1.71-4.99-1.71zm.79 6.41c-.38 2.47-2.26 2.47-4.09 2.47h-1.04l.73-4.6c.04-.28.29-.49.57-.49h.48c1.24 0 2.42 0 3.02.71.36.42.47 1.05.33 1.91z"/>
                <path fill="#003087" d="M35.297 9.16h-3.36c-.29 0-.53.21-.57.49l-.15.93-.23-.33c-.72-1.04-2.32-1.39-3.92-1.39-3.67 0-6.8 2.78-7.41 6.67-.32 1.94.13 3.79 1.23 5.09 1.01 1.19 2.45 1.68 4.16 1.68 2.96 0 4.6-1.9 4.6-1.9l-.15.92c-.06.36.22.68.58.68h3.03c.48 0 .89-.36.97-.84l1.81-11.49c.06-.37-.22-.69-.59-.51zm-4.68 6.45c-.32 1.9-1.83 3.17-3.76 3.17-.97 0-1.74-.31-2.23-.9-.49-.58-.68-1.42-.52-2.35.3-1.88 1.83-3.19 3.73-3.19.94 0 1.71.31 2.21.91.51.6.71 1.44.57 2.36z"/>
                <path fill="#009cde" d="M55.297 9.16h-3.37c-.32 0-.62.16-.8.42l-4.64 6.83-1.97-6.57c-.12-.41-.5-.68-.93-.68h-3.31c-.41 0-.69.4-.56.79l3.71 10.88-3.49 4.92c-.28.4 0 .94.47.94h3.37c.32 0 .62-.15.8-.41l11.21-16.19c.27-.39 0-.93-.49-.93z"/>
                <path fill="#009cde" d="M66.952 2.8h-6.85c-.48 0-.9.36-.97.84l-2.77 17.6c-.06.36.22.68.58.68h3.59c.34 0 .62-.24.67-.58l.79-4.99c.07-.48.49-.84.97-.84h2.17c4.52 0 7.13-2.18 7.81-6.51.31-1.89.01-3.38-.88-4.42-.98-1.16-2.72-1.78-5.01-1.78zm.79 6.41c-.37 2.47-2.26 2.47-4.09 2.47h-1.04l.73-4.6c.04-.28.29-.49.57-.49h.48c1.24 0 2.42 0 3.02.71.37.42.48 1.05.33 1.91z"/>
                <path fill="#009cde" d="M90.013 9.16h-3.36c-.29 0-.53.21-.57.49l-.15.93-.23-.33c-.72-1.04-2.32-1.39-3.92-1.39-3.67 0-6.8 2.78-7.41 6.67-.32 1.94.13 3.79 1.23 5.09 1.01 1.19 2.45 1.68 4.16 1.68 2.96 0 4.6-1.9 4.6-1.9l-.15.92c-.06.36.22.68.58.68h3.03c.48 0 .89-.36.97-.84l1.81-11.49c.06-.37-.22-.69-.59-.51zm-4.68 6.45c-.32 1.9-1.83 3.17-3.76 3.17-.97 0-1.74-.31-2.23-.9-.49-.58-.68-1.42-.52-2.35.3-1.88 1.83-3.19 3.73-3.19.94 0 1.71.31 2.21.91.5.6.71 1.44.57 2.36z"/>
                <path fill="#009cde" d="M94.313 3.21l-2.81 17.83c-.06.36.22.68.58.68h2.9c.48 0 .9-.36.97-.84l2.77-17.6c.06-.36-.22-.68-.58-.68h-3.25c-.29 0-.54.21-.58.61z"/>
              </svg>
              <span className="text-sm font-semibold text-[#003087]">PayPal</span>
            </button>

            {/* Dropdown content — shown when selected */}
            {selectedMethod === 'paypal' && (
              <div className="mx-4 mb-4 rounded-xl border border-gray-200 bg-white">
                {/* PayPal icon + "PayPal selected." */}
                <div className="flex items-center gap-3 px-4 py-4">
                  {/* PayPal P mark */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8 shrink-0">
                    <path
                      fill="#009cde"
                      d="M7.5 21.5l.8-5h-.9l.2-1.2h.9l1.1-6.8h4c1.3 0 2.2.3 2.8.9.5.6.7 1.4.5 2.5-.3 1.8-1.4 2.8-3.3 2.8H12l-.6 3.8H9.7l-.2 1.2h1.7l-.3 1.8H7.5z"
                    />
                    <path
                      fill="#003087"
                      d="M6.1 21.5l1.9-12h4.3c1.4 0 2.4.3 3 1 .6.7.8 1.6.6 2.8-.4 2.1-1.8 3.2-4.1 3.2h-1.7l-.7 4.3H7.8l-.2 1.2H6.1v-.5z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-800">PayPal selected.</span>
                </div>

                <div className="border-t border-gray-200" />

                {/* Redirect notice */}
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Browser/redirect icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                    <rect x="2" y="4" width="16" height="12" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9l4 3-4 3" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 7h16" />
                  </svg>
                  <p className="text-xs text-gray-500">
                    After submission, you will be redirected to securely complete next steps.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bank Transfer */}
          <button
            type="button"
            onClick={() => setSelectedMethod('bank_transfer')}
            className={`mb-8 w-full rounded-2xl border-2 p-4 text-left transition-colors ${
              selectedMethod === 'bank_transfer'
                ? 'border-[#1a2b4a] bg-white'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                  selectedMethod === 'bank_transfer'
                    ? 'border-[#1a2b4a] bg-[#1a2b4a]'
                    : 'border-gray-400'
                } flex items-center justify-center`}
              >
                {selectedMethod === 'bank_transfer' && (
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10.5l9-7.5 9 7.5M4.5 9v9a.75.75 0 00.75.75h4.5V15h3v3.75h4.5a.75.75 0 00.75-.75V9"
                />
              </svg>
              <div>
                <span className="text-sm font-medium text-gray-700">Bank transfer</span>
                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                  Coming soon
                </span>
              </div>
            </div>
          </button>

          {/* Pay button */}
          <button
            type="button"
            onClick={handlePay}
            disabled={confirmAndPayMutation.isPending}
            className="w-full rounded-2xl bg-[#2d6a4f] py-4 text-base font-semibold text-white shadow-sm transition-[background-color,transform,box-shadow] hover:bg-[#235a42] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {confirmAndPayMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing…
              </span>
            ) : (
              `Pay ${booking.totalAmount} ${booking.currency}`
            )}
          </button>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your payment is <strong>encrypted</strong> and completely <strong>secure</strong>
          </p>
        </div>

      </div>
    </div>
  );
}
