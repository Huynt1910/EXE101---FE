"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AuthImage() {
  return (
    <div className="relative hidden lg:block lg:col-span-1">
      {/* Background image wrapper */}
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

      {/* Chat overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
        <motion.div
          className="space-y-2 max-w-sm w-full mx-2 xl:max-w-md xl:mx-4 2xl:max-w-lg 2xl:mx-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* 1) Buddy */}
          <motion.div
            className="flex items-start gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="size-8 xl:size-10 flex items-center justify-center flex-shrink-0">
              <Image
                src="/avt_buddy.jpg"
                alt="Bonddy icon"
                width={24}
                height={24}
                className="rounded-md xl:w-7 xl:h-7"
                priority
              />
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-tl-md px-3 py-2 xl:px-4 xl:py-3 shadow-lg">
              <p className="text-xs xl:text-sm text-gray-800">
                Welcome! I’m your local Buddy in Ho Chi Minh City. What would you like to explore
                today?
              </p>
            </div>
          </motion.div>

          {/* 2) Traveler */}
          <motion.div
            className="flex items-start gap-2 justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <div className="bg-primary/90 backdrop-blur-sm rounded-2xl rounded-tr-md px-3 py-2 xl:px-4 xl:py-3 shadow-lg">
              <p className="text-xs xl:text-sm text-white">
                Hi! I’d love to visit Ben Thanh Market and experience local food around it.
              </p>
            </div>

            <div className="size-8 xl:size-10 flex items-center justify-center flex-shrink-0">
              <Image
                src="/avt_travler.JPG"
                alt="Traveler icon"
                width={24}
                height={24}
                className="rounded-md xl:w-7 xl:h-7"
                priority
              />
            </div>
          </motion.div>

          {/* 3) Buddy */}
          <motion.div
            className="flex items-start gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            <div className="size-8 xl:size-10 flex items-center justify-center flex-shrink-0">
              <Image
                src="/avt_buddy.jpg"
                alt="Bonddy icon"
                width={24}
                height={24}
                className="rounded-md xl:w-7 xl:h-7"
                priority
              />
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-tl-md px-3 py-2 xl:px-4 xl:py-3 shadow-lg">
              <p className="text-xs xl:text-sm text-gray-800">
                Great choice! Ben Thanh Market is one of the city’s most iconic places. I’ll guide
                you through street food spots and hidden local alleys nearby.
              </p>
            </div>
          </motion.div>

          {/* 4) Traveler */}
          <motion.div
            className="flex items-start gap-2 justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.2 }}
          >
            <div className="bg-primary/90 backdrop-blur-sm rounded-2xl rounded-tr-md px-3 py-2 xl:px-4 xl:py-3 shadow-lg">
              <p className="text-xs xl:text-sm text-white">
                That sounds perfect. Can we do the tour this evening?
              </p>
            </div>

             <div className="size-8 xl:size-10 flex items-center justify-center flex-shrink-0">
              <Image
                src="/avt_travler.JPG"
                alt="Traveler icon"
                width={24}
                height={24}
                className="rounded-md xl:w-7 xl:h-7"
                priority
              />
            </div>
          </motion.div>

          {/* 5) Buddy (card + final line) */}
          <motion.div
            className="flex items-start gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.8 }}
          >
            <div className="size-8 xl:size-10 flex items-center justify-center flex-shrink-0">
              <Image
                src="/avt_buddy.jpg"
                alt="Bonddy icon"
                width={24}
                height={24}
                className="rounded-md xl:w-7 xl:h-7"
                priority
              />
            </div>

            {/* Wrapper bubble */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-tl-md p-1 xl:p-3 shadow-lg max-w-sm">
              {/* Card width */}
              <div className="pointer-events-auto w-48 xl:w-56 2xl:w-64 rounded-xl bg-white shadow-sm overflow-hidden">
                <div className="relative h-24 xl:h-28 w-full">
                  <Image
                    src="/ben-thanh-market.jpg"
                    alt="Tour card"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1536px) 256px, (min-width: 1280px) 224px, 192px"
                  />

                  <div className="absolute left-2 top-2 flex gap-2">
                    <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-gray-800">
                      Ben Thanh
                    </span>
                    <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-gray-800">
                      Food tour
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <p className="text-xs xl:text-sm font-semibold text-gray-900 line-clamp-2">
                    Ben Thanh Market Food Walk + Hidden Alleys (Local Buddy)
                  </p>
                  <p className="mt-1 text-[11px] xl:text-xs text-gray-600">
                    Ho Chi Minh City · District 1
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-[11px] xl:text-xs text-gray-700">
                      ⭐ 4.9 <span className="text-gray-500">(238)</span>
                    </p>
                    <p className="text-xs xl:text-sm font-semibold text-gray-900">690k</p>
                  </div>
                </div>
              </div>

              <div className="mt-2 bg-white/90 backdrop-blur-sm rounded-2xl rounded-tl-md px-3 py-2 xl:px-4 xl:py-3 shadow-lg">
                <p className="text-xs xl:text-sm text-gray-800">
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
