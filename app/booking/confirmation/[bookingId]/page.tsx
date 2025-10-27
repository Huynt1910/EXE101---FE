"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Users,
  Mail,
  Phone,
  Download,
  Share2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { BUDDIES } from "@/lib/data/buddies";

interface ConfirmationPageProps {
  params: Promise<{
    bookingId: string;
  }>;
}

const mockActivities = [
  {
    id: "street-food-tour",
    title: "Hanoi Street Food Adventure",
    duration: "3 hours",
    price: 25,
    description: "Explore hidden street food gems with a local foodie",
    maxGroup: 6,
    includes: ["Food tasting", "Local guide", "Transportation"],
  },
  {
    id: "coffee-culture",
    title: "Vietnamese Coffee Culture",
    duration: "2 hours",
    price: 15,
    description: "Learn about Vietnamese coffee culture and brewing methods",
    maxGroup: 4,
    includes: ["Coffee tasting", "Brewing lesson", "Take-home beans"],
  },
  {
    id: "night-market",
    title: "Night Market Experience",
    duration: "4 hours",
    price: 30,
    description: "Experience the vibrant night market scene",
    maxGroup: 8,
    includes: ["Market tour", "Food samples", "Shopping tips"],
  },
];

export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  const resolvedParams = use(params);
  const [confirmationData, setConfirmationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get confirmation data from localStorage
    const data = localStorage.getItem("confirmationData");
    if (data) {
      setConfirmationData(JSON.parse(data));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading confirmation...</p>
        </div>
      </div>
    );
  }

  if (!confirmationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <Link href="/explore">
            <Button>Back to Explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  const buddy = BUDDIES.find((b) => b.id === confirmationData.buddyId);
  const activity = mockActivities.find(
    (a) => a.id === confirmationData.activityId
  );

  if (!buddy || !activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Booking</h1>
          <Link href="/explore">
            <Button>Back to Explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleDownloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    const ticketData = {
      bookingId: resolvedParams.bookingId,
      buddy: buddy.name,
      activity: activity.title,
      date: confirmationData.date,
      time: confirmationData.time,
      groupSize: confirmationData.groupSize,
      total: confirmationData.finalTotal,
    };

    const dataStr = JSON.stringify(ticketData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `booking-${resolvedParams.bookingId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <Link
            href="/explore"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Explore</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={handleDownloadTicket}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Success Message */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Your experience with {buddy.name} is all set
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Booking Details */}
          <div className="space-y-4 sm:space-y-6">
            {/* Booking Information */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Booking Information
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base">
                      Date & Time
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {new Date(confirmationData.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}{" "}
                      at {confirmationData.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base">
                      Group Size
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {confirmationData.groupSize}{" "}
                      {confirmationData.groupSize === 1 ? "person" : "people"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base">
                      Meeting Point
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {buddy.cities[0]} - Details will be sent via email
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Your Local Buddy
              </h2>

              <div className="flex items-start gap-3 sm:gap-4">
                <img
                  src={buddy.image || "/placeholder.svg"}
                  alt={buddy.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">
                    {buddy.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                    {activity.title}
                  </p>

                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Email sent</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">SMS sent</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* What's Next */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                What's Next?
              </h2>

              <div className="space-y-3">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      Check your email
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      We've sent you a confirmation email with all the details
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      Meet your buddy
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Your local buddy will contact you 24 hours before the
                      experience
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      Enjoy your experience
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Have an amazing time exploring with your local buddy!
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-4 sm:space-y-6">
            {/* Booking Summary */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Booking Summary
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Booking ID</span>
                  <span className="font-mono text-xs sm:text-sm">
                    {resolvedParams.bookingId}
                  </span>
                </div>

                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Activity</span>
                  <span className="font-medium text-right">
                    {activity.title}
                  </span>
                </div>

                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{activity.duration}</span>
                </div>

                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Total Paid</span>
                  <span className="font-bold text-base sm:text-lg">
                    ${confirmationData.finalTotal}
                  </span>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Quick Actions
              </h2>

              <div className="space-y-2 sm:space-y-3">
                <Button className="w-full" onClick={handleDownloadTicket}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Ticket
                </Button>

                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Booking
                </Button>

                <Link href="/trips" className="block">
                  <Button variant="outline" className="w-full">
                    View All Bookings
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Support */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Need Help?
              </h2>

              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <p className="text-muted-foreground">
                  If you have any questions about your booking, our support team
                  is here to help.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs sm:text-sm">
                      support@localhost.com
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs sm:text-sm">+84 123 456 789</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
