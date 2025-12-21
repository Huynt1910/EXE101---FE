"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  Users2,
  Star,
  MessageCircle,
  Download,
  ChevronRight,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const upcomingTrips = [
    {
      id: 1,
      title: "Street Food Tour in Hanoi",
      buddy: "Linh",
      buddyImage: "/vietnamese-woman.jpg",
      location: "Hanoi, Vietnam",
      date: "2025-11-15",
      time: "09:00 AM",
      guests: 2,
      price: 90,
      image: "/street-food-hanoi.jpg",
      status: "confirmed",
    },
    {
      id: 2,
      title: "Sunrise Hike & Meditation",
      buddy: "Minh",
      buddyImage: "/vietnamese-guide.jpg",
      location: "Sapa, Vietnam",
      date: "2025-12-01",
      time: "05:30 AM",
      guests: 1,
      price: 35,
      image: "/sunrise-hike.jpg",
      status: "confirmed",
    },
  ];

  const pastTrips = [
    {
      id: 3,
      title: "Traditional Cooking Class",
      buddy: "Hoa",
      buddyImage: "/vietnamese-chef.jpg",
      location: "Ho Chi Minh City, Vietnam",
      date: "2025-09-20",
      time: "02:00 PM",
      guests: 3,
      price: 165,
      image: "/cooking-class.jpg",
      status: "completed",
      rating: 5,
      review:
        "Amazing experience! Hoa was so patient and the food was delicious.",
    },
    {
      id: 4,
      title: "Night Market Walking Tour",
      buddy: "Linh",
      buddyImage: "/vietnamese-woman.jpg",
      location: "Hanoi, Vietnam",
      date: "2025-08-10",
      time: "06:00 PM",
      guests: 2,
      price: 80,
      image: "/night-market.jpg",
      status: "completed",
      rating: 4,
      review:
        "Great tour! Linh showed us hidden gems and the food was incredible.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            My Trips
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View and manage your upcoming and past activities
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex gap-2 sm:gap-4 border-b border-border mb-6 sm:mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === "upcoming"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Upcoming ({upcomingTrips.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-3 sm:px-4 py-2 sm:py-3 font-medium border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === "past"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Past ({pastTrips.length})
          </button>
        </div>

        {/* Upcoming Trips */}
        {activeTab === "upcoming" && (
          <div className="space-y-3 sm:space-y-4">
            {upcomingTrips.length > 0 ? (
              upcomingTrips.map((trip) => (
                <Card
                  key={trip.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Image */}
                    <div className="lg:w-48 h-48 lg:h-auto flex-shrink-0">
                      <img
                        src={trip.image || "/placeholder.svg"}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 truncate">
                              {trip.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-3">
                              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                {trip.status === "confirmed"
                                  ? "Confirmed"
                                  : "Completed"}
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-lg sm:text-2xl font-bold text-primary">
                              ${trip.price}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Total paid
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">{trip.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span>
                              {new Date(trip.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span>{trip.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <Users2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span>
                              {trip.guests}{" "}
                              {trip.guests === 1 ? "guest" : "guests"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-3 sm:pt-4 border-t border-border">
                          <img
                            src={trip.buddyImage || "/placeholder.svg"}
                            alt={trip.buddy}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-foreground">
                              with {trip.buddy}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Your local host
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-40 p-4 sm:p-6 flex flex-row lg:flex-col gap-2 sm:gap-3 justify-center border-t lg:border-t-0 lg:border-l border-border">
                      <Button
                        variant="outline"
                        className="bg-transparent flex-1 lg:w-full"
                        size="sm"
                      >
                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Message</span>
                        <span className="sm:hidden">Msg</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-transparent flex-1 lg:w-full"
                        size="sm"
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Receipt</span>
                        <span className="sm:hidden">Receipt</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-transparent flex-1 lg:w-full text-destructive hover:text-destructive"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 sm:p-12 text-center">
                <p className="text-base sm:text-lg text-muted-foreground mb-4">
                  No upcoming trips yet
                </p>
                <Link href="/explore">
                  <Button>Explore Activities</Button>
                </Link>
              </Card>
            )}
          </div>
        )}

        {/* Past Trips */}
        {activeTab === "past" && (
          <div className="space-y-3 sm:space-y-4">
            {pastTrips.length > 0 ? (
              pastTrips.map((trip) => (
                <Card
                  key={trip.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Image */}
                    <div className="lg:w-48 h-48 lg:h-auto flex-shrink-0">
                      <img
                        src={trip.image || "/placeholder.svg"}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 truncate">
                            {trip.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                  i < (trip.rating || 0)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                            <span className="text-xs sm:text-sm font-medium text-foreground ml-2">
                              {trip.rating}/5
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg sm:text-2xl font-bold text-primary">
                            ${trip.price}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Total paid
                          </p>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 italic">
                        "{trip.review}"
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{trip.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>
                            {new Date(trip.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>
                            {trip.guests}{" "}
                            {trip.guests === 1 ? "guest" : "guests"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-3 sm:pt-4 border-t border-border">
                        <img
                          src={trip.buddyImage || "/placeholder.svg"}
                          alt={trip.buddy}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-foreground">
                            with {trip.buddy}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Your local host
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-40 p-4 sm:p-6 flex flex-row lg:flex-col gap-2 sm:gap-3 justify-center border-t lg:border-t-0 lg:border-l border-border">
                      <Button
                        variant="outline"
                        className="bg-transparent flex-1 lg:w-full"
                        size="sm"
                      >
                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Message</span>
                        <span className="sm:hidden">Msg</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-transparent flex-1 lg:w-full"
                        size="sm"
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Receipt</span>
                        <span className="sm:hidden">Receipt</span>
                      </Button>
                      <Link href="/explore" className="flex-1 lg:w-full">
                        <Button className="w-full" size="sm">
                          <span className="hidden sm:inline">Book Again</span>
                          <span className="sm:hidden">Book</span>
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 sm:p-12 text-center">
                <p className="text-base sm:text-lg text-muted-foreground mb-4">
                  No past trips yet
                </p>
                <Link href="/explore">
                  <Button>Start Exploring</Button>
                </Link>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
