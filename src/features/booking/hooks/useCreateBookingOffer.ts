"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingQueryKeys } from "@/features/booking/api/booking.query-key";
import { bookingApi } from "@/features/booking/api/booking.services";
import type {
  CreateBookingOfferPayload,
  CreateBookingPayload,
  CreateBookingReviewPayload,
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

type CreateBookingReviewVariables = {
  bookingId: string;
  payload: CreateBookingReviewPayload;
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

export function useBookingReviewQuery(
  bookingId?: string | null,
  enabled = true,
) {
  return useQuery({
    queryKey: bookingQueryKeys.review(bookingId ?? null),
    queryFn: () => bookingApi.getBookingReview(bookingId ?? ""),
    enabled: Boolean(bookingId) && enabled,
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

export function useCreateBookingReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, payload }: CreateBookingReviewVariables) =>
      bookingApi.createBookingReview(bookingId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: bookingQueryKeys.travelerList(),
      });
      queryClient.invalidateQueries({
        queryKey: bookingQueryKeys.detail(variables.bookingId),
      });
      queryClient.invalidateQueries({
        queryKey: bookingQueryKeys.review(variables.bookingId),
      });
    },
  });
}
