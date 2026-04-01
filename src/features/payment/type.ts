import type { ApiResponse } from '@/features/api-type';

// ── Request ──────────────────────────────────────────────────────────────────

export interface CapturePaypalOrderPayload {
  orderId: string;
}
/** Populated once the capture endpoint returns 200. */
export interface CapturePaypalOrderData {
  id: string;
  bookingId: string;
  amount: number;
  method: number;
  methodName: string;
  status: number;
  statusName: string;
  externalRef: string;
  heldAt: string | null;
  releasedAt: string | null;
  refundedAt: string | null;
  note: string | null;
}

export type CapturePaypalOrderResponse = ApiResponse<CapturePaypalOrderData | null>;
