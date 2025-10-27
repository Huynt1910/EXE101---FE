"use client";
import Section from "../layout/Section";
import { feedbacksData } from "@/lib/data/homepage";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Star, Handshake } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Feedbacks() {
  return (
    <Section className="bg-gray-50" containerClassName="space-y-10">
      <h2 className="text-4xl font-bold text-center">What Our Clients Say</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {feedbacksData.map((t, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            viewport={{ amount: 0.25 }}
          >
            <Card className="p-8 hover-lift">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <img
                  src={t.image || "/placeholder.svg"}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.date}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="bg-primary text-primary-foreground rounded-2xl px-6 py-12 text-center">
        <h3 className="text-3xl font-bold mb-3">
          Find your perfect Local Buddy
        </h3>
        <p className="text-base opacity-90 mb-6">
          Tell us what you love—food, culture, adventure, hidden gems—and we'll
          match you with a local who shares your vibe.
        </p>
        <Link href="/explore">
          <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Find my match <Handshake className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </Section>
  );
}
