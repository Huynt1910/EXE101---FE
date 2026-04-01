export const bookingQueryKeys = {
  all: ["booking"] as const,
  detail: (id: string | null) =>
    [...bookingQueryKeys.all, "detail", id] as const,
  travelerList: () => [...bookingQueryKeys.all, "traveler", "list"] as const,
};
