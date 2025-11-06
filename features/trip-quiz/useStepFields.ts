import { useMemo } from "react";
import { UseFormWatch } from "react-hook-form";
import { FormState } from "./schemas";

export function useStepFields(watch: UseFormWatch<FormState>) {
  const watchedValues = watch();

  const step1Fields = useMemo(() => {
    const {
      budget,
      tripType,
      startDate,
      duration,
      startDateLong,
      endDateLong,
    } = watchedValues;

    const hasBasicInfo = !!budget && !!tripType;
    if (!hasBasicInfo) return false;

    if (tripType === "short") {
      return !!startDate && !!duration;
    } else if (tripType === "long") {
      return !!startDateLong && !!endDateLong;
    }
    return false;
  }, [
    watchedValues.budget,
    watchedValues.tripType,
    watchedValues.startDate,
    watchedValues.duration,
    watchedValues.startDateLong,
    watchedValues.endDateLong,
  ]);

  const step2Fields = useMemo(() => {
    const { travelStyle, interests } = watchedValues;
    return travelStyle.length > 0 || interests.length > 0;
  }, [watchedValues.travelStyle, watchedValues.interests]);

  const step3Fields = useMemo(() => {
    const { name, email } = watchedValues;
    return !!name && !!email;
  }, [watchedValues.name, watchedValues.email]);

  return {
    step1Fields,
    step2Fields,
    step3Fields,
  };
}
