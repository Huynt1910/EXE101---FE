"use client";
import Section from "../layout/Section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookText } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <Section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/hero.png" // ảnh gốc đủ lớn
        alt="Vietnam travel collage"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center space-y-6 px-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
          Explore Ho Chi Minh City with a local
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
          Connect with authentic local experiences and meet genuine locals who
          share their culture and stories.
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
