"use client";

import { useDeferredValue, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock3, ShieldAlert } from "lucide-react";
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
import {
  useAdminTripBookings,
  useAdminTripDetail,
  useAdminTrips,
} from "@/features/admin/hooks/useAdmin";
import {
  DetailItem,
  EmptyState,
  PaginationControls,
  StatusPill,
  TRIP_STATUS_OPTIONS,
  formatCurrency,
  selectClassName,
} from "@/app/(admin)/admin/_components/admin-shared";
import {
  formatDate,
  formatDateTime,
  formatTime,
} from "@/utils/formatDateAndTime";
import { formatStringList } from "@/utils/formatListData";

export function TripsClient() {
  const [tripSearch, setTripSearch] = useState("");
  const deferredTripSearch = useDeferredValue(tripSearch);
  const [tripCityFilter, setTripCityFilter] = useState("");
  const [tripStatusFilter, setTripStatusFilter] = useState("");
  const [tripsPage, setTripsPage] = useState(1);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

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

  const trips = tripsQuery.data?.data.items ?? [];
  const totalTrips = tripsQuery.data?.data.totalCount ?? 0;
  const selectedTrip =
    tripDetailQuery.data?.data ??
    trips.find((trip) => trip.id === selectedTripId) ??
    null;
  useEffect(() => {
    const firstTripId = trips[0]?.id ?? null;
    if (!selectedTripId && firstTripId) setSelectedTripId(firstTripId);
  }, [selectedTripId, trips]);

  return (
    <div className="space-y-6">
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Trip management</CardTitle>
          <CardDescription>
            Monitor demand from `/api/admin/trips` on a dedicated trip
            operations page.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="trip-search-page">Search</Label>
            <Input
              id="trip-search-page"
              value={tripSearch}
              onChange={(event) => {
                setTripsPage(1);
                setTripSearch(event.target.value);
              }}
              placeholder="City or free-text search"
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trip-city-page">City</Label>
            <Input
              id="trip-city-page"
              value={tripCityFilter}
              onChange={(event) => {
                setTripsPage(1);
                setTripCityFilter(event.target.value);
              }}
              placeholder="Ho Chi Minh City"
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trip-status-page">Trip status</Label>
            <select
              id="trip-status-page"
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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.95fr)]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Trips</CardTitle>
            <CardDescription>{totalTrips} total trip.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            {trips.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6">Trip</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>Travel party</TableHead>
                    <TableHead>Status</TableHead>
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
                      onClick={() => setSelectedTripId(trip.id)}
                    >
                      <TableCell className="px-6">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {trip.travelerName || "Unknown traveler"}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {trip.notes || "No notes"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {trip.city || "Unknown location"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatTime(trip.startTime)},{" "}
                        {formatDate(trip.startDate)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {trip.adults} adults / {trip.children} children
                      </TableCell>
                      <TableCell>
                        <StatusPill label={trip.status} />
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
        </Card>

        <div className="space-y-6">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTrip ? (
                <div className="grid grid-cols-2 gap-3">
                  <DetailItem
                    label="Location"
                    value={selectedTrip.city || "N/A"}
                  />
                  <DetailItem
                    label="Traveler"
                    value={selectedTrip.travelerName || "N/A"}
                  />
                  <DetailItem
                    label="Start date"
                    value={formatDate(selectedTrip.startDate)}
                  />
                  <DetailItem
                    label="Start time"
                    value={formatTime(selectedTrip.startTime) || "N/A"}
                  />
                  <DetailItem
                    label="Duration"
                    value={`${selectedTrip.durationHours} hours`}
                  />
                  <DetailItem
                    label="Notes"
                    value={selectedTrip.notes || "No notes provided."}
                  />
                  <DetailItem
                    label="Languages"
                    value={
                      formatStringList(selectedTrip.preferredLanguages) || "N/A"
                    }
                  />
                  <DetailItem
                    label="Activities"
                    value={formatStringList(selectedTrip.activities) || "N/A"}
                  />
                  <DetailItem
                    label="Create time"
                    value={formatDateTime(selectedTrip.createdAt) || "N/A"}
                  />
                  <DetailItem
                    label="Status"
                    value={<StatusPill label={selectedTrip.status} />}
                  />
                </div>
              ) : (
                <EmptyState
                  title="No trip selected"
                  description="Select a trip from the table to inspect traveler demand."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
