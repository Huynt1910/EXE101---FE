"use client";
import Hero from "./sections/Hero";
import AboutUs from "./sections/AboutUs";
import Activities from "./sections/Activities";
import Places from "./sections/Places";
import Feedbacks from "./sections/Feedbacks";

export default function HomePageContent() {
  return (
    <div className="bg-background">
      <Hero />
      <AboutUs />
      {/* <Activities /> */}
      <Places />
      <Feedbacks />
    </div>
  );
}
