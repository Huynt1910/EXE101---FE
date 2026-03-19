"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import {
  TRIP_REQUEST_STEP_FIELDS,
  TRIP_REQUEST_STEPS,
} from "@/app/(trip)/trip-request/trip-request.config";
import {
  defaultTripRequestFormData,
  getTripRequestDraft,
  saveTripRequestDraft,
  type TripRequestFormData,
  type TripRequestValidationErrors,
  validateTripRequest,
} from "@/lib/trip-request";

function getStartDatePart(value: string) {
  if (!value || !value.includes("T")) return "";
  return value.split("T")[0] ?? "";
}

export function useTripRequestForm() {
  const [step, setStep] = useState(1);
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TripRequestFormData>(
    defaultTripRequestFormData,
  );
  const [errors, setErrors] = useState<TripRequestValidationErrors>({});

  useEffect(() => {
    const draft = getTripRequestDraft();
    if (!draft) return;

    setFormData({
      ...defaultTripRequestFormData,
      ...draft,
    });
  }, []);

  const validation = useMemo(() => validateTripRequest(formData), [formData]);
  const currentStep = TRIP_REQUEST_STEPS[step - 1];
  const progressPercent = (step / TRIP_REQUEST_STEPS.length) * 100;
  const selectedDate = getStartDatePart(formData.startTime);

  const selectedStartTime = useMemo(() => {
    if (!formData.startTime) return null;
    return dayjs(formData.startTime);
  }, [formData.startTime]);

  const selectedEndTime = useMemo(() => {
    if (!formData.startTime) return null;
    return dayjs(formData.startTime).add(
      formData.durationHours || 3,
      "hour",
    );
  }, [formData.durationHours, formData.startTime]);

  const effectiveEndTime = useMemo(() => {
    if (!selectedStartTime || !selectedEndTime) return selectedEndTime;
    if (selectedEndTime.isAfter(selectedStartTime)) return selectedEndTime;
    return selectedStartTime.add(60, "minute");
  }, [selectedEndTime, selectedStartTime]);

  const updateField = <K extends keyof TripRequestFormData>(
    key: K,
    value: TripRequestFormData[K],
  ) => {
    setDraftSaved(false);
    setSubmitError(null);
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const syncStartTime = (datePart: string, nextStart: Dayjs | null) => {
    if (!datePart || !nextStart) {
      updateField("startTime", "");
      return;
    }

    const combined = dayjs(datePart)
      .hour(nextStart.hour())
      .minute(nextStart.minute())
      .second(0)
      .millisecond(0);

    updateField("startTime", combined.format("YYYY-MM-DDTHH:mm"));
  };

  const syncDuration = (start: Dayjs | null, end: Dayjs | null) => {
    if (!start || !end) return;

    const diff = end.diff(start, "hour");
    if (diff > 0) {
      updateField("durationHours", diff);
    }
  };

  const validateStep = (stepToValidate: number) => {
    const nextErrors = validateTripRequest(formData);
    const stepFields = TRIP_REQUEST_STEP_FIELDS[stepToValidate - 1] ?? [];
    const stepErrors = Object.fromEntries(
      stepFields
        .filter((field) => nextErrors[field])
        .map((field) => [field, nextErrors[field]]),
    ) as TripRequestValidationErrors;

    setErrors((prev) => ({ ...prev, ...stepErrors }));

    return Object.keys(stepErrors).length === 0;
  };

  const goToStep = (nextStep: number) => {
    if (nextStep <= step) {
      setStep(nextStep);
      return true;
    }

    let current = step;
    while (current < nextStep) {
      if (!validateStep(current)) return false;
      current += 1;
    }

    setStep(nextStep);
    return true;
  };

  const goToNextStep = () => {
    if (!validateStep(step)) return false;
    setStep((prev) => Math.min(prev + 1, TRIP_REQUEST_STEPS.length));
    return true;
  };

  const goToPreviousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const saveDraft = () => {
    saveTripRequestDraft(formData);
    setDraftSaved(true);
  };

  const validateBeforeSubmit = () => {
    const nextErrors = validateTripRequest(formData);
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length === 0) {
      return true;
    }

    const firstInvalidStep = TRIP_REQUEST_STEP_FIELDS.findIndex((fields) =>
      fields.some((field) => nextErrors[field]),
    );

    if (firstInvalidStep >= 0) {
      setStep(firstInvalidStep + 1);
    }

    return false;
  };

  const handlePreferredDateChange = (date: Dayjs | null) => {
    if (!date) {
      updateField("startTime", "");
      return;
    }

    const nextStart = selectedStartTime ?? dayjs().hour(10).minute(0);
    syncStartTime(date.format("YYYY-MM-DD"), nextStart);
  };

  const handlePreferredStartTimeChange = (time: Dayjs | null) => {
    const activeDate = selectedDate || dayjs().format("YYYY-MM-DD");
    syncStartTime(activeDate, time);
    syncDuration(time, effectiveEndTime);
  };

  const handlePreferredEndTimeChange = (time: Dayjs | null) => {
    syncDuration(selectedStartTime, time);
  };

  const replaceFormData = (nextFormData: TripRequestFormData) => {
    setFormData(nextFormData);
    setErrors({});
    setSubmitError(null);
    setDraftSaved(false);
  };

  return {
    step,
    draftSaved,
    submitError,
    formData,
    errors,
    validation,
    currentStep,
    progressPercent,
    selectedDate,
    selectedStartTime,
    selectedEndTime: effectiveEndTime,
    updateField,
    setSubmitError,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    saveDraft,
    validateBeforeSubmit,
    handlePreferredDateChange,
    handlePreferredStartTimeChange,
    handlePreferredEndTimeChange,
    replaceFormData,
  };
}
