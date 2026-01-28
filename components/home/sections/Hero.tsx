"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/AppProviders";

export default function Hero() {
  const { language } = useLanguage();
  const content = {
    vi: {
      badge: "Hành trình cá nhân",
      title: "Khám phá TP.HCM cùng người bản địa",
      description:
        "Kết nối với trải nghiệm thật và gặp gỡ những người địa phương am hiểu văn hóa, ẩm thực và những góc phố đặc sắc.",
      cta: "Nhận thông báo",
      note: "* Đăng ký để nhận thông báo khi website chính thức ra mắt",
      highlights: [
        {
          label: "Điểm nhấn",
          text: "Lịch trình được cá nhân hóa theo sở thích",
        },
        {
          label: "Linh hoạt",
          text: "Gợi ý hoạt động và ngân sách rõ ràng",
        },
        {
          label: "Hỗ trợ",
          text: "Đồng hành 24/7 trước và trong chuyến đi",
        },
      ],
    },
    en: {
      badge: "Personal journeys",
      title: "Explore HCMC with a local buddy",
      description:
        "Connect with real experiences and locals who know the culture, food, and hidden corners of the city.",
      cta: "Get notification",
      note: "* Sign up to get notified when we launch",
      highlights: [
        {
          label: "Highlights",
          text: "Trips tailored to your interests and pace",
        },
        {
          label: "Flexible",
          text: "Clear activity suggestions and budget ideas",
        },
        {
          label: "Support",
          text: "We stay with you before and during the trip",
        },
      ],
    },
  } as const;
  const t = content[language];

  return (
    <section className="relative overflow-hidden min-h-[100svh] lg:min-h-[50vh] flex">
      <Image
        src="/hero.png"
        alt="Vietnam travel collage"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_55%)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-14 sm:py-16 lg:py-20 flex items-center">
        <div className="grid w-full gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6 text-left">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              {t.badge}
            </p>
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl animate-fade-in-up">
              {t.title}
            </h1>
            <p className="max-w-2xl text-base text-white/90 sm:text-lg lg:text-xl animate-fade-in-up-delayed">
              {t.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 animate-fade-in-up-delayed-2">
              <Link href="#lead-form">
                <Button
                  size="lg"
                  className="bg-orange-500 text-white hover:bg-orange-600"
                >
                  {t.cta}
                </Button>
              </Link>
              <p className="text-sm text-white/70">{t.note}</p>
            </div>
          </div>

          <div className="grid gap-4 text-white/90">
            {t.highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur"
              >
                <p className="text-sm uppercase tracking-widest text-white/70">
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
