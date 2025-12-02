import HomePageContent from "@/components/home/HomePageContent";

export default function HomePage() {

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
