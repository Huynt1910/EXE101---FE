"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  MessageSquare,
  Settings,
  Bell,
  Eye,
  EyeOff,
  Download,
} from "lucide-react";
import Link from "next/link";

export default function HostDashboardPage() {
  const [showEarnings, setShowEarnings] = useState(true);

  const earningsData = [
    { month: "Jan", earnings: 1200 },
    { month: "Feb", earnings: 1900 },
    { month: "Mar", earnings: 1500 },
    { month: "Apr", earnings: 2200 },
    { month: "May", earnings: 2800 },
    { month: "Jun", earnings: 2400 },
  ];

  const bookingsData = [
    { date: "Mon", bookings: 4 },
    { date: "Tue", bookings: 3 },
    { date: "Wed", bookings: 5 },
    { date: "Thu", bookings: 6 },
    { date: "Fri", bookings: 8 },
    { date: "Sat", bookings: 7 },
    { date: "Sun", bookings: 5 },
  ];

  const upcomingBookings = [
    {
      id: 1,
      traveler: "Sarah Johnson",
      activity: "Street Food Tour in Hanoi",
      date: "2025-11-15",
      time: "09:00 AM",
      guests: 2,
      status: "confirmed",
      image: "/vietnamese-woman.jpg",
    },
    {
      id: 2,
      traveler: "Michael Chen",
      activity: "Motorbike Adventure to Ha Long Bay",
      date: "2025-11-18",
      time: "08:00 AM",
      guests: 1,
      status: "pending",
      image: "/vietnamese-man.jpg",
    },
    {
      id: 3,
      traveler: "Emma Wilson",
      activity: "Traditional Cooking Class",
      date: "2025-11-20",
      time: "02:00 PM",
      guests: 3,
      status: "confirmed",
      image: "/vietnamese-chef.jpg",
    },
  ];

  const recentMessages = [
    {
      id: 1,
      from: "Sarah Johnson",
      message:
        "Hi! I'm excited about the food tour. Do you have any dietary restrictions I should know about?",
      time: "2 hours ago",
      unread: true,
      image: "/vietnamese-woman.jpg",
    },
    {
      id: 2,
      from: "Michael Chen",
      message: "Can we reschedule the motorbike tour to the 19th instead?",
      time: "5 hours ago",
      unread: true,
      image: "/vietnamese-man.jpg",
    },
    {
      id: 3,
      from: "Emma Wilson",
      message: "Thank you for the cooking class! It was amazing!",
      time: "1 day ago",
      unread: false,
      image: "/vietnamese-chef.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-8 sm:py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Host Dashboard
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Manage your activities, bookings, and earnings
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export Report</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Total Earnings
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg sm:text-2xl font-bold text-foreground">
                      {showEarnings ? "$12,100" : "••••••"}
                    </p>
                    <button
                      onClick={() => setShowEarnings(!showEarnings)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {showEarnings ? (
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      ) : (
                        <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-primary opacity-20" />
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Total Bookings
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">
                    47
                  </p>
                </div>
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary opacity-20" />
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Total Guests
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">
                    156
                  </p>
                </div>
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary opacity-20" />
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Avg. Rating
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">
                    4.9/5
                  </p>
                </div>
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary opacity-20" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="bookings" className="text-xs sm:text-sm">
                Bookings
              </TabsTrigger>
              <TabsTrigger value="messages" className="text-xs sm:text-sm">
                Messages
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Earnings Chart */}
                <Card className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                    Earnings Trend
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={earningsData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                      />
                      <XAxis
                        dataKey="month"
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                      />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="earnings"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        dot={{ fill: "var(--primary)", r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Bookings Chart */}
                <Card className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                    Weekly Bookings
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={bookingsData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                      />
                      <XAxis
                        dataKey="date"
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                      />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar
                        dataKey="bookings"
                        fill="var(--primary)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    size="sm"
                  >
                    <span className="text-xs sm:text-sm">Create Activity</span>
                  </Button>
                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    size="sm"
                  >
                    <span className="text-xs sm:text-sm">View Analytics</span>
                  </Button>
                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    size="sm"
                  >
                    <span className="text-xs sm:text-sm">
                      Manage Availability
                    </span>
                  </Button>
                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    size="sm"
                  >
                    <span className="text-xs sm:text-sm">Edit Profile</span>
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  Upcoming Bookings
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  View All
                </Button>
              </div>

              {upcomingBookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="p-4 sm:p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      <img
                        src={booking.image || "/placeholder.svg"}
                        alt={booking.traveler}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground mb-1 text-sm sm:text-base">
                          {booking.traveler}
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 truncate">
                          {booking.activity}
                        </p>
                        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>
                              {new Date(booking.date).toLocaleDateString()}
                            </span>
                          </span>
                          <span>{booking.time}</span>
                          <span>
                            {booking.guests} guest
                            {booking.guests !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status === "confirmed"
                          ? "Confirmed"
                          : "Pending"}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm"
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  Recent Messages
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  View All
                </Button>
              </div>

              {recentMessages.map((msg) => (
                <Card
                  key={msg.id}
                  className={`p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer ${
                    msg.unread ? "bg-accent/5 border-primary/20" : ""
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <img
                      src={msg.image || "/placeholder.svg"}
                      alt={msg.from}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4
                          className={`font-semibold text-sm sm:text-base ${
                            msg.unread
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {msg.from}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {msg.time}
                        </span>
                      </div>
                      <p
                        className={`text-xs sm:text-sm ${
                          msg.unread
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {msg.message}
                      </p>
                    </div>
                    {msg.unread && (
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    )}
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
