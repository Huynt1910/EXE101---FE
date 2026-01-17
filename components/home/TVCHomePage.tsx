"use client";
import Hero from "./sections/Hero";
import AboutUs from "./sections/AboutUs";
import Places from "./sections/Places";
import Feedbacks from "./sections/Feedbacks";
import CTASection from "../share/CTASection";
import FAQ from "./sections/FAQ";

export default function TVCHomepageContent() {
  return (
    <div className="bg-background">
      <Hero />
      <CTASection />
      <AboutUs />
      <Places />
      <FAQ />
      <Feedbacks />
    </div>
  );
}
