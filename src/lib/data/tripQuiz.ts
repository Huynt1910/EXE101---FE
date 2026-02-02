// lib/data/buddies.ts

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

export type BudgetKey = keyof typeof BUDGETS;

// Tạo array để map trong UI
export const BUDGET_OPTIONS = (
  Object.entries(BUDGETS) as [BudgetKey, (typeof BUDGETS)[BudgetKey]][]
).map(([key, value]) => ({
  key,
  label: value.label,
  rank: value.rank,
}));
