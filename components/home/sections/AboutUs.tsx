// components/home/AboutSection.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { whyChooseUs } from "@/lib/data/whyChooseUs";
import Section from "../layout/Section";

export default function AboutUs() {
  return (
    <Section className="bg-white" containerClassName="space-y-16">
      {/* WHO WE ARE */}
      <div className="text-center mx-auto max-w-3xl space-y-6">
        <h2 className="text-4xl font-bold">Who We Are</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Founded in 2020, LocalHost is a community-driven platform connecting
          travelers with authentic local experiences. We specialize in
          personalized tours and activities, offering transparent pricing and
          real-time booking.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          We&apos;re proud to be the first platform to offer a complete range of
          local experiences online—with transparent pricing and local expertise.
        </p>
        <Link href="/about">
          <Button
            size="lg"
            className="bg-orange-500 text-white hover:bg-orange-600 hover-lift"
          >
            Meet Our Team
          </Button>
        </Link>
      </div>

      {/* WHY TRAVEL WITH US */}
      <div className="space-y-6 text-center">
        <h3 className="text-4xl font-bold mb-6">Why Travel with Us?</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {whyChooseUs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex">
                <Card className="h-full w-full p-8 flex flex-col items-center text-center hover-lift">
                  <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-8 h-8 text-teal-600" />
                  </div>
                  <h4 className="font-semibold mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
