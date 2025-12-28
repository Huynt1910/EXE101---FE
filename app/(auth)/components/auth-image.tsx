'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export default function AuthImage() {
  return (
    <div className="relative h-full">
      <div className="absolute inset-4 rounded-xl overflow-hidden">
        <Image
          src="/login-pic.jpg"
          alt="Saigon travel"
          className="h-full w-full object-cover object-center"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Messenger-style chat overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
        <motion.div
          className="
            w-full
            space-y-3
            max-w-md
            xl:max-w-lg
            2xl:max-w-xl
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Shared styles (inline) */}
          {/* 1) Buddy */}
          <motion.div
            className="flex items-start gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div
              className="
                size-10
                xl:size-12
                2xl:size-14
                rounded-full
                bg-white
                flex items-center justify-center
                flex-shrink-0
                shadow
              "
            >
              <Image
                src="/logo.png"
                alt="Bonddy icon"
                width={28}
                height={28}
                className="rounded-md xl:w-8 xl:h-8 2xl:w-9 2xl:h-9"
                priority
              />
            </div>

            <div
              className="
                bg-white/90 backdrop-blur-sm
                rounded-3xl rounded-tl-md
                px-4 py-3
                xl:px-5 xl:py-4
                2xl:px-6 2xl:py-5
                shadow-lg
                max-w-[85%]
              "
            >
              <p className="text-sm xl:text-base 2xl:text-lg leading-snug text-gray-800">
                Welcome! I’m your local Buddy in Ho Chi Minh City. What would you like to explore
                today?
              </p>
            </div>
          </motion.div>

          {/* 2) Traveler */}
          <motion.div
            className="flex items-start gap-3 justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div
              className="
                bg-primary backdrop-blur-sm
                rounded-3xl rounded-tr-md
                px-4 py-3
                xl:px-5 xl:py-4
                2xl:px-6 2xl:py-5
                shadow-lg
                max-w-[85%]
              "
            >
              <p className="text-sm xl:text-base 2xl:text-lg leading-snug text-white">
                Hi! I’d love to visit Ben Thanh Market and experience local food around it.
              </p>
            </div>

            <div
              className="
                size-10
                xl:size-12
                2xl:size-14
                rounded-full
                bg-primary
                flex items-center justify-center
                flex-shrink-0
                shadow
              "
            >
              <User className="size-4 xl:size-5 2xl:size-6 text-white" />
            </div>
          </motion.div>

          {/* 3) Buddy */}
          <motion.div
            className="flex items-start gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            <div
              className="
                size-10
                xl:size-12
                2xl:size-14
                rounded-full
                bg-white
                flex items-center justify-center
                flex-shrink-0
                shadow
              "
            >
              <Image
                src="/logo.png"
                alt="Bonddy icon"
                width={28}
                height={28}
                className="rounded-md xl:w-8 xl:h-8 2xl:w-9 2xl:h-9"
                priority
              />
            </div>

            <div
              className="
                bg-white/90 backdrop-blur-sm
                rounded-3xl rounded-tl-md
                px-4 py-3
                xl:px-5 xl:py-4
                2xl:px-6 2xl:py-5
                shadow-lg
                max-w-[85%]
              "
            >
              <p className="text-sm xl:text-base 2xl:text-lg leading-snug text-gray-800">
                Great choice! Ben Thanh Market is one of the city’s most iconic places. I’ll guide
                you through street food spots and hidden local alleys nearby.
              </p>
            </div>
          </motion.div>

          {/* 4) Traveler */}
          <motion.div
            className="flex items-start gap-3 justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.2 }}
          >
            <div
              className="
                bg-primary backdrop-blur-sm
                rounded-3xl rounded-tr-md
                px-4 py-3
                xl:px-5 xl:py-4
                2xl:px-6 2xl:py-5
                shadow-lg
                max-w-[85%]
              "
            >
              <p className="text-sm xl:text-base 2xl:text-lg leading-snug text-white">
                That sounds perfect. Can we do the tour this evening?
              </p>
            </div>

            <div
              className="
                size-10
                xl:size-12
                2xl:size-14
                rounded-full
                bg-primary
                flex items-center justify-center
                flex-shrink-0
                shadow
              "
            >
              <User className="size-4 xl:size-5 2xl:size-6 text-white" />
            </div>
          </motion.div>

          {/* 5) Buddy (card + final line) */}
          <motion.div
            className="flex items-start gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.8 }}
          >
            <div
              className="
                size-10
                xl:size-12
                2xl:size-14
                rounded-full
                bg-white
                flex items-center justify-center
                flex-shrink-0
                shadow
              "
            >
              <Image
                src="/logo.png"
                alt="Bonddy icon"
                width={28}
                height={28}
                className="rounded-md xl:w-8 xl:h-8 2xl:w-9 2xl:h-9"
                priority
              />
            </div>

            <div
              className="
                bg-white/90 backdrop-blur-sm
                rounded-3xl rounded-tl-md
                p-2
                xl:p-3
                2xl:p-4
                shadow-lg
                max-w-[88%]
              "
            >
              <div className="pointer-events-auto w-64 xl:w-72 2xl:w-80 rounded-2xl bg-white shadow-sm overflow-hidden">
                <div className="relative h-32 xl:h-36 2xl:h-40 w-full">
                  <Image
                    src="/ben-thanh-market.jpg"
                    alt="Tour card"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1536px) 320px, (min-width: 1280px) 288px, 256px"
                  />
                  <div className="absolute left-3 top-3 flex gap-2">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-800">
                      Ben Thanh
                    </span>
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-800">
                      Food tour
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm xl:text-base 2xl:text-lg font-semibold text-gray-900 line-clamp-2">
                    Ben Thanh Market Food Walk + Hidden Alleys (Local Buddy)
                  </p>
                  <p className="mt-1 text-sm text-gray-600">Ho Chi Minh City · District 1</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      ⭐ 4.9 <span className="text-gray-500">(238)</span>
                    </p>
                    <p className="text-base font-semibold text-gray-900">690k</p>
                  </div>
                </div>
              </div>

              <div
                className="
                  mt-3
                  bg-white/90 backdrop-blur-sm
                  rounded-3xl rounded-tl-md
                  px-4 py-3
                  xl:px-5 xl:py-4
                  2xl:px-6 2xl:py-5
                  shadow-lg
                "
              >
                <p className="text-sm xl:text-base 2xl:text-lg leading-snug text-gray-800">
                  Absolutely. I’ll help you get everything ready.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
