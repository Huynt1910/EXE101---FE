import Link from "next/link";
import {
  ArrowRight,
  BadgeHelp,
  CalendarClock,
  MessageCircle,
  Search,
  ShieldCheck,
  UserRoundSearch,
} from "lucide-react";
import InfoBlogLayout from "@/components/info/InfoBlogLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    title: "Start with public browsing",
    body: "Use the place guide and buddy list to understand options before you try to lock anything in.",
    icon: Search,
  },
  {
    title: "Open a buddy profile",
    body: "Check reviews, languages, pricing, and the kind of trip support that person tends to offer.",
    icon: UserRoundSearch,
  },
  {
    title: "Prepare the request",
    body: "Choose area, date, time, and traveler notes so the request is detailed enough to be useful.",
    icon: CalendarClock,
  },
  {
    title: "Use chat to refine details",
    body: "Chat is where expectations are aligned before the traveler decides whether to proceed further.",
    icon: MessageCircle,
  },
];

const faqs = [
  {
    question: "Do I need an account to read the site?",
    answer:
      "No. Public content and buddy profiles can be explored first. Account-only actions come later in the flow.",
  },
  {
    question: "Why not go directly to booking?",
    answer:
      "Because travel quality improves when the traveler understands the area and the buddy before they commit.",
  },
  {
    question: "What is the role of chat?",
    answer:
      "Chat is the place to clarify what is included, what kind of pace is realistic, and whether both sides are aligned.",
  },
];

export default function HowItWorksPage() {
  return (
    <InfoBlogLayout
      currentPath="/how-it-works"
      eyebrow="How It Works"
      title="Use Bonddy like an information-first product, then turn that context into a real trip plan."
      intro="This page explains the practical sequence of the website. It is not meant as marketing copy. It is a direct guide to how a traveler can move from reading, to comparing, to planning, to clearer communication."
      heroImage="/buddies-form-bg.png"
      heroAlt="How Bonddy works"
      heroCaption="The intended flow is browse, compare, plan, then refine in chat."
      sidebar={
        <>
          <Card className="rounded-[2rem] border-border/70 bg-card py-0 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Core idea
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Bonddy works best when the traveler reads first, chooses second, and only then moves into a booking-oriented flow.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full rounded-full">
                  <Link href="/buddies">
                    Browse buddies
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full rounded-full">
                  <Link href="/trip-request">Create a trip request</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-border/70 bg-card py-0 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-lg font-semibold text-foreground">Read next</h2>
              <div className="space-y-3">
                <Link href="/places" className="block rounded-[1.5rem] border border-border/70 bg-secondary/25 p-4 hover:bg-secondary/40">
                  <p className="font-medium text-foreground">Places & Tips</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Better area decisions before you compare buddy profiles.
                  </p>
                </Link>
                <Link href="/about-us" className="block rounded-[1.5rem] border border-border/70 bg-secondary/25 p-4 hover:bg-secondary/40">
                  <p className="font-medium text-foreground">About Bonddy</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Why the product is structured around context, not just conversion.
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
          The easiest way to misuse Bonddy is to treat it like a shortcut booking engine and skip the
          reading stage. The product becomes stronger when the traveler spends a little time understanding
          place fit, profile fit, and timing before pushing into actions that depend on those decisions.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold text-foreground">The intended sequence</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-[1.5rem] border border-border/70 bg-secondary/20 p-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold text-foreground">Where confusion usually happens</h2>
        <p className="text-base leading-8 text-muted-foreground">
          Most hesitation appears in the middle of the flow. Travelers may know they want local support,
          but still be unsure which district is best, whether a certain hourly rate makes sense, or what to
          write in trip notes. The site should answer enough of those questions before the traveler needs to ask.
        </p>
        <div className="rounded-[1.75rem] border border-border/70 bg-secondary/20 p-6">
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Product principle</p>
          <p className="mt-3 text-base leading-7 text-foreground">
            Public information reduces friction. Chat should solve nuance, not basic orientation.
          </p>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center gap-2 text-2xl font-semibold text-foreground">
          <BadgeHelp className="h-5 w-5 text-primary" />
          Common questions
        </div>
        <div className="space-y-4">
          {faqs.map((item) => (
            <div
              key={item.question}
              className="rounded-[1.5rem] border border-border/70 bg-secondary/20 p-5"
            >
              <h3 className="text-base font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </InfoBlogLayout>
  );
}
