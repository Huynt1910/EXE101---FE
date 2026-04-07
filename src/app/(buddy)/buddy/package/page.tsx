import Link from "next/link";
import PricingSection from "@/components/home/sections/pricing-section";

export default function BuddyPackagePage() {
  return (
    <main className="flex min-h-[calc(100vh-88px)] w-full items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center">
        <PricingSection embedded buddyUpgradeMode />
      </div>
    </main>
  );
}
