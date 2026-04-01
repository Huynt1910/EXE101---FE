export const userQueryKeys = {
  all: ["user"] as const,
  profile: () => [...userQueryKeys.all, "self-service", "profile"] as const,
};
