"use client";

import * as React from "react";
import dayjs, { type Dayjs } from "dayjs";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
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
import { TRIP_REQUEST_CITIES } from "@/lib/data/trip-request";

type DestinationTimingStepProps = {
  selectedDate: string;
  selectedStartTime: Dayjs | null;
  selectedEndTime: Dayjs | null;
  formData: TripRequestFormData;
  errors: TripRequestValidationErrors;
  onCityChange: (city: string) => void;
  onPreferredDateChange: (date: Dayjs | null) => void;
  onPreferredStartTimeChange: (time: Dayjs | null) => void;
  onPreferredEndTimeChange: (time: Dayjs | null) => void;
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
  selectedEndTime,
  formData,
  errors,
  onCityChange,
  onPreferredDateChange,
  onPreferredStartTimeChange,
  onPreferredEndTimeChange,
}: DestinationTimingStepProps) {
  const [open, setOpen] = React.useState(false);
  const selectedDateObject = selectedDate ? new Date(selectedDate) : undefined;

  return (
    <div className="space-y-6">
      <Field>
        <FieldLabel htmlFor="trip-city">Destination</FieldLabel>
        <Combobox
          items={TRIP_REQUEST_CITIES}
          value={formData.city}
          onValueChange={(value) => onCityChange(value ?? "")}
        >
          <ComboboxInput placeholder="Choose destination" id="trip-city" />
          <ComboboxContent>
            <ComboboxEmpty>No destination found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        {errors.city ? (
          <p className="mt-1 text-sm text-destructive">{errors.city}</p>
        ) : null}
      </Field>

      <FieldGroup className="grid gap-4 md:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="trip-date">Date</FieldLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="trip-date"
                className="w-full justify-between font-normal"
              >
                {selectedDateObject
                  ? format(selectedDateObject, "PPP")
                  : "Select date"}
                <ChevronDownIcon className="h-4 w-4 opacity-70" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDateObject}
                captionLayout="dropdown"
                defaultMonth={selectedDateObject}
                onSelect={(date) => {
                  onPreferredDateChange(date ? dayjs(date) : null);
                  setOpen(false);
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
            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="trip-end-time">End time</FieldLabel>
          <Input
            id="trip-end-time"
            type="time"
            step="60"
            value={formatTimeValue(selectedEndTime)}
            onChange={(event) => {
              const nextValue = parseTimeToDayjs(
                event.target.value,
                selectedEndTime ?? selectedStartTime,
              );
              onPreferredEndTimeChange(nextValue);
            }}
            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </Field>
      </FieldGroup>
    </div>
  );
}
