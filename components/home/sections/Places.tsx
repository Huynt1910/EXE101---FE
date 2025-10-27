"use client";
import Section from "../layout/Section";
import { motion } from "framer-motion";
import Link from "next/link";

const places = [
  {
    title: "Ha Long Bay",
    img: "/HaLong_Bay.jpg",
    href: "/cruises/halong-bay",
    desc: "Explore the breathtaking beauty of Halong Bay, Lan Ha Bay, and Bai Tu Long Bay with our selection of budget, mid-range, luxury, and boutique cruises. Whether you choose the charm of a traditional junk boat or the exclusivity of a private cruise, your journey will be tailored to your desires.",
    cta: "View Cruises",
  },
  {
    title: "Hoi An",
    img: "/Hoi_An.jpg",
    href: "/cruises/hoi-an",
    desc: "Explore the rich history and culture of Hoi An with our selection of tours and activities. From the ancient streets of the old town to the colorful markets and traditional handicrafts, you’ll experience the best of Hoi An’s culture and heritage.",
    cta: "View Cruises",
  },
];

export default function Places() {
  return (
    <Section className="bg-white" containerClassName="space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Vietnam’s Most Beautiful Places
        </h2>
        <p className="text-lg text-muted-foreground">
          With 7+ iconic destinations spanning North, Central, and South—Ha Long
          Bay, Hoi An, Ninh Binh, Sapa, Hue, Hanoi, and Ho Chi Minh City—you’ll
          experience limestone karsts, lantern-lit old towns, river caves,
          terraced mountains, and imperial heritage in one seamless journey.
        </p>
      </div>

      {places.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          viewport={{ amount: 0.3 }}
          className="mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className={i % 2 === 0 ? "" : "md:order-2"}>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {item.desc}
              </p>
              <Link href={item.href}>
                <button className="inline-flex items-center gap-2 rounded-xl bg-orange-500 text-white px-5 py-3 font-semibold shadow hover:bg-orange-600 transition-colors">
                  {item.cta}
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
              </Link>
            </div>
            <div className={i % 2 === 0 ? "" : "md:order-1"}>
              <div className="relative overflow-hidden rounded-3xl shadow-xl">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-[260px] sm:h-[320px] md:h-[360px] object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </Section>
  );
}
