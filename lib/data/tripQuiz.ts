// lib/data/tripQuiz.ts

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

export const COMPANIONS = [
  "Solo",
  "Couple",
  "With Friends",
  "Family",
  "Association / Club",
] as const;

export const BUDGETS = [
  { key: "LOW", label: "$ (Backpacker)" },
  { key: "MID", label: "$$ (Mid-range)" },
  { key: "HIGH", label: "$$$ (Luxury)" },
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
