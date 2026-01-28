"use client";
import Section from "../layout/Section";
import { getFeedbacks } from "@/lib/data/homepage";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useLanguage } from "@/components/AppProviders";

export default function Feedbacks() {
  const { language } = useLanguage();
  const content = {
    vi: {
      title: "Khách hàng nói gì về chúng tôi",
    },
    en: {
      title: "What travelers say",
    },
  } as const;
  const t = content[language];
  const feedbacksData = getFeedbacks(language);

  return (
    <section className="bg-white mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 space-y-12">
      <h2 className="text-center text-4xl font-bold">{t.title}</h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {feedbacksData.map((t, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            viewport={{ amount: 0.25 }}
          >
            <Card className="p-8 hover-lift">
              <div className="mb-4 flex gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="mb-6 italic text-muted-foreground">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <img
                  src={t.image || "/placeholder.svg"}
                  alt={t.name}
                  className="h-12 w-12 rounded-full object-cover"
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
    </section>
  );
}
