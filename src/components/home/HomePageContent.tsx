import { AboutUsSection } from "@/components/home/sections/about-us-section";
import { BuddiesFormSection } from "@/components/home/sections/buddies-form-section";
import { FAQ } from "@/components/home/sections/faq-section";
import { Hero } from "@/components/home/sections/hero-section";
import { ProofSection } from "@/components/home/sections/proof-section";
import { SolutionSection } from "@/components/home/sections/solution-section";
import { TestimonialsSection } from "@/components/home/sections/testimonials-section";
import { VietnamHighlightsSection } from "@/components/home/sections/vietnam-highlight-section";
import { Footer } from "@/components/layouts/Footer";

export default function HomePageContent() {
  return (
    <div className="bg-background">
      <Hero />
      <VietnamHighlightsSection />
      <ProofSection />
      <AboutUsSection />
      <TestimonialsSection />
      <SolutionSection />
      <BuddiesFormSection />
      <FAQ />
    </div>
  );
}
