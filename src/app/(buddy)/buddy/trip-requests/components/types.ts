export type TripRequestViewModel = {
  id: string;
  city: string;
  startDate: string;
  startTime: string;
  durationHours: number;
  adults: number;
  children: number;
  preferredLanguages: string[];
  notes: string;
  status: string;
  travelerName: string;
  createdAt: string;
  isApplied: boolean;
  matchScore: number;
};

export type DateFilter = "All" | "Today" | "ThisWeek" | "Weekend";
export type PeopleFilter = "All" | "1-2" | "3-5" | "6+";
export type SortMode = "Recommended" | "Newest" | "Earliest" | "LargestGroup";
