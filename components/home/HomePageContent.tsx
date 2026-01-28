"use client";
import Hero from "./sections/Hero";
import AboutUs from "./sections/AboutUs";
import Places from "./sections/Places";
import Feedbacks from "./sections/Feedbacks";
import CTASection from "../share/CTASection";
import FAQ from "./sections/FAQ";
import { ProductTeaserCard } from "../share/Hero1";
import { IntegrationCarousel } from "../share/IntegrationCarousel";

export default function HomePageContent() {
  return (
    <div className="bg-background">
      <Hero />
      <ProductTeaserCard />
      <AboutUs />
      {/* <Activities /> */}
      <Places />
      <IntegrationCarousel />
      <Feedbacks />
      <FAQ />
      <CTASection />
    </div>
  );
}
