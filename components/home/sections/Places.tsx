"use client";
import Section from "../layout/Section";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/share/AppProviders";

export default function Places() {
  const { language } = useLanguage();
  const content = {
    vi: {
      title: "Những điểm đến đẹp nhất TP.HCM",
      desc: "Landmark 81 và Chợ Bến Thành là hai biểu tượng không thể bỏ lỡ - nơi kết hợp giữa nhịp sống hiện đại và hơi thở văn hóa Sài Gòn.",
      cta: "Xem chi tiết",
      places: [
        {
          title: "Landmark 81",
          img: "places/landmark-81.png",
          href: "/places/landmark-81",
          desc: "Chiêm ngưỡng tòa nhà cao nhất Việt Nam với không gian ngắm cảnh, ẩm thực và trải nghiệm hiện đại ngay giữa lòng thành phố.",
        },
        {
          title: "Chợ Bến Thành",
          img: "places/ben-thanh.png",
          href: "/places/ben-thanh",
          desc: "Khám phá nhịp sống Sài Gòn với thiên đường ẩm thực đường phố, sản vật địa phương và nét văn hóa lâu đời.",
        },
      ],
    },
    en: {
      title: "HCMC's most iconic spots",
      desc: "Landmark 81 and Ben Thanh Market are must-see highlights, blending modern energy with Saigon’s cultural rhythm.",
      cta: "View details",
      places: [
        {
          title: "Landmark 81",
          img: "places/landmark-81.png",
          href: "/places/landmark-81",
          desc: "Vietnam’s tallest tower with skyline views, contemporary dining, and vibrant city energy.",
        },
        {
          title: "Ben Thanh Market",
          img: "places/ben-thanh.png",
          href: "/places/ben-thanh",
          desc: "A lively market of street food, local crafts, and Saigon’s signature bustle.",
        },
      ],
    },
  } as const;
  const t = content[language];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="space-y-4 text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t.title}
        </h2>
        <p className="text-lg text-muted-foreground py-4">{t.desc}</p>
      </div>

      {t.places.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          viewport={{ amount: 0.3 }}
          className="mb-6"
        >
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 py-2">
            <div className={i % 2 === 0 ? "" : "md:order-2"}>
              <h3 className="mb-4 text-3xl font-bold md:text-4xl">
                {item.title}
              </h3>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
              {/* <Link >
                <button className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow transition-colors hover:bg-orange-600">
                  {t.cta}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 18l6-6-6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </Link> */}
            </div>
            <div className={i % 2 === 0 ? "" : "md:order-1"}>
              <div className="relative overflow-hidden rounded-3xl shadow-xl">
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-[260px] w-full object-cover sm:h-[320px] md:h-[360px]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
