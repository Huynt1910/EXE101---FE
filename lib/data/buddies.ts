// lib/data/buddies.ts

export const DESTINATIONS = [
  { name: "Hanoi", region: "North" },
  { name: "Ha Long Bay", region: "North" },
  { name: "Ninh Binh", region: "North" },
  { name: "Sapa", region: "North" },
  { name: "Hue", region: "Central" },
  { name: "Da Nang", region: "Central" },
  { name: "Hoi An", region: "Central" },
  { name: "Ho Chi Minh City", region: "South" },
  { name: "Mekong Delta", region: "South" },
] as const;

export const TRAVEL_STYLES = [
  "Chill & Relax",
  "Adventure",
  "Cultural",
  "Foodie",
  "Photography",
  "Nightlife",
] as const;

export const INTERESTS = [
  "Street Food",
  "Hidden Bars",
  "Coffee",
  "Motorbike",
  "Hiking",
  "History",
  "Handicraft",
  "Markets",
  "Temples & Pagodas",
  "Beaches",
  "Boat & Kayak",
] as const;

export const BUDGETS = {
  LOW: { label: "$ (Backpacker)", rank: 0 },
  MID: { label: "$$ (Mid-range)", rank: 1 },
  HIGH: { label: "$$$ (Luxury)", rank: 2 },
} as const;

export type Buddy = {
  id: string;
  name: string;
  regions: Array<(typeof DESTINATIONS)[number]["region"]>;
  cities: string[];
  languages: string[];
  budget: keyof typeof BUDGETS;
  budgetLabel: string;
  maxGroup?: number;
  styles: string[];
  interests: string[];
  rating: number; // 0-5
  image: string;
};

export const BUDDIES: Buddy[] = [
  {
    id: "ha-noi-foodie-linh",
    name: "Linh (Hanoi Foodie)",
    regions: ["North"],
    cities: ["Hanoi", "Ninh Binh"],
    languages: ["Vietnamese", "English"],
    budget: "MID",
    budgetLabel: "20$/h",
    maxGroup: 6,
    styles: ["Foodie", "Cultural"],
    interests: ["Street Food", "Coffee", "Markets", "History", "Handicraft"],
    rating: 4.9,
    image: "/linh.png",
  },
  {
    id: "ha-long-guide-son",
    name: "Son (Ha Long Specialist)",
    regions: ["North"],
    cities: ["Ha Long Bay", "Hanoi"],
    languages: ["Vietnamese", "English"],
    budget: "MID",
    budgetLabel: "21$/h",
    maxGroup: 10,
    styles: ["Adventure", "Photography"],
    interests: ["Boat & Kayak", "Beaches", "History"],
    rating: 4.8,
    image: "/Son.png",
  },
  {
    id: "sapa-trek-giang",
    name: "Giang (Sapa Trek Leader)",
    regions: ["North"],
    cities: ["Sapa"],
    languages: ["Vietnamese", "English"],
    budget: "LOW",
    budgetLabel: BUDGETS.LOW.label,
    maxGroup: 8,
    styles: ["Adventure", "Photography"],
    interests: ["Hiking", "Markets", "Coffee"],
    rating: 4.7,
    image: "/buddies/giang.jpg",
  },
  {
    id: "hue-heritage-an",
    name: "An (Hue Heritage)",
    regions: ["Central"],
    cities: ["Hue", "Da Nang"],
    languages: ["Vietnamese", "English", "French"],
    budget: "MID",
    budgetLabel: BUDGETS.MID.label,
    maxGroup: 6,
    styles: ["Cultural", "Chill & Relax"],
    interests: ["History", "Temples & Pagodas", "Coffee"],
    rating: 4.9,
    image: "/buddies/an.jpg",
  },
  {
    id: "hoi-an-van",
    name: "Van (Hoi An Local)",
    regions: ["Central"],
    cities: ["Hoi An", "Da Nang"],
    languages: ["Vietnamese", "English"],
    budget: "MID",
    budgetLabel: BUDGETS.MID.label,
    maxGroup: 6,
    styles: ["Cultural", "Foodie"],
    interests: ["Handicraft", "Street Food", "Markets", "Beaches"],
    rating: 4.8,
    image: "/buddies/van.jpg",
  },
  {
    id: "saigon-nightlife-minh",
    name: "Minh (Saigon Nightlife)",
    regions: ["South"],
    cities: ["Ho Chi Minh City"],
    languages: ["Vietnamese", "English"],
    budget: "HIGH",
    budgetLabel: BUDGETS.HIGH.label,
    maxGroup: 4,
    styles: ["Nightlife", "Foodie"],
    interests: ["Hidden Bars", "Street Food", "Coffee"],
    rating: 4.6,
    image: "/buddies/minh.jpg",
  },
  {
    id: "mekong-lan",
    name: "Lan (Mekong Insider)",
    regions: ["South"],
    cities: ["Mekong Delta", "Ho Chi Minh City"],
    languages: ["Vietnamese", "English"],
    budget: "LOW",
    budgetLabel: BUDGETS.LOW.label,
    maxGroup: 8,
    styles: ["Cultural", "Chill & Relax"],
    interests: ["Boat & Kayak", "Markets", "History"],
    rating: 4.7,
    image: "/buddies/lan.jpg",
  },
  {
    id: "danang-active-huy",
    name: "Huy (Da Nang Active)",
    regions: ["Central"],
    cities: ["Da Nang", "Hoi An"],
    languages: ["Vietnamese", "English", "Korean"],
    budget: "MID",
    budgetLabel: BUDGETS.MID.label,
    maxGroup: 10,
    styles: ["Adventure", "Chill & Relax"],
    interests: ["Beaches", "Hiking", "Coffee"],
    rating: 4.8,
    image: "/buddies/huy.jpg",
  },
];
