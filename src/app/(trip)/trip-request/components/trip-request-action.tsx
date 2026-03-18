"use client";

import { MoveLeft, MoveRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

type TripRequestActionsProps = {
  step: number;
  totalSteps: number;
  nextLabel: string;
  draftSaved: boolean;
  isSubmitting: boolean;
  onSave: () => void;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

export function TripRequestActions({
  step,
  totalSteps,
  nextLabel,
  draftSaved,
  isSubmitting,
  onSave,
  onBack,
  onNext,
  onSubmit,
}: TripRequestActionsProps) {
  return (
    <div className="mt-4 flex flex-col gap-3 sm:justify-between xl:flex-row xl:items-center">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        <Button
          type="button"
          variant="outline"
          className="rounded-full px-6"
          onClick={onSave}
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
            onClick={onBack}
          >
            <MoveLeft className="h-4 w-4" />
            Back
          </Button>
        ) : null}

        {step < totalSteps ? (
          <Button type="button" className="rounded-full px-6" onClick={onNext}>
            {nextLabel}
            <MoveRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            className="rounded-full px-6"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating trip..." : "Create my trip"}
            <MoveRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
