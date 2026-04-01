"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Globe,
  LoaderCircle,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useRegisterAsBuddyMutation } from "@/features/buddy/hooks/useBuddy";
import { handleApiError } from "@/lib/error-handler";
import { buildAuthUrl } from "@/lib/callback-url";
import { useAuthStore } from "@/lib/store/authStore";
import { useHydratedStore } from "@/hooks/useHydratedStore";

const ACTIVITY_OPTIONS = [
  "Food",
  "Shopping",
  "Nightlife",
  "Street food",
  "Coffee",
  "History",
  "Museums",
  "Culture",
  "Photography",
  "Walking tour",
  "Hidden gems",
  "Markets",
  "Local transport",
] as const;

const LANGUAGE_OPTIONS = [
  "English",
  "Vietnamese",
  "Japanese",
  "Korean",
  "Chinese",
  "French",
  "German",
  "Spanish",
  "Thai",
] as const;

function normalizeTag(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function isDuplicate(values: string[], candidate: string) {
  const normalizedCandidate = candidate.trim().toLowerCase();
  return values.some(
    (value) => value.trim().toLowerCase() === normalizedCandidate,
  );
}

type MultiSelectFieldProps = {
  label: string;
  helper: string;
  placeholder: string;
  options: readonly string[];
  values: string[];
  onChange: (values: string[]) => void;
};

function MultiSelectField({
  label,
  helper,
  placeholder,
  options,
  values,
  onChange,
}: Readonly<MultiSelectFieldProps>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const normalizedQuery = normalizeTag(query);
  const filteredOptions = useMemo(() => {
    if (!normalizedQuery) return options;

    return options.filter((option) =>
      option.toLowerCase().includes(normalizedQuery.toLowerCase()),
    );
  }, [normalizedQuery, options]);

  const canAddCustom =
    normalizedQuery.length > 0 &&
    !isDuplicate(values, normalizedQuery) &&
    !options.some(
      (option) => option.toLowerCase() === normalizedQuery.toLowerCase(),
    );

  const toggleValue = (value: string) => {
    if (isDuplicate(values, value)) {
      onChange(
        values.filter(
          (item) => item.trim().toLowerCase() !== value.trim().toLowerCase(),
        ),
      );
      return;
    }

    onChange([...values, normalizeTag(value)]);
  };

  const removeValue = (value: string) => {
    onChange(
      values.filter(
        (item) => item.trim().toLowerCase() !== value.trim().toLowerCase(),
      ),
    );
  };

  const addCustomValue = () => {
    if (!canAddCustom) return;
    onChange([...values, normalizedQuery]);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <p className="text-sm text-muted-foreground">{helper}</p>
      </div>

      <div className="rounded-[1.5rem] border border-border/70 bg-secondary/20 p-4">
        <div className="flex min-h-12 flex-wrap gap-2">
          {values.length > 0 ? (
            values.map((value) => (
              <Badge
                key={value}
                variant="secondary"
                className="gap-1 rounded-full px-3 py-1.5 text-sm"
              >
                <span>{value}</span>
                <button
                  type="button"
                  onClick={() => removeValue(value)}
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-foreground/10"
                  aria-label={`Remove ${value}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">{placeholder}</p>
          )}
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="mt-4 w-full justify-between rounded-xl"
            >
              Select {label.toLowerCase()}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent align="start" className="w-[22rem] rounded-2xl p-4">
            <div className="space-y-3">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search or add ${label.toLowerCase()}...`}
              />

              <div className="max-h-64 space-y-2 overflow-y-auto">
                {filteredOptions.map((option) => {
                  const selected = isDuplicate(values, option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleValue(option)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/40 text-foreground hover:bg-secondary"
                      }`}
                    >
                      <span>{option}</span>
                      {selected ? <Check className="h-4 w-4" /> : null}
                    </button>
                  );
                })}

                {filteredOptions.length === 0 && !canAddCustom ? (
                  <p className="rounded-xl bg-secondary/25 px-3 py-3 text-sm text-muted-foreground">
                    No matching option.
                  </p>
                ) : null}

                {canAddCustom ? (
                  <button
                    type="button"
                    onClick={addCustomValue}
                    className="flex w-full items-center justify-between rounded-xl bg-amber-50 px-3 py-2 text-left text-sm text-amber-700 transition-colors hover:bg-amber-100"
                  >
                    <span>Add "{normalizedQuery}"</span>
                    <Sparkles className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default function BuddyApplyPage() {
  const router = useRouter();
  const isHydrated = useHydratedStore();
  const { isAuthenticated } = useAuthStore();
  const registerMutation = useRegisterAsBuddyMutation();

  const [activities, setActivities] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [costPerHour, setCostPerHour] = useState("");
  const [bio, setBio] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const loginHref = useMemo(() => buildAuthUrl("/login", "/buddy/apply"), []);

  const validate = () => {
    const nextErrors: Record<string, string | undefined> = {};

    if (activities.length === 0) {
      nextErrors.activities = "Choose at least one activity.";
    }

    if (languages.length === 0) {
      nextErrors.languages = "Choose at least one language.";
    }

    const parsedCost = Number(costPerHour);
    if (!costPerHour || !Number.isFinite(parsedCost) || parsedCost <= 0) {
      nextErrors.costPerHour = "Hourly rate must be greater than 0.";
    }

    if (!bio.trim()) {
      nextErrors.bio = "Bio is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!isHydrated || !isAuthenticated) {
      router.push(loginHref);
      return;
    }

    if (!validate()) {
      toast.error("Please complete your buddy application.");
      return;
    }

    try {
      const response = await registerMutation.mutateAsync({
        activities,
        costPerHour: Number(costPerHour),
        languages,
        bio: bio.trim(),
      });

      toast.success(response.message ?? "Buddy registered successfully.");
      router.push(`/buddies/${response.data.id}`);
    } catch (error) {
      handleApiError(error, { showTitle: false });
    }
  };

  return (
    <section className="min-h-screen bg-background px-4 pb-16 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,34rem)]">
        <Card className="overflow-hidden rounded-[2.5rem] border-border/70 bg-card py-0 shadow-sm">
          <div className="relative h-full min-h-[24rem]">
            <Image
              src="/buddies-form-bg.png"
              alt="Become a buddy"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-primary/30" />
            <div className="relative z-10 flex h-full flex-col justify-between gap-8 p-8 text-primary-foreground md:p-10">
              <div className="space-y-5">
                <Badge className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-white">
                  Apply to be a buddy
                </Badge>
                <div className="space-y-4">
                  <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
                    Share your city the local way and earn from real traveler
                    experiences.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-primary-foreground/85">
                    Tell us what you know best, the languages you speak, and the
                    kind of trips you enjoy helping with. Once registered, your
                    buddy profile can start appearing to travelers.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                    Activities
                  </div>
                  <p className="mt-2 text-sm text-primary-foreground/80">
                    Curate food walks, shopping, hidden gems, and more.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Globe className="h-4 w-4" />
                    Languages
                  </div>
                  <p className="mt-2 text-sm text-primary-foreground/80">
                    Match with travelers in the languages you can confidently
                    support.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Wallet className="h-4 w-4" />
                    Rate
                  </div>
                  <p className="mt-2 text-sm text-primary-foreground/80">
                    Set your expected hourly price for local guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2.5rem] border-border/70 bg-card py-0 shadow-sm">
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                Buddy registration
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Pick common options from the dropdown, add custom values when
                needed, and submit your public buddy profile.
              </p>
            </div>

            {!isAuthenticated && isHydrated ? (
              <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Sign in is required before submitting the application.
                <div className="mt-3">
                  <Button asChild size="sm" className="rounded-full">
                    <Link href={loginHref}>
                      Log in to apply
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : null}

            <MultiSelectField
              label="Activities"
              helper="Choose the trip styles and experiences you usually guide."
              placeholder="No activity selected yet."
              options={ACTIVITY_OPTIONS}
              values={activities}
              onChange={(nextValues) => {
                setActivities(nextValues);
                setErrors((current) => ({ ...current, activities: undefined }));
              }}
            />
            {errors.activities ? (
              <p className="-mt-3 text-xs text-destructive">
                {errors.activities}
              </p>
            ) : null}

            <MultiSelectField
              label="Languages"
              helper="Select the languages you can comfortably use with travelers."
              placeholder="No language selected yet."
              options={LANGUAGE_OPTIONS}
              values={languages}
              onChange={(nextValues) => {
                setLanguages(nextValues);
                setErrors((current) => ({ ...current, languages: undefined }));
              }}
            />
            {errors.languages ? (
              <p className="-mt-3 text-xs text-destructive">
                {errors.languages}
              </p>
            ) : null}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Cost per hour
              </label>
              <Input
                type="number"
                min="1"
                step="1"
                value={costPerHour}
                onChange={(event) => {
                  setCostPerHour(event.target.value);
                  setErrors((current) => ({
                    ...current,
                    costPerHour: undefined,
                  }));
                }}
                placeholder="10"
              />
              {errors.costPerHour ? (
                <p className="text-xs text-destructive">{errors.costPerHour}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Bio</label>
              <Textarea
                value={bio}
                onChange={(event) => {
                  setBio(event.target.value);
                  setErrors((current) => ({ ...current, bio: undefined }));
                }}
                placeholder="Tell travelers what kind of local support you provide and why exploring with you feels different."
                className="min-h-36"
              />
              {errors.bio ? (
                <p className="text-xs text-destructive">{errors.bio}</p>
              ) : null}
            </div>

            <div className="rounded-[1.5rem] border border-border/70 bg-secondary/25 p-4 text-sm text-muted-foreground">
              Submitted profile data will be sent exactly from your selected and
              custom values for activities and languages.
            </div>

            <Button
              onClick={handleSubmit}
              disabled={registerMutation.isPending}
              className="h-11 w-full rounded-xl"
            >
              {registerMutation.isPending ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <BadgeCheck className="h-4 w-4" />
              )}
              {registerMutation.isPending
                ? "Submitting..."
                : "Apply to be a buddy"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
