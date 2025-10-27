"use client";

import { useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart,
  MapPin,
  Star,
  Clock,
  Users2,
  MessageCircle,
  Share2,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

// Mock data - in a real app, this would come from a database
const activitiesData: Record<
  number,
  {
    id: number;
    title: string;
    buddy: string;
    buddyImage: string;
    buddyBio: string;
    buddyRating: number;
    buddyReviews: number;
    location: string;
    rating: number;
    reviews: number;
    price: number;
    image: string;
    category: string;
    description: string;
    duration: string;
    groupSize: string;
    highlights: string[];
    includes: string[];
    notIncludes: string[];
    reviews_list: Array<{
      author: string;
      rating: number;
      date: string;
      text: string;
      avatar: string;
    }>;
  }
> = {
  1: {
    id: 1,
    title: "Street Food Tour in Hanoi",
    buddy: "Linh",
    buddyImage: "/vietnamese-woman.jpg",
    buddyBio:
      "Local food enthusiast with 8 years of experience showing travelers the best street food in Hanoi. Passionate about Vietnamese culture and cuisine.",
    buddyRating: 4.9,
    buddyReviews: 128,
    location: "Hanoi, Vietnam",
    rating: 4.9,
    reviews: 128,
    price: 45,
    image: "/street-food-hanoi.jpg",
    category: "Food & Culture",
    description:
      "Explore the vibrant street food scene of Hanoi with a local guide. Visit hidden gems, taste authentic dishes, and learn about Vietnamese food culture.",
    duration: "3 hours",
    groupSize: "2-8 people",
    highlights: [
      "Visit 5+ street food stalls",
      "Learn cooking techniques from locals",
      "Taste authentic Vietnamese dishes",
      "Explore Old Quarter neighborhoods",
      "Cultural insights and stories",
    ],
    includes: ["Food tastings", "Beverages", "Local guide", "Walking tour"],
    notIncludes: ["Hotel pickup", "Meals beyond tastings", "Souvenirs"],
    reviews_list: [
      {
        author: "Sarah M.",
        rating: 5,
        date: "2 weeks ago",
        text: "Linh was amazing! She took us to the best street food spots and shared so much about Vietnamese culture. Highly recommend!",
        avatar: "/woman-avatar.png",
      },
      {
        author: "John D.",
        rating: 5,
        date: "1 month ago",
        text: "Best food tour I've ever done. Authentic, delicious, and Linh's passion for her city is contagious.",
        avatar: "/man-avatar.png",
      },
      {
        author: "Emma L.",
        rating: 4,
        date: "2 months ago",
        text: "Great experience overall. The food was incredible and Linh was very knowledgeable. A bit fast-paced but worth it.",
        avatar: "/woman-avatar-2.png",
      },
    ],
  },
};

export default function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [isFavorite, setIsFavorite] = useState(false);
  const activityId = Number.parseInt(resolvedParams.id);
  const activity = activitiesData[activityId] || activitiesData[1];

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/explore"
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Activities
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Activity Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="relative rounded-lg overflow-hidden h-96 bg-muted">
              <img
                src={activity.image || "/placeholder.svg"}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 bg-white rounded-full p-3 hover:bg-gray-100 transition-colors shadow-lg"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`}
                />
              </button>
            </div>

            {/* Activity Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
                    {activity.category}
                  </span>
                  <h1 className="text-4xl font-bold text-foreground mb-4">
                    {activity.title}
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">
                    {activity.rating}
                  </span>
                  <span className="text-muted-foreground">
                    ({activity.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  {activity.location}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  {activity.duration}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users2 className="w-5 h-5" />
                  {activity.groupSize}
                </div>
              </div>

              <p className="text-lg text-muted-foreground mb-8">
                {activity.description}
              </p>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Highlights
              </h2>
              <ul className="space-y-3">
                {activity.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What's Included */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  What's Included
                </h3>
                <ul className="space-y-2">
                  {activity.includes.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-muted-foreground flex items-center gap-2"
                    >
                      <span className="text-primary">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Not Included
                </h3>
                <ul className="space-y-2">
                  {activity.notIncludes.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-muted-foreground flex items-center gap-2"
                    >
                      <span className="text-destructive">✕</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Guest Reviews
              </h2>
              <div className="space-y-6">
                {activity.reviews_list.map((review, idx) => (
                  <Card key={idx} className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={review.avatar || "/placeholder.svg"}
                        alt={review.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground">
                            {review.author}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.text}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Buddy Profile & Booking */}
          <div className="space-y-6">
            {/* Buddy Profile Card */}
            <Card className="p-6">
              <div className="text-center mb-6">
                <img
                  src={activity.buddyImage || "/placeholder.svg"}
                  alt={activity.buddy}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {activity.buddy}
                </h3>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">
                    {activity.buddyRating}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({activity.buddyReviews} reviews)
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground text-center mb-6">
                {activity.buddyBio}
              </p>

              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message {activity.buddy}
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="lg"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
              </div>
            </Card>

            {/* Booking Card */}
            <Card className="p-6 border-2 border-primary">
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-4xl font-bold text-primary">
                    ${activity.price}
                  </span>
                  <span className="text-muted-foreground">/person</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Duration: {activity.duration}
                </p>
              </div>

              <Button className="w-full" size="lg">
                Book Now
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                You won't be charged yet. Confirm your booking details on the
                next page.
              </p>
            </Card>

            {/* Quick Info */}
            <Card className="p-6">
              <h4 className="font-semibold text-foreground mb-4">Quick Info</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Duration</p>
                  <p className="font-medium text-foreground">
                    {activity.duration}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Group Size
                  </p>
                  <p className="font-medium text-foreground">
                    {activity.groupSize}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="font-medium text-foreground">
                    {activity.location}
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
