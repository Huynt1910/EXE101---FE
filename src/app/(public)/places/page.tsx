import Link from "next/link";
import { ArrowRight, Coffee, MapPinned, Sparkles, UtensilsCrossed, Wallet } from "lucide-react";
import InfoBlogLayout from "@/components/info/InfoBlogLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const destinationIdeas = [
  {
    title: "District 1",
    summary:
      "Start here if you want an easy first impression of the city, strong cafe density, museums, and recognizable landmarks.",
  },
  {
    title: "District 5",
    summary:
      "Better when food, temples, older street texture, and a more layered local atmosphere matter more than polished convenience.",
  },
  {
    title: "Binh Thanh",
    summary:
      "Useful for travelers who want local access and strong food options without feeling disconnected from the center.",
  },
  {
    title: "District 7",
    summary:
      "A calmer choice for families, slower travelers, and anyone who prefers more space and a softer daily pace.",
  },
];

const tips = [
  {
    title: "Plan by district clusters",
    body: "Trying to touch too many areas in one day usually costs more energy than it returns.",
    icon: MapPinned,
  },
  {
    title: "Leave room for food detours",
    body: "The strongest meals are often not in the first plan. Keep a time buffer for spontaneous stops.",
    icon: UtensilsCrossed,
  },
  {
    title: "Use cafes as pacing tools",
    body: "A short cafe stop can reset the whole day and make the next part of the route much more enjoyable.",
    icon: Coffee,
  },
  {
    title: "Watch the transport drift",
    body: "Cheap single rides add up when the itinerary is scattered. Cluster locations to protect both budget and mood.",
    icon: Wallet,
  },
];

export default function PlacesPage() {
  return (
    <InfoBlogLayout
      currentPath="/places"
      eyebrow="Places, Tips, Tricks"
      title="A practical city guide for deciding where to go before you decide who to book."
      intro="This page is intentionally selective. It is not trying to list everything. It is trying to help a traveler choose a direction, understand a few useful patterns, and avoid the most common planning mistakes early."
      heroImage="/places/ben-thanh.png"
      heroAlt="Places in Vietnam"
      heroCaption="The strongest travel plans usually start with area logic, not attraction overload."
      sidebar={
        <>
          <Card className="rounded-[2rem] border-border/70 bg-card py-0 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Sparkles className="h-5 w-5 text-primary" />
                Best next move
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Once you know the kind of area you want, compare buddy profiles that match that pace and trip style.
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
                <Link href="/how-it-works" className="block rounded-[1.5rem] border border-border/70 bg-secondary/25 p-4 hover:bg-secondary/40">
                  <p className="font-medium text-foreground">How It Works</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    See how public reading turns into trip planning and chat.
                  </p>
                </Link>
                <Link href="/about-us" className="block rounded-[1.5rem] border border-border/70 bg-secondary/25 p-4 hover:bg-secondary/40">
                  <p className="font-medium text-foreground">About Bonddy</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Why the website is structured more like a guide than a simple booking page.
                  </p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </>
      }
    >
      <section className="space-y-4">
        <p className="text-lg leading-8 text-foreground">
          Travelers often search for individual attractions when what they really need is a district
          decision. Area choice shapes transport time, energy, meal quality, and whether the day feels
          coherent or fragmented. That is why this page starts with zones and rhythms instead of a giant checklist.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold text-foreground">Where people usually begin</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {destinationIdeas.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-border/70 bg-secondary/20 p-5"
            >
              <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold text-foreground">Tips and tricks that actually matter</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {tips.map((tip) => {
            const Icon = tip.icon;

            return (
              <div
                key={tip.title}
                className="rounded-[1.5rem] border border-border/70 bg-secondary/20 p-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{tip.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{tip.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold text-foreground">How this helps the booking flow</h2>
        <p className="text-base leading-8 text-muted-foreground">
          Once the traveler understands whether they want central energy, local food density, a calmer district,
          or a slower family-friendly rhythm, it becomes much easier to choose a buddy and write useful notes
          for the trip request. Better reading creates better requests, and better requests create better conversations.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link href="/buddies">Compare buddies</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/trip-request">Create a trip request</Link>
          </Button>
        </div>
      </section>
    </InfoBlogLayout>
  );
}
