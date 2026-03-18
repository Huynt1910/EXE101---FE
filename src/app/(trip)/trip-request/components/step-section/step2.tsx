import { Coins, Globe2, Users } from "lucide-react";
import { FieldError } from "@/app/(trip)/trip-request/components/shared";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  TripRequestFormData,
  TripRequestValidationErrors,
} from "@/lib/trip-request";

type GroupBudgetStepProps = {
  formData: TripRequestFormData;
  errors: TripRequestValidationErrors;
  onGroupSizeChange: (value: number) => void;
  onLanguageChange: (value: string) => void;
  onBudgetMinChange: (value: number) => void;
  onBudgetMaxChange: (value: number) => void;
};

export function GroupBudgetStep({
  formData,
  errors,
  onGroupSizeChange,
  onLanguageChange,
  onBudgetMinChange,
  onBudgetMaxChange,
}: GroupBudgetStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Group and budget
        </p>
        <h3 className="mt-2 text-xl font-semibold sm:text-2xl">
          Tell us who is joining and what budget feels right
        </h3>
      </div>

      <FieldGroup className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="trip-group-size">
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Number of travelers
            </span>
          </FieldLabel>
          <Input
            id="trip-group-size"
            type="number"
            min={1}
            value={formData.groupSize}
            onChange={(event) =>
              onGroupSizeChange(Number(event.target.value) || 0)
            }
            className={cn(errors.groupSize && "border-red-500")}
          />
          <FieldError message={errors.groupSize} />
        </Field>

        <Field>
          <FieldLabel htmlFor="trip-language">
            <span className="inline-flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-primary" />
              Preferred language
            </span>
          </FieldLabel>
          <Input
            id="trip-language"
            placeholder="English, Vietnamese, Korean..."
            value={formData.preferredLanguage}
            onChange={(event) => onLanguageChange(event.target.value)}
            className={cn(errors.preferredLanguage && "border-red-500")}
          />
          <FieldError message={errors.preferredLanguage} />
        </Field>
      </FieldGroup>

      <div className="rounded-3xl border border-border bg-muted/30 p-4 sm:p-5">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Coins className="h-5 w-5 text-primary" />
            Budget range
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the range you are comfortable with for this trip.
          </p>
        </div>

        <FieldGroup className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="trip-budget-min">Minimum budget</FieldLabel>
            <Input
              id="trip-budget-min"
              type="number"
              min={0}
              value={formData.budgetMin}
              onChange={(event) =>
                onBudgetMinChange(Number(event.target.value) || 0)
              }
              className={cn(errors.budgetMin && "border-red-500")}
            />
            <FieldError message={errors.budgetMin} />
          </Field>

          <Field>
            <FieldLabel htmlFor="trip-budget-max">Maximum budget</FieldLabel>
            <Input
              id="trip-budget-max"
              type="number"
              min={0}
              value={formData.budgetMax}
              onChange={(event) =>
                onBudgetMaxChange(Number(event.target.value) || 0)
              }
              className={cn(errors.budgetMax && "border-red-500")}
            />
            <FieldError message={errors.budgetMax} />
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
}
