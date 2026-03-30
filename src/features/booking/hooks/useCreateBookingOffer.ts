"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { bookingApi } from "@/features/booking/api/booking.services";
import type {
  CreateBookingOfferPayload,
  CreateBookingPayload,
} from "@/features/booking/type";

type CreateBookingVariables = {
  payload: CreateBookingPayload;
};

type CreateBookingOfferVariables = {
  tripRequestId: string;
  payload: CreateBookingOfferPayload;
};

type ConfirmAndCreatePaypalOrderVariables = {
  bookingId: string;
};

export function useBookingDetailQuery(bookingId?: string | null) {
  return useQuery({
    queryKey: ["booking", "detail", bookingId],
    queryFn: () => bookingApi.getBookingDetail(bookingId ?? ""),
    enabled: Boolean(bookingId),
    staleTime: 10 * 1000,
  });
}

export function useMyTravelerBookingsQuery() {
  return useQuery({
    queryKey: ["booking", "traveler", "list"],
    queryFn: () => bookingApi.getMyTravelerBookings(),
    staleTime: 30 * 1000,
  });
}

export function useCreateBookingMutation() {
  return useMutation({
    mutationFn: ({ payload }: CreateBookingVariables) =>
      bookingApi.createBooking(payload),
  });
}

export function useCreateBookingOfferMutation() {
  return useMutation({
    mutationFn: ({ tripRequestId, payload }: CreateBookingOfferVariables) =>
      bookingApi.createOfferByTripRequest(tripRequestId, payload),
  });
}

export function useConfirmAndCreatePaypalOrderMutation() {
  return useMutation({
    mutationFn: ({ bookingId }: ConfirmAndCreatePaypalOrderVariables) =>
      bookingApi.confirmAndCreatePaypalOrder(bookingId),
  });
}
