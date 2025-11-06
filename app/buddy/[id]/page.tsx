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
import { buddiesData } from "@/lib/data/buddies";
import { activityMap } from "@/lib/data/activities";
export default function BuddyProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [isFavorite, setIsFavorite] = useState(false);
  const buddyId = Number(id);
  const buddy = buddiesData[buddyId] || buddiesData[1];

  const buddyActivities =
    buddy.activities.map((key) => activityMap[key]).filter(Boolean) || [];

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
                src={buddy.buddyImage || "/placeholder.svg"}
                alt={buddy.title}
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
                  {/* Activity labels */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {buddyActivities.map((activity) => (
                      <span
                        key={activity.key}
                        className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {activity.label}
                      </span>
                    ))}
                  </div>

                  <h1 className="text-4xl font-bold text-foreground mb-4">
                    {buddy.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Highlights
              </h2>
              <ul className="space-y-3">
                {buddy.highlights.map((highlight, idx) => (
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
                  {buddy.includes.map((item, idx) => (
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
                  {buddy.notIncludes.map((item, idx) => (
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
                {buddy.reviews_list.map((review, idx) => (
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
                  src={buddy.buddyImage || "/placeholder.svg"}
                  alt={buddy.buddy}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {buddy.buddy}
                </h3>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">
                    {buddy.buddyRating}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({buddy.buddyReviews} reviews)
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground text-center mb-6">
                {buddy.buddyBio}
              </p>

              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message {buddy.buddy}
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
                    {buddy.price} $
                  </span>
                  <span className="text-muted-foreground">/hour</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Duration: {buddy.duration}
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
                    {buddy.duration}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Group Size
                  </p>
                  <p className="font-medium text-foreground">
                    {buddy.groupSize}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="font-medium text-foreground">
                    {buddy.location}
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
