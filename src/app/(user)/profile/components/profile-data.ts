import {
  Bell,
  BookOpen,
  ClipboardList,
  MessageCircle,
  Package,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { CourseItem, MenuItem } from "./profile-types";

export const MENU_ITEMS: MenuItem[] = [
  { label: "Overview", icon: Sparkles, href: "/profile" },
  {
    label: "Personal info",
    icon: UserRound,
    href: "/profile?section=personal",
    section: "personal",
  },
  {
    label: "My bookings",
    icon: ClipboardList,
    href: "/profile?section=bookings",
    section: "bookings",
    badgeKey: "bookings",
  },
  {
    label: "My trips",
    icon: BookOpen,
    href: "/profile?section=trips",
    section: "trips",
    badgeKey: "trips",
  },
  {
    label: "Notifications",
    icon: Bell,
    href: "/profile?section=notifications",
    section: "notifications",
    badgeKey: "notifications",
  },
  {
    label: "Messages",
    icon: MessageCircle,
    href: "/messages",
    badgeKey: "messages",
  },
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
