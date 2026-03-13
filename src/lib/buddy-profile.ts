import type { Buddy } from "@/lib/data/buddies";

export type BuddyProfileMeta = {
  languages: string[];
  tripsLed: number;
  gender: "female" | "male" | "other";
  styles: string[];
  cityExpertise: string[];
  tags: string[];
  availability: string[];
  coverImage: string;
  feedback: Array<{
    author: string;
    rating: number;
    text: string;
  }>;
};

export const buddyProfileMeta: Record<number, BuddyProfileMeta> = {
  1: {
    languages: ["Vietnamese", "English"],
    tripsLed: 124,
    gender: "female",
    styles: ["Food", "Culture", "Walking"],
    cityExpertise: ["Ho Chi Minh City"],
    tags: ["local expert", "food", "culture"],
    availability: ["Today 18:00", "Tomorrow 09:00", "Sat 14:00"],
    coverImage: "/places/ho-chi-minh-city.png",
    feedback: [
      { author: "Anna", rating: 5, text: "Very warm and practical guide for first-time visitors." },
      { author: "Leo", rating: 5, text: "Knows the best food stops and keeps the pace comfortable." },
    ],
  },
  2: {
    languages: ["Vietnamese", "English"],
    tripsLed: 97,
    gender: "male",
    styles: ["Adventure", "Motorbike", "Outdoor"],
    cityExpertise: ["Ha Long", "Quang Ninh"],
    tags: ["adventure", "motorbike", "nature"],
    availability: ["Tomorrow 07:00", "Fri 08:00", "Sun 10:00"],
    coverImage: "/motorbike-adventure-halong-bay.jpg",
    feedback: [
      { author: "Mia", rating: 5, text: "Confident route planning and strong safety mindset." },
      { author: "Ryan", rating: 4, text: "Great for travelers wanting active exploration." },
    ],
  },
  3: {
    languages: ["Vietnamese", "English"],
    tripsLed: 156,
    gender: "female",
    styles: ["Food", "Workshop", "Family"],
    cityExpertise: ["Ho Chi Minh City"],
    tags: ["food", "cooking", "family friendly"],
    availability: ["Today 15:00", "Sat 09:00", "Sun 11:00"],
    coverImage: "/traditional-cooking-class-vietnam.jpg",
    feedback: [
      { author: "Sophie", rating: 5, text: "Very patient and clear when guiding groups." },
    ],
  },
  4: {
    languages: ["Vietnamese", "English"],
    tripsLed: 88,
    gender: "male",
    styles: ["Night life", "Culture", "Social"],
    cityExpertise: ["Ho Chi Minh City"],
    tags: ["night life", "local expert", "rooftop"],
    availability: ["Tonight 20:00", "Fri 19:00", "Sat 20:00"],
    coverImage: "/saigon-nightlife-rooftop.jpg",
    feedback: [
      { author: "Jason", rating: 5, text: "Perfect for a safe and curated nightlife experience." },
    ],
  },
  5: {
    languages: ["Vietnamese", "English", "French"],
    tripsLed: 143,
    gender: "male",
    styles: ["History", "Culture", "Full day"],
    cityExpertise: ["Ho Chi Minh City", "Cu Chi"],
    tags: ["culture", "history", "local expert"],
    availability: ["Tomorrow 08:00", "Sat 08:00", "Sun 08:00"],
    coverImage: "/cu-chi-war-history-tour.jpg",
    feedback: [
      { author: "Laura", rating: 5, text: "Strong historical context and excellent communication." },
    ],
  },
  6: {
    languages: ["Vietnamese", "English"],
    tripsLed: 102,
    gender: "female",
    styles: ["Eco", "Slow travel", "Local life"],
    cityExpertise: ["Ho Chi Minh City", "Mekong Delta"],
    tags: ["food", "culture", "local life"],
    availability: ["Fri 07:00", "Sat 07:00", "Sun 07:00"],
    coverImage: "/mekong-delta-eco-tour.jpg",
    feedback: [
      { author: "Emily", rating: 5, text: "Authentic local perspective and smooth logistics." },
    ],
  },
  7: {
    languages: ["Vietnamese", "English"],
    tripsLed: 65,
    gender: "female",
    styles: ["Coffee", "Art", "Culture"],
    cityExpertise: ["Ho Chi Minh City"],
    tags: ["culture", "coffee", "creative"],
    availability: ["Today 16:00", "Tomorrow 10:00", "Sat 16:00"],
    coverImage: "/saigon-coffee-art-tour.jpg",
    feedback: [
      { author: "Jonas", rating: 5, text: "Ideal for travelers wanting a creative city angle." },
    ],
  },
  8: {
    languages: ["Vietnamese", "English"],
    tripsLed: 71,
    gender: "female",
    styles: ["Nature", "Outdoor", "Day trip"],
    cityExpertise: ["Ho Chi Minh City", "Can Gio"],
    tags: ["nature", "local expert", "outdoor"],
    availability: ["Fri 08:00", "Sat 08:00", "Sun 08:00"],
    coverImage: "/can-gio-mangrove-tour.jpg",
    feedback: [
      { author: "Sophie", rating: 4, text: "Good option for a calm break from the city." },
    ],
  },
};

export function getBuddyMeta(buddyId: number): BuddyProfileMeta {
  return (
    buddyProfileMeta[buddyId] ?? {
      languages: ["English"],
      tripsLed: 0,
      gender: "other",
      styles: ["Local"],
      cityExpertise: [],
      tags: [],
      availability: [],
      coverImage: "/hero.png",
      feedback: [],
    }
  );
}

export function getBuddyProfileData(buddy: Buddy) {
  return {
    ...buddy,
    ...getBuddyMeta(buddy.id),
  };
}
