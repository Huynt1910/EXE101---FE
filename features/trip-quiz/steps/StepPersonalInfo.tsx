"use client";

import { useTripWizard } from "../TripWizardProvider";

export function StepPersonalInfo() {
  const { form } = useTripWizard();
  const { register } = form;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Your name</span>
          <input
            {...register("name")}
            className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Email</span>
          <input
            type="email"
            {...register("email")}
            className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-semibold text-gray-700">
          Notes (optional)
        </span>
        <textarea
          rows={5}
          {...register("notes")}
          className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Tell us anything special you want…"
        />
      </label>
    </div>
  );
}
