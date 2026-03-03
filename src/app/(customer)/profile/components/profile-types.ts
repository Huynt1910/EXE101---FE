import type { ComponentType } from "react";

export type MenuItem = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
  section?: string;
  badge?: number;
};

export type CourseItem = {
  title: string;
  description: string;
  lessons: string;
  status: string;
  statusTone: "done" | "upcoming";
};
