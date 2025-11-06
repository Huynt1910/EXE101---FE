"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, MapPin, Star, Users, Search, Clock, Quote } from "lucide-react";
import { buddiesData } from "@/lib/data/buddies";
import { activities, activityMap } from "@/lib/data/activities";

const buddies = Object.values(buddiesData);

// Lấy list group từ activities.json làm category filter
const categoryOptions = Array.from(
  new Set(activities.map((a) => a.group))
).sort();

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBuddies = buddies.filter((buddy) => {
    const q = searchQuery.toLowerCase().trim();

    // Filter theo category = group của activity
    const matchesCategory =
      !selectedCategory ||
      buddy.activities.some((key) => {
        const activity = activityMap[key];
        return activity && activity.group === selectedCategory;
      });

    // Search theo: buddy name, title, location, activity label/group
    const matchesSearch =
      !q ||
      buddy.buddy.toLowerCase().includes(q) ||
      buddy.title.toLowerCase().includes(q) ||
      buddy.location.toLowerCase().includes(q) ||
      buddy.activities.some((key) => {
        const activity = activityMap[key];
        if (!activity) return false;
        return (
          activity.label.toLowerCase().includes(q) ||
          activity.group.toLowerCase().includes(q)
        );
      });

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
            Find Your Local Buddy
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
            Connect with local buddies in Vietnam based on activities, interests
            and travel style.
          </p>

          {/* Search Bar */}
          <div className="relative mb-6 sm:mb-8">
            <Search className="absolute left-3 sm:left-4 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by buddy name, location, or activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
            />
          </div>

          {/* Category Filters (từ group của activities) */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-colors text-xs sm:text-sm ${
                selectedCategory === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              All Categories
            </button>

            {categoryOptions.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-colors text-xs sm:text-sm ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Buddies Grid */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <p className="text-sm sm:text-base text-muted-foreground">
              Showing {filteredBuddies.length} of {buddies.length} local buddies
            </p>
          </div>

          {filteredBuddies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredBuddies.map((buddy) => {
                const buddyActivities =
                  buddy.activities
                    .map((key) => activityMap[key])
                    .filter(Boolean)
                    .slice(0, 3) || [];

                return (
                  <Link key={buddy.id} href={`/buddy/${buddy.id}`}>
                    <Card className="p-0 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                      {/* Image */}
                      <div className="relative aspect-[4/3] bg-muted">
                        <img
                          src={buddy.buddyImage || "/placeholder-use.png"}
                          alt={buddy.buddy}
                          className="absolute inset-0 w-full h-full object-cover object-center block"
                        />
                        <button className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white rounded-full p-1.5 sm:p-2 hover:bg-gray-100 transition-colors">
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                        </button>
                        {/* Activity tags (tối đa 2) */}
                        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex flex-wrap gap-1">
                          {buddyActivities.slice(0, 2).map((a) => (
                            <span
                              key={a!.key}
                              className="bg-black/70 text-white text-xs px-2 py-1 rounded-full"
                            >
                              {a!.label}
                            </span>
                          ))}
                        </div>
                      </div>
                      {/* Content */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col">
                        {/* Top: Name & Price */}
                        <div className="flex items-baseline justify-between gap-2">
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-foreground leading-tight">
                              {buddy.buddy}
                            </h3>
                            <p className="text-[11px] sm:text-xs text-muted-foreground">
                              {buddy.location}
                            </p>
                          </div>

                          <p className="text-xl sm:text-2xl font-bold text-primary leading-none">
                            ${buddy.price}
                            <span className="ml-0.5 text-[10px] sm:text-xs font-normal text-primary/80">
                              /h
                            </span>
                          </p>
                        </div>

                        {/* Quote / short description */}
                        <div className="mt-3 mb-3 sm:mt-4 sm:mb-4 relative font-thin text-md text-muted-foreground italic">
                          {/* Quote mở */}
                          <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-primary/40 absolute -top-1 left-0 -scale-x-100" />

                          <p className="px-7">{buddy.description}</p>

                          {/* Quote đóng - lật ngang */}
                          <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-primary/40 absolute -bottom-1 right-0" />
                        </div>

                        <div className="border-t border-border pt-3 mt-auto">
                          <div className="flex justify-between text-center text-[10px] sm:text-xs text-muted-foreground">
                            <div className="flex-1">
                              <p className="mb-0.5 uppercase tracking-wide">
                                Reviews
                              </p>
                              <p className="text-sm sm:text-base font-semibold text-foreground">
                                {buddy.reviews}
                              </p>
                            </div>
                            <div className="flex-1">
                              <p className="mb-0.5 uppercase tracking-wide">
                                Rating
                              </p>
                              <div className="flex items-center justify-center gap-1">
                                <span className="text-sm sm:text-base font-semibold text-foreground">
                                  {buddy.rating.toFixed(1)}
                                </span>
                                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <p className="text-base sm:text-lg text-muted-foreground">
                No local buddies found matching your search.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
