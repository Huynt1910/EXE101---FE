"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarDays,
  Globe2,
  MapPin,
  PencilLine,
  Trash2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTripMutations } from "@/features/trip/hooks/useTripMutation";
import {
  formatDurationHours,
  formatTravelerSummary,
  formatTripRequestDateTime,
} from "@/lib/trip-request";
import { useTripDetail } from "@/features/trip/hooks/useTripRequest";

export default function TravelerTripDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const tripId = typeof params.id === "string" ? params.id : "";
  const tripDetailQuery = useTripDetail(tripId);
  const { deleteTripMutation } = useTripMutations();

  const handleDelete = async () => {
    const shouldDelete = window.confirm(
      "Delete this trip? Active bookings may prevent deletion.",
    );

    if (!shouldDelete) return;

    try {
      await deleteTripMutation.mutateAsync(tripId);
      toast.success("Trip deleted successfully.");
      router.push("/profile?section=trips");
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

  if (tripDetailQuery.isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Loading trip details...
        </CardContent>
      </Card>
    );
  }

  if (tripDetailQuery.isError || !tripDetailQuery.data?.data) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-destructive">
          Unable to load this trip.
        </CardContent>
      </Card>
    );
  }

  const trip = tripDetailQuery.data.data;

  return (
    <div className="space-y-4">
      <Button variant="ghost" asChild className="w-fit px-0">
        <Link href="/profile?section=trips">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to my trips
        </Link>
      </Button>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{trip.status}</Badge>
            <span className="text-sm text-muted-foreground">
              Created {formatTripRequestDateTime(trip.createdAt)}
            </span>
          </div>
          <div>
            <CardTitle className="text-3xl">{trip.city}</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              Trip starts{" "}
              {formatTripRequestDateTime(
                `${trip.startDate}T${trip.startTime.slice(0, 5)}`,
              )}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                Duration
              </div>
              <p className="mt-2 text-lg font-semibold">
                {formatDurationHours(trip.durationHours)}
              </p>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                Travelers
              </div>
              <p className="mt-2 text-lg font-semibold">
                {formatTravelerSummary(trip.adults, trip.children)}
              </p>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe2 className="h-4 w-4 text-primary" />
                Preferred languages
              </div>
              <p className="mt-2 text-lg font-semibold">
                {trip.preferredLanguages.length > 0
                  ? trip.preferredLanguages.join(", ")
                  : "No language preference"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              Traveler notes
            </div>
            <p className="mt-2 text-sm text-foreground">
              {trip.notes || "No additional notes provided."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href={`/trip-request?tripId=${trip.id}`}>
                <PencilLine className="mr-2 h-4 w-4" />
                Edit trip
              </Link>
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                void handleDelete();
              }}
              disabled={deleteTripMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete trip
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
