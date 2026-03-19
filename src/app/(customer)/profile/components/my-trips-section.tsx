"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays, Globe2, MapPin, PencilLine, Trash2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMyTrips } from "@/features/trip/hooks/useTripQueries";
import { useTripMutations } from "@/features/trip/hooks/useTripMutation";
import {
  formatDurationHours,
  formatTravelerSummary,
  formatTripRequestDateTime,
} from "@/lib/trip-request";

export function MyTripsSection() {
  const router = useRouter();
  const myTripsQuery = useMyTrips({ PageSize: 20 });
  const { deleteTripMutation } = useTripMutations();

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
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Loading your trips...
        </CardContent>
      </Card>
    );
  }

  if (myTripsQuery.isError) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-destructive">
          Unable to load your trips right now.
        </CardContent>
      </Card>
    );
  }

  const trips = myTripsQuery.data?.data.items ?? [];

  if (trips.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My trips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You have not created any trips yet.
          </p>
          <Button asChild>
            <Link href="/trip-request">Create a trip</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">My trips</h2>
          <p className="text-sm text-muted-foreground">
            Review your requests, update details, or remove trips that are no longer needed.
          </p>
        </div>
        <Button asChild>
          <Link href="/trip-request">Create new trip</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {trips.map((trip) => (
          <Card key={trip.id}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary">{trip.status}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Created {formatTripRequestDateTime(trip.createdAt)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {trip.city}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Trip starts {formatTripRequestDateTime(`${trip.startDate}T${trip.startTime.slice(0, 5)}`)}
                    </p>
                  </div>

                  <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      <span>{formatDurationHours(trip.durationHours)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{formatTravelerSummary(trip.adults, trip.children)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe2 className="h-4 w-4 text-primary" />
                      <span>
                        {trip.preferredLanguages.length > 0
                          ? trip.preferredLanguages.join(", ")
                          : "No language preference"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{trip.notes || "No additional notes provided."}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/profile/trips/${trip.id}`)}
                  >
                    View details
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/trip-request?tripId=${trip.id}`)}
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
