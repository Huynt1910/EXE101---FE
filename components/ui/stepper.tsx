"use client";

interface StepperProps {
  step: number;
  setStep: (s: number) => void;
  labels: string[];
}

export function Stepper({ step, setStep, labels }: StepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-4">
        {labels.map((label, i) => {
          const idx = i + 1;
          const isActive = idx === step;
          const isDone = idx < step;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setStep(idx)}
              className="flex-1 group"
            >
              <div className="flex items-center">
                <div
                  className={[
                    "h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold border transition-all",
                    isActive
                      ? "bg-teal-600 text-white border-teal-600"
                      : isDone
                      ? "bg-teal-50 text-teal-700 border-teal-600"
                      : "bg-white text-gray-600 border-gray-300",
                  ].join(" ")}
                >
                  {idx}
                </div>
                <div className="ml-3 text-sm font-medium text-gray-700">
                  {label}
                </div>
              </div>
              {idx < labels.length && (
                <div className="ml-[18px] h-px w-[calc(100%-18px)] mt-3 bg-gray-200 group-last:hidden" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
