"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Sparkles, Users } from "lucide-react";
import { FieldError } from "@/app/(trip)/trip-request/components/shared";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  TRIP_REQUEST_ACTIVITY_OPTIONS,
  TRIP_REQUEST_LANGUAGE_OPTIONS,
} from "@/lib/data/trip-request";
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
  onActivitiesChange: (value: string[]) => void;
  onPreferredLanguagesChange: (value: string[]) => void;
};

function normalizeTag(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function includesValue(values: string[], candidate: string) {
  const normalizedCandidate = candidate.trim().toLowerCase();
  return values.some(
    (value) => value.trim().toLowerCase() === normalizedCandidate,
  );
}

type MultiSelectFieldProps = {
  id: string;
  label: string;
  helper: string;
  placeholder: string;
  options: readonly string[];
  values: string[];
  error?: string;
  onChange: (values: string[]) => void;
};

function MultiSelectField({
  id,
  label,
  helper,
  placeholder,
  options,
  values,
  error,
  onChange,
}: Readonly<MultiSelectFieldProps>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const normalizedQuery = normalizeTag(query);
  const filteredOptions = useMemo(() => {
    if (!normalizedQuery) return options;

    return options.filter((option) =>
      option.toLowerCase().includes(normalizedQuery.toLowerCase()),
    );
  }, [normalizedQuery, options]);

  const canAddCustom =
    normalizedQuery.length > 0 &&
    !includesValue(values, normalizedQuery) &&
    !options.some(
      (option) => option.toLowerCase() === normalizedQuery.toLowerCase(),
    );

  const toggleValue = (value: string) => {
    if (includesValue(values, value)) {
      onChange(
        values.filter(
          (item) => item.trim().toLowerCase() !== value.trim().toLowerCase(),
        ),
      );
      return;
    }

    onChange([...values, normalizeTag(value)]);
  };

  const addCustomValue = () => {
    if (!canAddCustom) return;
    onChange([...values, normalizedQuery]);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="rounded-3xl border border-border bg-muted/30 p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{label}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{helper}</p>
      </div>

      <div className="mb-4 flex min-h-12 flex-wrap gap-2 rounded-2xl border border-border bg-background p-3">
        {values.length > 0 ? (
          values.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => toggleValue(value)}
              className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition hover:bg-primary/15"
            >
              {value}
            </button>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">{placeholder}</p>
        )}
      </div>

      <Field>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={id}
              className={cn(
                "w-full justify-between bg-background",
                error && "border-red-500",
              )}
            >
              Select {label.toLowerCase()}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[24rem] rounded-2xl p-4">
            <div className="space-y-3">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search or add ${label.toLowerCase()}...`}
              />

              <div className="max-h-64 space-y-2 overflow-y-auto">
                {filteredOptions.map((option) => {
                  const selected = includesValue(values, option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleValue(option)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/40 text-foreground hover:bg-secondary",
                      )}
                    >
                      <span>{option}</span>
                      {selected ? <Check className="h-4 w-4" /> : null}
                    </button>
                  );
                })}

                {filteredOptions.length === 0 && !canAddCustom ? (
                  <p className="rounded-xl bg-secondary/25 px-3 py-3 text-sm text-muted-foreground">
                    No matching option.
                  </p>
                ) : null}

                {canAddCustom ? (
                  <button
                    type="button"
                    onClick={addCustomValue}
                    className="flex w-full items-center justify-between rounded-xl bg-amber-50 px-3 py-2 text-left text-sm text-amber-700 transition-colors hover:bg-amber-100"
                  >
                    <span>Add "{normalizedQuery}"</span>
                    <Sparkles className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <FieldError message={error} />
      </Field>
    </div>
  );
}

export function GroupBudgetStep({
  formData,
  errors,
  onAdultsChange,
  onChildrenChange,
  onActivitiesChange,
  onPreferredLanguagesChange,
}: GroupBudgetStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Travelers and interests
        </p>
        <h3 className="mt-2 text-xl font-semibold sm:text-2xl">
          Tell us who is joining, what you want to do, and which languages fit
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

      <MultiSelectField
        id="trip-activities"
        label="Activities"
        helper="Pick the experiences you want the buddy to optimize for."
        placeholder="No activity selected yet."
        options={TRIP_REQUEST_ACTIVITY_OPTIONS}
        values={formData.activities}
        error={errors.activities}
        onChange={onActivitiesChange}
      />

      <MultiSelectField
        id="trip-preferred-languages"
        label="Preferred languages"
        helper="Choose the languages you want to use comfortably during the trip."
        placeholder="No language selected yet."
        options={TRIP_REQUEST_LANGUAGE_OPTIONS}
        values={formData.preferredLanguages}
        error={errors.preferredLanguages}
        onChange={onPreferredLanguagesChange}
      />
    </div>
  );
}
