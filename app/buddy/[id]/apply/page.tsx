"use client";

import { useState, use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  customerName: string;
  customerEmail: string;
}

export default function BuddyApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [buddy, setBuddy] = useState<any>(null);
  const [tripRequest, setTripRequest] = useState<TripRequest | null>(null);
  const [applicationData, setApplicationData] = useState({
    message: "",
    proposedPrice: "",
    availableDates: [] as string[],
    specialOffers: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Get buddy data
    const foundBuddy = BUDDIES.find((b) => b.id === resolvedParams.id);
    setBuddy(foundBuddy);

    // Mock trip request data - in real app, this would come from URL params or API
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
      customerName: "John Doe",
      customerEmail: "john@example.com",
    };
    setTripRequest(mockTripRequest);
  }, [resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Redirect to payment after successful application
    setTimeout(() => {
      if (tripRequest) {
        window.location.href = `/buddy/${buddy.id}/payment`;
      }
    }, 2000);
  };

  if (!buddy || !tripRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Application Submitted Successfully!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your application has been submitted successfully. You will be
              redirected to payment shortly.
            </p>
            <div className="space-y-4">
              <Link href={`/buddy/${buddy.id}`}>
                <Button variant="outline">Back to Profile</Button>
              </Link>
              <Link href="/host-dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Link
          href={`/buddy/${buddy.id}`}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Back to Profile</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Trip Request Details */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                Trip Request Details
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Destination
                    </p>
                    <p className="font-medium text-sm sm:text-base truncate">
                      {tripRequest.destination}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Start Date
                    </p>
                    <p className="font-medium text-sm sm:text-base">
                      {tripRequest.startDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Duration
                    </p>
                    <p className="font-medium text-sm sm:text-base">
                      {tripRequest.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Budget
                    </p>
                    <p className="font-medium text-sm sm:text-base">
                      {tripRequest.budget}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 sm:mt-4">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                  Interests:
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {tripRequest.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="text-xs sm:text-sm"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-3 sm:mt-4">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                  Customer Notes:
                </p>
                <p className="text-xs sm:text-sm bg-muted p-2 sm:p-3 rounded-lg">
                  {tripRequest.notes}
                </p>
              </div>

              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                  Customer Information
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{tripRequest.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">
                      {tripRequest.customerEmail}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Application Form */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                Apply for This Trip
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                    Your Message to Customer *
                  </label>
                  <Textarea
                    value={applicationData.message}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        message: e.target.value,
                      })
                    }
                    placeholder="Tell the customer why you're perfect for this trip..."
                    rows={3}
                    className="text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                    Your Proposed Price *
                  </label>
                  <input
                    type="text"
                    value={applicationData.proposedPrice}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        proposedPrice: e.target.value,
                      })
                    }
                    placeholder="e.g., $150 per day"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                    Available Dates *
                  </label>
                  <input
                    type="text"
                    value={applicationData.availableDates.join(", ")}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        availableDates: e.target.value
                          .split(", ")
                          .filter(Boolean),
                      })
                    }
                    placeholder="e.g., 2024-02-15, 2024-02-16, 2024-02-17"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                    Special Offers (Optional)
                  </label>
                  <Textarea
                    value={applicationData.specialOffers}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        specialOffers: e.target.value,
                      })
                    }
                    placeholder="Any special offers or unique experiences you can provide..."
                    rows={2}
                    className="text-sm sm:text-base"
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </Card>

            {/* Buddy Profile Summary */}
            <Card className="p-4 sm:p-6">
              <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                Your Profile
              </h3>
              <div className="flex items-start gap-3 sm:gap-4">
                <img
                  src={buddy.image || "/placeholder.svg"}
                  alt={buddy.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-sm sm:text-base">
                    {buddy.name}
                  </h4>
                  <div className="flex items-center gap-1 mb-1 sm:mb-2">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-foreground text-xs sm:text-sm">
                      {buddy.rating}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      ({buddy.reviews} reviews)
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {buddy.cities.join(", ")}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
