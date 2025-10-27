"use client";

import { useState } from "react";
import HomePageContent from "@/components/home/HomePageContent";

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {/* Intro animation
      <IntroHomePage
        defaultOpen={showIntro}
        onClose={() => setShowIntro(false)}
      /> */}

      {/* Main content */}
      <div className="bg-background">
        <HomePageContent />
      </div>
    </>
  );
}
