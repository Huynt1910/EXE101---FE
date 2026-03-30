import { AdminDashboardClient } from "@/app/(admin)/admin/admin-dashboard-client";

type AdminPageSearchParams = Promise<{
  tab?: string;
}>;

const VALID_TABS = new Set(["overview", "users", "buddies", "operations", "incidents"]);

export default async function AdminPage({
  searchParams,
}: {
  searchParams: AdminPageSearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const requestedTab = resolvedSearchParams.tab;
  const initialTab =
    requestedTab && VALID_TABS.has(requestedTab) ? requestedTab : "overview";

  return (
    <AdminDashboardClient
      initialTab={
        initialTab as "overview" | "users" | "buddies" | "operations" | "incidents"
      }
    />
  );
}
