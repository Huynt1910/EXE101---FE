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
  User,
  Mail,
  Phone,
  Heart,
  Users,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

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
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  postedAt: string;
  applicationsCount: number;
  isApplied: boolean;
  requirements: string[];
  specialRequests: string;
}

export default function TripRequestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [tripRequest, setTripRequest] = useState<TripRequest | null>(null);
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
      notes:
        "Looking for authentic local experiences and street food tours. I'm a food blogger and want to capture the essence of Vietnamese cuisine.",
      status: "pending",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "+1 (555) 123-4567",
      postedAt: "2024-01-20T10:00:00Z",
      applicationsCount: 3,
      isApplied: false,
      requirements: [
        "English speaking guide",
        "Food safety knowledge",
        "Photography skills",
        "Cultural insights",
      ],
      specialRequests:
        "Please note any dietary restrictions or allergies. I'm interested in learning cooking techniques.",
    };

    setTripRequest(mockTripRequest);
    setLoading(false);
  }, []);

  const handleApplyToTrip = async () => {
    // In real app, this would call API to apply to trip
    setTripRequest((prev) =>
      prev
        ? {
            ...prev,
            isApplied: true,
            applicationsCount: prev.applicationsCount + 1,
          }
        : null
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!tripRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Trip Request Not Found</h1>
          <Link href="/buddy-dashboard">
            <Button>Back to Dashboard</Button>
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
          href="/buddy-dashboard"
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trip Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Overview */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {tripRequest.destination}
                  </h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-5 h-5" />
                      <span>{tripRequest.startDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-5 h-5" />
                      <span>{tripRequest.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-5 h-5" />
                      <span>{tripRequest.budget}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={tripRequest.isApplied ? "default" : "secondary"}
                  >
                    {tripRequest.isApplied ? "Applied" : "Available"}
                  </Badge>
                  <button className="p-2 hover:bg-muted rounded-full transition-colors">
                    <Heart className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Travel Style
                  </h3>
                  <Badge variant="outline">{tripRequest.travelStyle}</Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Group Size
                  </h3>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{tripRequest.companions}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Customer Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Customer Information
              </h2>

              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {tripRequest.customerName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tripRequest.companions}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{tripRequest.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{tripRequest.customerPhone}</span>
                </div>
              </div>
            </Card>

            {/* Trip Description */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Trip Description
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {tripRequest.notes}
              </p>
            </Card>

            {/* Interests */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Customer Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {tripRequest.interests.map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Requirements */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Guide Requirements
              </h2>
              <ul className="space-y-2">
                {tripRequest.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{requirement}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Special Requests */}
            {tripRequest.specialRequests && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Special Requests
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {tripRequest.specialRequests}
                </p>
              </Card>
            )}
          </div>

          {/* Right Column - Actions & Stats */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Apply to This Trip
              </h3>

              {!tripRequest.isApplied ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This trip is looking for a local guide. Apply now to be
                    considered!
                  </p>

                  <Link href={`/buddy/1/apply?tripId=${tripRequest.id}`}>
                    <Button className="w-full" size="lg">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                  </Link>

                  <div className="text-xs text-muted-foreground text-center">
                    <p>You'll be able to customize your application</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Application Sent!
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Your application has been submitted. The customer will
                    review it and get back to you.
                  </p>
                </div>
              )}
            </Card>

            {/* Trip Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Trip Statistics
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Applications
                  </span>
                  <span className="font-semibold text-foreground">
                    {tripRequest.applicationsCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Posted</span>
                  <span className="font-semibold text-foreground">
                    {new Date(tripRequest.postedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline">{tripRequest.status}</Badge>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Customer
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  Save for Later
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
