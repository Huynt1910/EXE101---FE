"use client";

import { useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MapPin,
  Star,
  Users,
  MessageCircle,
  Share2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { BUDDIES } from "@/lib/data/buddies";
import { notFound } from "next/navigation";

interface BuddyProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BuddyProfilePage({ params }: BuddyProfilePageProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const resolvedParams = use(params);
  const buddy = BUDDIES.find((b) => b.id === resolvedParams.id);

  if (!buddy) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
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
            <Button variant="ghost" size="sm" className="p-2">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => setIsFavorited(!isFavorited)}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorited ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Buddy Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Buddy Header */}
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="relative mx-auto sm:mx-0">
                  <img
                    src={buddy.image || "/placeholder.svg"}
                    alt={buddy.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Online
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    {buddy.name}
                  </h1>

                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-3 sm:mb-4">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm sm:text-base">
                      {buddy.cities.join(", ")}
                    </span>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 mb-3 sm:mb-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-foreground text-sm sm:text-base">
                        {buddy.rating}
                      </span>
                      <span className="text-muted-foreground text-sm sm:text-base">
                        (4.8/5)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm sm:text-base">
                        Max {buddy.maxGroup} people
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-4 justify-center sm:justify-start">
                    {buddy.styles.map((style) => (
                      <Badge
                        key={style}
                        variant="secondary"
                        className="text-xs sm:text-sm"
                      >
                        {style}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {buddy.languages.map((lang) => (
                      <Badge
                        key={lang}
                        variant="outline"
                        className="text-xs sm:text-sm"
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* About Section */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                About {buddy.name.split(" ")[0]}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                I'm a passionate local guide with{" "}
                {Math.floor(Math.random() * 5) + 3} years of experience showing
                travelers the authentic side of {buddy.cities[0]}. I specialize
                in {buddy.styles.join(", ").toLowerCase()}
                experiences and love sharing my knowledge about local culture,
                food, and hidden gems.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                My interests include {buddy.interests.slice(0, 3).join(", ")}{" "}
                and I'm always excited to meet new people and share amazing
                experiences together!
              </p>
            </Card>
          </div>

          {/* Right Column - Contact & Apply */}
          <div className="space-y-4 sm:space-y-6">
            {/* Contact */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Contact {buddy.name.split(" ")[0]}
              </h2>
              <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                Have questions? Send a message to discuss your trip details.
              </p>
              <Button variant="outline" className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </Card>

            {/* Apply for Trip */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Apply for Trip
              </h2>
              <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                Interested in this buddy? Apply to be matched with them for your
                trip.
              </p>
              <Link href={`/buddy/${buddy.id}/apply`}>
                <Button className="w-full" size="lg">
                  Apply Now
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
