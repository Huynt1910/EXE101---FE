export const buddyQueryKeys = {
  all: ["buddy"] as const,
  detail: (id: string) => ["buddy", "detail", id] as const,
};
