"use client";

import * as React from "react";
import dayjs, { type Dayjs } from "dayjs";
import { format } from "date-fns";
import { Check, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type {
  TripRequestFormData,
  TripRequestValidationErrors,
} from "@/lib/trip-request";
import {
  TRIP_REQUEST_DURATION_OPTIONS,
  TRIP_REQUEST_LOCATION_GROUPS,
} from "@/lib/data/trip-request";

type DestinationTimingStepProps = {
  selectedDate: string;
  selectedStartTime: Dayjs | null;
  formData: TripRequestFormData;
  errors: TripRequestValidationErrors;
  onCityChange: (city: string) => void;
  onPreferredDateChange: (date: Dayjs | null) => void;
  onPreferredStartTimeChange: (time: Dayjs | null) => void;
  onDurationHoursChange: (durationHours: number) => void;
};

function formatTimeValue(value: Dayjs | null) {
  if (!value) return "";
  return value.format("HH:mm");
}

function parseTimeToDayjs(timeValue: string, baseDate?: Dayjs | null) {
  if (!timeValue) return null;

  const [hours, minutes] = timeValue.split(":").map(Number);
  const source = baseDate ?? dayjs();

  return source
    .hour(hours || 0)
    .minute(minutes || 0)
    .second(0)
    .millisecond(0);
}

export function DestinationTimingStep({
  selectedDate,
  selectedStartTime,
  formData,
  errors,
  onCityChange,
  onPreferredDateChange,
  onPreferredStartTimeChange,
  onDurationHoursChange,
}: DestinationTimingStepProps) {
  const [dateOpen, setDateOpen] = React.useState(false);
  const [locationOpen, setLocationOpen] = React.useState(false);
  const [durationOpen, setDurationOpen] = React.useState(false);
  const [locationQuery, setLocationQuery] = React.useState("");
  const selectedDateObject = selectedDate ? new Date(selectedDate) : undefined;
  const normalizedLocationQuery = locationQuery.trim().toLowerCase();
  const unifiedFieldClass =
    "border-input bg-background text-foreground hover:bg-primary ";

  const filteredLocationGroups = React.useMemo(() => {
    if (!normalizedLocationQuery) {
      return TRIP_REQUEST_LOCATION_GROUPS;
    }

    return TRIP_REQUEST_LOCATION_GROUPS.map((group) => {
      const districtMatches = group.district
        .toLowerCase()
        .includes(normalizedLocationQuery);

      return {
        district: group.district,
        wards: districtMatches
          ? [...group.wards]
          : group.wards.filter((ward) =>
              ward.toLowerCase().includes(normalizedLocationQuery),
            ),
      };
    }).filter((group) => group.wards.length > 0);
  }, [normalizedLocationQuery]);

  return (
    <div className="space-y-6">
      <Field>
        <FieldLabel htmlFor="trip-city">Location</FieldLabel>
        <Popover open={locationOpen} onOpenChange={setLocationOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="trip-city"
              className={`w-full justify-between font-normal ${unifiedFieldClass}`}
            >
              <span className="truncate text-left">
                {formData.city || "Choose district or ward"}
              </span>
              <ChevronDownIcon className="h-4 w-4 opacity-70" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            className="w-[min(32rem,calc(100vw-2rem))] bg-popover p-0 text-popover-foreground"
          >
            <div className="border-b border-border p-3">
              <Input
                value={locationQuery}
                onChange={(event) => setLocationQuery(event.target.value)}
                placeholder="Search district or ward"
                className="bg-background"
              />
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {filteredLocationGroups.length > 0 ? (
                filteredLocationGroups.map((group) => (
                  <div key={group.district} className="mb-3 last:mb-0">
                    <div className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {group.district}
                    </div>
                    <div className="space-y-1">
                      {group.wards.map((ward) => {
                        const value = `${ward}, ${group.district}`;
                        const selected = formData.city === value;

                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => {
                              onCityChange(value);
                              setLocationQuery("");
                              setLocationOpen(false);
                            }}
                            className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                              selected
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-accent hover:text-accent-foreground"
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="font-medium text-inherit">
                                {ward}
                              </div>
                              {/* <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {group.district}
                              </div> */}
                            </div>
                            {selected ? (
                              <Check className="h-4 w-4 shrink-0 text-current" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p className="px-3 py-4 text-sm text-muted-foreground">
                  No matching location found.
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>
        {errors.city ? (
          <p className="mt-1 text-sm text-destructive">{errors.city}</p>
        ) : null}
      </Field>

      <FieldGroup className="grid gap-4 md:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="trip-date">Date</FieldLabel>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="trip-date"
                className={`w-full justify-between font-normal ${unifiedFieldClass}`}
              >
                {selectedDateObject
                  ? format(selectedDateObject, "PPP")
                  : "Select date"}
                <ChevronDownIcon className="h-4 w-4 opacity-70" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={selectedDateObject}
                captionLayout="dropdown"
                defaultMonth={selectedDateObject}
                onSelect={(date) => {
                  onPreferredDateChange(date ? dayjs(date) : null);
                  setDateOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>

          {errors.startTime ? (
            <p className="mt-1 text-sm text-destructive">{errors.startTime}</p>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="trip-start-time">Start time</FieldLabel>
          <Input
            id="trip-start-time"
            type="time"
            step="60"
            value={formatTimeValue(selectedStartTime)}
            onChange={(event) => {
              const nextValue = parseTimeToDayjs(
                event.target.value,
                selectedStartTime,
              );
              onPreferredStartTimeChange(nextValue);
            }}
            className="appearance-none border-input bg-background text-foreground [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="trip-duration-hours">
            Duration (hours)
          </FieldLabel>
          <Popover open={durationOpen} onOpenChange={setDurationOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="trip-duration-hours"
                className={`w-full justify-between font-normal ${unifiedFieldClass}`}
              >
                <span>
                  {formData.durationHours}{" "}
                  {formData.durationHours === 1 ? "hour" : "hours"}
                </span>
                <ChevronDownIcon className="h-4 w-4 opacity-70" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              className="w-[var(--radix-popover-trigger-width)] bg-popover p-2 text-popover-foreground"
            >
              <div className="space-y-1">
                {TRIP_REQUEST_DURATION_OPTIONS.map((hours) => {
                  const selected = formData.durationHours === hours;

                  return (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => {
                        onDurationHoursChange(hours);
                        setDurationOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                        selected
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <span>
                        {hours} {hours === 1 ? "hour" : "hours"}
                      </span>
                      {selected ? (
                        <Check className="h-4 w-4 shrink-0 text-current" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
          {errors.durationHours ? (
            <p className="mt-1 text-sm text-destructive">
              {errors.durationHours}
            </p>
          ) : null}
        </Field>
      </FieldGroup>
    </div>
  );
}
