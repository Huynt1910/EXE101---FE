import Link from "next/link";
import { CheckCircle2, ChevronRight, ListChecks, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SuccessPageProps = {
  searchParams: Promise<{
    tripId?: string;
  }>;
};

export default async function TripRequestSuccessPage({
  searchParams,
}: Readonly<SuccessPageProps>) {
  const { tripId } = await searchParams;
  const tripDetailHref = tripId ? `/profile/trip/${tripId}` : "/profile?section=trips";

  return (
    <section className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl rounded-[1.75rem] border-border/70 bg-card py-0 shadow-sm">
        <CardHeader className="border-b border-border/70 px-8 py-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <CardTitle className="mt-4 text-3xl font-semibold tracking-tight">
            Trip created successfully
          </CardTitle>
          <CardDescription className="mx-auto max-w-xl text-base leading-7">
            Your trip request is now saved. You can review it later in your profile,
            manage updates, and keep track of all created trips in one place.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-8 py-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-secondary/30 p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ListChecks className="h-4 w-4 text-primary" />
                Next step
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Open your trips list in profile to see everything you created and
                continue managing future plans.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-secondary/30 p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <MapPinned className="h-4 w-4 text-primary" />
                Trip visibility
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Buddies and future booking actions will connect back to this trip
                record, so it is best to keep your details updated.
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t border-border/70 px-8 py-6 sm:flex-row sm:justify-center">
          <Button asChild className="w-full rounded-xl sm:w-auto">
            <Link href="/profile?section=trips">
              Go to My Trips
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full rounded-xl sm:w-auto">
            <Link href={tripDetailHref}>View trip details</Link>
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
