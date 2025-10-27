"use client";

import { useState, use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  MapPin,
  Star,
  Clock,
  Calendar,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  User,
  Mail,
  Phone,
  Shield,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { BUDDIES } from "@/lib/data/buddies";

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
  customerName: string;
  customerEmail: string;
}

interface ApplicationData {
  message: string;
  proposedPrice: string;
  availableDates: string[];
  specialOffers: string;
}

export default function BuddyPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [buddy, setBuddy] = useState<any>(null);
  const [tripRequest, setTripRequest] = useState<TripRequest | null>(null);
  const [applicationData, setApplicationData] =
    useState<ApplicationData | null>(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    email: "",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get buddy data
    const foundBuddy = BUDDIES.find((b) => b.id === resolvedParams.id);
    setBuddy(foundBuddy);

    // Mock trip request data - in real app, this would come from URL params or API
    const mockTripRequest: TripRequest = {
      id: "1",
      destination: "Hanoi, Vietnam",
      startDate: "2024-02-15",
      duration: "3 days",
      budget: "$200-300",
      interests: ["Food & Culture", "History", "Photography"],
      companions: "Solo traveler",
      travelStyle: "Adventure",
      notes: "Looking for authentic local experiences",
      customerName: "John Doe",
      customerEmail: "john@example.com",
    };
    setTripRequest(mockTripRequest);

    // Mock application data - in real app, this would come from the previous step
    const mockApplicationData: ApplicationData = {
      message:
        "I'm a passionate local guide with extensive knowledge of Hanoi's hidden food gems and cultural sites. I'd love to show you the authentic side of our beautiful city!",
      proposedPrice: "$150 per day",
      availableDates: ["2024-02-15", "2024-02-16", "2024-02-17"],
      specialOffers:
        "Free photography session and local market visit included!",
    };
    setApplicationData(mockApplicationData);
  }, [resolvedParams.id]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentData.cardNumber || paymentData.cardNumber.length < 16) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }

    if (
      !paymentData.expiryDate ||
      !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)
    ) {
      newErrors.expiryDate = "Please enter expiry date in MM/YY format";
    }

    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      newErrors.cvv = "Please enter a valid CVV";
    }

    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = "Please enter cardholder name";
    }

    if (!paymentData.email.trim() || !/\S+@\S+\.\S+/.test(paymentData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!paymentData.phone.trim()) {
      newErrors.phone = "Please enter phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsProcessing(false);
    setIsPaid(true);

    // Redirect to confirmation after successful payment
    setTimeout(() => {
      if (tripRequest) {
        window.location.href = `/trips`;
      }
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  if (!buddy || !tripRequest || !applicationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your payment has been processed successfully. You will be
              redirected to your booking confirmation shortly.
            </p>
            <div className="space-y-4">
              <Link href={`/buddy/${buddy.id}`}>
                <Button variant="outline">Back to Profile</Button>
              </Link>
              <Link href="/trips">
                <Button>View My Bookings</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate total price (mock calculation)
  const proposedPrice = applicationData.proposedPrice.replace(/[^0-9]/g, "");
  const pricePerDay = parseInt(proposedPrice) || 150;
  const duration = parseInt(tripRequest.duration.replace(/[^0-9]/g, "")) || 3;
  const subtotal = pricePerDay * duration;
  const serviceFee = Math.round(subtotal * 0.1); // 10% service fee
  const total = subtotal + serviceFee;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Link
          href={`/buddy/${buddy.id}/apply`}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Back to Application</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Trip & Application Summary */}
          <div className="space-y-4 sm:space-y-6">
            {/* Trip Request Details */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                Trip Request Details
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Destination
                    </p>
                    <p className="font-medium text-sm sm:text-base truncate">
                      {tripRequest.destination}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Start Date
                    </p>
                    <p className="font-medium text-sm sm:text-base">
                      {tripRequest.startDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Duration
                    </p>
                    <p className="font-medium text-sm sm:text-base">
                      {tripRequest.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Budget
                    </p>
                    <p className="font-medium text-sm sm:text-base">
                      {tripRequest.budget}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 sm:mt-4">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                  Interests:
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {tripRequest.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="text-xs sm:text-sm"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            {/* Buddy Profile */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                Your Local Buddy
              </h2>
              <div className="flex items-start gap-3 sm:gap-4">
                <img
                  src={buddy.image || "/placeholder.svg"}
                  alt={buddy.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">
                    {buddy.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-1 sm:mb-2">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-foreground text-xs sm:text-sm">
                      {buddy.rating}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      ({buddy.reviews} reviews)
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {buddy.cities.join(", ")}
                  </p>
                </div>
              </div>
            </Card>

            {/* Application Summary */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                Application Summary
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                    Proposed Price:
                  </p>
                  <p className="font-medium text-sm sm:text-base">
                    {applicationData.proposedPrice}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                    Available Dates:
                  </p>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {applicationData.availableDates.map((date) => (
                      <Badge
                        key={date}
                        variant="outline"
                        className="text-xs sm:text-sm"
                      >
                        {date}
                      </Badge>
                    ))}
                  </div>
                </div>
                {applicationData.specialOffers && (
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                      Special Offers:
                    </p>
                    <p className="text-xs sm:text-sm bg-muted p-2 sm:p-3 rounded-lg">
                      {applicationData.specialOffers}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Payment Form */}
          <div className="space-y-4 sm:space-y-6">
            {/* Payment Summary */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                Payment Summary
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">
                    Service Fee ({duration} days)
                  </span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="border-t border-border pt-2 sm:pt-3">
                  <div className="flex justify-between font-semibold text-base sm:text-lg">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Form */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                Payment Information
              </h2>

              <form onSubmit={handlePayment} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                    Card Number *
                  </label>
                  <Input
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        cardNumber: formatCardNumber(e.target.value),
                      })
                    }
                    placeholder="1234 5678 9012 3456"
                    className={`text-sm sm:text-base ${
                      errors.cardNumber ? "border-red-500" : ""
                    }`}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                      Expiry Date *
                    </label>
                    <Input
                      type="text"
                      value={paymentData.expiryDate}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          expiryDate: formatExpiryDate(e.target.value),
                        })
                      }
                      placeholder="MM/YY"
                      className={`text-sm sm:text-base ${
                        errors.expiryDate ? "border-red-500" : ""
                      }`}
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                      CVV *
                    </label>
                    <Input
                      type="text"
                      value={paymentData.cvv}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          cvv: e.target.value.replace(/[^0-9]/g, ""),
                        })
                      }
                      placeholder="123"
                      className={`text-sm sm:text-base ${
                        errors.cvv ? "border-red-500" : ""
                      }`}
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                    Cardholder Name *
                  </label>
                  <Input
                    type="text"
                    value={paymentData.cardholderName}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        cardholderName: e.target.value,
                      })
                    }
                    placeholder="John Doe"
                    className={`text-sm sm:text-base ${
                      errors.cardholderName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.cardholderName && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.cardholderName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={paymentData.email}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        email: e.target.value,
                      })
                    }
                    placeholder="john@example.com"
                    className={`text-sm sm:text-base ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={paymentData.phone}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        phone: e.target.value,
                      })
                    }
                    placeholder="+84 123 456 789"
                    className={`text-sm sm:text-base ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>Your payment information is secure and encrypted</span>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span className="text-sm sm:text-base">
                        Processing Payment...
                      </span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      <span className="text-sm sm:text-base">Pay ${total}</span>
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* Security Notice */}
            <Card className="p-4 sm:p-6 bg-muted/50">
              <div className="flex items-start gap-2 sm:gap-3">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">
                    Secure Payment
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Your payment is processed securely using industry-standard
                    encryption. We never store your full card details on our
                    servers.
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
