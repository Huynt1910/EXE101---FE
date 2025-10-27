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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Database,
  Trash2,
  Plus,
  Download,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [seedingStatus, setSeedingStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [seedingMessage, setSeedingMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const revenueData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 2000 },
    { month: "Apr", revenue: 2780 },
    { month: "May", revenue: 1890 },
    { month: "Jun", revenue: 2390 },
  ];

  const bookingStatusData = [
    { name: "Completed", value: 45, fill: "#10b981" },
    { name: "Pending", value: 30, fill: "#f59e0b" },
    { name: "Cancelled", value: 15, fill: "#ef4444" },
    { name: "No-show", value: 10, fill: "#6b7280" },
  ];

  const users = [
    {
      id: 1,
      name: "Linh Nguyen",
      email: "linh@example.com",
      role: "Host",
      joinDate: "2025-01-15",
      status: "active",
    },
    {
      id: 2,
      name: "Duc Tran",
      email: "duc@example.com",
      role: "Host",
      joinDate: "2025-02-20",
      status: "active",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "Traveler",
      joinDate: "2025-03-10",
      status: "active",
    },
    {
      id: 4,
      name: "Michael Chen",
      email: "michael@example.com",
      role: "Traveler",
      joinDate: "2025-03-15",
      status: "inactive",
    },
  ];

  const activities = [
    {
      id: 1,
      title: "Street Food Tour in Hanoi",
      host: "Linh Nguyen",
      price: 45,
      bookings: 28,
      rating: 4.9,
    },
    {
      id: 2,
      title: "Motorbike Adventure to Ha Long Bay",
      host: "Duc Tran",
      price: 65,
      bookings: 15,
      rating: 4.8,
    },
    {
      id: 3,
      title: "Traditional Cooking Class",
      host: "Hoa Pham",
      price: 55,
      bookings: 42,
      rating: 5.0,
    },
    {
      id: 4,
      title: "Sunrise Hike & Meditation",
      host: "Minh Tran",
      price: 35,
      bookings: 18,
      rating: 4.7,
    },
  ];

  const handleSeedDatabase = async () => {
    setSeedingStatus("loading");
    setSeedingMessage("Seeding database with sample data...");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSeedingStatus("success");
      setSeedingMessage(
        "Database seeded successfully! Added 50+ sample records."
      );
    } catch (error) {
      setSeedingStatus("error");
      setSeedingMessage("Error seeding database. Please try again.");
    }
  };

  const handleClearDatabase = async () => {
    if (
      !confirm(
        "Are you sure you want to clear all data? This cannot be undone."
      )
    )
      return;

    setSeedingStatus("loading");
    setSeedingMessage("Clearing database...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSeedingStatus("success");
      setSeedingMessage("Database cleared successfully!");
    } catch (error) {
      setSeedingStatus("error");
      setSeedingMessage("Error clearing database.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-slate-300">
                Manage platform, users, activities, and analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
              <p className="text-slate-300 text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold text-white">2,547</p>
              <p className="text-xs text-slate-400 mt-2">
                +12% from last month
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
              <p className="text-slate-300 text-sm mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-white">1,284</p>
              <p className="text-xs text-slate-400 mt-2">+8% from last month</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
              <p className="text-slate-300 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-white">$45,230</p>
              <p className="text-xs text-slate-400 mt-2">
                +15% from last month
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
              <p className="text-slate-300 text-sm mb-1">Active Activities</p>
              <p className="text-3xl font-bold text-white">342</p>
              <p className="text-xs text-slate-400 mt-2">+5% from last month</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="seeding">Seeding</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Monthly Revenue
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                      />
                      <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        dot={{ fill: "var(--primary)", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Booking Status */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Booking Status Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={bookingStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label
                        outerRadius={80}
                        dataKey="value"
                      >
                        {bookingStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Quick Stats */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Platform Health
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Average Rating
                    </p>
                    <p className="text-3xl font-bold text-foreground">4.8/5</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on 1,284 reviews
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Completion Rate
                    </p>
                    <p className="text-3xl font-bold text-foreground">94.2%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Bookings completed successfully
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Response Time
                    </p>
                    <p className="text-3xl font-bold text-foreground">2.3h</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Average host response time
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  User Management
                </h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>

              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Join Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-foreground">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {user.joinDate}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user.status === "active" ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Activity Management
                </h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Activity
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activities.map((activity) => (
                  <Card
                    key={activity.id}
                    className="p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Host: {activity.host}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Price
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          ${activity.price}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Bookings
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {activity.bookings}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Rating
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {activity.rating}/5
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Bookings by Month
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                      />
                      <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="var(--primary)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Key Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        New Users (This Month)
                      </span>
                      <span className="font-semibold text-foreground">
                        +234
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        New Activities (This Month)
                      </span>
                      <span className="font-semibold text-foreground">+45</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total Transactions
                      </span>
                      <span className="font-semibold text-foreground">
                        $125,430
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Platform Commission
                      </span>
                      <span className="font-semibold text-foreground">
                        $12,543
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Seeding Tab */}
            <TabsContent value="seeding" className="space-y-6">
              <Card className="p-6 border-amber-200 bg-amber-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">
                      Database Seeding
                    </h4>
                    <p className="text-sm text-amber-800">
                      Use these tools to populate or clear the database with
                      sample data. This is useful for testing and development.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Seed Database */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Seed Database
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">
                    Populate the database with 50+ sample records including
                    users, activities, bookings, and reviews.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Sample Data Includes:
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• 20+ Host profiles with activities</li>
                        <li>• 30+ Traveler accounts</li>
                        <li>• 50+ Activities across categories</li>
                        <li>• 100+ Bookings with various statuses</li>
                        <li>• 200+ Reviews and ratings</li>
                      </ul>
                    </div>

                    <Button
                      onClick={handleSeedDatabase}
                      disabled={seedingStatus === "loading"}
                      className="w-full"
                    >
                      {seedingStatus === "loading" ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Seeding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Seed Database
                        </>
                      )}
                    </Button>
                  </div>
                </Card>

                {/* Clear Database */}
                <Card className="p-6 border-destructive/20 bg-destructive/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Trash2 className="w-5 h-5 text-destructive" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Clear Database
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">
                    Remove all sample data from the database. This action cannot
                    be undone.
                  </p>

                  <div className="space-y-4">
                    <div className="p-3 bg-destructive/10 rounded-lg">
                      <p className="text-xs font-medium text-destructive">
                        Warning: This will delete all data!
                      </p>
                    </div>

                    <Button
                      onClick={handleClearDatabase}
                      disabled={seedingStatus === "loading"}
                      variant="destructive"
                      className="w-full"
                    >
                      {seedingStatus === "loading" ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Clearing...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear All Data
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Status Message */}
              {seedingStatus !== "idle" && (
                <Card
                  className={`p-4 flex items-start gap-3 ${
                    seedingStatus === "success"
                      ? "bg-green-50 border-green-200"
                      : seedingStatus === "error"
                      ? "bg-red-50 border-red-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  {seedingStatus === "success" ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : seedingStatus === "error" ? (
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Loader className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0 animate-spin" />
                  )}
                  <p
                    className={`text-sm font-medium ${
                      seedingStatus === "success"
                        ? "text-green-800"
                        : seedingStatus === "error"
                        ? "text-red-800"
                        : "text-blue-800"
                    }`}
                  >
                    {seedingMessage}
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
