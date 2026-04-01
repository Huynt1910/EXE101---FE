export const buddyQueryKeys = {
  all: ["buddy"] as const,
  list: () => [...buddyQueryKeys.all, "list"] as const,
  detail: (id: string) => [...buddyQueryKeys.all, "detail", id] as const,
  reviews: (buddyId: string, page = 1, pageSize = 6) =>
    [...buddyQueryKeys.all, "reviews", buddyId, page, pageSize] as const,
};
