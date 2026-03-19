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
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
  onLanguageChange: (value: string) => void;
};

export function GroupBudgetStep({
  formData,
  errors,
  onAdultsChange,
  onChildrenChange,
  onLanguageChange,
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
          <FieldLabel htmlFor="trip-adults">
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Adults
            </span>
          </FieldLabel>
          <Input
            id="trip-adults"
            type="number"
            min={1}
            value={formData.adults}
            onChange={(event) =>
              onAdultsChange(Number(event.target.value) || 0)
            }
            className={cn(errors.adults && "border-red-500")}
          />
          <FieldError message={errors.adults} />
        </Field>

        <Field>
          <FieldLabel htmlFor="trip-children">
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Children
            </span>
          </FieldLabel>
          <Input
            id="trip-children"
            type="number"
            min={0}
            value={formData.children}
            onChange={(event) =>
              onChildrenChange(Number(event.target.value) || 0)
            }
            className={cn(errors.children && "border-red-500")}
          />
          <FieldError message={errors.children} />
        </Field>
      </FieldGroup>

      <div className="rounded-3xl border border-border bg-muted/30 p-4 sm:p-5">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Coins className="h-5 w-5 text-primary" />
            Language preference
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add one or more preferred languages, separated by commas.
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="trip-language">
            <span className="inline-flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-primary" />
              Preferred languages
            </span>
          </FieldLabel>
          <Input
            id="trip-language"
            placeholder="English, Vietnamese, Korean"
            value={formData.preferredLanguage}
            onChange={(event) => onLanguageChange(event.target.value)}
            className={cn(errors.preferredLanguage && "border-red-500")}
          />
          <FieldError message={errors.preferredLanguage} />
        </Field>
      </div>
    </div>
  );
}
