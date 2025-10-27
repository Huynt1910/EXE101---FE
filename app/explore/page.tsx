"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart,
  MapPin,
  Star,
  Users,
  Search,
  Calendar,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { BUDDIES as localBuddies } from "@/lib/data/buddies";

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "Foodie",
    "Adventure",
    "Cultural",
    "Chill & Relax",
    "Nightlife",
    "Photography",
  ];

  const filteredBuddies = localBuddies.filter((buddy) => {
    const matchesCategory =
      !selectedCategory || buddy.styles.includes(selectedCategory);
    const matchesSearch =
      buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buddy.cities.some((city) =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      buddy.interests.some((interest) =>
        interest.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
            Connect with authentic local guides who share your interests and
            travel style
          </p>

          {/* Search Bar */}
          <div className="relative mb-6 sm:mb-8">
            <Search className="absolute left-3 sm:left-4 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by buddy name, city, or interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
            />
          </div>

          {/* Category Filters */}
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
            {categories.map((category) => (
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
              Showing {filteredBuddies.length} of {localBuddies.length} local
              buddies
            </p>
          </div>

          {filteredBuddies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredBuddies.map((buddy) => (
                <Link key={buddy.id} href={`/buddy/${buddy.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                    <div className="relative h-48 sm:h-56 lg:h-64 bg-muted overflow-hidden">
                      <img
                        src={buddy.image || "/placeholder.svg"}
                        alt={buddy.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                      <button className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white rounded-full p-1.5 sm:p-2 hover:bg-gray-100 transition-colors">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                      </button>
                      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex flex-wrap gap-1">
                        {buddy.styles.slice(0, 2).map((style) => (
                          <span
                            key={style}
                            className="bg-black/70 text-white text-xs px-2 py-1 rounded-full"
                          >
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 flex-1 flex flex-col">
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                        {buddy.name}
                      </h3>

                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate">
                          {buddy.cities.join(", ")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-foreground text-sm sm:text-base">
                            {buddy.rating}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          (4.8/5)
                        </span>
                      </div>

                      <div className="mb-3 sm:mb-4">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                          Languages:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {buddy.languages.map((lang) => (
                            <span
                              key={lang}
                              className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3 sm:mb-4">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                          Interests:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {buddy.interests.slice(0, 3).map((interest) => (
                            <span
                              key={interest}
                              className="bg-primary/10 text-primary text-xs px-2 py-1 rounded"
                            >
                              {interest}
                            </span>
                          ))}
                          {buddy.interests.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{buddy.interests.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-auto pt-3 sm:pt-4 border-t border-border">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <div>
                            <p className="text-muted-foreground">Budget:</p>
                            <p className="font-semibold text-foreground">
                              {buddy.budgetLabel}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-muted-foreground">Max Group:</p>
                            <p className="font-semibold text-foreground">
                              {buddy.maxGroup} people
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
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
