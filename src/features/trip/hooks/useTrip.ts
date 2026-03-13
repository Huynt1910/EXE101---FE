import { useMutation } from "@tanstack/react-query";
import { tripApi } from "../api/trip.services";
import type { CreateTripRequest } from "../type";

export function useTrip() {
  const createTripMutation = useMutation({
    mutationFn: (payload: CreateTripRequest) => tripApi.createTrip(payload),
  });

  return {
    createTripMutation,
  };
}

export type UseTripResult = ReturnType<typeof useTrip>;
