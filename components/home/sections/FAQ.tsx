"use client";

import Section from "../layout/Section";
import { useLanguage } from "@/components/share/AppProviders";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const content = {
  vi: {
    title1: "Câu hỏi thường gặp",
    title2: "khi sử dụng Bonddy",
    items: [
      {
        q: "Bonddy là gì và hoạt động như thế nào?",
        a: "Bonddy kết nối bạn với người bản địa để thiết kế lịch trình cá nhân hóa theo sở thích, tư vấn nhanh và hỗ trợ xuyên suốt chuyến đi.",
      },
      {
        q: "Tôi có thể yêu cầu lịch trình theo sở thích không?",
        a: "Có. Bạn chỉ cần chia sẻ sở thích, thời gian và ngân sách dự kiến, Bonddy sẽ gợi ý lộ trình phù hợp.",
      },
      {
        q: "Dịch vụ có phù hợp cho gia đình hoặc cặp đôi không?",
        a: "Hoàn toàn phù hợp. Bonddy có thể tối ưu lịch trình theo quy mô nhóm và nhu cầu riêng của bạn.",
      },
      {
        q: "Thông tin cá nhân của tôi có được bảo mật không?",
        a: "Có. Chúng tôi chỉ sử dụng thông tin để liên hệ và hỗ trợ, và không chia sẻ cho bên thứ ba.",
      },
      {
        q: "Tôi bắt đầu như thế nào?",
        a: "Bạn để lại thông tin ở form đăng ký/nhận tư vấn, Bonddy sẽ liên hệ trong vòng 24 giờ để bắt đầu lên kế hoạch.",
      },
    ],
  },
  en: {
    title1: "Frequently Asked Questions",
    title2: "about using Bonddy",
    items: [
      {
        q: "What is Bonddy and how does it work?",
        a: "Bonddy connects you with local buddies to design a personalized itinerary, quick advice, and support during your trip.",
      },
      {
        q: "Can I request a trip based on my interests?",
        a: "Yes. Share your interests, timing, and budget and we will suggest a tailored plan.",
      },
      {
        q: "Is the service suitable for families or couples?",
        a: "Absolutely. We optimize itineraries for different group sizes and needs.",
      },
      {
        q: "Is my personal data safe?",
        a: "Yes. We only use your details for consultation and never share them with third parties.",
      },
      {
        q: "How do I get started?",
        a: "Leave your info in the consultation form and we will contact you within 24 hours.",
      },
    ],
  },
} as const;

export default function FAQ() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-bold">{t.title1}</h2>
        <h2 className="text-4xl font-bold text-primary">{t.title2}</h2>
      </div>

      <Accordion
        type="single"
        collapsible
        className="mx-auto max-w-3xl rounded-2xl border"
      >
        {t.items.map((item, index) => (
          <AccordionItem key={item.q} value={`item-${index}`}>
            <AccordionTrigger className="text-xl px-6">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-lg px-6">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
