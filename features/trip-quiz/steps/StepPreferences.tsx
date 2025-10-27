"use client";

import { useTripWizard } from "../TripWizardProvider";
import { CheckboxChip } from "@/components/ui/checkboxChip";
import { TRAVEL_STYLES, INTERESTS } from "@/lib/data/tripQuiz";

export function StepPreferences() {
  const { form } = useTripWizard();
  const { register, watch, setValue } = form;
  const travelStyle = watch("travelStyle");
  const interests = watch("interests");

  const toggleTravelStyle = (style: string) => {
    const newStyles = travelStyle.includes(style)
      ? travelStyle.filter((s) => s !== style)
      : [...travelStyle, style];
    setValue("travelStyle", newStyles);
  };

  const toggleInterest = (interest: string) => {
    const newInterests = interests.includes(interest)
      ? interests.filter((i) => i !== interest)
      : [...interests, interest];
    setValue("interests", newInterests);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-2">
          How many people are traveling?
        </div>
        <input
          type="number"
          min={1}
          max={20}
          {...register("groupSize", { valueAsNumber: true })}
          className="w-full max-w-md rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div>
        <div className="text-sm font-semibold text-gray-700 mb-2">
          Travel style (choose multiple)
        </div>
        <div className="flex flex-wrap gap-2">
          {TRAVEL_STYLES.map((s) => (
            <CheckboxChip
              key={s}
              label={s}
              checked={travelStyle.includes(s)}
              onChange={() => toggleTravelStyle(s)}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold text-gray-700 mb-2">
          Interests (choose multiple)
        </div>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((i) => (
            <CheckboxChip
              key={i}
              label={i}
              checked={interests.includes(i)}
              onChange={() => toggleInterest(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
