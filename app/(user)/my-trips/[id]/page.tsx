"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Star,
  Clock,
  Users,
  MessageCircle,
  Heart,
  CheckCircle,
  Calendar,
  DollarSign,
} from "lucide-react";
import { buddiesData, type Buddy } from "@/lib/data/buddies";
import { activityMap } from "@/lib/data/activities";

interface TripRequest {
  id: string;
  destination: string;
  startDate: string;
  duration: string;
  budget: string;
  interests: string[];
  companions: string;
  travelStyle: string;
  notes: string;
  status: "pending" | "matched" | "booked";
  matchedBuddies: number[];
}

export default function TripRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [tripRequest, setTripRequest] = useState<TripRequest | null>(null);
  const [matchedBuddies, setMatchedBuddies] = useState<Buddy[]>([]);
  const [loading, setLoading] = useState(true);

  const allBuddies = Object.values(buddiesData);

  useEffect(() => {
    const mockTripRequest: TripRequest = {
      id: "1",
      destination: "Ho Chi Minh City, Vietnam",
      startDate: "2024-02-15",
      duration: "3 days",
      budget: "$200-300",
      interests: ["Food & Culture", "History", "Photography"],
      companions: "Solo traveler",
      travelStyle: "Adventure",
      notes: "Looking for authentic local experiences",
      status: "matched",
      matchedBuddies: [1, 2, 3],
    };

    setTripRequest(mockTripRequest);

    const buddies = allBuddies.filter((buddy) =>
      mockTripRequest.matchedBuddies.includes(buddy.id)
    );

    setMatchedBuddies(buddies);
    setLoading(false);
  }, []); // allBuddies là static import nên ok

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            Finding perfect local buddies...
          </p>
        </div>
      </div>
    );
  }

  if (!tripRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Trip Request Not Found</h1>
          <Button onClick={() => router.push("/design_trip")}>
            Create New Trip
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-teal-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Perfect Local Buddies Found!
            </h1>
            <p className="text-lg text-muted-foreground">
              We found {matchedBuddies.length} local buddies who match your trip
              preferences
            </p>
          </div>

          {/* Trip Summary */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Your Trip Request
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-medium">{tripRequest.destination}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{tripRequest.startDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{tripRequest.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">{tripRequest.budget}</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Interests:</p>
              <div className="flex flex-wrap gap-2">
                {tripRequest.interests.map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Matched Buddies */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Available Local Buddies
              </h2>
              <p className="text-muted-foreground">
                Choose your perfect local guide for this trip
              </p>
            </div>
          </div>

          {matchedBuddies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedBuddies.map((buddy) => {
                const buddyActivities =
                  buddy.activities
                    ?.map((key) => activityMap[key])
                    .filter(Boolean) || [];

                return (
                  <Card
                    key={buddy.id}
                    className="p-0 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
                    onClick={() => router.push(`/buddy/${buddy.id}`)} // click cả card
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-muted">
                      <img
                        src={buddy.buddyImage || "/placeholder.svg"}
                        alt={buddy.buddy}
                        className="absolute inset-0 w-full h-full object-cover object-center block"
                      />
                      <button
                        className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: handle favorite
                        }}
                      >
                        <Heart className="w-5 h-5 text-red-500" />
                      </button>
                      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
                        {buddyActivities.slice(0, 2).map((a) => (
                          <span
                            key={a!.key}
                            className="bg-black/70 text-white text-xs px-2 py-1 rounded-full"
                          >
                            {a!.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {buddy.buddy}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {buddy.title}
                          </p>
                        </div>
                        <p className="text-xl font-bold text-primary leading-none">
                          ${buddy.price}
                          <span className="ml-1 text-[10px] text-primary/80 font-normal">
                            /person
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{buddy.location}</span>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-foreground">
                            {buddy.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({buddy.reviews})
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{buddy.groupSize}</span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {buddy.description}
                      </p>

                      <div className="mt-auto pt-3 border-t border-border space-y-2">
                        {/* View Profile */}
                        <Button
                          size="sm"
                          className="w-full rounded-lg bg-teal-700 hover:bg-teal-800 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/buddy/${buddy.id}`);
                          }}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>

                        {/* Book Now */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/booking?buddyId=${buddy.id}&tripId=${tripRequest.id}`
                            );
                          }}
                        >
                          Book Now
                        </Button>

                        <div className="flex items-center gap-2 text-xs text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Available for your dates</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                No local buddies found matching your criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/design_trip")}
              >
                Modify Your Trip Request
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
