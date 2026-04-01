'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function PaymentCancelPage() {
  const router = useRouter();

  useEffect(() => {
    const bookingId = sessionStorage.getItem('pendingBookingId');

    sessionStorage.removeItem('pendingPaymentId');
    sessionStorage.removeItem('pendingOrderId');
    sessionStorage.removeItem('pendingBookingId');

    if (bookingId) {
      toast.warning('Payment cancelled. Please try again.');
      router.replace(`/booking/${bookingId}`);
    } else {
      router.replace('/');
    }
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#1a2b4a]" />
    </div>
  );
}
