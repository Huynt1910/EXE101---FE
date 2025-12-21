"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, Banknote, CheckCircle2 } from "lucide-react";
import { buddiesData } from "@/lib/data/buddies";

type PaymentMethod = "bank" | "momo" | "card";
type Step = 1 | 2 | 3;

export default function BookingPage() {
  const searchParams = useSearchParams();

  const buddyIdParam = searchParams.get("buddyId");
  const tripId = searchParams.get("tripId") || "1";

  const buddy =
    (buddyIdParam && buddiesData[Number(buddyIdParam)]) || buddiesData[1];

  const totalAmount = useMemo(() => buddy.price * 3, [buddy.price]);

  const [step, setStep] = useState<Step>(1);
  const [method, setMethod] = useState<PaymentMethod>("bank");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!buddy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7F0]">
        <p className="text-base text-muted-foreground">Buddy not found.</p>
      </div>
    );
  }

  const paymentLabel =
    method === "bank"
      ? "Confirm Bank Transfer"
      : method === "momo"
      ? "Confirm Momo Payment"
      : "Pay with Card";

  const handleContinueFromStep1 = () => setStep(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
    }, 900);
  };

  const resetPayment = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-[#FFF7F0]">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 xl:px-16 py-10 lg:py-14">
        {/* HEADER */}
        <div className="mb-8 lg:mb-10">
          <h1 className="text-3xl lg:text-4xl font-semibold text-[#2B2B2B]">
            Checkout
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground mt-1.5">
            Booking with{" "}
            <span className="font-semibold text-[#0F766E]">{buddy.buddy}</span>
          </p>

          {/* STEP INDICATOR */}
          <div className="mt-5 flex items-center gap-3 text-sm">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center justify-center w-9 h-9 rounded-full border font-medium
                  ${
                    step === s
                      ? "bg-[#0F766E] text-white border-[#0F766E]"
                      : step > s
                      ? "bg-emerald-50 text-[#0F766E] border-emerald-200"
                      : "bg-white text-gray-500 border-gray-300"
                  }`}
              >
                {s}
              </div>
            ))}
            <span className="ml-2 text-gray-500">
              {step === 1 && "Step 1: Choose payment method"}
              {step === 2 && "Step 2: Enter payment details"}
              {step === 3 && "Step 3: Confirmation"}
            </span>
          </div>
        </div>

        {/* LAYOUT: LEFT (FORM) + RIGHT (SUMMARY) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* LEFT: 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* STEP 1: CHOOSE METHOD */}
            {step === 1 && (
              <Card className="p-6 xl:p-7">
                <h2 className="text-lg lg:text-xl font-semibold mb-5">
                  Choose a payment method
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* BANK */}
                  <button
                    type="button"
                    onClick={() => setMethod("bank")}
                    className={`flex flex-col gap-2 rounded-2xl border px-4 py-4 text-left text-sm lg:text-base transition
                      ${
                        method === "bank"
                          ? "border-[#0F766E] bg-emerald-50 shadow-sm"
                          : "border-gray-200 bg-white hover:bg-emerald-50/40"
                      }`}
                  >
                    <Banknote className="w-5 h-5" />
                    <span className="font-semibold text-2xl">
                      Bank transfer
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Transfer directly to our bank account.
                    </span>
                    {method === "bank" && (
                      <span className="text-xs text-[#0F766E] font-semibold">
                        Selected
                      </span>
                    )}
                  </button>

                  {/* MOMO */}
                  <button
                    type="button"
                    onClick={() => setMethod("momo")}
                    className={`flex flex-col gap-2 rounded-2xl border px-4 py-4 text-left text-sm lg:text-base transition
                      ${
                        method === "momo"
                          ? "border-[#0F766E] bg-emerald-50 shadow-sm"
                          : "border-gray-200 bg-white hover:bg-emerald-50/40"
                      }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span className="font-semibold text-2xl">Momo</span>
                    <span className="text-sm text-muted-foreground">
                      Scan QR / transfer via Momo app.
                    </span>
                    {method === "momo" && (
                      <span className="text-xs text-[#0F766E] font-semibold">
                        Selected
                      </span>
                    )}
                  </button>

                  {/* CARD */}
                  <button
                    type="button"
                    onClick={() => setMethod("card")}
                    className={`flex flex-col gap-2 rounded-2xl border px-4 py-4 text-left text-sm lg:text-base transition
                      ${
                        method === "card"
                          ? "border-[#0F766E] bg-emerald-50 shadow-sm"
                          : "border-gray-200 bg-white hover:bg-emerald-50/40"
                      }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="font-semibold text-2xl">
                      Credit / Debit card
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Visa, Mastercard, etc.
                    </span>
                    {method === "card" && (
                      <span className="text-xs text-[#0F766E] font-semibold">
                        Selected
                      </span>
                    )}
                  </button>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleContinueFromStep1}
                    className="w-full sm:w-auto px-7 text-sm lg:text-base"
                  >
                    Continue
                  </Button>
                </div>
              </Card>
            )}

            {/* STEP 2: PAYMENT DETAILS */}
            {step === 2 && (
              <Card className="p-6 xl:p-7 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl lg:text-xl font-semibold">
                    Payment details
                  </h2>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-[#0F766E] hover:underline"
                  >
                    ← Change method
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* BANK */}
                  {method === "bank" && (
                    <div className="space-y-4">
                      <h3 className="text-xl lg:text-lg font-semibold">
                        Bank transfer
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Please transfer the exact amount and use the reference
                        content below. Your booking will be confirmed after we
                        verify the payment.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
                        <div>
                          <p className="text-muted-foreground">Bank</p>
                          <p className="font-semibold">Vietcombank (VCB)</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Account number
                          </p>
                          <p className="font-semibold">0123456789</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Account name</p>
                          <p className="font-semibold">NGUYEN VAN A</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Amount</p>
                          <p className="font-bold text-[#0F766E]">
                            $ {totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1.5">
                          Transfer content (required):
                        </p>
                        <div className="px-3 py-2 rounded-md bg-muted text-sm font-mono">
                          BUDDY-{buddy.id}-TRIP-{tripId}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row gap-5">
                        <div className="w-40 h-40 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                          BANK QR
                        </div>
                        <ol className="text-sm text-muted-foreground space-y-1.5">
                          <li>1. Open your banking app.</li>
                          <li>2. Scan the QR or input bank details.</li>
                          <li>3. Enter exact amount shown.</li>
                          <li>
                            4. Use the transfer content code above (required).
                          </li>
                          <li>5. Complete transfer then confirm below.</li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {/* MOMO */}
                  {method === "momo" && (
                    <div className="space-y-4">
                      <h3 className="text-xl lg:text-lg font-semibold text-center">
                        Momo payment
                      </h3>
                      <p className="text-sm text-muted-foreground text-center">
                        Scan the Momo QR below with your app and send the exact
                        amount.
                      </p>

                      <div className="flex flex-col items-center gap-3">
                        <div className="w-80 h-80 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                          MOMO QR
                        </div>

                        <div className="text-center space-y-1.5">
                          <p className="text-sm text-muted-foreground">
                            Transfer content:
                          </p>
                          <div className="px-3 py-2 rounded-md bg-muted text-sm font-mono inline-block">
                            BUDDY-{buddy.id}-TRIP-{tripId}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Amount:{" "}
                            <span className="font-semibold text-[#0F766E]">
                              $ {totalAmount.toLocaleString()}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CARD */}
                  {method === "card" && (
                    <div className="space-y-4">
                      <h3 className="text-xl lg:text-lg font-semibold">
                        Card details
                      </h3>

                      {/* Logos row */}
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 rounded-md bg-slate-100 font-semibold text-slate-700 text-xs">
                          VISA
                        </div>
                        <div className="px-3 py-1 rounded-md bg-slate-100 font-semibold text-slate-700 text-xs">
                          MasterCard
                        </div>
                        <div className="px-3 py-1 rounded-md bg-slate-100 font-semibold text-slate-700 text-xs">
                          JCB
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="card-number"
                            className="text-base font-medium"
                          >
                            Card number
                          </Label>
                          <Input
                            id="card-number"
                            placeholder="4005 5500 0000 0001"
                            inputMode="numeric"
                            className="h-11 text-base rounded-xl border-gray-300 focus:ring-2 focus:ring-[#0F766E]/70"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label
                            htmlFor="card-name"
                            className="text-base font-medium"
                          >
                            Name on card
                          </Label>
                          <Input
                            id="card-name"
                            placeholder="Tran Quang Khai"
                            className="h-11 text-base rounded-xl border-gray-300 focus:ring-2 focus:ring-[#0F766E]/70"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label
                              htmlFor="card-expiry"
                              className="text-base font-medium"
                            >
                              Expiry date
                            </Label>
                            <Input
                              id="card-expiry"
                              placeholder="05/28"
                              className="h-11 text-base rounded-xl border-gray-300 focus:ring-2 focus:ring-[#0F766E]/70"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label
                              htmlFor="card-cvc"
                              className="text-base font-medium"
                            >
                              CVC
                            </Label>
                            <Input
                              id="card-cvc"
                              placeholder="234"
                              inputMode="numeric"
                              className="h-11 text-base rounded-xl border-gray-300 focus:ring-2 focus:ring-[#0F766E]/70"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        This is a demo UI only. Connect to a real payment
                        gateway (Stripe, 2C2P, Napas, ...) to actually charge
                        the card.
                      </p>
                    </div>
                  )}

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="w-full sm:w-auto px-5"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto px-7"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : paymentLabel}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* STEP 3: SUCCESS */}
            {step === 3 && (
              <Card className="p-6 xl:p-7 flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-xl lg:text-2xl font-semibold text-[#14532d]">
                  Payment submitted!
                </h2>
                <p className="text-sm lg:text-base text-muted-foreground max-w-md">
                  We’ve received your payment information for{" "}
                  <span className="font-semibold">{buddy.buddy}</span>. Our team
                  will verify and send confirmation to your email shortly.
                </p>
                <p className="text-sm text-slate-500">
                  Reference:{" "}
                  <span className="font-mono">
                    BUDDY-{buddy.id}-TRIP-{tripId}
                  </span>
                </p>
                <div className="mt-3 flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto px-5"
                    onClick={resetPayment}
                  >
                    Make another payment
                  </Button>
                  <Button className="w-full sm:w-auto px-6">
                    Go to My Trips
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* RIGHT: SUMMARY (1/3) */}
          <div className="space-y-4">
            <Card className="p-6 xl:p-7">
              <h3 className="text-lg lg:text-lg font-semibold mb-4">
                Booking Summary
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={buddy.buddyImage || "/placeholder.svg"}
                  alt={buddy.buddy}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{buddy.buddy}</p>
                  <p className="text-xs text-muted-foreground">{buddy.title}</p>
                </div>
              </div>

              <div className="border-t pt-3 mt-1.5 text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Guide rate (est.)
                  </span>
                  <span className="font-medium">${buddy.price}/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Estimated 3 hours
                  </span>
                  <span className="font-medium">
                    ${(buddy.price * 3).toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-[#0F766E] pt-2">
                  <span>Total (estimate)</span>
                  <span>$ {totalAmount.toLocaleString()} </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Final amount may change based on actual duration & agreement
                  with your buddy. No automatic charge is made in this demo.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
