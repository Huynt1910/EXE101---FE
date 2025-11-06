"use client";

import { useTripWizard } from "../TripWizardProvider";
import { RadioItem } from "@/components/ui/radioItem";
import { BUDGET_OPTIONS } from "@/lib/data/tripQuiz";
export function StepTripDetails() {
  const { form } = useTripWizard();
  const { register, watch, setValue } = form;
  const tripType = watch("tripType");

  return (
    <div className="space-y-8">
      {/* <div>
        <div className="text-sm font-semibold text-gray-700 mb-2">
          Where would you like to go?
        </div>
        <select
          {...register("destination")}
          className="w-full max-w-md rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="" disabled>
            Select destination
          </option>
          {DESTINATIONS.map((d) => (
            <option key={d.name} value={d.name}>
              {d.name} ({d.region})
            </option>
          ))}
        </select>
      </div> */}

      <div>
        <div className="text-sm font-semibold text-gray-700 mb-2">Budget</div>
        <select
          {...register("budget")}
          className="w-full max-w-md rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
        >
          {BUDGET_OPTIONS.map((b) => (
            <option key={b.key} value={b.key}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="text-sm font-semibold text-gray-700 mb-2">
          What type of trip are you planning?
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RadioItem
            name="tripType"
            value="short"
            label="Short Trip (Hours)"
            checked={tripType === "short"}
            onChange={(v) => setValue("tripType", v as "short" | "long")}
          />
          <RadioItem
            name="tripType"
            value="long"
            label="Long Trip (Days)"
            checked={tripType === "long"}
            onChange={(v) => setValue("tripType", v as "short" | "long")}
          />
        </div>
      </div>

      {/* Short Trip Fields */}
      {tripType === "short" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">
              Start Date & Time
            </span>
            <input
              type="datetime-local"
              {...register("startDate")}
              className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">
              Duration (hours)
            </span>
            <select
              {...register("duration")}
              className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="" disabled>
                Select duration
              </option>
              <option value="2">2 hours</option>
              <option value="4">4 hours</option>
              <option value="6">6 hours</option>
              <option value="8">8 hours</option>
              <option value="12">12 hours</option>
            </select>
          </label>
        </div>
      )}

      {/* Long Trip Fields */}
      {tripType === "long" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">
              Start Date
            </span>
            <input
              type="date"
              {...register("startDateLong")}
              className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">
              End Date
            </span>
            <input
              type="date"
              {...register("endDateLong")}
              className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
            />
          </label>
        </div>
      )}
    </div>
  );
}
