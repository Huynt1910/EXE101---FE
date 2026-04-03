export const servicePackageQueryKeys = {
  all: ["service-package"] as const,
  list: () => [...servicePackageQueryKeys.all, "list"] as const,
  mySubscription: () =>
    [...servicePackageQueryKeys.all, "my-subscription"] as const,
};
