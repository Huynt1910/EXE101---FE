'use client';

import { useMutation } from '@tanstack/react-query';
import { paymentApi } from '@/features/payment/api/payment.services';
import type { CapturePaypalOrderPayload } from '@/features/payment/type';

type CapturePaypalOrderVariables = {
  paymentId: string;
  payload: CapturePaypalOrderPayload;
};

export function useCapturePaypalOrderMutation() {
  return useMutation({
    mutationFn: ({ paymentId, payload }: CapturePaypalOrderVariables) =>
      paymentApi.capturePaypalOrder(paymentId, payload),
  });
}
