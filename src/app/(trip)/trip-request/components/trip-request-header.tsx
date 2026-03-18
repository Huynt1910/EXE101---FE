type TripRequestHeaderProps = {
  step: number;
  totalSteps: number;
  intro: string;
  progressPercent: number;
};

export function TripRequestHeader({
  step,
  totalSteps,
  intro,
  progressPercent,
}: TripRequestHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Step {step} of {totalSteps}
          </p>
          <h2 className="mt-2 text-xl font-semibold sm:text-2xl">{intro}</h2>
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
  );
}
