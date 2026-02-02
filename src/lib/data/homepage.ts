import type { Language } from "@/lib/i18n";

export interface Destination {
  id: number;
  name: string;
  image: string;
  tours: number;
  description: string;
}

export interface Testimonial {
  name: string;
  date: string;
  rating: number;
  text: string;
  image: string;
}

export interface WhyChooseUs {
  icon: any;
  title: string;
  description: string;
}

export const topDestinations: Destination[] = [
  {
    id: 1,
    name: "Hanoi",
    image: "/street-food-tour-hanoi.jpg",
    tours: 45,
    description:
      "Capital city with rich history and vibrant street food culture",
  },
  {
    id: 2,
    name: "Ha Long Bay",
    image: "/halong-bay.jpg",
    tours: 32,
    description: "UNESCO World Heritage site with stunning limestone karsts",
  },
  {
    id: 3,
    name: "Ho Chi Minh City",
    image: "/traditional-cooking-class-vietnam.jpg",
    tours: 38,
    description: "Dynamic metropolis blending tradition with modern energy",
  },
  {
    id: 4,
    name: "Sapa",
    image: "/sunrise-hike-meditation-sapa.jpg",
    tours: 28,
    description:
      "Mountain town known for terraced rice fields and ethnic cultures",
  },
];

const feedbacksByLang: Record<Language, Testimonial[]> = {
  vi: [
    {
      name: "Martina Di-marco",
      date: "22/09/2025",
      rating: 5,
      text: "Chuyến đi Việt Nam được tổ chức rất chu đáo. Lịch trình cá nhân hóa, hướng dẫn viên nhiệt tình, di chuyển đúng giờ và khách sạn lựa chọn kỹ.",
      image: "/vietnamese-woman.jpg",
    },
    {
      name: "Tara Bergin",
      date: "09/10/2025",
      rating: 5,
      text: "Ngay từ lúc liên hệ, chúng tôi đã được tư vấn rất tận tình. Mọi yêu cầu đều được xử lý nhanh và rõ ràng.",
      image: "/vietnamese-woman.jpg",
    },
  ],
  en: [
    {
      name: "Martina Di-marco",
      date: "Sep 22, 2025",
      rating: 5,
      text: "A beautifully organized Vietnam trip. Personalized itinerary, warm guides, on-time transfers, and carefully selected hotels.",
      image: "/vietnamese-woman.jpg",
    },
    {
      name: "Tara Bergin",
      date: "Oct 9, 2025",
      rating: 5,
      text: "From first contact, the team was attentive and quick to handle every request. Clear, friendly, and reliable.",
      image: "/vietnamese-woman.jpg",
    },
  ],
};

export function getFeedbacks(language: Language) {
  return feedbacksByLang[language];
}
