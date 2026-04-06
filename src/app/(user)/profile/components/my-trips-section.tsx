"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Pagination } from "@heroui/pagination";
import {
  CalendarDays,
  Globe2,
  MapPin,
  PencilLine,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookingPanel,
  BookingPanelContent,
  BookingPanelHeader,
  BookingPanelTitle,
} from "@/components/ui/booking-panel";
import { useMyTrips } from "../../../../features/trip/hooks/useTripRequest";
import { useTripMutations } from "@/features/trip/hooks/useTripMutation";
import {
  formatDurationHours,
  formatTravelerSummary,
  formatTripRequestDateTime,
} from "@/lib/trip-request";

export function MyTripsSection() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const myTripsQuery = useMyTrips({ PageSize: pageSize, Page: currentPage });
  const { deleteTripMutation } = useTripMutations();
  const paginationData = myTripsQuery.data?.data;
  const trips = paginationData?.items ?? [];
  const totalCount = paginationData?.totalCount ?? 0;
  const totalPages = useMemo(
    () =>
      paginationData?.totalPages ??
      Math.max(
        1,
        Math.ceil(totalCount / (paginationData?.pageSize ?? pageSize)),
      ),
    [
      pageSize,
      paginationData?.pageSize,
      paginationData?.totalPages,
      totalCount,
    ],
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDelete = async (tripId: string) => {
    const shouldDelete = window.confirm(
      "Delete this trip? Active bookings may prevent deletion.",
    );

    if (!shouldDelete) return;

    try {
      await deleteTripMutation.mutateAsync(tripId);
      toast.success("Trip deleted successfully.");
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "Unable to delete this trip.";

      toast.error(message);
    }
  };

  if (myTripsQuery.isLoading) {
    return (
      <BookingPanel>
        <BookingPanelContent className="text-sm text-muted-foreground">
          Loading your trips…
        </BookingPanelContent>
      </BookingPanel>
    );
  }

  if (myTripsQuery.isError) {
    return (
      <BookingPanel className="border-destructive/20">
        <BookingPanelContent className="text-sm text-destructive">
          Unable to load your trips right now.
        </BookingPanelContent>
      </BookingPanel>
    );
  }

  if (trips.length === 0) {
    return (
      <BookingPanel>
        <BookingPanelHeader>
          <BookingPanelTitle>My trips</BookingPanelTitle>
        </BookingPanelHeader>
        <BookingPanelContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You have not created any trips yet.
          </p>
          <Button asChild>
            <Link href="/trip-request">Create a trip</Link>
          </Button>
        </BookingPanelContent>
      </BookingPanel>
    );
  }

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-foreground">My trips</h2>
          <p className="text-sm text-muted-foreground">
            Review your requests, update details, or remove trips that are no
            longer needed.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Showing page {paginationData?.page ?? currentPage} of {totalPages}
            {totalCount > 0 ? ` • ${totalCount} total trips` : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/trip-request">Create new trip</Link>
        </Button>
      </div>

      <div className="min-w-0 grid gap-2">
        {trips.map((trip) => (
          <BookingPanel key={trip.id} className="min-w-0 overflow-hidden">
            <BookingPanelContent>
              <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary">{trip.status}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Created {formatTripRequestDateTime(trip.createdAt)}
                    </span>
                  </div>

                  <div>
                    <h3 className="break-words text-xl font-semibold text-foreground">
                      {trip.city}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Trip starts{" "}
                      {formatTripRequestDateTime(
                        `${trip.startDate}T${trip.startTime.slice(0, 5)}`,
                      )}
                    </p>
                  </div>

                  <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      <span>{formatDurationHours(trip.durationHours)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>
                        {formatTravelerSummary(trip.adults, trip.children)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe2 className="h-4 w-4 text-primary" />
                      <span className="break-words">
                        {trip.preferredLanguages.length > 0
                          ? trip.preferredLanguages.join(", ")
                          : "No language preference"}
                      </span>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="min-w-0 break-words">
                      {trip.notes || "No additional notes provided."}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 xl:shrink-0 xl:justify-end xl:self-start xl:pl-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/profile/trip/${trip.id}`)}
                  >
                    View details
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/trip-request?tripId=${trip.id}`)
                    }
                  >
                    <PencilLine className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      void handleDelete(trip.id);
                    }}
                    disabled={deleteTripMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </BookingPanelContent>
          </BookingPanel>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <Pagination
          showControls
          initialPage={1}
          page={currentPage}
          total={Math.max(1, totalPages)}
          onChange={setCurrentPage}
          isDisabled={totalPages <= 1 || myTripsQuery.isFetching}
          classNames={{
            item: "transition-colors hover:bg-primary/10 hover:text-primary",
            prev: "transition-colors hover:bg-primary/10 hover:text-primary",
            next: "transition-colors hover:bg-primary/10 hover:text-primary",
            cursor: "bg-primary text-primary-foreground",
          }}
        />
      </div>
    </div>
  );
}
