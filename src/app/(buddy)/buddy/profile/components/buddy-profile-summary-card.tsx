"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type RefObject,
} from "react";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import {
  Camera,
  Check,
  ChevronDown,
  LoaderCircle,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  Star,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvatarCropDialog } from "@/components/common/avatar-crop-dialog";
import {
  BookingPanel,
  BookingPanelContent,
  BookingPanelHeader,
} from "@/components/ui/booking-panel";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useBuddyMeQuery,
  useBuddyProfileMutations,
} from "@/features/buddy/hooks/useBuddy";
import type {
  BuddyProfile,
  UpdateBuddyProfileRequest,
} from "@/features/buddy/type";
import { useMyServiceSubscriptionQuery } from "@/features/service-package/hooks/useServicePackage";
import type { ServicePackageSubscription } from "@/features/service-package/type";
import { handleApiError } from "@/lib/error-handler";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/utils/formatDateAndTime";
import { formatNumber } from "@/utils/formatNumber";
import {
  cropAvatarFile,
  type AvatarCropTransform,
} from "@/utils/optimizeAvatarFile";

const genderOptions = ["Male", "Female", "Other"] as const;
const MAX_AVATAR_FILE_BYTES = 900 * 1024;
const MAX_AVATAR_DIMENSION = 1200;
const MAX_AVATAR_SOURCE_BYTES = 15 * 1024 * 1024;

const ACTIVITY_OPTIONS = [
  "Food",
  "Shopping",
  "Nightlife",
  "Street food",
  "Coffee",
  "History",
  "Museums",
  "Culture",
  "Photography",
  "Walking tour",
  "Hidden gems",
  "Markets",
  "Local transport",
] as const;

const LANGUAGE_OPTIONS = [
  "English",
  "Vietnamese",
  "Japanese",
  "Korean",
  "Chinese",
  "French",
  "German",
  "Spanish",
  "Thai",
] as const;

type BuddyProfileFormState = {
  fullName: string;
  gender: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  aboutMe: string;
  activities: string[];
  costPerHour: string;
  languages: string[];
  bio: string;
};

type BuddyProfileErrors = Partial<Record<keyof BuddyProfileFormState, string>>;

type MultiSelectFieldProps = {
  label: string;
  placeholder: string;
  options: readonly string[];
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
};

function normalizeTag(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeTagList(values: string[]) {
  const seen = new Set<string>();

  return values.map(normalizeTag).filter((value) => {
    const key = value.toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isDuplicate(values: string[], candidate: string) {
  const normalizedCandidate = candidate.trim().toLowerCase();
  return values.some(
    (value) => value.trim().toLowerCase() === normalizedCandidate,
  );
}

function revokeObjectUrl(url?: string | null) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function formatDateLabel(value?: string | null) {
  if (!value) return "Not set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(date);
}

function toDateInputValue(value?: string | null) {
  if (!value) return "";

  const normalized = /^(\d{4}-\d{2}-\d{2})/.exec(value)?.[1];
  if (normalized) return normalized;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

function getInitials(profile?: BuddyProfile | null) {
  const source =
    profile?.fullName?.trim() || profile?.email?.split("@")[0] || "B";

  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function normalizeGender(value?: string | null) {
  if (value === "Male" || value === "Female" || value === "Other") {
    return value;
  }

  return "Other";
}

function getInitialDraft(profile?: BuddyProfile | null): BuddyProfileFormState {
  return {
    fullName: profile?.fullName ?? "",
    gender: normalizeGender(profile?.gender),
    phoneNumber: profile?.phoneNumber ?? "",
    address: profile?.address ?? "",
    dateOfBirth: toDateInputValue(profile?.dateOfBirth),
    aboutMe: profile?.aboutMe ?? "",
    activities: normalizeTagList(profile?.activities ?? []),
    costPerHour:
      typeof profile?.costPerHour === "number" &&
      Number.isFinite(profile.costPerHour)
        ? String(profile.costPerHour)
        : "",
    languages: normalizeTagList(profile?.languages ?? []),
    bio: profile?.bio ?? "",
  };
}

function normalizeDraft(draft: BuddyProfileFormState): BuddyProfileFormState {
  return {
    fullName: draft.fullName.trim(),
    gender: normalizeGender(draft.gender),
    phoneNumber: draft.phoneNumber.trim(),
    address: draft.address.trim(),
    dateOfBirth: draft.dateOfBirth.trim(),
    aboutMe: draft.aboutMe.trim(),
    activities: normalizeTagList(draft.activities),
    costPerHour: draft.costPerHour.trim(),
    languages: normalizeTagList(draft.languages),
    bio: draft.bio.trim(),
  };
}

function toUpdatePayload(
  draft: BuddyProfileFormState,
): UpdateBuddyProfileRequest {
  const normalized = normalizeDraft(draft);

  return {
    fullName: normalized.fullName,
    gender: normalized.gender,
    phoneNumber: normalized.phoneNumber,
    address: normalized.address,
    dateOfBirth: normalized.dateOfBirth || null,
    aboutMe: normalized.aboutMe,
    activities: normalized.activities,
    costPerHour: Number(normalized.costPerHour),
    languages: normalized.languages,
    bio: normalized.bio,
  };
}

function validateDraft(draft: BuddyProfileFormState): BuddyProfileErrors {
  const normalized = normalizeDraft(draft);
  const errors: BuddyProfileErrors = {};

  if (!normalized.fullName) {
    errors.fullName = "Full name is required.";
  } else if (normalized.fullName.length > 80) {
    errors.fullName = "Full name must be 80 characters or fewer.";
  }

  if (
    !genderOptions.includes(normalized.gender as (typeof genderOptions)[number])
  ) {
    errors.gender = "Choose a valid gender.";
  }

  if (normalized.phoneNumber.length > 20) {
    errors.phoneNumber = "Phone number must be 20 characters or fewer.";
  }

  if (normalized.address.length > 500) {
    errors.address = "Address must be 500 characters or fewer.";
  }

  if (normalized.aboutMe.length > 1000) {
    errors.aboutMe = "About me must be 1000 characters or fewer.";
  }

  if (normalized.activities.length === 0) {
    errors.activities = "Choose at least one activity.";
  }

  if (!normalized.costPerHour) {
    errors.costPerHour = "Cost per hour is required.";
  } else {
    const parsedCost = Number(normalized.costPerHour);
    if (!Number.isFinite(parsedCost) || parsedCost < 0) {
      errors.costPerHour = "Cost per hour must be a valid number.";
    }
  }

  if (normalized.languages.length === 0) {
    errors.languages = "Choose at least one language.";
  }

  if (!normalized.bio) {
    errors.bio = "Bio is required.";
  } else if (normalized.bio.length > 1000) {
    errors.bio = "Bio must be 1000 characters or fewer.";
  }

  return errors;
}

function MultiSelectField({
  label,
  placeholder,
  options,
  values,
  onChange,
  error,
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
    !isDuplicate(values, normalizedQuery) &&
    !options.some(
      (option) => option.toLowerCase() === normalizedQuery.toLowerCase(),
    );

  const toggleValue = (value: string) => {
    if (isDuplicate(values, value)) {
      onChange(
        values.filter(
          (item) => item.trim().toLowerCase() !== value.trim().toLowerCase(),
        ),
      );
      return;
    }

    onChange([...values, normalizeTag(value)]);
  };

  const removeValue = (value: string) => {
    onChange(
      values.filter(
        (item) => item.trim().toLowerCase() !== value.trim().toLowerCase(),
      ),
    );
  };

  const addCustomValue = () => {
    if (!canAddCustom) return;

    onChange([...values, normalizedQuery]);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3 px-0.5">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-xs text-muted-foreground">
          {values.length} selected
        </span>
      </div>

      <div
        className={cn(
          "flex min-h-11 flex-wrap items-center gap-2 rounded-2xl border bg-background px-3 py-2.5",
          error ? "border-destructive/60" : "border-border/70",
        )}
      >
        {values.length > 0 ? (
          values.map((value) => (
            <Badge
              key={value}
              variant="secondary"
              className="gap-1 rounded-full px-3 py-1.5 text-sm"
            >
              <span>{value}</span>
              <button
                type="button"
                onClick={() => removeValue(value)}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-foreground/10"
                aria-label={`Remove ${value}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">{placeholder}</p>
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full justify-between rounded-xl px-3"
          >
            Select {label.toLowerCase()}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-[22rem] rounded-2xl p-4">
          <div className="space-y-3">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search or add ${label.toLowerCase()}...`}
            />

            <div className="max-h-64 space-y-2 overflow-y-auto">
              {filteredOptions.map((option) => {
                const selected = isDuplicate(values, option);

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
                  className="flex w-full items-center justify-between rounded-xl bg-accent px-3 py-2 text-left text-sm text-accent-foreground transition-colors hover:opacity-90"
                >
                  <span>Add "{normalizedQuery}"</span>
                  <Check className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function BuddyProfileSummarySkeleton() {
  return (
    <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <BookingPanel>
        <BookingPanelContent className="space-y-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <Skeleton className="h-28 w-28 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-44" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>

          <div className="space-y-3 rounded-2xl border border-border/70 p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        </BookingPanelContent>
      </BookingPanel>

      <BookingPanel>
        <BookingPanelHeader className="border-b border-border/70 pb-5">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </BookingPanelHeader>
        <BookingPanelContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>

          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </BookingPanelContent>
      </BookingPanel>
    </div>
  );
}

type BuddyProfileEditorProps = {
  aboutMeLength: number;
  addressLength: number;
  avatarSrc?: string;
  bioLength: number;
  draft: BuddyProfileFormState;
  errors: BuddyProfileErrors;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleAvatarUpload: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSave: () => Promise<void>;
  isDirty: boolean;
  isSavingProfile: boolean;
  isUploadingAvatar: boolean;
  isSubscriptionError: boolean;
  isSubscriptionLoading: boolean;
  onFieldChange: <K extends keyof BuddyProfileFormState>(
    key: K,
    value: BuddyProfileFormState[K],
  ) => void;
  profile: BuddyProfile;
  subscription: ServicePackageSubscription | null;
};

function BuddyProfileEditor({
  addressLength,
  avatarSrc,
  bioLength,
  draft,
  errors,
  fileInputRef,
  handleAvatarUpload,
  handleSave,
  isDirty,
  isSavingProfile,
  isUploadingAvatar,
  isSubscriptionError,
  isSubscriptionLoading,
  onFieldChange,
  profile,
  subscription,
}: Readonly<BuddyProfileEditorProps>) {
  return (
    <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <BookingPanel>
        <BookingPanelContent className="space-y-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative">
              <Avatar className="h-28 w-28 border border-border/70 bg-secondary">
                <AvatarImage
                  src={avatarSrc}
                  alt={profile.fullName || "Buddy avatar"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-secondary text-lg font-semibold text-muted-foreground">
                  {getInitials(profile) || <UserRound className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <span
                className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center"
                aria-label={profile.isActive ? "Active" : "Inactive"}
                title={profile.isActive ? "Active" : "Inactive"}
              >
                {profile.isActive && (
                  <span className="absolute h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                )}
                <span
                  className={cn(
                    "relative h-3 w-3 rounded-full border-2 border-card",
                    profile.isActive ? "bg-green-500" : "bg-slate-400",
                  )}
                />
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="inline-flex items-center gap-1.5 text-xl font-semibold leading-none text-foreground">
                <span className="leading-none">{profile.fullName || "Buddy profile"}</span>
                <CheckBadgeIcon
                  className="h-5 w-5 shrink-0 text-sky-500"
                  aria-hidden="true"
                />
              </h2>
              <p className="text-sm text-muted-foreground">
                {profile.email || "No email"}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                <Star className="mr-1 h-3.5 w-3.5" />
                {typeof profile.rate === "number" && profile.rate > 0
                  ? profile.rate.toFixed(1)
                  : "No rating"}
              </Badge>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
            >
              {isUploadingAvatar ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              {isUploadingAvatar ? "Uploading..." : "Change photo"}
            </Button>
          </div>

          <div className="space-y-4 rounded-2xl border border-border/70 p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Mail className="h-4 w-4 text-primary" />
                Email
              </div>
              <p className="text-sm text-muted-foreground">
                {profile.email || "No email"}
              </p>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Joined {formatDateLabel(profile.createdAt)}</p>
              <p>Last update {formatDateLabel(profile.updatedAt)}</p>
              <p>Birthday {formatDateLabel(profile.dateOfBirth)}</p>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-border/70 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Package className="h-4 w-4 text-primary" />
              Current package
            </div>
            {isSubscriptionLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : isSubscriptionError ? (
              <p className="text-sm text-destructive">
                Unable to load current package information.
              </p>
            ) : subscription ? (
              <div className="space-y-2">
                <p className="font-medium text-foreground">
                  {subscription.packageName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Start date: {formatDateTime(subscription.startDate)}
                </p>
                <p className="text-sm text-muted-foreground">
                  End date: {formatDateTime(subscription.endDate)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {subscription.status || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Paid at: {formatDateTime(subscription.paidAt)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Amount paid: {formatNumber(subscription.amountPaid)}{" "}
                  {subscription.currency || ""}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No active package yet. Open the package page to choose one.
              </p>
            )}
          </div>
        </BookingPanelContent>
      </BookingPanel>

      <BookingPanel className="py-2">
        <BookingPanelHeader className="border-b border-border/70 py-5 text-center text-foreground text-4xl font-semibold">
          Profile details
        </BookingPanelHeader>

        <BookingPanelContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="px-0.5 text-sm font-medium text-foreground">
                Full name
              </label>
              <Input
                value={draft.fullName}
                onChange={(event) =>
                  onFieldChange("fullName", event.target.value)
                }
                placeholder="Your full name"
                className={cn(
                  "bg-background",
                  errors.fullName && "border-destructive/60",
                )}
              />
              {errors.fullName ? (
                <p className="text-xs text-destructive">{errors.fullName}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="px-0.5 text-sm font-medium text-foreground">
                Gender
              </label>
              <select
                value={draft.gender}
                onChange={(event) =>
                  onFieldChange("gender", event.target.value)
                }
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                  errors.gender && "border-destructive/60",
                )}
              >
                {genderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.gender ? (
                <p className="text-xs text-destructive">{errors.gender}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="px-0.5 text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                value={profile.email ?? ""}
                disabled
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <label className="px-0.5 text-sm font-medium text-foreground">
                Phone number
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className={cn(
                    "bg-background pl-9",
                    errors.phoneNumber && "border-destructive/60",
                  )}
                  value={draft.phoneNumber}
                  onChange={(event) =>
                    onFieldChange("phoneNumber", event.target.value)
                  }
                  placeholder="Your phone number"
                />
              </div>
              {errors.phoneNumber ? (
                <p className="text-xs text-destructive">{errors.phoneNumber}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="px-0.5 text-sm font-medium text-foreground">
                Date of birth
              </label>
              <Input
                type="date"
                value={draft.dateOfBirth}
                onChange={(event) =>
                  onFieldChange("dateOfBirth", event.target.value)
                }
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <label className="px-0.5 text-sm font-medium text-foreground">
                Cost per hour
              </label>
              <Input
                type="number"
                min="0"
                step="1"
                value={draft.costPerHour}
                onChange={(event) =>
                  onFieldChange("costPerHour", event.target.value)
                }
                placeholder="Hourly rate"
                className={cn(
                  "bg-background",
                  errors.costPerHour && "border-destructive/60",
                )}
              />
              {errors.costPerHour ? (
                <p className="text-xs text-destructive">{errors.costPerHour}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 px-0.5">
              <label className="text-sm font-medium text-foreground">
                Address
              </label>
              <span className="text-xs text-muted-foreground">
                {addressLength}/500
              </span>
            </div>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Textarea
                className={cn(
                  "min-h-24 bg-background pl-9 pt-2.5",
                  errors.address && "border-destructive/60",
                )}
                value={draft.address}
                onChange={(event) =>
                  onFieldChange("address", event.target.value)
                }
                placeholder="Your address"
              />
            </div>
            {errors.address ? (
              <p className="text-xs text-destructive">{errors.address}</p>
            ) : null}
          </div>

          <MultiSelectField
            label="Activities"
            placeholder="No activity selected yet."
            options={ACTIVITY_OPTIONS}
            values={draft.activities}
            onChange={(values) => onFieldChange("activities", values)}
            error={errors.activities}
          />

          <MultiSelectField
            label="Languages"
            placeholder="No language selected yet."
            options={LANGUAGE_OPTIONS}
            values={draft.languages}
            onChange={(values) => onFieldChange("languages", values)}
            error={errors.languages}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 px-0.5">
              <label className="text-sm font-medium text-foreground">Bio</label>
              <span className="text-xs text-muted-foreground">
                {bioLength}/1000
              </span>
            </div>
            <Textarea
              className={cn(
                "min-h-36 bg-background",
                errors.bio && "border-destructive/60",
              )}
              value={draft.bio}
              onChange={(event) => onFieldChange("bio", event.target.value)}
              placeholder="Tell travelers what kind of local support you provide."
            />
            {errors.bio ? (
              <p className="text-xs text-destructive">{errors.bio}</p>
            ) : null}
          </div>

          <div className="flex justify-end mt-4">
            <Button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || isSavingProfile}
              className="rounded-xl"
            >
              {isSavingProfile ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSavingProfile ? "Saving..." : "Save profile"}
            </Button>
          </div>
        </BookingPanelContent>
      </BookingPanel>
    </div>
  );
}

export function BuddyProfileSummaryCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const appliedDraftSnapshotRef = useRef<string | null>(null);
  const profileQuery = useBuddyMeQuery();
  const subscriptionQuery = useMyServiceSubscriptionQuery();
  const { updateBuddyProfileMutation, uploadBuddyAvatarMutation } =
    useBuddyProfileMutations();
  const [draft, setDraft] = useState<BuddyProfileFormState>(getInitialDraft());
  const [errors, setErrors] = useState<BuddyProfileErrors>({});
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [cropDialogImageSrc, setCropDialogImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const profile = profileQuery.data?.data;
    if (!profile) return;

    const nextDraft = getInitialDraft(profile);
    const snapshot = JSON.stringify(nextDraft);

    if (snapshot === appliedDraftSnapshotRef.current) return;

    setDraft(nextDraft);
    setErrors({});
    appliedDraftSnapshotRef.current = snapshot;
  }, [profileQuery.data?.data]);

  useEffect(() => {
    return () => {
      revokeObjectUrl(avatarPreviewUrl);
      revokeObjectUrl(cropDialogImageSrc);
    };
  }, [avatarPreviewUrl, cropDialogImageSrc]);

  const profile = profileQuery.data?.data;
  const subscription = subscriptionQuery.data?.data ?? null;
  const avatarSrc = avatarPreviewUrl || profile?.profilePicture || undefined;
  const normalizedDraftSnapshot = JSON.stringify(normalizeDraft(draft));
  const isDirty = normalizedDraftSnapshot !== appliedDraftSnapshotRef.current;
  const isSavingProfile = updateBuddyProfileMutation.isPending;
  const isUploadingAvatar = uploadBuddyAvatarMutation.isPending;

  const closeCropDialog = () => {
    revokeObjectUrl(cropDialogImageSrc);
    setCropDialogImageSrc(null);
    setPendingAvatarFile(null);
  };

  const updateDraftField = <K extends keyof BuddyProfileFormState>(
    key: K,
    value: BuddyProfileFormState[K],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSave = async () => {
    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please review the highlighted fields.");
      return;
    }

    try {
      await updateBuddyProfileMutation.mutateAsync(toUpdatePayload(draft));
      appliedDraftSnapshotRef.current = normalizedDraftSnapshot;
      toast.success("Buddy profile updated successfully.");
    } catch (error) {
      handleApiError(error, { showTitle: false });
    }
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SOURCE_BYTES) {
      toast.error(
        "Image is too large. Please choose a file smaller than 15MB.",
      );
      event.target.value = "";
      return;
    }

    setPendingAvatarFile(file);
    setCropDialogImageSrc((current) => {
      revokeObjectUrl(current);
      return URL.createObjectURL(file);
    });
    event.target.value = "";
  };

  const handleConfirmAvatarCrop = async (transform: AvatarCropTransform) => {
    if (!pendingAvatarFile) return;

    try {
      const optimizedFile = await cropAvatarFile(pendingAvatarFile, transform, {
        maxBytes: MAX_AVATAR_FILE_BYTES,
        maxDimension: MAX_AVATAR_DIMENSION,
      });
      const nextPreviewUrl = URL.createObjectURL(optimizedFile);

      setAvatarPreviewUrl((current) => {
        revokeObjectUrl(current);
        return nextPreviewUrl;
      });

      await uploadBuddyAvatarMutation.mutateAsync(optimizedFile);
      revokeObjectUrl(nextPreviewUrl);
      setAvatarPreviewUrl(null);
      closeCropDialog();
      toast.success("Avatar updated successfully.");
    } catch (error) {
      setAvatarPreviewUrl((current) => {
        revokeObjectUrl(current);
        return null;
      });

      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        (error as { status?: number }).status === 413
      ) {
        toast.error("Image is too large. Please choose a smaller image.");
        return;
      }

      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      handleApiError(error, { showTitle: false });
    }
  };

  if (profileQuery.isLoading) {
    return <BuddyProfileSummarySkeleton />;
  }

  if (profileQuery.isError || !profile) {
    return (
      <BookingPanel className="border-destructive/20">
        <BookingPanelContent>
          <p className="text-sm text-destructive">
            Unable to load your buddy profile.
          </p>
        </BookingPanelContent>
      </BookingPanel>
    );
  }

  return (
    <>
      <BuddyProfileEditor
        addressLength={draft.address.length}
        avatarSrc={avatarSrc}
        bioLength={draft.bio.length}
        draft={draft}
        errors={errors}
        fileInputRef={fileInputRef}
        handleAvatarUpload={handleAvatarUpload}
        handleSave={handleSave}
        isDirty={isDirty}
        isSavingProfile={isSavingProfile}
        isUploadingAvatar={isUploadingAvatar}
        isSubscriptionError={subscriptionQuery.isError}
        isSubscriptionLoading={subscriptionQuery.isLoading}
        onFieldChange={updateDraftField}
        profile={profile}
        subscription={subscription}
        aboutMeLength={draft.aboutMe.length}
      />
      <AvatarCropDialog
        open={Boolean(cropDialogImageSrc)}
        imageSrc={cropDialogImageSrc}
        isSubmitting={isUploadingAvatar}
        onOpenChange={(open) => {
          if (!open) closeCropDialog();
        }}
        onConfirm={handleConfirmAvatarCrop}
      />
    </>
  );
}
