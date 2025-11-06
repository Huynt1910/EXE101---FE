"use client";

import { useState, useEffect } from "react";
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
import Link from "next/link";
import { BUDDIES } from "@/lib/data/buddies";

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
  matchedBuddies: string[];
}

export default function TripRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [tripRequest, setTripRequest] = useState<TripRequest | null>(null);
  const [matchedBuddies, setMatchedBuddies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockTripRequest: TripRequest = {
      id: "1",
      destination: "Hanoi, Vietnam",
      startDate: "2024-02-15",
      duration: "3 days",
      budget: "$200-300",
      interests: ["Food & Culture", "History", "Photography"],
      companions: "Solo traveler",
      travelStyle: "Adventure",
      notes: "Looking for authentic local experiences",
      status: "matched",
      matchedBuddies: ["1", "2", "3"],
    };

    setTripRequest(mockTripRequest);

    // Filter buddies based on trip requirements
    const filteredBuddies = BUDDIES.filter(
      (buddy) =>
        buddy.cities.some((city) => city.toLowerCase().includes("hanoi")) &&
        buddy.interests.some((interest) =>
          mockTripRequest.interests.some((tripInterest) =>
            interest.toLowerCase().includes(tripInterest.toLowerCase())
          )
        )
    );

    setMatchedBuddies(filteredBuddies);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
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
          <Link href="/design_trip">
            <Button>Create New Trip</Button>
          </Link>
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
            <Link href={`/trip-request/${tripRequest.id}/applications`}>
              <Button variant="outline">
                View Applications ({matchedBuddies.length})
              </Button>
            </Link>
          </div>

          {matchedBuddies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedBuddies.map((buddy) => (
                <Card
                  key={buddy.id}
                  className="p-0 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
                >
                  {/* IMAGE WRAPPER không padding, không margin */}
                  <div className="relative aspect-[4/3] bg-muted">
                    <img
                      src={buddy.image || "/placeholder.svg"}
                      alt={buddy.name}
                      className="absolute inset-0 w-full h-full object-cover object-[50%_30%] block"
                    />
                    <button className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors">
                      <Heart className="w-5 h-5 text-red-500" />
                    </button>
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
                      {buddy.styles.slice(0, 2).map((style: string) => (
                        <span
                          key={style}
                          className="bg-black/70 text-white text-xs px-2 py-1 rounded-full"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {buddy.name}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{buddy.cities.join(", ")}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-foreground">
                          {buddy.rating}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({buddy.reviews} reviews)
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Languages:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {buddy.languages.map((lang: string) => (
                          <span
                            key={lang}
                            className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Interests:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {buddy.interests.slice(0, 3).map((interest: string) => (
                          <span
                            key={interest}
                            className="bg-primary/10 text-primary text-xs px-2 py-1 rounded"
                          >
                            {interest}
                          </span>
                        ))}
                        {buddy.interests.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{buddy.interests.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Budget:
                          </p>
                          <p className="font-semibold text-foreground">
                            {buddy.budgetLabel}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Max Group:
                          </p>
                          <p className="font-semibold text-foreground">
                            {buddy.maxGroup} people
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        asChild
                        size="lg"
                        className="w-full rounded-lg bg-teal-700 hover:bg-teal-800 text-white"
                      >
                        <Link href={`/buddy/${buddy.id}`}>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          View Profile & Apply
                        </Link>
                      </Button>

                      <Button
                        asChild
                        size="lg"
                        className="w-full rounded-lg bg-teal-600 hover:bg-teal-700 text-white"
                      >
                        <Link href={`/buddy/${buddy.id}/apply`}>Apply Now</Link>
                      </Button>

                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Available for your dates</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                No local buddies found matching your criteria.
              </p>
              <Link href="/design_trip">
                <Button variant="outline">Modify Your Trip Request</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
