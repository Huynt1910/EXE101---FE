"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Star,
  Clock,
  Calendar,
  DollarSign,
  Search,
  Filter,
  Heart,
  MessageCircle,
  User,
  Eye,
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
  postedAt: string;
  applicationsCount: number;
  isApplied: boolean;
}

export default function BuddyDashboardPage() {
  const [tripRequests, setTripRequests] = useState<TripRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<TripRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockTripRequests: TripRequest[] = [
      {
        id: "1",
        destination: "Hanoi, Vietnam",
        startDate: "2024-02-15",
        duration: "3 days",
        budget: "$200-300",
        interests: ["Food & Culture", "History", "Photography"],
        companions: "Solo traveler",
        travelStyle: "Adventure",
        notes: "Looking for authentic local experiences and street food tours",
        status: "pending",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        postedAt: "2024-01-20T10:00:00Z",
        applicationsCount: 3,
        isApplied: false,
      },
      {
        id: "2",
        destination: "Ho Chi Minh City, Vietnam",
        startDate: "2024-02-20",
        duration: "5 days",
        budget: "$400-500",
        interests: ["Nightlife", "Shopping", "Modern Culture"],
        companions: "Couple",
        travelStyle: "Luxury",
        notes:
          "Want to experience the vibrant city life and modern attractions",
        status: "pending",
        customerName: "Sarah & Mike",
        customerEmail: "sarah@example.com",
        postedAt: "2024-01-21T14:30:00Z",
        applicationsCount: 5,
        isApplied: true,
      },
      {
        id: "3",
        destination: "Hoi An, Vietnam",
        startDate: "2024-03-01",
        duration: "2 days",
        budget: "$150-200",
        interests: ["Cultural Heritage", "Photography", "Art"],
        companions: "Solo traveler",
        travelStyle: "Cultural",
        notes: "Interested in ancient town tours and traditional crafts",
        status: "pending",
        customerName: "Emma Wilson",
        customerEmail: "emma@example.com",
        postedAt: "2024-01-22T09:15:00Z",
        applicationsCount: 2,
        isApplied: false,
      },
      {
        id: "4",
        destination: "Da Nang, Vietnam",
        startDate: "2024-03-10",
        duration: "4 days",
        budget: "$300-400",
        interests: ["Beach", "Adventure", "Nature"],
        companions: "Family (4 people)",
        travelStyle: "Family-friendly",
        notes: "Family trip with kids, need child-friendly activities",
        status: "pending",
        customerName: "David Chen",
        customerEmail: "david@example.com",
        postedAt: "2024-01-23T16:45:00Z",
        applicationsCount: 4,
        isApplied: false,
      },
    ];

    setTripRequests(mockTripRequests);
    setFilteredRequests(mockTripRequests);
    setLoading(false);
  }, []);

  // Filter trip requests based on search and filters
  useEffect(() => {
    let filtered = tripRequests;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (request) =>
          request.destination
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          request.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.interests.some((interest) =>
            interest.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Interest filter
    if (selectedInterests.length > 0) {
      filtered = filtered.filter((request) =>
        selectedInterests.some((interest) =>
          request.interests.includes(interest)
        )
      );
    }

    // Destination filter
    if (selectedDestinations.length > 0) {
      filtered = filtered.filter((request) =>
        selectedDestinations.some((destination) =>
          request.destination.toLowerCase().includes(destination.toLowerCase())
        )
      );
    }

    setFilteredRequests(filtered);
  }, [searchQuery, selectedInterests, selectedDestinations, tripRequests]);

  const handleApplyToTrip = async (tripId: string) => {
    // In real app, this would call API to apply to trip
    setTripRequests((prev) =>
      prev.map((request) =>
        request.id === tripId
          ? {
              ...request,
              isApplied: true,
              applicationsCount: request.applicationsCount + 1,
            }
          : request
      )
    );
  };

  const allInterests = Array.from(
    new Set(tripRequests.flatMap((request) => request.interests))
  );

  const allDestinations = Array.from(
    new Set(tripRequests.map((request) => request.destination.split(",")[0]))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading trip requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-teal-50 to-blue-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Find Your Perfect Trip Requests
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
              Browse and apply to trip requests that match your expertise
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by destination, interests, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 text-sm sm:text-base"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Interest Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                    Filter by Interests
                  </label>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {allInterests.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => {
                          setSelectedInterests((prev) =>
                            prev.includes(interest)
                              ? prev.filter((i) => i !== interest)
                              : [...prev, interest]
                          );
                        }}
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                          selectedInterests.includes(interest)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Destination Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                    Filter by Destination
                  </label>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {allDestinations.map((destination) => (
                      <button
                        key={destination}
                        onClick={() => {
                          setSelectedDestinations((prev) =>
                            prev.includes(destination)
                              ? prev.filter((d) => d !== destination)
                              : [...prev, destination]
                          );
                        }}
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                          selectedDestinations.includes(destination)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {destination}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Trip Requests List */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Available Trip Requests ({filteredRequests.length})
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Apply to trips that match your skills and availability
            </p>
          </div>

          {filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {filteredRequests.map((request) => (
                <Card
                  key={request.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1 truncate">
                          {request.destination}
                        </h3>
                        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{request.startDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{request.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{request.budget}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge
                          variant={request.isApplied ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {request.isApplied ? "Applied" : "Available"}
                        </Badge>
                        <button className="p-1.5 sm:p-2 hover:bg-muted rounded-full transition-colors">
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 p-2 sm:p-3 bg-muted rounded-lg">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm sm:text-base">
                          {request.customerName}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {request.companions}
                        </p>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                          Interests:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {request.interests.map((interest) => (
                            <Badge
                              key={interest}
                              variant="outline"
                              className="text-xs"
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                          Travel Style:
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {request.travelStyle}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                          Notes:
                        </p>
                        <p className="text-xs sm:text-sm bg-muted p-2 sm:p-3 rounded-lg">
                          {request.notes}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 pt-3 sm:pt-4 border-t border-border">
                      <span>{request.applicationsCount} applications</span>
                      <span>
                        Posted {new Date(request.postedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <Link
                        href={`/trip-request/${request.id}/details`}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs sm:text-sm"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          View Details
                        </Button>
                      </Link>

                      {!request.isApplied ? (
                        <Link
                          href={`/buddy/1/apply?tripId=${request.id}`}
                          className="flex-1"
                        >
                          <Button
                            size="sm"
                            className="w-full text-xs sm:text-sm"
                          >
                            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Apply Now
                          </Button>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600">
                          <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm font-medium">
                            Application Sent
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 sm:p-8 text-center">
              <p className="text-base sm:text-lg text-muted-foreground mb-4">
                No trip requests found matching your criteria.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Try adjusting your search or filters to see more results.
              </p>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
