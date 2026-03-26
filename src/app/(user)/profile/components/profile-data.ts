import {
  BookOpen,
  CalendarClock,
  CalendarDays,
  CheckCheck,
  MessageCircle,
  Trophy,
  UserRound,
} from "lucide-react";
import type { CourseItem, MenuItem } from "./profile-types";

export const MENU_ITEMS: MenuItem[] = [
  { label: "Profile", icon: UserRound, href: "/profile" },
  {
    label: "My trips",
    icon: BookOpen,
    href: "/profile?section=trips",
    section: "trips",
    badge: 0,
  },
  {
    label: "Completed",
    icon: CheckCheck,
    href: "/profile?section=completed",
    section: "completed",
    badge: 0,
  },
  {
    label: "Events",
    icon: CalendarDays,
    href: "/profile?section=events",
    section: "events",
    badge: 2,
  },
  {
    label: "Achievements",
    icon: Trophy,
    href: "/profile?section=achievements",
    section: "achievements",
  },
  {
    label: "Security",
    icon: CalendarClock,
    href: "/profile?section=security",
    section: "security",
  },
  { label: "Messages", icon: MessageCircle, href: "/inbox", badge: 1 },
];

export const COURSES: CourseItem[] = [
  {
    title: "UX/UI Design - Websites",
    description: "Composition, typography and color theory in product pages.",
    lessons: "68 lessons",
    status: "Completed",
    statusTone: "done",
  },
  {
    title: "UX/UI Design - Mobile Apps",
    description: "Design principles for modern mobile interfaces.",
    lessons: "12 lessons",
    status: "Completed",
    statusTone: "done",
  },
  {
    title: "UX/UI Design - Motion",
    description: "Motion and interaction patterns for educational products.",
    lessons: "12 lessons",
    status: "Start: 13.06.2023",
    statusTone: "upcoming",
  },
];
