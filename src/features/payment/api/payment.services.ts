import { httpClient } from '@/lib/http/client';
import type {
  CapturePaypalOrderPayload,
  CapturePaypalOrderResponse,
} from '@/features/payment/type';

const PAYMENT_BASE_PATH = '/api/Bookings/payments';

export const paymentApi = {
  async capturePaypalOrder(paymentId: string, payload: CapturePaypalOrderPayload) {
    const res = await httpClient.post<CapturePaypalOrderResponse, CapturePaypalOrderPayload>(
      `${PAYMENT_BASE_PATH}/${paymentId}/paypal/capture`,
      payload,
    );

    return res.data;
  },
};
