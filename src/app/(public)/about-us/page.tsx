import Link from "next/link";
import { ArrowRight, Compass, HeartHandshake, MapPinned, MessageCircleMore } from "lucide-react";
import InfoBlogLayout from "@/components/info/InfoBlogLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const relatedLinks = [
  {
    title: "Places & Tips",
    href: "/places",
    description: "Neighborhood ideas, planning tips, and small travel tricks before you book.",
  },
  {
    title: "How It Works",
    href: "/how-it-works",
    description: "The actual flow from browsing buddies to trip request and chat.",
  },
  {
    title: "Browse Buddies",
    href: "/buddies",
    description: "Compare public profiles, rates, languages, and reviews.",
  },
];

export default function AboutUsPage() {
  return (
    <InfoBlogLayout
      currentPath="/about-us"
      eyebrow="About Bonddy"
      title="A local-first travel website built to reduce guesswork before the trip begins."
      intro="Bonddy is not meant to feel like a directory of random attractions. The product is built around a simpler question: what helps a traveler understand a city faster, choose better, and communicate clearly before committing to a plan?"
      heroImage="/hero.png"
      heroAlt="Bonddy travel experience"
      heroCaption="Bonddy combines public place inspiration, local buddy discovery, and practical pre-trip planning in one flow."
      sidebar={
        <>
          <Card className="rounded-[2rem] border-border/70 bg-card py-0 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <HeartHandshake className="h-5 w-5 text-primary" />
                Why this site exists
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Many travelers do not need more content. They need better context, clearer choices,
                and someone local who can refine the plan into something realistic.
              </p>
              <Button asChild className="w-full rounded-full">
                <Link href="/buddies">
                  Browse buddies
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-border/70 bg-card py-0 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-lg font-semibold text-foreground">Read next</h2>
              <div className="space-y-3">
                {relatedLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-[1.5rem] border border-border/70 bg-secondary/25 p-4 transition-colors hover:bg-secondary/40"
                  >
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      }
    >
      <section className="space-y-4">
        <p className="text-lg leading-8 text-foreground">
          Bonddy sits between inspiration and execution. A traveler may know they want food,
          hidden corners, a market morning, or a slow afternoon cafe route, but still not know
          which district fits that pace, how much movement is realistic in one day, or which
          local profile feels trustworthy enough to continue with.
        </p>
        <p className="text-base leading-8 text-muted-foreground">
          That gap is where the site is most useful. Public content helps the traveler understand
          places. Public buddy profiles help them compare people. The trip request and chat flow
          help turn vague interest into a plan that can actually work on the ground.
        </p>
      </section>

      <section className="space-y-5">
        <div className="flex items-center gap-2 text-2xl font-semibold text-foreground">
          <Compass className="h-5 w-5 text-primary" />
          What Bonddy focuses on
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-border/70 bg-secondary/20 p-5">
            <h3 className="text-lg font-semibold text-foreground">Place context first</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Travelers should understand where they are going before comparing offers or deciding who to book.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-border/70 bg-secondary/20 p-5">
            <h3 className="text-lg font-semibold text-foreground">Public profile clarity</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Rates, languages, reviews, and specialties should be readable without needing to ask basic questions in chat.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-border/70 bg-secondary/20 p-5">
            <h3 className="text-lg font-semibold text-foreground">Better decisions earlier</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The site is designed to reduce uncertainty before the booking stage, not after it.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center gap-2 text-2xl font-semibold text-foreground">
          <MapPinned className="h-5 w-5 text-primary" />
          Why places and tips matter
        </div>
        <p className="text-base leading-8 text-muted-foreground">
          Good travel planning usually starts with area logic, not attraction logic. A traveler who
          understands why District 1 feels different from Binh Thanh or District 7 makes better choices,
          spends less energy crossing the city, and gets more value from buddy guidance. That is why
          Bonddy includes place-based information instead of pushing directly into a booking form.
        </p>
        <div className="rounded-[1.75rem] border border-border/70 bg-secondary/20 p-6">
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Editorial note</p>
          <p className="mt-3 text-base leading-7 text-foreground">
            The best version of this site is not a marketplace shouting for conversion. It behaves more like
            a practical city guide that naturally leads into better booking decisions.
          </p>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center gap-2 text-2xl font-semibold text-foreground">
          <MessageCircleMore className="h-5 w-5 text-primary" />
          What happens after the reader becomes a user
        </div>
        <p className="text-base leading-8 text-muted-foreground">
          Once a visitor understands the city context, the next step is straightforward: compare buddy profiles,
          choose the direction that fits, then continue into a trip request. The value is not just the booking.
          The value is that by the time the chat starts, the traveler already has better language for what they want.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link href="/places">Read the place guide</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/how-it-works">See how the product works</Link>
          </Button>
        </div>
      </section>
    </InfoBlogLayout>
  );
}
