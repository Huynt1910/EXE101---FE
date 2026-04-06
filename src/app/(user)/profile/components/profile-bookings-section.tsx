"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarClock, CreditCard, MessageCircle, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookingPanel,
  BookingPanelContent,
  BookingPanelDescription,
  BookingPanelHeader,
  BookingPanelTitle,
} from "@/components/ui/booking-panel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useConfirmAndCreatePaypalOrderMutation,
  useMyTravelerBookingsQuery,
} from "@/features/booking/hooks/useCreateBookingOffer";
import type { BookingOffer } from "@/features/booking/type";

const bookingTabs = [
  "All",
  "Pending",
  "Pending payment",
  "Confirmed",
  "Completed",
  "Cancelled",
] as const;

type BookingTab = (typeof bookingTabs)[number];

function getBookingGroup(status?: string | null) {
  switch (status) {
    case "PendingCustomerConfirm":
      return "Pending";
    case "PendingPayment":
      return "Pending payment";
    case "Confirmed":
    case "InProgress":
      return "Confirmed";
    case "Completed":
      return "Completed";
    case "Cancelled":
    case "CancelledByTimeout":
    case "Expired":
      return "Cancelled";
    default:
      return "Pending";
  }
}

function getStatusClasses(group: string) {
  switch (group) {
    case "Confirmed":
    case "Completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Pending":
    case "Pending payment":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "Cancelled":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-border/70 bg-secondary/50 text-muted-foreground";
  }
}

function formatDate(date?: string | null, time?: string | null) {
  if (!date) return "Schedule not set";
  return `${date}${time ? ` at ${time.slice(0, 5)}` : ""}`;
}

function normalizeItems(items: BookingOffer[], activeTab: BookingTab) {
  if (activeTab === "All") return items;
  return items.filter(
    (item) => getBookingGroup(item.statusName || item.status) === activeTab,
  );
}

export function ProfileBookingsSection() {
  const [activeTab, setActiveTab] = useState<BookingTab>("All");
  const bookingsQuery = useMyTravelerBookingsQuery();
  const confirmAndPayMutation = useConfirmAndCreatePaypalOrderMutation();

  const bookings = bookingsQuery.data?.data.items ?? [];
  const filteredBookings = useMemo(
    () => normalizeItems(bookings, activeTab),
    [activeTab, bookings],
  );

  const handleConfirmAndPay = async (bookingId: string) => {
    try {
      const response = await confirmAndPayMutation.mutateAsync({ bookingId });
      const approveUrl = response.data.paymentOrder.approveUrl;

      if (!approveUrl) {
        toast.error("Payment link is missing from the response.");
        return;
      }

      window.location.href = approveUrl;
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "Unable to start payment right now.";

      toast.error(message);
    }
  };

  if (bookingsQuery.isLoading) {
    return (
      <BookingPanel>
        <BookingPanelContent className="text-sm text-muted-foreground">
          Loading your bookings…
        </BookingPanelContent>
      </BookingPanel>
    );
  }

  if (bookingsQuery.isError) {
    return (
      <BookingPanel className="border-destructive/20">
        <BookingPanelContent className="text-sm text-destructive">
          Unable to load your bookings right now.
        </BookingPanelContent>
      </BookingPanel>
    );
  }

  return (
    <BookingPanel>
      <BookingPanelHeader className="border-b border-border/70">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <BookingPanelTitle className="text-2xl">My bookings</BookingPanelTitle>
            <BookingPanelDescription>
              Track confirmation, payment, and local buddy commitments in one
              place.
            </BookingPanelDescription>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as BookingTab)}
          >
            <TabsList className="h-auto flex-wrap rounded-2xl bg-secondary/60 p-1">
              {bookingTabs.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-xl px-3 py-2 text-xs sm:text-sm"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </BookingPanelHeader>
      <BookingPanelContent className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => {
            const group = getBookingGroup(booking.statusName || booking.status);
            const canPay =
              booking.statusName === "PendingCustomerConfirm" ||
              booking.statusName === "PendingPayment";

            return (
              <div
                key={booking.id}
                className="rounded-[1.5rem] border border-border/70 bg-background p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`rounded-full px-3 py-1 ${getStatusClasses(group)}`}
                      >
                        {group}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Booking ID: {booking.id.slice(0, 8)}
                      </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(16rem,1fr)]">
                      <div className="space-y-3">
                        <div>
                          <p className="text-lg font-semibold text-foreground">
                            {booking.buddyName || "Local buddy"}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatDate(booking.bookedDate, booking.bookedStartTime)}
                          </p>
                        </div>

                        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                          <div className="rounded-2xl bg-secondary/35 p-4">
                            <div className="flex items-center gap-2 text-foreground">
                              <CalendarClock className="h-4 w-4 text-primary" />
                              Booking details
                            </div>
                            <p className="mt-2">
                              {booking.bookedAdults} adults, {booking.bookedChildren} children
                            </p>
                            <p>{booking.bookedDurationHours} hours</p>
                          </div>
                          <div className="rounded-2xl bg-secondary/35 p-4">
                            <div className="flex items-center gap-2 text-foreground">
                              <CreditCard className="h-4 w-4 text-primary" />
                              Pricing
                            </div>
                            <p className="mt-2">
                              {booking.totalAmount} {booking.currency}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Includes platform fee {booking.platformFeeAmount}{" "}
                              {booking.currency}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 rounded-[1.25rem] border border-border/70 bg-background p-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            Includes
                          </p>
                          <p className="mt-2 text-sm text-foreground">
                            {booking.includes || "No inclusions listed."}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            Message from buddy
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {booking.noteForCustomer ||
                              "No additional note shared yet."}
                          </p>
                        </div>
                        {booking.paymentDeadline ? (
                          <p className="text-xs text-muted-foreground">
                            Payment deadline: {booking.paymentDeadline}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 xl:max-w-xs xl:justify-end">
                    <Button asChild variant="outline" className="rounded-xl">
                      <Link href="/messages">
                        <MessageCircle className="h-4 w-4" />
                        Messages
                      </Link>
                    </Button>
                    {canPay ? (
                      <Button
                        className="rounded-xl"
                        onClick={() => {
                          void handleConfirmAndPay(booking.id);
                        }}
                        disabled={confirmAndPayMutation.isPending}
                      >
                        <Wallet className="h-4 w-4" />
                        {confirmAndPayMutation.isPending
                          ? "Processing…"
                          : "Confirm & pay"}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-border/70 bg-secondary/20 p-8 text-center">
            <p className="text-base font-medium text-foreground">
              No bookings in this state
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Once you confirm a local buddy arrangement, it will appear here
              with payment and schedule status.
            </p>
          </div>
        )}
      </BookingPanelContent>
    </BookingPanel>
  );
}
