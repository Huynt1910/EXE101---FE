"use client";
import Section from "../layout/Section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookText } from "lucide-react";

export default function Hero() {
  return (
    <Section
      className="relative bg-cover bg-center bg-no-repeat"
      asMotion={true}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ amount: 0.4 }}
      style={{ backgroundImage: "url(/halong-bay.jpg)" }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center space-y-6">
        <h1 className="text-5xl sm:text-6xl font-bold text-white">
          Explore Vietnam & Asia with a local
        </h1>
        <p className="text-xl text-white/90">
          Connect with authentic local experiences and meet genuine locals who
          share their culture and stories
        </p>
        <Link href="/design_trip">
          <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <BookText className="w-5 h-5 mr-2" />
            Start Designing Our Trip
          </Button>
        </Link>
      </div>
    </Section>
  );
}
