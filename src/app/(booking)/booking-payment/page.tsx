"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, CheckCircle2, Clock3, CreditCard, FileText, Smartphone, Sparkles, Users } from "lucide-react";
import { Timeline } from "@/components/common/timeline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  advanceBookingStatus,
  getLatestTripRequest,
  getBookingStatusMeta,
} from "@/lib/trip-request";
import { buddiesData } from "@/lib/data/buddies";

type PaymentMethod = "bank" | "momo" | "card";
type Step = 1 | 2 | 3;

export default function PaymentPage() {
  const router = useRouter();
  const request = getLatestTripRequest();
  const buddy = request?.selectedBuddyId ? buddiesData[request.selectedBuddyId] : null;
  const [step, setStep] = useState<Step>(1);
  const [method, setMethod] = useState<PaymentMethod>("bank");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalAmount = useMemo(() => request?.proposal?.finalPrice ?? 0, [request?.proposal?.finalPrice]);

  if (!request || !buddy) {
    return <div className="booking-page flex items-center justify-center"><p className="text-base text-muted-foreground">Booking data not found.</p></div>;
  }

  const paymentLabel = method === "bank" ? "Confirm bank transfer" : method === "momo" ? "Confirm Momo payment" : "Pay with card";
  const timelineItems = [
    {
      id: "created",
      title: "Create request",
      description: "Your trip request is created and matching has started.",
      icon: CheckCircle2,
      status: "completed" as const,
    },
    {
      id: "match",
      title: "Match your buddy",
      description: "Customer and buddy are connected and can continue in inbox.",
      icon: Users,
      status: "completed" as const,
    },
    {
      id: "proposal",
      title: "Review proposal",
      description: "The customer confirmed the buddy proposal in inbox.",
      icon: FileText,
      status: "completed" as const,
    },
    {
      id: "payment",
      title: "Complete payment",
      description: "This is the current step before the booking is fully confirmed.",
      icon: CreditCard,
      status: step === 3 ? ("completed" as const) : ("current" as const),
    },
    {
      id: "during",
      title: "During a trip",
      description: "This starts after payment is complete and the trip begins.",
      icon: Clock3,
      status: "upcoming" as const,
    },
    {
      id: "feedback",
      title: "Complete and feedback",
      description: "After the trip, the customer can complete feedback.",
      icon: Sparkles,
      status: "upcoming" as const,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      advanceBookingStatus("CONFIRMED", `Payment was completed for request ${request.id}.`);
      setIsSubmitting(false);
      setStep(3);
    }, 900);
  };

  return (
    <div className="booking-page">
      <div className="booking-section max-w-[1440px] py-10 md:px-6 lg:px-10 xl:px-16 lg:py-14">
        <div className="mb-8 lg:mb-10">
          <h1 className="text-3xl font-semibold text-[#2B2B2B] lg:text-4xl">Payment</h1>
          <p className="mt-1.5 text-sm text-muted-foreground lg:text-base">Booking with <span className="font-semibold text-[#0F766E]">{buddy.buddy}</span></p>
          <p className="mt-2 text-sm text-muted-foreground">Current status: {getBookingStatusMeta(request.bookingStatus).label}</p>
        </div>
        <Card className="mb-6 p-6 xl:p-7">
          <h2 className="text-xl font-semibold">Customer journey</h2>
          <p className="mt-2 text-sm text-muted-foreground">Review proposal is already completed because the customer confirmed it in inbox before reaching payment.</p>
          <Timeline className="mt-5" items={timelineItems} />
        </Card>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-6 lg:col-span-2">
            {step === 1 && (
              <Card className="p-6 xl:p-7">
                <h2 className="mb-5 text-lg font-semibold lg:text-xl">Choose a payment method</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[{ key: "bank", icon: Banknote, title: "Bank transfer", description: "Transfer directly to our bank account." }, { key: "momo", icon: Smartphone, title: "Momo", description: "Scan QR / transfer via Momo app." }, { key: "card", icon: CreditCard, title: "Credit / Debit card", description: "Visa, Mastercard, etc." }].map((item) => (
                    <button key={item.key} type="button" onClick={() => setMethod(item.key as PaymentMethod)} className={`flex flex-col gap-2 rounded-2xl border px-4 py-4 text-left text-sm transition lg:text-base ${method === item.key ? "border-[#0F766E] bg-emerald-50 shadow-sm" : "border-gray-200 bg-white hover:bg-emerald-50/40"}`}><item.icon className="h-5 w-5" /><span className="text-2xl font-semibold">{item.title}</span><span className="text-sm text-muted-foreground">{item.description}</span></button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end gap-3"><Button variant="outline" onClick={() => router.push("/booking-hub")} className="px-7">Back to booking</Button><Button onClick={() => setStep(2)} className="px-7">Continue</Button></div>
              </Card>
            )}
            {step === 2 && (
              <Card className="space-y-6 p-6 xl:p-7">
                <div className="flex items-center justify-between"><h2 className="text-2xl font-semibold lg:text-xl">Payment details</h2><button type="button" onClick={() => setStep(1)} className="text-sm text-[#0F766E] hover:underline">Change method</button></div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {method === "bank" && <div className="space-y-4"><h3 className="text-xl font-semibold lg:text-lg">Bank transfer</h3><div className="grid grid-cols-1 gap-4 text-base sm:grid-cols-2"><div><p className="text-muted-foreground">Bank</p><p className="font-semibold">Vietcombank (VCB)</p></div><div><p className="text-muted-foreground">Account number</p><p className="font-semibold">0123456789</p></div><div><p className="text-muted-foreground">Account name</p><p className="font-semibold">NGUYEN VAN A</p></div><div><p className="text-muted-foreground">Amount</p><p className="font-bold text-[#0F766E]">$ {totalAmount.toLocaleString()}</p></div></div></div>}
                  {method === "momo" && <div className="space-y-4 text-center"><h3 className="text-xl font-semibold lg:text-lg">Momo payment</h3><div className="mx-auto flex h-72 w-72 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">MOMO QR</div></div>}
                  {method === "card" && <div className="space-y-4"><h3 className="text-xl font-semibold lg:text-lg">Card details</h3><div className="space-y-3"><div className="space-y-1.5"><Label htmlFor="card-number">Card number</Label><Input id="card-number" placeholder="4005 5500 0000 0001" required /></div><div className="space-y-1.5"><Label htmlFor="card-name">Name on card</Label><Input id="card-name" placeholder="Tran Quang Khai" required /></div></div></div>}
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row"><Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Processing..." : paymentLabel}</Button></div>
                </form>
              </Card>
            )}
            {step === 3 && <Card className="flex flex-col items-center gap-3 p-6 text-center xl:p-7"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100"><CheckCircle2 className="h-8 w-8 text-emerald-600" /></div><h2 className="text-xl font-semibold text-[#14532d] lg:text-2xl">Payment submitted</h2><p className="max-w-md text-sm text-muted-foreground lg:text-base">Payment is recorded for {buddy.buddy}. The booking is now confirmed and ready for the trip timeline.</p><div className="mt-3 flex flex-col gap-3 sm:flex-row"><Button variant="outline" onClick={() => router.push("/booking-hub")}>Back to booking</Button><Button onClick={() => router.push("/inbox")}>Open inbox</Button></div></Card>}
          </div>
          <div className="space-y-4"><Card className="p-6 xl:p-7"><h3 className="mb-4 text-lg font-semibold">Payment summary</h3><div className="mb-4 flex items-center gap-3"><img src={buddy.buddyImage || "/placeholder.svg"} alt={buddy.buddy} className="h-14 w-14 rounded-full object-cover" /><div><p className="text-sm font-semibold">{buddy.buddy}</p><p className="text-xs text-muted-foreground">{buddy.title}</p></div></div><div className="space-y-1.5 border-t pt-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Final price</span><span className="font-medium">${totalAmount}</span></div><div className="flex justify-between font-semibold text-[#0F766E] pt-2"><span>Status after payment</span><span>Confirmed</span></div></div></Card></div>
        </div>
      </div>
    </div>
  );
}
