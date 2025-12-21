"use client";

import {
  TripWizardProvider,
  useTripWizard,
} from "@/features/trip-quiz/TripWizardProvider";
import { Stepper } from "@/components/ui/stepper";
import { StepTripDetails } from "@/features/trip-quiz/steps/StepTripDetails";
import { StepPreferences } from "@/features/trip-quiz/steps/StepPreferences";
import { StepPersonalInfo } from "@/features/trip-quiz/steps/StepPersonalInfo";

function TripWizardContent() {
  const { step, setStep, canNext, nextStep, prevStep, submitForm } =
    useTripWizard();
  const labels = ["Trip Details", "Preferences", "Personal Info"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 3) {
      submitForm();
    } else {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-[url('/banner-homepage.png')] bg-cover bg-center max-h-20">
        <div className="bg-black/35">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-white">
            <h1 className="text-3xl sm:text-5xl font-extrabold">
              Create your trip to Vietnam
            </h1>
            <p className="mt-3 text-white/90 max-w-2xl">
              Answer a few quick questions. We'll tailor your trip and match you
              with locals that fit your style.
            </p>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-10">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white shadow-xl p-4 sm:p-6 lg:p-8"
        >
          <Stepper step={step} setStep={setStep} labels={labels} />

          {/* Step Content */}
          {step === 1 && <StepTripDetails />}
          {step === 2 && <StepPreferences />}
          {step === 3 && <StepPersonalInfo />}

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ‹ Previous
            </button>

            {step < 3 ? (
              <button
                type="submit"
                disabled={!canNext}
                className={[
                  "inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white",
                  canNext ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-300",
                ].join(" ")}
              >
                Next step ›
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canNext}
                className={[
                  "inline-flex items-center rounded-xl px-6 py-3 text-white font-semibold",
                  canNext ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-300",
                ].join(" ")}
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DesignTripQuizPage() {
  return (
    <TripWizardProvider>
      <TripWizardContent />
    </TripWizardProvider>
  );
}
