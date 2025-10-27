"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";

type Props = {
  title: string;
  image?: string;
  duration: string;
  rating: number;
  reviews: number;
  price: number;
};

export default function ActivityCard({
  title,
  image,
  duration,
  rating,
  reviews,
  price,
}: Props) {
  return (
    <Card
      className="
        relative overflow-hidden rounded-2xl border-0
        bg-black text-white group shadow-md hover:shadow-2xl
        transition-transform duration-300 hover:-translate-y-1
        h-[560px]
      "
    >
      <img
        src={image || "/placeholder.svg"}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      <button
        className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 hover:bg-white"
        onClick={(e) => e.preventDefault()}
        aria-label="Save"
      >
        <Heart className="w-5 h-5 text-red-500" />
      </button>

      <div className="absolute inset-x-0 bottom-0 z-10 p-6">
        <h3 className="mb-3 line-clamp-2 text-xl font-semibold">{title}</h3>
        <div className="mb-3 flex items-center gap-2 text-sm"></div>
        <div className="mb-4 flex items-center gap-2"></div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2"></div>
        </div>
      </div>
    </Card>
  );
}
