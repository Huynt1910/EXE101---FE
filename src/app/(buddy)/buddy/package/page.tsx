import Link from "next/link";
import PricingSection from "@/components/home/sections/pricing-section";

export default function BuddyPackagePage() {
  return (
    <main className="w-full px-4 py-4 pb-24 sm:px-6 sm:py-6 md:pb-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <PricingSection embedded buddyUpgradeMode />
      </div>
    </main>
  );
}
