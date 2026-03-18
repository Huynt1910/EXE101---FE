"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TripRequestActions } from "@/app/(trip)/trip-request/components/trip-request-action";
import { TripRequestHeader } from "@/app/(trip)/trip-request/components/trip-request-header";
import { TripRequestTimeline } from "@/app/(trip)/trip-request/components/trip-request-timeline";
import { DestinationTimingStep } from "@/app/(trip)/trip-request/components/step-section/step1";
import { GroupBudgetStep } from "@/app/(trip)/trip-request/components/step-section/step2";
import { MeetingNotesStep } from "@/app/(trip)/trip-request/components/step-section/step3";
import { Card } from "@/components/ui/card";
import { useTripRequestForm } from "@/features/trip/hooks/useTripRequestForm";
import { useTripMutations } from "@/features/trip/hooks/useTripMutation";
import {
  clearTripRequestDraft,
  mapTripDtoToStoredTripRequest,
  mapTripFormDataToCreateTripRequest,
  saveLatestTripRequest,
} from "@/lib/trip-request";
import { TRIP_REQUEST_STEPS } from "./trip-request.config";

export default function TripRequestPage() {
  const router = useRouter();
  const { createTripMutation } = useTripMutations();
  const {
    step,
    draftSaved,
    submitError,
    formData,
    errors,
    currentStep,
    progressPercent,
    selectedDate,
    selectedStartTime,
    selectedEndTime,
    updateField,
    setSubmitError,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    saveDraft,
    validateBeforeSubmit,
    handlePreferredDateChange,
    handlePreferredStartTimeChange,
    handlePreferredEndTimeChange,
  } = useTripRequestForm();

  const handleNext = () => {
    if (goToNextStep()) return;
    toast.error("Please complete the required fields before continuing.");
  };

  const handleSaveDraft = () => {
    saveDraft();
    toast.success("Draft saved locally.");
  };

  const handleSubmit = async () => {
    if (!validateBeforeSubmit()) {
      toast.error("Trip request is incomplete. Please review your details.");
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

  return (
    <section className="booking-section min-h-screen mx-auto my-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-6 xl:gap-8">
        <div className="space-y-6">
          <Card className="booking-banner p-4 sm:p-5 md:p-6">
            <TripRequestHeader
              step={step}
              totalSteps={TRIP_REQUEST_STEPS.length}
              intro={currentStep.intro}
              progressPercent={progressPercent}
            />

            <TripRequestTimeline step={step} onStepChange={goToStep} />

            <div className="mt-8">
              {step === 1 ? (
                <DestinationTimingStep
                  selectedDate={selectedDate}
                  selectedStartTime={selectedStartTime}
                  selectedEndTime={selectedEndTime}
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
                  onGroupSizeChange={(value) => updateField("groupSize", value)}
                  onLanguageChange={(value) =>
                    updateField("preferredLanguage", value)
                  }
                  onBudgetMinChange={(value) => updateField("budgetMin", value)}
                  onBudgetMaxChange={(value) => updateField("budgetMax", value)}
                />
              ) : null}

              {step === 3 ? (
                <MeetingNotesStep
                  formData={formData}
                  errors={errors}
                  onMeetingPointChange={(value) =>
                    updateField("meetingPoint", value)
                  }
                  onNotesChange={(value) => updateField("notes", value)}
                />
              ) : null}
            </div>

            {submitError ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {submitError}
              </div>
            ) : null}

            <TripRequestActions
              step={step}
              totalSteps={TRIP_REQUEST_STEPS.length}
              nextLabel={currentStep.cta}
              draftSaved={draftSaved}
              isSubmitting={createTripMutation.isPending}
              onSave={handleSaveDraft}
              onBack={goToPreviousStep}
              onNext={handleNext}
              onSubmit={() => {
                void handleSubmit();
              }}
            />
          </Card>
        </div>
      </div>
    </section>
  );
}
