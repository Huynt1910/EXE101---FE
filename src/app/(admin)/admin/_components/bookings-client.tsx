"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { Clock3, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import {
  useAdminBookingDetail,
  useAdminBookingIncidents,
  useAdminBookingReview,
  useAdminMutations,
  useAdminTripBookings,
  useAdminTripDetail,
  useAdminTrips,
} from "@/features/admin/hooks/useAdmin";
import {
  BOOKING_STATUS_OPTIONS,
  DetailItem,
  EmptyState,
  PaginationControls,
  StatusPill,
  TRIP_STATUS_OPTIONS,
  formatCurrency,
  getErrorMessage,
  selectClassName,
} from "@/app/(admin)/admin/_components/admin-shared";
import { formatDate, formatDateTime } from "@/utils/formatDateAndTime";
import { formatStringList } from "@/utils/formatListData";

export function BookingsClient() {
  const [tripSearch, setTripSearch] = useState("");
  const deferredTripSearch = useDeferredValue(tripSearch);
  const [tripCityFilter, setTripCityFilter] = useState("");
  const [tripStatusFilter, setTripStatusFilter] = useState("");
  const [tripsPage, setTripsPage] = useState(1);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [bookingStatusDraft, setBookingStatusDraft] = useState("");

  const tripsQuery = useAdminTrips({
    Page: tripsPage,
    PageSize: 10,
    Search: deferredTripSearch || undefined,
    City: tripCityFilter || undefined,
    Status: tripStatusFilter || undefined,
    SortBy: "createdAt",
    SortOrder: "desc",
  });
  const tripDetailQuery = useAdminTripDetail(selectedTripId);
  const tripBookingsQuery = useAdminTripBookings(selectedTripId);
  const bookingDetailQuery = useAdminBookingDetail(selectedBookingId);
  const bookingReviewQuery = useAdminBookingReview(selectedBookingId);
  const bookingIncidentsQuery = useAdminBookingIncidents(selectedBookingId);
  const { updateBookingStatusMutation } = useAdminMutations();

  const trips = tripsQuery.data?.data.items ?? [];
  const totalTrips = tripsQuery.data?.data.totalCount ?? 0;
  const tripBookings = tripBookingsQuery.data?.data ?? [];
  const selectedTrip =
    tripDetailQuery.data?.data ??
    trips.find((trip) => trip.id === selectedTripId) ??
    null;
  const selectedBooking =
    bookingDetailQuery.data?.data ??
    tripBookings.find((booking) => booking.id === selectedBookingId) ??
    null;
  const confirmedBookingsOnTrip = tripBookings.filter(
    (booking) =>
      booking.status === "Confirmed" || booking.status === "Completed",
  ).length;

  useEffect(() => {
    const firstTripId = trips[0]?.id ?? null;
    if (!selectedTripId && firstTripId) setSelectedTripId(firstTripId);
  }, [selectedTripId, trips]);

  useEffect(() => {
    const firstBookingId = tripBookings[0]?.id ?? null;
    if (selectedTripId && !selectedBookingId && firstBookingId) {
      setSelectedBookingId(firstBookingId);
    }
  }, [selectedBookingId, selectedTripId, tripBookings]);

  useEffect(() => {
    setBookingStatusDraft(selectedBooking?.status ?? "");
  }, [selectedBooking?.status]);

  const handleUpdateBookingStatus = async () => {
    if (!selectedBookingId || !bookingStatusDraft) return;

    try {
      await updateBookingStatusMutation.mutateAsync({
        id: selectedBookingId,
        payload: { status: bookingStatusDraft },
      });
      toast({
        title: "Booking updated",
        description: "The booking status has been changed successfully.",
      });
    } catch (error) {
      toast({
        title: "Could not update booking",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Booking management</CardTitle>
          <CardDescription>
            Select a trip, inspect trip-linked bookings, and update booking
            status from a dedicated page.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="trip-search">Search</Label>
            <Input
              id="trip-search"
              value={tripSearch}
              onChange={(event) => {
                setTripsPage(1);
                setTripSearch(event.target.value);
              }}
              placeholder="City or free-text search"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trip-city">City</Label>
            <Input
              id="trip-city"
              value={tripCityFilter}
              onChange={(event) => {
                setTripsPage(1);
                setTripCityFilter(event.target.value);
              }}
              placeholder="Ho Chi Minh City"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trip-status">Trip status</Label>
            <select
              id="trip-status"
              className={selectClassName}
              value={tripStatusFilter}
              onChange={(event) => {
                setTripsPage(1);
                setTripStatusFilter(event.target.value);
              }}
            >
              <option value="">All statuses</option>
              {TRIP_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setTripSearch("");
                setTripCityFilter("");
                setTripStatusFilter("");
                setTripsPage(1);
              }}
            >
              Reset filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.95fr)]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Trips</CardTitle>
            <CardDescription>
              {totalTrips} total trip requests visible to admin.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            {trips.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6">Trip</TableHead>
                    <TableHead>Traveler</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Travel party</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trips.map((trip) => (
                    <TableRow
                      key={trip.id}
                      data-state={
                        trip.id === selectedTripId ? "selected" : undefined
                      }
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedTripId(trip.id);
                        setSelectedBookingId(null);
                      }}
                    >
                      <TableCell className="px-6">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {trip.city || "Unknown city"}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {trip.notes || "No notes"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {trip.travelerName || "Unknown traveler"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(trip.startDate)}
                      </TableCell>
                      <TableCell>
                        <StatusPill label={trip.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {trip.adults} adults / {trip.children} children
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="px-6 pb-6">
                <EmptyState
                  title="No trips found"
                  description="The current trip filters did not return any results."
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-border/70 px-0 pt-0">
            <PaginationControls
              page={tripsQuery.data?.data.page ?? 1}
              totalPages={tripsQuery.data?.data.totalPages ?? 1}
              hasPreviousPage={tripsQuery.data?.data.hasPreviousPage ?? false}
              hasNextPage={tripsQuery.data?.data.hasNextPage ?? false}
              onPrevious={() =>
                setTripsPage((current) => Math.max(current - 1, 1))
              }
              onNext={() =>
                setTripsPage((current) =>
                  tripsQuery.data?.data.hasNextPage ? current + 1 : current,
                )
              }
            />
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Selected trip</CardTitle>
              <CardDescription>
                Trip detail from `/api/admin/trips/{"{id}"}`.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTrip ? (
                <div className="grid gap-3">
                  <DetailItem label="City" value={selectedTrip.city || "N/A"} />
                  <DetailItem
                    label="Traveler"
                    value={selectedTrip.travelerName || "N/A"}
                  />
                  <DetailItem
                    label="Status"
                    value={<StatusPill label={selectedTrip.status} />}
                  />
                  <DetailItem
                    label="Start date"
                    value={formatDate(selectedTrip.startDate)}
                  />
                  <DetailItem
                    label="Start time"
                    value={selectedTrip.startTime || "N/A"}
                  />
                  <DetailItem
                    label="Duration"
                    value={`${selectedTrip.durationHours} hours`}
                  />
                  <DetailItem
                    label="Preferred languages"
                    value={
                      formatStringList(selectedTrip.preferredLanguages) || "N/A"
                    }
                  />
                  <DetailItem
                    label="Activities"
                    value={formatStringList(selectedTrip.activities) || "N/A"}
                  />
                  <DetailItem
                    label="Notes"
                    value={selectedTrip.notes || "No notes provided."}
                  />
                </div>
              ) : (
                <EmptyState
                  title="No trip selected"
                  description="Select a trip from the table to inspect demand and booking activity."
                />
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Bookings for selected trip</CardTitle>
              <CardDescription>
                Bookings linked to the trip through `/api/admin/trips/
                {"{tripId}"}/bookings`.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              {tripBookings.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-6">Buddy</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tripBookings.map((booking) => (
                      <TableRow
                        key={booking.id}
                        data-state={
                          booking.id === selectedBookingId
                            ? "selected"
                            : undefined
                        }
                        className="cursor-pointer"
                        onClick={() => setSelectedBookingId(booking.id)}
                      >
                        <TableCell className="px-6">
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">
                              {booking.buddyName || "Unknown buddy"}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {booking.bookedDate
                                ? formatDate(booking.bookedDate)
                                : "No booked date"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusPill
                            label={booking.statusName || booking.status}
                          />
                        </TableCell>
                        <TableCell>
                          {formatCurrency(
                            booking.totalAmount,
                            booking.currency || "USD",
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="px-6 pb-6">
                  <EmptyState
                    title="No bookings for this trip"
                    description="Select another trip or wait until booking demand is created."
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border/70">
        <CardHeader className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-1.5">
            <CardTitle>Selected booking detail</CardTitle>
            <CardDescription>
              Booking detail, review and incident context for support/admin
              intervention.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              aria-label="Booking status"
              className={`${selectClassName} min-w-[220px]`}
              value={bookingStatusDraft}
              onChange={(event) => setBookingStatusDraft(event.target.value)}
              disabled={!selectedBooking}
            >
              <option value="">Select status</option>
              {BOOKING_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <Button
              onClick={handleUpdateBookingStatus}
              disabled={
                !selectedBooking ||
                !bookingStatusDraft ||
                updateBookingStatusMutation.isPending
              }
            >
              Save booking status
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {selectedBooking ? (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem
                  label="Status"
                  value={
                    <StatusPill
                      label={
                        selectedBooking.statusName || selectedBooking.status
                      }
                    />
                  }
                />
                <DetailItem
                  label="Buddy"
                  value={selectedBooking.buddyName || "N/A"}
                />
                <DetailItem
                  label="Traveler"
                  value={selectedBooking.travelerName || "N/A"}
                />
                <DetailItem
                  label="Booked date"
                  value={formatDate(selectedBooking.bookedDate)}
                />
                <DetailItem
                  label="Start time"
                  value={selectedBooking.bookedStartTime || "N/A"}
                />
                <DetailItem
                  label="Duration"
                  value={
                    typeof selectedBooking.bookedDurationHours === "number"
                      ? `${selectedBooking.bookedDurationHours} hours`
                      : "N/A"
                  }
                />
                <DetailItem
                  label="Party size"
                  value={`${selectedBooking.bookedAdults ?? 0} adults / ${selectedBooking.bookedChildren ?? 0} children`}
                />
                <DetailItem
                  label="Total amount"
                  value={formatCurrency(
                    selectedBooking.totalAmount,
                    selectedBooking.currency || "USD",
                  )}
                />
                <DetailItem
                  label="Platform fee"
                  value={formatCurrency(
                    selectedBooking.platformFeeAmount,
                    selectedBooking.currency || "USD",
                  )}
                />
                <DetailItem
                  label="Includes"
                  value={selectedBooking.includes || "N/A"}
                />
                <DetailItem
                  label="Excludes"
                  value={selectedBooking.excludes || "N/A"}
                />
                <DetailItem
                  label="Buddy note"
                  value={
                    selectedBooking.noteForCustomer || "No note for customer."
                  }
                />
              </div>

              <div className="space-y-4">
                <Card className="gap-4 border-border/70 bg-muted/20 py-4 shadow-none">
                  <CardHeader className="px-4">
                    <CardTitle className="text-base">Review snapshot</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4">
                    {bookingReviewQuery.data?.data ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">
                            {bookingReviewQuery.data.data.reviewerName ||
                              "Anonymous reviewer"}
                          </p>
                          <StatusPill
                            label={`${bookingReviewQuery.data.data.rating}/5`}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {bookingReviewQuery.data.data.comment ||
                            "No review comment provided."}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(
                            bookingReviewQuery.data.data.createdAt,
                          )}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No review is attached to this booking yet.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="gap-4 border-border/70 bg-muted/20 py-4 shadow-none">
                  <CardHeader className="px-4">
                    <CardTitle className="text-base">
                      Incidents on this booking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 px-4">
                    {bookingIncidentsQuery.data?.data.length ? (
                      bookingIncidentsQuery.data.data.map((incident) => (
                        <div
                          key={incident.id}
                          className="rounded-xl border border-border/70 bg-background px-4 py-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-foreground">
                              {incident.typeName || incident.type}
                            </p>
                            <StatusPill
                              label={incident.statusName || incident.status}
                            />
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {incident.description || "No description provided."}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No incidents have been reported for this booking.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No booking selected"
              description="Pick a booking from the selected trip to inspect payment-sensitive operations."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
