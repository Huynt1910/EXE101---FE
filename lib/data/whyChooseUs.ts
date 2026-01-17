import { BookOpen, Award, Clock } from "lucide-react";
import type { Language } from "@/lib/i18n";

export interface WhyChooseUs {
  icon: any;
  title: string;
  description: string;
}

const whyChooseUsByLang: Record<Language, WhyChooseUs[]> = {
  vi: [
    {
      icon: BookOpen,
      title: "Hiểu biết địa phương",
      description:
        "Đồng hành cùng người bản địa, am hiểu văn hóa và những điểm đến độc đáo",
    },
    {
      icon: Award,
      title: "Đánh giá uy tín",
      description: "Được xác thực, nhận nhiều phản hồi tích cực",
    },
    {
      icon: Clock,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ đồng hành trước, trong và sau chuyến đi của bạn",
    },
  ],
  en: [
    {
      icon: BookOpen,
      title: "Local insight",
      description:
        "Hosts are locals who know the culture, flavors, and hidden corners",
    },
    {
      icon: Award,
      title: "Trusted reviews",
      description: "Verified hosts with consistently positive guest feedback",
    },
    {
      icon: Clock,
      title: "24/7 support",
      description: "We stay with you before, during, and after your trip",
    },
  ],
};

export function getWhyChooseUs(language: Language) {
  return whyChooseUsByLang[language];
}
