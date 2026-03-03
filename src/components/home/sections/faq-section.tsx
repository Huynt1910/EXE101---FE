"use client";

import { useLanguage } from "@/components/common/AppProviders";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getHomepageContent } from "@/i18n";

export function FAQ() {
  const { language } = useLanguage();
  const t = getHomepageContent(language).faq;

  return (
    <section className="bg-primary text-primary-foreground py-20 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-bold">{t.hero.title1}</h2>

        <h2 className="text-4xl font-bold text-primary-foreground">
          {t.hero.title2} <span className="text-accent">{t.hero.brand}</span>
        </h2>
      </div>

      <Accordion
        type="single"
        collapsible
        className="mx-auto max-w-3xl rounded-2xl border text-primary-foreground"
      >
        {t.items.map((item, index) => (
          <AccordionItem key={item.q} value={`item-${index}`}>
            <AccordionTrigger className="text-xl px-6 cursor-pointer ">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-lg px-6 text-primary-foreground/90">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

