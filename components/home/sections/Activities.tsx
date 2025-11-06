"use client";
import Section from "../layout/Section";
import ActivityCard from "./ActivityCard";
import { activities } from "@/lib/data/activities";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Activities() {
  // return (
  // <Section className="bg-gray-50" containerClassName="space-y-10">
  //   <div className="text-center space-y-4">
  //     <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
  //       Things to do in Vietnam
  //     </h2>
  //     <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
  //       Discover a wide range of activities and tours designed to enhance your
  //       travel experience. From cultural tours to adventure activities, we
  //       offer a diverse selection of experiences tailored to your interests.
  //     </p>
  //   </div>
  //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 items-stretch">
  //     {activities.map((a, idx) => (
  //       <motion.div
  //         key={a.id}
  //         initial={{ opacity: 0, y: 40 }}
  //         whileInView={{ opacity: 1, y: 0 }}
  //         transition={{ duration: 0.6, delay: idx * 0.15 }}
  //         viewport={{ amount: 0.25 }}
  //         className="flex"
  //       >
  //         <Link href={`/activity/${a.id}`} className="flex-1">
  //           <ActivityCard
  //             title={a.title}
  //             image={a.image}
  //             duration={a.duration}
  //             rating={a.rating}
  //             reviews={a.reviews}
  //             price={a.price}
  //           />
  //         </Link>
  //       </motion.div>
  //     ))}
  //   </div>
  // </Section>
  // );
}
