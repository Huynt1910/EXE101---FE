"use client";

import type React from "react";

import { useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [groupSize, setGroupSize] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const activityId = Number.parseInt(resolvedParams.id);
  const activity = {
    id: activityId,
    title: "Street Food Tour in Hanoi",
    buddy: "Linh",
    location: "Hanoi, Vietnam",
    price: 45,
    duration: "3 hours",
    image: "/street-food-hanoi.jpg",
  };

  const totalPrice = activity.price * groupSize;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href={`/activity/${activityId}`}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Activity
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        s <= step
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`flex-1 h-1 mx-2 transition-colors ${
                          s < step ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Select Date & Guests</span>
                <span>Your Details</span>
                <span>Payment</span>
              </div>
            </div>

            {/* Step 1: Date & Guests */}
            {step === 1 && (
              <Card className="p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Number of Guests
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                        className="w-10 h-10 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="text-2xl font-semibold text-foreground w-12 text-center">
                        {groupSize}
                      </span>
                      <button
                        onClick={() => setGroupSize(Math.min(8, groupSize + 1))}
                        className="w-10 h-10 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Maximum 8 guests per booking
                    </p>
                  </div>

                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">
                      Confirm your group size. You can modify these details on
                      the next step if needed.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button onClick={handleNextStep} className="flex-1" size="lg">
                    Continue
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 2: Personal Details */}
            {step === 2 && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Your Details
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button
                    onClick={handlePrevStep}
                    variant="outline"
                    className="flex-1 bg-transparent"
                    size="lg"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={!formData.firstName || !formData.email}
                    className="flex-1"
                    size="lg"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Payment Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-900">
                      Your payment is secure and encrypted. You won't be charged
                      until you confirm.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button
                    onClick={handlePrevStep}
                    variant="outline"
                    className="flex-1 bg-transparent"
                    size="lg"
                  >
                    Back
                  </Button>
                  <Link href="/trips" className="flex-1">
                    <Button className="w-full" size="lg">
                      Complete Booking
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Booking Summary
              </h3>

              <div className="mb-6 pb-6 border-b border-border">
                <img
                  src={activity.image || "/placeholder.svg"}
                  alt={activity.title}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h4 className="font-semibold text-foreground mb-2">
                  {activity.title}
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {activity.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {activity.duration}
                  </div>
                  {selectedDate && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {new Date(selectedDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    ${activity.price} × {groupSize}{" "}
                    {groupSize === 1 ? "guest" : "guests"}
                  </span>
                  <span className="font-medium text-foreground">
                    ${totalPrice}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service fee</span>
                  <span className="font-medium text-foreground">
                    ${Math.round(totalPrice * 0.1)}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${totalPrice + Math.round(totalPrice * 0.1)}
                  </span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                <p>
                  You can cancel free of charge up to 48 hours before the
                  activity.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
