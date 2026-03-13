"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { toast } from "sonner";
import {
  Camera,
  CheckCircle2,
  MapPin,
  MoonStar,
  MoveLeft,
  MoveRight,
  Save,
  ShoppingBag,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";
import { Timeline } from "@/components/common/timeline";
import {
  MatchingTipsCard,
  PopularDistrictsCard,
  TripPreviewCard,
  TrustSignalsCard,
  WhatHappensNextCard,
} from "@/app/(booking)/trip-request/components/sidebar";
import {
  DestinationTimingStep,
  GroupBudgetStep,
  type LocationOption,
  MeetingNotesStep,
  ReviewStep,
} from "@/app/(booking)/trip-request/components/step-sections";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTrip } from "@/features/trip/hooks/useTrip";
import {
  clearTripRequestDraft,
  defaultTripRequestFormData,
  getTripRequestDraft,
  mapTripDtoToStoredTripRequest,
  mapTripFormDataToCreateTripRequest,
  saveLatestTripRequest,
  saveTripRequestDraft,
  type TripRequestFormData,
  type TripRequestValidationErrors,
  validateTripRequest,
} from "@/lib/trip-request";

const STEP_CONFIG = [
  {
    label: "Where & when",
    subtitle: "Destination and timing",
    intro: "Let's start with the basics",
    cta: "Continue to group & budget",
  },
  {
    label: "Group & budget",
    subtitle: "Who is joining and spending",
    intro: "Make the match more accurate",
    cta: "Continue to meeting details",
  },
  {
    label: "Meeting & notes",
    subtitle: "Practical details and interests",
    intro: "Add context for a better match",
    cta: "Review your trip",
  },
  {
    label: "Review",
    subtitle: "Confirm your details",
    intro: "One last check before you create",
    cta: "Create my trip",
  },
] as const;

const STEP_FIELDS: Array<Array<keyof TripRequestFormData>> = [
  ["city", "startTime"],
  ["groupSize", "preferredLanguage", "budgetMin", "budgetMax"],
  ["meetingPoint", "notes"],
  [],
];

const GROUP_OPTIONS = [
  { label: "Solo", value: 1 },
  { label: "2 people", value: 2 },
  { label: "3-5 people", value: 4 },
  { label: "6+", value: 6 },
];

const LANGUAGE_OPTIONS = ["English", "Vietnamese", "Korean", "Japanese"];
const LOCATION_OPTIONS: LocationOption[] = [
  {
    city: "Ha Noi",
    district: "Ba Dinh District",
    value: "Ba Dinh District, Ha Noi",
  },
  {
    city: "Ha Noi",
    district: "Hoan Kiem District",
    value: "Hoan Kiem District, Ha Noi",
  },
  {
    city: "Ha Noi",
    district: "Tay Ho District",
    value: "Tay Ho District, Ha Noi",
  },
  {
    city: "Ha Noi",
    district: "Dong Da District",
    value: "Dong Da District, Ha Noi",
  },
  {
    city: "Ha Noi",
    district: "Cau Giay District",
    value: "Cau Giay District, Ha Noi",
  },
  {
    city: "Ho Chi Minh City",
    district: "District 1",
    value: "District 1, Ho Chi Minh City",
  },
  {
    city: "Ho Chi Minh City",
    district: "District 3",
    value: "District 3, Ho Chi Minh City",
  },
  {
    city: "Ho Chi Minh City",
    district: "District 4",
    value: "District 4, Ho Chi Minh City",
  },
  {
    city: "Ho Chi Minh City",
    district: "Binh Thanh District",
    value: "Binh Thanh District, Ho Chi Minh City",
  },
  {
    city: "Ho Chi Minh City",
    district: "Thu Duc City",
    value: "Thu Duc City, Ho Chi Minh City",
  },
];
const NOTE_SUGGESTIONS = [
  { label: "Food", icon: Utensils },
  { label: "Local culture", icon: Sparkles },
  { label: "Shopping", icon: ShoppingBag },
  { label: "Photography", icon: Camera },
  { label: "Nightlife", icon: MoonStar },
  { label: "Family-friendly", icon: Users },
];

function getStartDatePart(value: string) {
  if (!value || !value.includes("T")) return "";
  return value.split("T")[0] ?? "";
}

export default function TripRequestPage() {
  const router = useRouter();
  const { createTripMutation } = useTrip();
  const [step, setStep] = useState(1);
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TripRequestFormData>(
    defaultTripRequestFormData,
  );
  const [errors, setErrors] = useState<TripRequestValidationErrors>({});

  useEffect(() => {
    const draft = getTripRequestDraft();
    if (!draft) return;

    setFormData({
      ...defaultTripRequestFormData,
      ...draft,
    });
  }, []);

  const updateField = <K extends keyof TripRequestFormData>(
    key: K,
    value: TripRequestFormData[K],
  ) => {
    setDraftSaved(false);
    setSubmitError(null);
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validation = useMemo(() => validateTripRequest(formData), [formData]);
  const currentStep = STEP_CONFIG[step - 1];
  const progressPercent = (step / STEP_CONFIG.length) * 100;
  const selectedDate = getStartDatePart(formData.startTime);
  const selectedStartTime = useMemo(() => {
    if (!formData.startTime) return null;
    return dayjs(formData.startTime);
  }, [formData.startTime]);
  const selectedEndTime = useMemo(() => {
    if (!formData.startTime) return null;
    return dayjs(formData.startTime).add(
      formData.durationMinutes || 180,
      "minute",
    );
  }, [formData.durationMinutes, formData.startTime]);

  const syncStartTime = (datePart: string, nextStart: Dayjs | null) => {
    if (!datePart || !nextStart) {
      updateField("startTime", "");
      return;
    }

    const combined = dayjs(datePart)
      .hour(nextStart.hour())
      .minute(nextStart.minute())
      .second(0)
      .millisecond(0);

    updateField("startTime", combined.format("YYYY-MM-DDTHH:mm"));
  };

  const syncDuration = (start: Dayjs | null, end: Dayjs | null) => {
    if (!start || !end) return;
    const diff = end.diff(start, "minute");
    if (diff > 0) {
      updateField("durationMinutes", diff);
    }
  };

  const effectiveEndTime = useMemo(() => {
    if (!selectedStartTime || !selectedEndTime) return selectedEndTime;
    if (selectedEndTime.isAfter(selectedStartTime)) return selectedEndTime;
    return selectedStartTime.add(60, "minute");
  }, [formData.durationMinutes, formData.startTime]);

  const validateStep = (stepToValidate: number) => {
    const nextErrors = validateTripRequest(formData);
    const stepFields = STEP_FIELDS[stepToValidate - 1] ?? [];
    const stepErrors = Object.fromEntries(
      stepFields
        .filter((field) => nextErrors[field])
        .map((field) => [field, nextErrors[field]]),
    ) as TripRequestValidationErrors;

    setErrors((prev) => ({ ...prev, ...stepErrors }));

    return Object.keys(stepErrors).length === 0;
  };

  const handleStepChange = (nextStep: number) => {
    if (nextStep <= step) {
      setStep(nextStep);
      return;
    }

    let current = step;
    while (current < nextStep) {
      if (!validateStep(current)) return;
      current += 1;
    }

    setStep(nextStep);
  };

  const stepTimelineItems = useMemo(
    () =>
      STEP_CONFIG.map((item, index) => {
        const idx = index + 1;

        return {
          id: item.label,
          title: item.label,
          meta: item.subtitle,
          icon:
            idx === 1
              ? MapPin
              : idx === 2
                ? Users
                : idx === 3
                  ? Sparkles
                  : CheckCircle2,
          status:
            idx < step
              ? ("completed" as const)
              : idx === step
                ? ("current" as const)
                : ("upcoming" as const),
          onClick: () => handleStepChange(idx),
          clickable: true,
        };
      }),
    [step],
  );

  const matchingEstimate = useMemo(() => {
    if (!formData.city.trim()) return null;

    let min = 4;
    let max = 7;

    if (
      ["ho chi minh city", "hanoi", "da nang", "hoi an"].includes(
        formData.city.trim().toLowerCase(),
      )
    ) {
      min += 4;
      max += 5;
    }

    if (formData.preferredLanguage.trim()) {
      min += 1;
      max += 2;
    }

    return `${min}-${max} matching buddies`;
  }, [formData.city, formData.preferredLanguage]);

  const handleNext = () => {
    if (!validateStep(step)) {
      toast.error("Please complete the required fields before continuing.");
      return;
    }
    setStep((prev) => Math.min(prev + 1, STEP_CONFIG.length));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSaveDraft = () => {
    saveTripRequestDraft(formData);
    setDraftSaved(true);
    toast.success("Draft saved locally.");
  };

  const handleSubmit = async () => {
    const nextErrors = validateTripRequest(formData);
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Trip request is incomplete. Please review your details.");
      const firstInvalidStep = STEP_FIELDS.findIndex((fields) =>
        fields.some((field) => nextErrors[field]),
      );
      if (firstInvalidStep >= 0) {
        setStep(firstInvalidStep + 1);
      }
      return;
    }

    try {
      const toastId = toast.loading("Creating your trip request...");
      const response = await createTripMutation.mutateAsync(
        mapTripFormDataToCreateTripRequest(formData),
      );

      const request = mapTripDtoToStoredTripRequest(response.data, formData);
      saveLatestTripRequest(request);
      clearTripRequestDraft();
      toast.success("Trip created successfully.", { id: toastId });
      router.push(`/trip-request/success?id=${request.id}`);
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "Unable to create trip right now.";
      setSubmitError(message);
      toast.error(message);
    }
  };

  const addInterestToNotes = (interest: string) => {
    const trimmedNotes = formData.notes.trim();
    const nextNotes = trimmedNotes
      ? trimmedNotes.toLowerCase().includes(interest.toLowerCase())
        ? trimmedNotes
        : `${trimmedNotes}${trimmedNotes.endsWith(".") ? "" : "."} Interested in ${interest.toLowerCase()}.`
      : `Interested in ${interest.toLowerCase()}.`;

    updateField("notes", nextNotes);
  };

  const handlePreferredDateChange = (date: Dayjs | null) => {
    if (!date) {
      updateField("startTime", "");
      return;
    }

    const nextStart = selectedStartTime ?? dayjs().hour(10).minute(0);
    syncStartTime(date.format("YYYY-MM-DD"), nextStart);
  };

  const handlePreferredStartTimeChange = (time: Dayjs | null) => {
    const activeDate = selectedDate || dayjs().format("YYYY-MM-DD");
    syncStartTime(activeDate, time);
    syncDuration(time, effectiveEndTime);
  };

  const handlePreferredEndTimeChange = (time: Dayjs | null) => {
    syncDuration(selectedStartTime, time);
  };

  const nextCta =
    step < STEP_CONFIG.length ? currentStep.cta : "Create my trip";

  return (
    <main className="booking-page">
      <section className="booking-section">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] xl:gap-8">
          <div className="space-y-6">
            <Card className="booking-banner p-4 sm:p-5 md:p-6">
              <div className="mb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      Step {step} of {STEP_CONFIG.length}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
                      {currentStep.intro}
                    </h2>
                  </div>
                  <div className="w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {Math.round(progressPercent)}%
                  </div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <Timeline items={stepTimelineItems} />

              <div className="mt-8">
                {step === 1 ? (
                  <DestinationTimingStep
                    locations={LOCATION_OPTIONS}
                    selectedDate={selectedDate}
                    selectedStartTime={selectedStartTime}
                    selectedEndTime={effectiveEndTime}
                    formData={formData}
                    errors={errors}
                    onCityChange={(city) => updateField("city", city)}
                    onPreferredDateChange={handlePreferredDateChange}
                    onPreferredStartTimeChange={handlePreferredStartTimeChange}
                    onPreferredEndTimeChange={handlePreferredEndTimeChange}
                  />
                ) : null}

                {step === 2 ? (
                  <GroupBudgetStep
                    formData={formData}
                    errors={errors}
                    groupOptions={GROUP_OPTIONS}
                    languageOptions={LANGUAGE_OPTIONS}
                    onGroupSizeChange={(value) =>
                      updateField("groupSize", value)
                    }
                    onLanguageChange={(value) =>
                      updateField("preferredLanguage", value)
                    }
                    onBudgetMinChange={(value) =>
                      updateField("budgetMin", value)
                    }
                    onBudgetMaxChange={(value) =>
                      updateField("budgetMax", value)
                    }
                  />
                ) : null}

                {step === 3 ? (
                  <MeetingNotesStep
                    formData={formData}
                    errors={errors}
                    noteSuggestions={NOTE_SUGGESTIONS}
                    onMeetingPointChange={(value) =>
                      updateField("meetingPoint", value)
                    }
                    onNotesChange={(value) => updateField("notes", value)}
                    onAddInterestToNotes={addInterestToNotes}
                  />
                ) : null}

                {step === 4 ? (
                  <ReviewStep
                    formData={formData}
                    hasValidationErrors={Object.keys(validation).length > 0}
                  />
                ) : null}
              </div>

              <div className="flex flex-col gap-3 border-t sm:justify-between xl:flex-row xl:items-center">
                {submitError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {submitError}
                  </div>
                ) : null}
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:justify-between xl:flex-row xl:items-center">
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full px-6"
                    onClick={handleSaveDraft}
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  {draftSaved ? (
                    <span className="text-sm text-muted-foreground">
                      Draft saved locally.
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full px-6"
                      onClick={handleBack}
                    >
                      <MoveLeft className="h-4 w-4" />
                      Back
                    </Button>
                  ) : null}

                  {step < STEP_CONFIG.length ? (
                    <Button
                      type="button"
                      className="rounded-full px-6"
                      onClick={handleNext}
                    >
                      {nextCta}
                      <MoveRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="rounded-full px-6"
                      onClick={() => void handleSubmit()}
                      disabled={createTripMutation.isPending}
                    >
                      {createTripMutation.isPending
                        ? "Creating trip..."
                        : "Create my trip"}
                      <MoveRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            <PopularDistrictsCard
              districts={LOCATION_OPTIONS.map((item) => item.value)}
              onSelectDistrict={(district) => updateField("city", district)}
            />
          </div>

          <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <TripPreviewCard
              formData={formData}
              matchingEstimate={matchingEstimate}
            />
            <MatchingTipsCard />
            <TrustSignalsCard />
          </div>
        </div>
      </section>
    </main>
  );
}
