"use client";
import Hero from "./sections/Hero";
import AboutUs from "./sections/AboutUs";
import Places from "./sections/Places";
import Feedbacks from "./sections/Feedbacks";
import FAQ from "./sections/FAQ";
import CTALeadFormSection from "../CTASection";

export default function HomePageContent() {
  return (
    <div className="bg-background">
      <Hero />
      <AboutUs />
      {/* <Activities /> */}
      <Places />
      <Feedbacks />
      <FAQ />
      <CTALeadFormSection />
    </div>
  );
}
