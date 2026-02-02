"use client";

import { ReactNode } from "react";

interface HomePageLayoutProps {
  children: ReactNode;
}

export default function HomePageLayout({ children }: HomePageLayoutProps) {
  return (
    <div className="h-full snap-y snap-mandatory scroll-smooth overflow-y-auto">
      {children}
    </div>
  );
}

