"use client";

import { useMemo } from "react";
import { Timeline } from "@/components/common/timeline";
import {
  TRIP_REQUEST_COMPLETED_ICON,
  TRIP_REQUEST_STEPS,
} from "@/app/(trip)/trip-request/trip-request.config";

type TripRequestTimelineProps = {
  step: number;
  onStepChange: (nextStep: number) => void;
};

export function TripRequestTimeline({
  step,
  onStepChange,
}: TripRequestTimelineProps) {
  const items = useMemo(
    () =>
      TRIP_REQUEST_STEPS.map((item, index) => {
        const idx = index + 1;

        return {
          id: item.label,
          title: item.label,
          meta: item.subtitle,
          icon: idx < step ? TRIP_REQUEST_COMPLETED_ICON : item.icon,
          status:
            idx < step
              ? ("completed" as const)
              : idx === step
                ? ("current" as const)
                : ("upcoming" as const),
          onClick: () => onStepChange(idx),
          clickable: true,
        };
      }),
    [step, onStepChange],
  );

  return <Timeline items={items} />;
}
