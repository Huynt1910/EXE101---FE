import { FieldError } from "@/app/(trip)/trip-request/components/shared";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  TripRequestFormData,
  TripRequestValidationErrors,
} from "@/lib/trip-request";

type MeetingNotesStepProps = {
  formData: TripRequestFormData;
  errors: TripRequestValidationErrors;
  onNotesChange: (value: string) => void;
};

export function MeetingNotesStep({
  formData,
  errors,
  onNotesChange,
}: MeetingNotesStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Meeting and notes
        </p>
        <h3 className="mt-2 text-xl font-semibold sm:text-2xl">
          Add the details that make your trip clear and personal
        </h3>
      </div>

      <Field>
        <FieldLabel htmlFor="trip-notes">Additional notes</FieldLabel>
        <Textarea
          id="trip-notes"
          rows={6}
          placeholder="Tell us what you want to explore, any preferences, or important details for your buddy."
          value={formData.notes}
          onChange={(event) => onNotesChange(event.target.value)}
          className={cn(errors.notes && "border-red-500")}
        />
        <FieldError message={errors.notes} />
      </Field>
    </div>
  );
}
