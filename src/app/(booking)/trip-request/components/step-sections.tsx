import type { LucideIcon } from "lucide-react";
import { CalendarDays, Clock3, Coins, Globe2, MapPin } from "lucide-react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import dayjs, { type Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  formatBudgetRange,
  formatTripRequestDateTime,
  type TripRequestFormData,
  type TripRequestValidationErrors,
} from "@/lib/trip-request";
import { ChoiceChip, FieldError } from "./shared";

type GroupOption = {
  label: string;
  value: number;
};

type NoteSuggestion = {
  label: string;
  icon: LucideIcon;
};

export type LocationOption = {
  city: string;
  district: string;
  value: string;
};

type BaseStepProps = {
  formData: TripRequestFormData;
  errors: TripRequestValidationErrors;
};

const muiFieldSx = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.75rem",
    backgroundColor: "var(--background)",
    "& fieldset": {
      borderColor: "var(--border)",
    },
    "&:hover fieldset": {
      borderColor: "var(--primary)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--primary)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "var(--muted-foreground)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "var(--primary)",
  },
  "& .MuiFormHelperText-root": {
    marginLeft: 0,
    color: "var(--muted-foreground)",
  },
};

export function DestinationTimingStep({
  locations,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
  formData,
  errors,
  onCityChange,
  onPreferredDateChange,
  onPreferredStartTimeChange,
  onPreferredEndTimeChange,
}: BaseStepProps & {
  locations: readonly LocationOption[];
  selectedDate: string;
  selectedStartTime: Dayjs | null;
  selectedEndTime: Dayjs | null;
  onCityChange: (city: string) => void;
  onPreferredDateChange: (date: Dayjs | null) => void;
  onPreferredStartTimeChange: (time: Dayjs | null) => void;
  onPreferredEndTimeChange: (time: Dayjs | null) => void;
}) {
  const selectedLocation =
    locations.find((location) => location.value === formData.city) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Destination and timing
        </p>
        <h3 className="mt-2 text-xl font-semibold sm:text-2xl">
          Tell us where and when you want to explore
        </h3>
      </div>

      <div className="space-y-2">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          Location
        </span>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Autocomplete
            options={[...locations].sort((a, b) =>
              a.city === b.city
                ? a.district.localeCompare(b.district)
                : a.city.localeCompare(b.city),
            )}
            groupBy={(option) => option.city}
            getOptionLabel={(option) => option.district}
            value={selectedLocation}
            onChange={(_, option) => onCityChange(option?.value ?? "")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Where are you going?"
                placeholder="Select a district"
                error={Boolean(errors.city)}
                helperText={
                  errors.city ?? "Searchby district, grouped by city."
                }
                sx={muiFieldSx}
              />
            )}
          />
        </LocalizationProvider>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="space-y-2">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              Which date works best?
            </span>
            <DatePicker
              className="rounded-full"
              label="Preferred date"
              value={selectedDate ? dayjs(selectedDate) : null}
              onChange={onPreferredDateChange}
              disablePast
              slotProps={{
                textField: {
                  helperText:
                    errors.startTime ??
                    "Choose your preferred date first. Exact buddy availability will be confirmed later.",
                },
              }}
              sx={muiFieldSx}
            />
          </div>
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="space-y-2">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock3 className="h-4 w-4 text-primary" />
              Preferred time window
            </span>
            <div className="grid gap-4 sm:grid-cols-2">
              <TimePicker
                label="Start time"
                value={selectedStartTime}
                onChange={onPreferredStartTimeChange}
                minutesStep={30}
              />
              {/* <TimePicker
                label="End time"
                value={selectedEndTime}
                onChange={onPreferredEndTimeChange}
                ampm={false}
                minutesStep={30}
                sx={muiFieldSx}
              /> */}
            </div>
            {/* {selectedStartTime && selectedEndTime ? (
              <p className="text-sm text-muted-foreground">
                Duration preview:{" "}
                {selectedEndTime.diff(selectedStartTime, "minute")} minutes
              </p>
            ) : null} */}
          </div>
        </LocalizationProvider>

        <div className="lg:col-span-2">
          <FieldError message={errors.startTime} />
        </div>
      </div>
    </div>
  );
}

export function GroupBudgetStep({
  formData,
  errors,
  groupOptions,
  languageOptions,
  onGroupSizeChange,
  onLanguageChange,
  onBudgetMinChange,
  onBudgetMaxChange,
}: BaseStepProps & {
  groupOptions: readonly GroupOption[];
  languageOptions: readonly string[];
  onGroupSizeChange: (value: number) => void;
  onLanguageChange: (value: string) => void;
  onBudgetMinChange: (value: number) => void;
  onBudgetMaxChange: (value: number) => void;
}) {
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

      <div className="space-y-2">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          How many people are joining?
        </span>
        <div className="flex flex-wrap gap-2">
          {groupOptions.map((option) => (
            <ChoiceChip
              key={option.label}
              active={formData.groupSize === option.value}
              onClick={() => onGroupSizeChange(option.value)}
            >
              {option.label}
            </ChoiceChip>
          ))}
        </div>
        <FieldError message={errors.groupSize} />
      </div>

      <div className="space-y-2">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe2 className="h-4 w-4 text-primary" />
          Preferred guide language
        </span>
        <Input
          placeholder="English, Vietnamese, Korean..."
          value={formData.preferredLanguage}
          onChange={(event) => onLanguageChange(event.target.value)}
          className={cn(errors.preferredLanguage && "border-red-500")}
        />
        <FieldError message={errors.preferredLanguage} />
        <div className="flex flex-wrap gap-2 pt-1">
          {languageOptions.map((language) => (
            <ChoiceChip
              key={language}
              active={formData.preferredLanguage === language}
              onClick={() => onLanguageChange(language)}
            >
              {language}
            </ChoiceChip>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-muted/30 p-4 sm:p-5">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Coins className="h-5 w-5 text-primary" />
            Your budget range
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a realistic range so we can suggest suitable buddies faster.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-muted-foreground">
              Minimum budget (USD)
            </span>
            <Input
              type="number"
              min={0}
              value={formData.budgetMin}
              onChange={(event) =>
                onBudgetMinChange(Number(event.target.value) || 0)
              }
              className={cn(errors.budgetMin && "border-red-500")}
            />
            <FieldError message={errors.budgetMin} />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-muted-foreground">
              Maximum budget (USD)
            </span>
            <Input
              type="number"
              min={0}
              value={formData.budgetMax}
              onChange={(event) =>
                onBudgetMaxChange(Number(event.target.value) || 0)
              }
              className={cn(errors.budgetMax && "border-red-500")}
            />
            <FieldError message={errors.budgetMax} />
          </label>
        </div>
      </div>
    </div>
  );
}

export function MeetingNotesStep({
  formData,
  errors,
  noteSuggestions,
  onMeetingPointChange,
  onNotesChange,
  onAddInterestToNotes,
}: BaseStepProps & {
  noteSuggestions: readonly NoteSuggestion[];
  onMeetingPointChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onAddInterestToNotes: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Meeting and notes
        </p>
        <h3 className="mt-2 text-xl font-semibold sm:text-2xl">
          Add the details that make your trip feel personal
        </h3>
      </div>

      <label className="block space-y-2">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          Where would you like to meet?
        </span>
        <Input
          placeholder="Example: Ben Thanh Market main gate"
          value={formData.meetingPoint}
          onChange={(event) => onMeetingPointChange(event.target.value)}
          className={cn(errors.meetingPoint && "border-red-500")}
        />
        <FieldError message={errors.meetingPoint} />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-muted-foreground">
          Anything else we should know?
        </span>
        <Textarea
          rows={6}
          placeholder="Tell us what you would like to explore: food, local culture, photography, nightlife, hidden gems..."
          value={formData.notes}
          onChange={(event) => onNotesChange(event.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Add clear notes about your interests to improve match quality.
        </p>
      </label>

      <div className="flex flex-wrap gap-2">
        {noteSuggestions.map((item) => {
          const Icon = item.icon;
          return (
            <ChoiceChip
              key={item.label}
              active={formData.notes
                .toLowerCase()
                .includes(item.label.toLowerCase())}
              onClick={() => onAddInterestToNotes(item.label)}
            >
              <span className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {item.label}
              </span>
            </ChoiceChip>
          );
        })}
      </div>
    </div>
  );
}

export function ReviewStep({
  formData,
  hasValidationErrors,
}: {
  formData: TripRequestFormData;
  hasValidationErrors: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Final review
        </p>
        <h3 className="mt-2 text-xl font-semibold sm:text-2xl">
          Review your trip before creating it
        </h3>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-3xl border border-border p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Where and when</p>
          <p className="mt-3 text-lg font-semibold">
            {formData.city || "Choose a district"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatTripRequestDateTime(formData.startTime)}
          </p>
        </Card>

        <Card className="rounded-3xl border border-border p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Who and language</p>
          <p className="mt-3 text-lg font-semibold">
            {formData.groupSize} travelers
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {formData.preferredLanguage || "Add a preferred language"}
          </p>
        </Card>

        <Card className="rounded-3xl border border-border p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Budget</p>
          <p className="mt-3 text-lg font-semibold">
            {formatBudgetRange(formData.budgetMin, formData.budgetMax)}
          </p>
        </Card>

        <Card className="rounded-3xl border border-border p-5 shadow-none">
          <p className="text-sm text-muted-foreground">Meeting point</p>
          <p className="mt-3 text-lg font-semibold">
            {formData.meetingPoint || "Add a meeting point"}
          </p>
        </Card>
      </div>

      <Card className="rounded-3xl border border-border p-5 shadow-none">
        <p className="text-sm text-muted-foreground">Notes and interests</p>
        <p className="mt-3 whitespace-pre-line text-sm leading-6">
          {formData.notes.trim() || "No extra notes yet."}
        </p>
      </Card>

      {hasValidationErrors ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Some details still need attention before you can create this trip.
        </div>
      ) : null}
    </div>
  );
}
