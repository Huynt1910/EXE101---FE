"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormState,
  baseStep1,
  shortTrip,
  longTrip,
  step2Schema,
  step3Schema,
} from "./schemas";
import { useStepFields } from "./useStepFields";

interface TripWizardContextType {
  step: number;
  setStep: (step: number) => void;
  form: UseFormReturn<FormState>;
  canNext: boolean;
  nextStep: () => void;
  prevStep: () => void;
  submitForm: () => void;
}

const TripWizardContext = createContext<TripWizardContextType | undefined>(
  undefined
);

const initialFormValues: FormState = {
  destination: "",
  budget: "MID",
  tripType: "short",
  startDate: "",
  duration: "",
  startDateLong: "",
  endDateLong: "",
  groupSize: 1,
  travelStyle: [],
  interests: [],
  name: "",
  email: "",
  notes: "",
};

interface TripWizardProviderProps {
  children: ReactNode;
}

export function TripWizardProvider({ children }: TripWizardProviderProps) {
  const [step, setStep] = useState(1);

  const form = useForm<FormState>({
    resolver: zodResolver(baseStep1),
    defaultValues: initialFormValues,
    mode: "onChange",
  });

  const { step1Fields, step2Fields, step3Fields } = useStepFields(form.watch);

  const canNext = (() => {
    switch (step) {
      case 1:
        return step1Fields;
      case 2:
        return step2Fields;
      case 3:
        return step3Fields;
      default:
        return false;
    }
  })();

  const nextStep = () => {
    if (canNext && step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const submitForm = () => {
    const formData = form.getValues();
    console.log("SUBMIT FORM:", formData);
    // TODO: Submit to API and redirect
    window.location.href = "/trip-request/1";
  };

  const value: TripWizardContextType = {
    step,
    setStep,
    form,
    canNext,
    nextStep,
    prevStep,
    submitForm,
  };

  return (
    <TripWizardContext.Provider value={value}>
      {children}
    </TripWizardContext.Provider>
  );
}

export function useTripWizard() {
  const context = useContext(TripWizardContext);
  if (context === undefined) {
    throw new Error("useTripWizard must be used within a TripWizardProvider");
  }
  return context;
}
