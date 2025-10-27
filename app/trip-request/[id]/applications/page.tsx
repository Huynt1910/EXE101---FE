"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Star,
  Clock,
  Calendar,
  DollarSign,
  MessageCircle,
  ArrowLeft,
  CheckCircle,
  User,
  Mail,
  Phone,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { BUDDIES } from "@/lib/data/buddies";

interface Application {
  id: string;
  buddyId: string;
  message: string;
  proposedPrice: string;
  availableDates: string[];
  specialOffers: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
}

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
}

export default function TripApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [tripRequest, setTripRequest] = useState<TripRequest | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
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
    };

    const mockApplications: Application[] = [
      {
        id: "app1",
        buddyId: "1",
        message:
          "Hi! I'm Linh, a local food enthusiast with 8 years of experience. I'd love to show you the best street food in Hanoi and share our culture with you!",
        proposedPrice: "$45 per day",
        availableDates: ["2024-02-15", "2024-02-16", "2024-02-17"],
        specialOffers:
          "I can also arrange a cooking class with my family if you're interested!",
        status: "pending",
        appliedAt: "2024-01-20T10:30:00Z",
      },
      {
        id: "app2",
        buddyId: "2",
        message:
          "Hello! I'm Duc, a motorbike tour guide. I can show you the hidden gems of Hanoi and take you on an authentic local adventure!",
        proposedPrice: "$50 per day",
        availableDates: [
          "2024-02-15",
          "2024-02-16",
          "2024-02-17",
          "2024-02-18",
        ],
        specialOffers: "Free motorbike rental included!",
        status: "pending",
        appliedAt: "2024-01-20T14:15:00Z",
      },
      {
        id: "app3",
        buddyId: "3",
        message:
          "Hi there! I'm Hoa, a cultural guide specializing in Vietnamese history. I'd be happy to show you the rich heritage of Hanoi!",
        proposedPrice: "$40 per day",
        availableDates: ["2024-02-15", "2024-02-16", "2024-02-17"],
        specialOffers: "I can arrange visits to local artisan workshops!",
        status: "pending",
        appliedAt: "2024-01-20T16:45:00Z",
      },
    ];

    setTripRequest(mockTripRequest);
    setApplications(mockApplications);
    setLoading(false);
  }, []);

  const handleAcceptApplication = async (applicationId: string) => {
    // In real app, this would call API to accept application
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? { ...app, status: "accepted" as const }
          : { ...app, status: "rejected" as const }
      )
    );

    // Redirect to payment after accepting application
    setTimeout(() => {
      window.location.href = `/booking/confirmation/${applicationId}`;
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading applications...</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href={`/trip-request/${tripRequest.id}`}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Trip Request
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Trip Summary */}
        <Card className="p-6 mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Applications for Your Trip
          </h1>
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
        </Card>

        {/* Applications List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">
            {applications.length} Local Buddies Applied
          </h2>

          {applications.length > 0 ? (
            <div className="space-y-6">
              {applications.map((application) => {
                const buddy = BUDDIES.find((b) => b.id === application.buddyId);
                if (!buddy) return null;

                return (
                  <Card key={application.id} className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={buddy.image || "/placeholder.svg"}
                          alt={buddy.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-foreground">
                                {buddy.name}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                  <span className="font-semibold text-foreground">
                                    {buddy.rating}
                                  </span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  (128 reviews)
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{buddy.cities.join(", ")}</span>
                              </div>
                            </div>
                            <Badge
                              variant={
                                application.status === "accepted"
                                  ? "default"
                                  : application.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {application.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Application Details */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">
                              Application Message
                            </h4>
                            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                              {application.message}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-foreground mb-2">
                              Proposed Price
                            </h4>
                            <p className="text-lg font-semibold text-primary">
                              {application.proposedPrice}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-foreground mb-2">
                              Available Dates
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {application.availableDates.map((date) => (
                                <Badge key={date} variant="outline">
                                  {date}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {application.specialOffers && (
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">
                                Special Offers
                              </h4>
                              <p className="text-sm text-muted-foreground bg-green-50 p-3 rounded-lg border border-green-200">
                                {application.specialOffers}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Buddy Profile */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">
                              Languages
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {buddy.languages.map((lang) => (
                                <Badge key={lang} variant="secondary">
                                  {lang}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-foreground mb-2">
                              Interests
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {buddy.interests.slice(0, 5).map((interest) => (
                                <Badge key={interest} variant="outline">
                                  {interest}
                                </Badge>
                              ))}
                              {buddy.interests.length > 5 && (
                                <span className="text-xs text-muted-foreground">
                                  +{buddy.interests.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Budget Range
                              </p>
                              <p className="font-semibold text-foreground">
                                {buddy.budgetLabel}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Max Group
                              </p>
                              <p className="font-semibold text-foreground">
                                {buddy.maxGroup} people
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-4 mt-6 pt-6 border-t border-border">
                        <Link href={`/buddy/${buddy.id}`}>
                          <Button variant="outline">View Full Profile</Button>
                        </Link>

                        {application.status === "pending" && (
                          <Button
                            onClick={() =>
                              handleAcceptApplication(application.id)
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept & Pay
                          </Button>
                        )}

                        {application.status === "accepted" && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-medium">
                              Application Accepted
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-lg text-muted-foreground mb-4">
                No applications received yet.
              </p>
              <p className="text-sm text-muted-foreground">
                Local buddies will be notified about your trip request and can
                apply to be your guide.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
