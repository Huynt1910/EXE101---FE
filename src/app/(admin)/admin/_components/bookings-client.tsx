"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
  useAdminBookings,
  useAdminBookingDetail,
  useAdminBookingIncidents,
  useAdminBookingReview,
  useAdminMutations,
} from "@/features/admin/hooks/useAdmin";
import {
  BOOKING_STATUS_OPTIONS,
  DetailItem,
  EmptyState,
  PaginationControls,
  StatusPill,
  formatCurrency,
  getErrorMessage,
  selectClassName,
} from "@/app/(admin)/admin/_components/admin-shared";
import { formatDate, formatDateTime } from "@/utils/formatDateAndTime";

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const SORT_FIELDS = [
  { label: "Created time", value: "createdAt" },
  { label: "Booked date", value: "bookedDate" },
  { label: "Payment deadline", value: "paymentDeadline" },
  { label: "Traveler name", value: "travelerName" },
  { label: "Buddy name", value: "buddyName" },
  { label: "Status", value: "status" },
  { label: "Total amount", value: "totalAmount" },
] as const;
const SORT_ORDERS = [
  { label: "Descending", value: "desc" },
  { label: "Ascending", value: "asc" },
] as const;

export function BookingsClient() {
  const [search, setSearch] = useState("");
  const [buddyName, setBuddyName] = useState("");
  const [travelerName, setTravelerName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [bookedFrom, setBookedFrom] = useState("");
  const [bookedTo, setBookedTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [bookingStatusDraft, setBookingStatusDraft] = useState("");

  const deferredSearch = useDeferredValue(search);
  const deferredBuddyName = useDeferredValue(buddyName);
  const deferredTravelerName = useDeferredValue(travelerName);

  const bookingsQuery = useAdminBookings({
    Page: page,
    PageSize: pageSize,
    Search: deferredSearch || undefined,
    BuddyName: deferredBuddyName || undefined,
    TravelerName: deferredTravelerName || undefined,
    Status: statusFilter || undefined,
    BookedFrom: bookedFrom || undefined,
    BookedTo: bookedTo || undefined,
    SortBy: sortBy,
    SortOrder: sortOrder,
  });
  const bookingDetailQuery = useAdminBookingDetail(selectedBookingId);
  const bookingReviewQuery = useAdminBookingReview(selectedBookingId);
  const bookingIncidentsQuery = useAdminBookingIncidents(selectedBookingId);
  const { updateBookingStatusMutation } = useAdminMutations();

  const bookings = bookingsQuery.data?.data.items ?? [];
  const bookingsPage = bookingsQuery.data?.data.page ?? 1;
  const totalBookings = bookingsQuery.data?.data.totalCount ?? 0;
  const totalPages = bookingsQuery.data?.data.totalPages ?? 1;
  const selectedBooking =
    bookingDetailQuery.data?.data ??
    bookings.find((booking) => booking.id === selectedBookingId) ??
    null;

  useEffect(() => {
    const firstBookingId = bookings[0]?.id ?? null;
    const hasSelectedBooking = bookings.some(
      (booking) => booking.id === selectedBookingId,
    );

    if (!bookings.length) {
      setSelectedBookingId(null);
      return;
    }

    if (!selectedBookingId || !hasSelectedBooking) {
      setSelectedBookingId(firstBookingId);
    }
  }, [bookings, selectedBookingId]);

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
      toast.success("The booking status has been changed successfully.", {
        description: "Booking updated",
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        description: "Could not update booking",
      });
    }
  };

  const handleSortChange = (field: string) => {
    setPage(1);

    if (sortBy === field) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(field);
    setSortOrder("desc");
  };

  return (
    <div className="space-y-6">
      <div className="booking-muted-panel">
        <div className="space-y-1.5 p-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Booking management
          </h2>
        </div>
        <div className="grid gap-4 px-6 pb-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="booking-search">Search</Label>
            <Input
              id="booking-search"
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              placeholder="Trip id, traveler, buddy..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-buddy">Buddy name</Label>
            <Input
              id="booking-buddy"
              value={buddyName}
              onChange={(event) => {
                setPage(1);
                setBuddyName(event.target.value);
              }}
              placeholder="Khoa Huynh"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-traveler">Traveler name</Label>
            <Input
              id="booking-traveler"
              value={travelerName}
              onChange={(event) => {
                setPage(1);
                setTravelerName(event.target.value);
              }}
              placeholder="Jason Bui"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-status">Booking status</Label>
            <select
              id="booking-status"
              className={selectClassName}
              value={statusFilter}
              onChange={(event) => {
                setPage(1);
                setStatusFilter(event.target.value);
              }}
            >
              <option value="">All statuses</option>
              {BOOKING_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="booked-from">Booked from</Label>
            <Input
              id="booked-from"
              type="date"
              value={bookedFrom}
              onChange={(event) => {
                setPage(1);
                setBookedFrom(event.target.value);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="booked-to">Booked to</Label>
            <Input
              id="booked-to"
              type="date"
              value={bookedTo}
              onChange={(event) => {
                setPage(1);
                setBookedTo(event.target.value);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort-by">Sort by</Label>
            <select
              id="sort-by"
              className={selectClassName}
              value={sortBy}
              onChange={(event) => {
                setPage(1);
                setSortBy(event.target.value);
              }}
            >
              {SORT_FIELDS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort-order">Sort order</Label>
            <select
              id="sort-order"
              className={selectClassName}
              value={sortOrder}
              onChange={(event) => {
                setPage(1);
                setSortOrder(event.target.value);
              }}
            >
              {SORT_ORDERS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSearch("");
                setBuddyName("");
                setTravelerName("");
                setStatusFilter("");
                setBookedFrom("");
                setBookedTo("");
                setSortBy("createdAt");
                setSortOrder("desc");
                setPage(1);
                setPageSize(10);
              }}
            >
              Reset filters
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.95fr)]">
        <div className="booking-muted-panel">
          <div className="space-y-1.5 p-6">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Bookings
            </h2>
            <p className="text-sm text-muted-foreground">
              {totalBookings} bookings returned by the current API query.
            </p>
          </div>
          <div className="px-0">
            {bookings.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 font-medium"
                        onClick={() => handleSortChange("travelerName")}
                      >
                        Traveler
                        <ArrowUpDown className="size-3.5" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 font-medium"
                        onClick={() => handleSortChange("buddyName")}
                      >
                        Buddy
                        <ArrowUpDown className="size-3.5" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 font-medium"
                        onClick={() => handleSortChange("bookedDate")}
                      >
                        Schedule
                        <ArrowUpDown className="size-3.5" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 font-medium"
                        onClick={() => handleSortChange("status")}
                      >
                        Status
                        <ArrowUpDown className="size-3.5" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 font-medium"
                        onClick={() => handleSortChange("totalAmount")}
                      >
                        Total
                        <ArrowUpDown className="size-3.5" />
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
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
                            {booking.travelerName || "Unknown traveler"}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {booking.id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {booking.buddyName || "Unknown buddy"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="space-y-1">
                          <p>{formatDate(booking.bookedDate)}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.bookedStartTime || "No start time"}
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
                  title="No bookings found"
                  description="The current booking filters did not return any results."
                />
              </div>
            )}
          </div>
          <div className="border-t border-border/70 px-0 pt-0">
            <div className="w-full">
              <PaginationControls
                page={bookingsPage}
                totalPages={totalPages}
                hasPreviousPage={
                  bookingsQuery.data?.data.hasPreviousPage ?? false
                }
                hasNextPage={bookingsQuery.data?.data.hasNextPage ?? false}
                onPrevious={() =>
                  setPage((current) => Math.max(current - 1, 1))
                }
                onNext={() =>
                  setPage((current) =>
                    bookingsQuery.data?.data.hasNextPage
                      ? current + 1
                      : current,
                  )
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="booking-muted-panel">
            <div className="space-y-1.5 p-6">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Selected booking
              </h2>
              <p className="text-sm text-muted-foreground">
                Fast summary of the current row before inspecting the full
                record.
              </p>
            </div>
            <div className="px-6 pb-6">
              {selectedBooking ? (
                <div className="grid gap-3">
                  <DetailItem label="Booking ID" value={selectedBooking.id} />
                  <DetailItem
                    label="Trip ID"
                    value={selectedBooking.tripId || "N/A"}
                  />
                  <DetailItem
                    label="Traveler"
                    value={selectedBooking.travelerName || "N/A"}
                  />
                  <DetailItem
                    label="Buddy"
                    value={selectedBooking.buddyName || "N/A"}
                  />
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
                    label="Created at"
                    value={formatDateTime(selectedBooking.createdAt)}
                  />
                  <DetailItem
                    label="Payment deadline"
                    value={formatDateTime(selectedBooking.paymentDeadline)}
                  />
                  <DetailItem
                    label="Chat room"
                    value={selectedBooking.chatRoomId || "N/A"}
                  />
                </div>
              ) : (
                <EmptyState
                  title="No booking selected"
                  description="Select a booking row to inspect the payment and support context."
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
