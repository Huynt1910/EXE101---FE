"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { homePageContent } from "@/content/site-content";

export function FAQ() {
  const t = homePageContent.faq;

  return (
    <section className="bg-primary text-primary-foreground py-20 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-bold">{t.hero.title1}</h2>

        <h2 className="text-4xl font-bold text-primary-foreground">
          {t.hero.title2}{" "}
          <span className="text-orange-600">{t.hero.brand}</span>
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
