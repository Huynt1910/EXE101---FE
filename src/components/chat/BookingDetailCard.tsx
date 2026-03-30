'use client';

import { toast } from 'sonner';
import {
  useBookingDetailQuery,
  useConfirmAndCreatePaypalOrderMutation,
} from '@/features/booking/hooks/useCreateBookingOffer';

type Props = {
  bookingId?: string | null;
  currentUserId?: string;
  isMine?: boolean;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatTime(value: string) {
  if (!value) return '—';
  return value.slice(0, 5);
}

function getBookingStatusLabel(statusName: string) {
  if (statusName === 'PendingCustomerConfirm') return 'Waiting for confirmation';
  if (statusName === 'PendingPayment') return 'Waiting for payment';
  if (statusName === 'Confirmed') return 'Paid';
  if (statusName === 'Cancelled') return 'Cancelled';
  if (statusName === 'CancelledByTimeout') return 'Cancelled by timeout';
  if (statusName === 'Expired') return 'Expired';
  if (statusName === 'Completed') return 'Completed';
  if (statusName === 'InProgress') return 'In progress';
  return statusName;
}

function getStatusVariant(statusName: string): 'pending' | 'success' | 'danger' | 'neutral' {
  if (statusName === 'PendingCustomerConfirm' || statusName === 'PendingPayment') return 'pending';
  if (statusName === 'Confirmed' || statusName === 'Completed' || statusName === 'InProgress') return 'success';
  if (statusName === 'Cancelled' || statusName === 'CancelledByTimeout' || statusName === 'Expired') return 'danger';
  return 'neutral';
}

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  danger: 'bg-red-100 text-red-600 border-red-200',
  neutral: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function BookingDetailCard({ bookingId, currentUserId, isMine = false }: Readonly<Props>) {
  const bookingDetailQuery = useBookingDetailQuery(bookingId);
  const confirmAndPayMutation = useConfirmAndCreatePaypalOrderMutation();

  if (!bookingId) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        Booking card is missing booking id.
      </div>
    );
  }

  if (bookingDetailQuery.isLoading) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-pulse space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-gray-200" />
          <div className="h-4 w-28 rounded bg-gray-200" />
          <div className="ml-auto h-5 w-20 rounded-full bg-gray-100" />
        </div>
        <div className="h-px bg-gray-100" />
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-2.5 w-12 rounded bg-gray-100" />
              <div className="h-3.5 w-20 rounded bg-gray-200" />
            </div>
          ))}
        </div>
        <div className="h-16 rounded-xl bg-gray-100" />
        <div className="h-8 w-36 rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (bookingDetailQuery.isError || !bookingDetailQuery.data?.data) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
        <p>Unable to load booking detail.</p>
        <button
          type="button"
          onClick={() => bookingDetailQuery.refetch()}
          className="mt-2 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-700 border border-red-200 hover:bg-red-50 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const booking = bookingDetailQuery.data.data;
  const normalizedCurrentUserId = currentUserId?.trim().toLowerCase() ?? '';
  const isTraveler =
    Boolean(normalizedCurrentUserId) &&
    booking.travelerUserId.trim().toLowerCase() === normalizedCurrentUserId;

  const canConfirmAndPay =
    isTraveler &&
    (booking.statusName === 'PendingCustomerConfirm' || booking.statusName === 'PendingPayment');

  const paymentLabel = booking.statusName === 'PendingPayment' ? 'Continue to PayPal' : 'Confirm & Pay';
  const statusLabel = getBookingStatusLabel(booking.statusName);
  const statusVariant = getStatusVariant(booking.statusName);

  async function handleConfirmAndPay() {
    if (!canConfirmAndPay || confirmAndPayMutation.isPending) return;

    try {
      const response = await confirmAndPayMutation.mutateAsync({ bookingId: booking.id });
      const paymentOrder = response.data.paymentOrder;

      sessionStorage.setItem('pendingPaymentId', paymentOrder.paymentId);
      sessionStorage.setItem('pendingOrderId', paymentOrder.orderId);
      sessionStorage.setItem('pendingBookingId', paymentOrder.bookingId);

      if (!paymentOrder.approveUrl) {
        toast.error('Missing PayPal approval url.');
        return;
      }

      window.location.href = paymentOrder.approveUrl;
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? String((error as { message?: string }).message ?? 'Failed to initialize PayPal payment.')
          : 'Failed to initialize PayPal payment.';
      toast.error(message);
    }
  }

  const cardBase = isMine
    ? 'border-amber-300/60 bg-gradient-to-br from-[#fffbe6] to-[#fff3b0] shadow-amber-100/80'
    : 'border-gray-200 bg-white shadow-gray-100/80';

  const dividerColor = isMine ? 'border-amber-200/70' : 'border-gray-100';
  const labelColor = isMine ? 'text-amber-800/60' : 'text-gray-400';
  const valueColor = isMine ? 'text-amber-900' : 'text-gray-800';
  const sectionBg = isMine ? 'bg-amber-50/60 border-amber-200/50' : 'bg-gray-50 border-gray-200/60';
  const noteColor = isMine ? 'text-amber-700/70' : 'text-gray-400';
  const totalValueColor = isMine ? 'text-amber-900 font-bold' : 'text-[#1a2b4a] font-bold';
  const headerIconBg = isMine ? 'bg-amber-400/20 text-amber-600' : 'bg-[#1a2b4a]/10 text-[#1a2b4a]';

  return (
    <div
      className={`w-full max-w-sm rounded-2xl border shadow-md ${cardBase} overflow-hidden`}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-sm font-bold ${valueColor}`}>Booking summary</p>
          <span
            className={`flex-shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${statusStyles[statusVariant]}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div className={`border-t ${dividerColor}`} />

      {/* Info Grid */}
      <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-3">
        <div>
          <p className={`text-[10px] font-semibold uppercase tracking-wider ${labelColor} mb-0.5`}>
            Date & Time
          </p>
          <p className={`text-xs font-medium ${valueColor}`}>
            {formatDate(booking.bookedDate)}
          </p>
          <p className={`text-xs ${isMine ? 'text-amber-800/50' : 'text-gray-500'}`}>
            at {formatTime(booking.bookedStartTime)}
          </p>
        </div>

        <div>
          <p className={`text-[10px] font-semibold uppercase tracking-wider ${labelColor} mb-0.5`}>
            Duration
          </p>
          <p className={`text-xs font-medium ${valueColor}`}>
            {booking.bookedDurationHours} {booking.bookedDurationHours === 1 ? 'hour' : 'hours'}
          </p>
        </div>

        <div>
          <p className={`text-[10px] font-semibold uppercase tracking-wider ${labelColor} mb-0.5`}>
            Group size
          </p>
          <p className={`text-xs font-medium ${valueColor}`}>
            {booking.bookedAdults} {booking.bookedAdults === 1 ? 'adult' : 'adults'}
          </p>
          <p className={`text-xs ${isMine ? 'text-amber-800/50' : 'text-gray-500'}`}>
            {booking.bookedChildren} {booking.bookedChildren === 1 ? 'child' : 'children'}
          </p>
        </div>

        <div>
          <p className={`text-[10px] font-semibold uppercase tracking-wider ${labelColor} mb-0.5`}>
            Tour price
          </p>
          <p className={`text-xs font-medium ${valueColor}`}>
            {booking.price} {booking.currency}
            <span className={`ml-1.5 text-[10px] font-normal ${isMine ? 'text-amber-800/50' : 'text-gray-400'}`}>
              (+ {booking.platformFeeAmount} {booking.currency} fee)
            </span>
          </p>
        </div>
      </div>

      {/* Includes / Excludes / Note */}
      <div className={`mx-4 mb-3 rounded-xl border ${sectionBg} px-3 py-2.5 space-y-1.5`}>
        <div className="flex gap-1.5 items-start">
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${labelColor} w-14 flex-shrink-0 pt-px`}>
            Includes
          </span>
          <span className={`text-xs leading-relaxed ${valueColor}`}>
            {booking.includes || '—'}
          </span>
        </div>
        <div className="flex gap-1.5 items-start">
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${labelColor} w-14 flex-shrink-0 pt-px`}>
            Excludes
          </span>
          <span className={`text-xs leading-relaxed ${valueColor}`}>
            {booking.excludes || '—'}
          </span>
        </div>
        {booking.noteForCustomer ? (
          <p className={`text-[11px] italic pt-0.5 ${noteColor}`}>
            &ldquo;{booking.noteForCustomer}&rdquo;
          </p>
        ) : null}
      </div>

      {/* Total */}
      <div className={`mx-4 mb-3 rounded-xl border ${sectionBg} px-3 py-2.5 flex items-center justify-between`}>
        <p className={`text-xs font-semibold uppercase tracking-wider ${labelColor}`}>Total</p>
        <p className={`text-base ${totalValueColor}`}>
          {booking.totalAmount}{' '}
          <span className={`text-xs font-normal ${isMine ? 'text-amber-700/60' : 'text-gray-400'}`}>
            {booking.currency}
          </span>
        </p>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        {booking.paymentDeadline ? (
          <p className={`mb-2 text-[10px] ${isMine ? 'text-amber-700/50' : 'text-gray-400'}`}>
            Payment deadline:{' '}
            <span className="font-medium">{new Date(booking.paymentDeadline).toLocaleString('en-GB')}</span>
          </p>
        ) : null}

        {canConfirmAndPay ? (
          <button
            type="button"
            onClick={handleConfirmAndPay}
            disabled={confirmAndPayMutation.isPending}
            className="w-full rounded-xl bg-[#1a2b4a] py-2.5 text-sm font-semibold text-white shadow-sm transition-[background-color,transform,box-shadow] hover:bg-[#243d6a] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {confirmAndPayMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing…
              </span>
            ) : paymentLabel}
          </button>
        ) : (
          <p className={`text-[11px] text-center ${isMine ? 'text-amber-700/50' : 'text-gray-400'}`}>
            Waiting for traveler payment action.
          </p>
        )}
      </div>
    </div>
  );
}
