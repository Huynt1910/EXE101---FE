"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Clock3,
  MapPinned,
  ShieldAlert,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useAdminBuddies,
  useAdminIncidents,
  useAdminTripBookings,
  useAdminTrips,
  useAdminUsers,
} from "@/features/admin/hooks/useAdmin";
import {
  BOOKING_CHART_COLORS,
  EmptyState,
  StatusPill,
  buildBookingStatusData,
  buildTripTrendData,
  countResolvedIncidents,
  formatCompactNumber,
  formatCurrency,
} from "@/app/(admin)/admin/_components/admin-shared";
import { formatDate } from "@/utils/formatDateAndTime";

export function OverviewClient() {
  const usersQuery = useAdminUsers({
    Page: 1,
    PageSize: 10,
    SortBy: "createdAt",
    SortOrder: "desc",
  });
  const buddiesQuery = useAdminBuddies({
    Page: 1,
    PageSize: 1,
  });
  const tripsQuery = useAdminTrips({
    Page: 1,
    PageSize: 10,
    SortBy: "createdAt",
    SortOrder: "desc",
  });
  const incidentsQuery = useAdminIncidents({
    Page: 1,
    PageSize: 10,
  });

  const trips = tripsQuery.data?.data.items ?? [];
  const selectedTripId = trips[0]?.id ?? null;
  const tripBookingsQuery = useAdminTripBookings(selectedTripId);

  const users = usersQuery.data?.data.items ?? [];
  const tripBookings = tripBookingsQuery.data?.data ?? [];
  const incidents = incidentsQuery.data?.data.items ?? [];
  const selectedTrip = trips[0] ?? null;

  const totalUsers = usersQuery.data?.data.totalCount ?? 0;
  const totalBuddies = buddiesQuery.data?.data.totalCount ?? 0;
  const totalTrips = tripsQuery.data?.data.totalCount ?? 0;
  const totalIncidents = incidentsQuery.data?.data.totalCount ?? 0;
  const verifiedUsersOnPage = users.filter(
    (user) => user.isEmailVerified,
  ).length;
  const unresolvedIncidentsOnPage = incidents.filter(
    (incident) => incident.status === "Open" || incident.status === "InReview",
  ).length;
  const openTripsOnPage = trips.filter((trip) => trip.status === "Open").length;
  const confirmedBookingsOnTrip = tripBookings.filter(
    (booking) =>
      booking.status === "Confirmed" || booking.status === "Completed",
  ).length;
  const bookingStatusData = buildBookingStatusData(tripBookings);
  const bookingStatusCards = bookingStatusData.slice(0, 3);
  const tripTrendData = buildTripTrendData(trips);
  const selectedTripBookingValue = tripBookings.reduce(
    (sum, booking) => sum + (booking.totalAmount ?? 0),
    0,
  );
  const resolvedIncidents = countResolvedIncidents(incidents);
  const recentUsers = [...users]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);
  const recentTrips = [...trips]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);
  const incidentQueue = [...incidents]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950 p-6 text-slate-50 shadow-2xl shadow-slate-950/20">
        <div className="grid gap-4 xl:grid-cols-4">
          <Card className="border border-emerald-500/20 bg-emerald-500/10 text-slate-50 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription className="text-emerald-100/70">
                    Total users
                  </CardDescription>
                  <CardTitle className="mt-2 text-4xl text-white">
                    {formatCompactNumber(totalUsers)}
                  </CardTitle>
                </div>
                <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-3">
                  <Users className="h-5 w-5 text-emerald-200" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-emerald-100/80">
              {verifiedUsersOnPage} verified users in the current result window.
            </CardContent>
          </Card>

          <Card className="border border-violet-500/20 bg-violet-500/10 text-slate-50 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription className="text-violet-100/70">
                    Buddy supply
                  </CardDescription>
                  <CardTitle className="mt-2 text-4xl text-white">
                    {formatCompactNumber(totalBuddies)}
                  </CardTitle>
                </div>
                <div className="rounded-2xl border border-violet-400/25 bg-violet-400/10 p-3">
                  <MapPinned className="h-5 w-5 text-violet-200" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-violet-100/80">
              Marketplace-ready buddy profiles available for matching.
            </CardContent>
          </Card>

          <Card className="border border-sky-500/20 bg-sky-500/10 text-slate-50 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription className="text-sky-100/70">
                    Trip demand
                  </CardDescription>
                  <CardTitle className="mt-2 text-4xl text-white">
                    {formatCompactNumber(totalTrips)}
                  </CardTitle>
                </div>
                <div className="rounded-2xl border border-sky-400/25 bg-sky-400/10 p-3">
                  <BookOpen className="h-5 w-5 text-sky-200" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-sky-100/80">
              {openTripsOnPage} open trips in the current slice.
            </CardContent>
          </Card>

          <Card className="border border-orange-500/20 bg-orange-500/10 text-slate-50 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription className="text-orange-100/70">
                    Incident queue
                  </CardDescription>
                  <CardTitle className="mt-2 text-4xl text-white">
                    {formatCompactNumber(totalIncidents)}
                  </CardTitle>
                </div>
                <div className="rounded-2xl border border-orange-400/25 bg-orange-400/10 p-3">
                  <AlertTriangle className="h-5 w-5 text-orange-200" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-orange-100/80">
              {unresolvedIncidentsOnPage} unresolved incidents right now.
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-2xl font-semibold text-white">
                  Trip demand trend
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Trips created versus open trips across the current page
                  window.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#8bd450]" />
                  Trips
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#7aa2ff]" />
                  Open trips
                </div>
              </div>
            </div>

            <div className="mt-6 h-[320px]">
              {trips.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tripTrendData}>
                    <CartesianGrid vertical={false} stroke="#334155" />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "#cbd5e1", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: 16,
                        color: "#f8fafc",
                      }}
                    />
                    <Bar
                      dataKey="trips"
                      fill="#8bd450"
                      radius={[10, 10, 0, 0]}
                      maxBarSize={52}
                    />
                    <Bar
                      dataKey="openTrips"
                      fill="#7aa2ff"
                      radius={[10, 10, 0, 0]}
                      maxBarSize={52}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900/40 p-6 text-center text-sm text-slate-300">
                  Trip trend will appear here once the current admin trip query
                  returns records.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div>
              <p className="text-2xl font-semibold text-white">Booking mix</p>
              <p className="mt-1 text-sm text-slate-300">
                Status distribution for{" "}
                {selectedTrip?.city || "the selected trip"}.
              </p>
            </div>

            <div className="mt-4 h-[260px]">
              {bookingStatusData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: 16,
                        color: "#f8fafc",
                      }}
                    />
                    <Pie
                      data={bookingStatusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={66}
                      outerRadius={104}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {bookingStatusData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={
                            BOOKING_CHART_COLORS[
                              index % BOOKING_CHART_COLORS.length
                            ]
                          }
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900/40 p-6 text-center text-sm text-slate-300">
                  Select a trip with bookings to see the booking status
                  distribution.
                </div>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
              {bookingStatusCards.length ? (
                bookingStatusCards.map((item) => {
                  const percentage =
                    tripBookings.length > 0
                      ? Math.round((item.value / tripBookings.length) * 100)
                      : 0;

                  return (
                    <div
                      key={item.name}
                      className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3"
                    >
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: item.fill }}
                        />
                        {item.name}
                      </div>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {percentage}%
                      </p>
                      <p className="text-sm text-slate-400">
                        {item.value} bookings
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 px-4 py-5 text-sm text-slate-300">
                  No booking breakdown is available for the current selection.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          <Card className="border border-white/10 bg-white/5 text-slate-50 shadow-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-300">
                Selected trip revenue
              </CardDescription>
              <CardTitle className="text-3xl text-white">
                {formatCurrency(selectedTripBookingValue)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              Sum of booking totals linked to the currently selected trip.
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 text-slate-50 shadow-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-300">
                Booking focus
              </CardDescription>
              <CardTitle className="text-3xl text-white">
                {tripBookings.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              Total bookings currently attached to{" "}
              {selectedTrip?.city || "the selected trip"}.
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 text-slate-50 shadow-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-300">
                Resolution rate
              </CardDescription>
              <CardTitle className="text-3xl text-white">
                {totalIncidents > 0
                  ? `${Math.round((resolvedIncidents / totalIncidents) * 100)}%`
                  : "0%"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              {resolvedIncidents} resolved or closed incidents in the current
              queue window.
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Quick moves</CardTitle>
            <CardDescription>
              Jump straight into the admin tasks that require action.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                href: "/admin/users",
                label: "Review customer accounts",
                description:
                  "Inspect user records, verification state and editable profile fields.",
              },
              {
                href: "/admin/buddies",
                label: "Assign or edit buddies",
                description:
                  "Register user accounts as buddies and tune availability data.",
              },
              {
                href: "/admin/service-packages",
                label: "Manage service packages",
                description:
                  "Create pricing packages, commission rules and feature flags.",
              },
              {
                href: "/admin/trips",
                label: "Inspect trips",
                description: "Check trip demand and traveler request context.",
              },
              {
                href: "/admin/bookings",
                label: "Review bookings",
                description:
                  "Update booking status and inspect review outcomes.",
              },
              {
                href: "/admin/incidents",
                label: "Resolve incident queue",
                description:
                  "Move tickets from open/in-review to resolved or closed.",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex w-full items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-3 text-left transition-colors hover:bg-muted/40"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Recent users</CardTitle>
            <CardDescription>
              Latest customer records coming into the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUsers.length ? (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-muted/20 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user.fullName || "Unnamed user"}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {user.email || "No email"}
                    </p>
                  </div>
                  <StatusPill
                    label={user.isEmailVerified ? "Verified" : "Pending"}
                  />
                </div>
              ))
            ) : (
              <EmptyState
                title="No users loaded"
                description="The admin users endpoint did not return any records for the current filters."
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Latest trips</CardTitle>
            <CardDescription>
              New traveler demand visible to operations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTrips.length ? (
              recentTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      {trip.city || "Unknown city"}
                    </p>
                    <StatusPill label={trip.status} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {trip.travelerName || "Unknown traveler"} •{" "}
                    {formatDate(trip.startDate)}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                title="No trips loaded"
                description="The admin trips endpoint has not returned any rows yet."
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Incident queue</CardTitle>
            <CardDescription>
              Newest tickets currently visible to support/admin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {incidentQueue.length ? (
              incidentQueue.map((incident) => (
                <div
                  key={incident.id}
                  className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      {incident.typeName || incident.type}
                    </p>
                    <StatusPill
                      label={incident.statusName || incident.status}
                    />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {incident.description || "No description provided."}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                title="No incidents loaded"
                description="The incident queue is empty for the current filters."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
