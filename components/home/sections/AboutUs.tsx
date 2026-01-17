"use client";

import { Card } from "@/components/ui/card";
import { getWhyChooseUs } from "@/lib/data/whyChooseUs";
import Section from "../layout/Section";
import { useLanguage } from "@/components/share/AppProviders";

export default function AboutUs() {
  const { language } = useLanguage();
  const content = {
    vi: {
      title: "Chúng tôi là ai",
      desc: "Từ năm 2025, chúng tôi kết nối du khách với trải nghiệm địa phương chân thực, tập trung vào tour cá nhân hóa và giá minh bạch.",
      whyTitle: "Tại sao đồng hành cùng chúng tôi?",
    },
    en: {
      title: "Who we are",
      desc: "Since 2025, we connect travelers with authentic local experiences, focusing on personalized tours and transparent pricing.",
      whyTitle: "Why travel with us?",
    },
  } as const;
  const t = content[language];
  const whyChooseUs = getWhyChooseUs(language);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-5 text-center">
        <h2 className="text-4xl font-bold">{t.title}</h2>
        <p className="text-lg text-balance leading-relaxed text-muted-foreground py-4">
          {t.desc}
        </p>
      </div>

      <div className="space-y-6 text-center">
        <h3 className="mb-6 text-4xl font-bold">{t.whyTitle}</h3>

        <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex">
                <Card className="flex h-full w-full flex-col items-center p-8 text-center hover-lift">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 shadow-sm">
                    <Icon className="h-8 w-8 text-teal-600" />
                  </div>
                  <h4 className="mb-2 text-3xl font-semibold text-teal-800">
                    {item.title}
                  </h4>
                  <p className="text-lg text-muted-foreground">
                    {item.description}
                  </p>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
