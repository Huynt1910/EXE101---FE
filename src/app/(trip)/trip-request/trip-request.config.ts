import { CheckCircle2, MapPin, Sparkles, Users } from "lucide-react";
import type { TripRequestFormData } from "@/lib/trip-request";

export const TRIP_REQUEST_STEPS = [
  {
    label: "Where & when",
    subtitle: "Destination and timing",
    intro: "Let's start with the basics",
    cta: "Continue to group details",
    icon: MapPin,
  },
  {
    label: "Travelers & interests",
    subtitle: "Who is joining and what fits",
    intro: "Add the traveler details",
    cta: "Continue to meeting details",
    icon: Users,
  },
  {
    label: "Notes",
    subtitle: "Extra context for your buddy",
    intro: "Add the last details before creating your trip",
    cta: "Create my trip",
    icon: Sparkles,
  },
] as const;

export const TRIP_REQUEST_COMPLETED_ICON = CheckCircle2;

export const TRIP_REQUEST_STEP_FIELDS: Array<Array<keyof TripRequestFormData>> =
  [
    ["city", "startTime", "durationHours"],
    ["adults", "children", "activities", "preferredLanguages"],
    ["notes"],
  ];
