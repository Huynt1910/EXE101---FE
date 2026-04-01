'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCapturePaypalOrderMutation } from '@/features/payment/hooks/usePayment';

/* ── tiny confetti burst (CSS-only, no deps) ── */
const confettiColors = ['#f97316', '#22c55e', '#3b82f6', '#eab308', '#ec4899', '#a855f7'];
function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => {
    const color = confettiColors[i % confettiColors.length];
    const left = `${(i * 37 + 5) % 100}%`;
    const delay = `${(i * 0.12).toFixed(2)}s`;
    const size = i % 3 === 0 ? 8 : i % 3 === 1 ? 6 : 5;
    return { color, left, delay, size, rotate: (i * 47) % 360 };
  });
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden rounded-t-3xl">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: p.left,
            top: '-10px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: i % 5 === 0 ? '50%' : '1px',
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall 1.2s ${p.delay} ease-out forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(160px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const captureMutation = useCapturePaypalOrderMutation();
  const capturedRef = useRef(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (capturedRef.current) return;

    const paymentId = sessionStorage.getItem('pendingPaymentId');
    const orderId = token ?? sessionStorage.getItem('pendingOrderId');

    if (!paymentId || !orderId) return;

    capturedRef.current = true;

    captureMutation.mutate(
      { paymentId, payload: { orderId } },
      {
        onSuccess: () => {
          sessionStorage.removeItem('pendingPaymentId');
          sessionStorage.removeItem('pendingOrderId');
          sessionStorage.removeItem('pendingBookingId');
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bookingId =
    captureMutation.data?.data?.bookingId ??
    (typeof window !== 'undefined' ? sessionStorage.getItem('pendingBookingId') : null);

  // ── Loading ──
  if (captureMutation.isPending || captureMutation.isIdle) {
    return (
      <section className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-[#fdf6e3] px-4 py-10">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#1a2b4a]" />
          <p className="text-sm text-gray-500">Processing your payment…</p>
        </div>
      </section>
    );
  }

  // ── Error ──
  if (captureMutation.isError) {
    const errorMessage =
      captureMutation.error instanceof Error
        ? captureMutation.error.message
        : 'Failed to capture PayPal order.';

    return (
      <section className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-[#fdf6e3] px-4 py-10">
        <div className="w-full max-w-md rounded-3xl bg-white px-8 py-10 text-center shadow-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <XCircle className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">Payment failed</h2>
          <p className="mt-2 text-sm text-gray-500">{errorMessage}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {bookingId ? (
              <Button asChild className="w-full rounded-2xl sm:w-auto">
                <Link href={`/booking/${bookingId}`}>
                  Try again <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button className="w-full rounded-2xl sm:w-auto" onClick={() => router.push('/')}>
                Back to home
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ── Success ──
  const payment = captureMutation.data?.data;

  const rows = [
    { label: 'Transaction ID', value: payment?.externalRef ?? '—' },
    { label: 'Date', value: formatDate(payment?.heldAt ?? null) },
    { label: 'Type of Transaction', value: payment?.methodName ?? '—' },
    { label: 'Amount', value: payment ? `$${payment.amount.toFixed(2)}` : '—' },
    { label: 'Status', value: payment?.statusName ?? '—', highlight: true },
  ];

  return (
    <section className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-[#fdf6e3] px-4 py-10">
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-md">
        <Confetti />

        {/* Top — icon + title */}
        <div className="flex flex-col items-center px-8 pb-8 pt-12 text-center">
          {/* Success rings */}
          <div className="relative mb-4 flex h-20 w-20 items-center justify-center">
            <div className="absolute h-20 w-20 rounded-full bg-emerald-100 opacity-50" />
            <div className="absolute h-14 w-14 rounded-full bg-emerald-200 opacity-60" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Payment Successful</h1>
          {payment && (
            <p className="mt-1 text-sm text-gray-500">
              Successful Paid ${payment.amount.toFixed(2)}
            </p>
          )}
        </div>

        {/* Payment methods */}
        <div className="px-8 pb-6">
          <h2 className="mb-3 text-base font-semibold text-gray-800">Payment methods</h2>
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
            {rows.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-4 py-3 text-sm ${
                  i !== rows.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <span className="text-gray-500">{row.label}</span>
                <span
                  className={`max-w-[55%] truncate text-right font-medium ${
                    row.highlight ? 'text-emerald-600' : 'text-gray-900'
                  }`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 px-8 pb-8">
          {bookingId && (
            <Button asChild className="w-full rounded-full bg-[#1a2b4a] py-5 text-base hover:bg-[#16243d]">
              <Link href={`/booking/${bookingId}`}>
                View booking <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <Button
            asChild
            className="w-full rounded-full bg-orange-500 py-5 text-base hover:bg-orange-600"
          >
            <Link href="/">Back Home</Link>
          </Button>
        </div>

      </div>
    </section>
  );
}
