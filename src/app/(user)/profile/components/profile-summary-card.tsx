"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Camera,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { handleApiError } from "@/lib/error-handler";
import {
  useUserProfile,
  useUserProfileMutations,
} from "@/features/user/hooks/useUserProfile";
import type {
  UpdateUserProfileRequest,
  UserProfile,
} from "@/features/user/type";

const genderOptions = ["Male", "Female", "Other"] as const;
const MAX_AVATAR_FILE_BYTES = 900 * 1024;
const MAX_AVATAR_DIMENSION = 1200;
const MAX_AVATAR_SOURCE_BYTES = 15 * 1024 * 1024;

const profileFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required.")
    .max(20, "Full name must be 20 characters or fewer."),
  gender: z.enum(genderOptions),
  phoneNumber: z
    .string()
    .trim()
    .max(20, "Phone number must be 20 characters or fewer."),
  address: z
    .string()
    .trim()
    .max(500, "Address must be 500 characters or fewer."),
  dateOfBirth: z.string(),
  aboutMe: z
    .string()
    .trim()
    .max(1000, "About me must be 1000 characters or fewer."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

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

function normalizeGender(value?: string | null) {
  if (value === "Male" || value === "Female" || value === "Other") {
    return value;
  }

  return "Other";
}

function getInitialFormValues(profile?: UserProfile | null): ProfileFormValues {
  return {
    fullName: profile?.fullName ?? "",
    gender: normalizeGender(profile?.gender),
    phoneNumber: profile?.phoneNumber ?? "",
    address: profile?.address ?? "",
    dateOfBirth: toDateInputValue(profile?.dateOfBirth),
    aboutMe: profile?.aboutMe ?? "",
  };
}

function toUpdatePayload(values: ProfileFormValues): UpdateUserProfileRequest {
  return {
    fullName: values.fullName.trim(),
    gender: values.gender,
    phoneNumber: values.phoneNumber.trim(),
    address: values.address.trim(),
    dateOfBirth: values.dateOfBirth || null,
    aboutMe: values.aboutMe.trim(),
  };
}

function getInitials(profile?: UserProfile | null) {
  const source =
    profile?.fullName?.trim() || profile?.email?.split("@")[0] || "U";

  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

async function loadImageElement(file: File) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () =>
        reject(new Error("Unable to read the selected image."));
      nextImage.src = objectUrl;
    });

    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to process the selected image."));
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

async function optimizeAvatarFile(file: File) {
  if (file.size <= MAX_AVATAR_FILE_BYTES) {
    return file;
  }

  const image = await loadImageElement(file);
  const scale = Math.min(
    1,
    MAX_AVATAR_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight),
  );
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to process the selected image.");
  }

  context.drawImage(image, 0, 0, width, height);

  let quality = 0.9;
  let blob = await canvasToBlob(canvas, quality);

  while (blob.size > MAX_AVATAR_FILE_BYTES && quality > 0.45) {
    quality -= 0.1;
    blob = await canvasToBlob(canvas, quality);
  }

  if (blob.size > MAX_AVATAR_FILE_BYTES) {
    throw new Error(
      "Image is still too large after compression. Please choose a smaller file.",
    );
  }

  const fileBaseName = file.name.replace(/\.[^/.]+$/, "");
  return new File([blob], `${fileBaseName || "avatar"}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

function ProfileSummarySkeleton() {
  return (
    <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <Card className="rounded-[1.75rem] border-border/70 py-0">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <Skeleton className="h-28 w-28 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-44" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>

          <div className="space-y-3 rounded-2xl border border-border/70 p-4">
            <Skeleton className="h-4 w-16" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[1.75rem] border-border/70 py-0">
        <CardHeader className="border-b border-border/70 pb-5">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-36 w-full rounded-2xl" />
          </div>

          <div className="flex justify-end">
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ProfileSummaryCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const appliedProfileSnapshotRef = useRef<string | null>(null);
  const profileQuery = useUserProfile();
  const { updateProfileMutation, uploadAvatarMutation } =
    useUserProfileMutations();
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: getInitialFormValues(),
  });

  const addressValue = form.watch("address");
  const aboutMeValue = form.watch("aboutMe");

  useEffect(() => {
    const profile = profileQuery.data?.data;
    if (!profile) return;

    const nextValues = getInitialFormValues(profile);
    const snapshot = JSON.stringify(nextValues);

    if (snapshot === appliedProfileSnapshotRef.current) return;

    form.reset(nextValues);
    appliedProfileSnapshotRef.current = snapshot;
  }, [form, profileQuery.data?.data]);

  useEffect(() => {
    return () => {
      revokeObjectUrl(avatarPreviewUrl);
    };
  }, [avatarPreviewUrl]);

  const profile = profileQuery.data?.data;
  const avatarSrc = avatarPreviewUrl || profile?.profilePicture || undefined;
  const isSavingProfile = updateProfileMutation.isPending;
  const isUploadingAvatar = uploadAvatarMutation.isPending;

  const handleSave = form.handleSubmit(async (values) => {
    try {
      await updateProfileMutation.mutateAsync(toUpdatePayload(values));
      toast.success("Profile updated successfully.");
    } catch (error) {
      handleApiError(error, { showTitle: false });
    }
  });

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

    try {
      const optimizedFile = await optimizeAvatarFile(file);
      const nextPreviewUrl = URL.createObjectURL(optimizedFile);

      setAvatarPreviewUrl((current) => {
        revokeObjectUrl(current);
        return nextPreviewUrl;
      });

      await uploadAvatarMutation.mutateAsync(optimizedFile);
      revokeObjectUrl(nextPreviewUrl);
      setAvatarPreviewUrl(null);
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
        event.target.value = "";
        return;
      }

      if (error instanceof Error) {
        toast.error(error.message);
        event.target.value = "";
        return;
      }
      handleApiError(error, { showTitle: false });
    } finally {
      event.target.value = "";
    }
  };

  if (profileQuery.isLoading) {
    return <ProfileSummarySkeleton />;
  }

  if (profileQuery.isError || !profile) {
    return (
      <Card className="rounded-[1.75rem] border-destructive/20 py-0">
        <CardContent className="p-6">
          <p className="text-sm text-destructive">
            Unable to load your profile information.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <Card className="rounded-[1.75rem] border-border/70 py-0">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <Avatar className="h-28 w-28 border border-border/70 bg-secondary">
              <AvatarImage
                src={avatarSrc}
                alt={profile.fullName || "Profile avatar"}
                className="object-cover"
              />
              <AvatarFallback className="bg-secondary text-lg font-semibold text-muted-foreground">
                {getInitials(profile) || <UserRound className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                {profile.fullName || "Your profile"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {profile.email || "No email"}
              </p>
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
              {isUploadingAvatar ? "Uploading…" : "Change photo"}
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
              <p>
                {profile.isEmailVerified
                  ? "Email verified"
                  : "Email not verified"}
              </p>
              <p>Joined {formatDateLabel(profile.createdAt)}</p>
              <p>Last update {formatDateLabel(profile.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[1.75rem] border-border/70 py-2">
        <CardHeader className="border-b border-border/70 pb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl text-foreground">
                Profile details
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Review your self-service profile and save text changes
                separately from the avatar upload.
              </p>
            </div>

            {/* <Button
              type="button"
              onClick={handleSave}
              disabled={!form.formState.isDirty || !form.formState.isValid || isSavingProfile}
              className="rounded-xl"
            >
              {isSavingProfile ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSavingProfile ? "Saving…" : "Save profile"}
            </Button> */}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form className="space-y-5" onSubmit={handleSave}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Full name
                </label>
                <Input
                  placeholder="Your full name"
                  {...form.register("fullName")}
                />
                {form.formState.errors.fullName ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.fullName.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Gender
                </label>
                <select
                  {...form.register("gender")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input value={profile.email ?? ""} disabled />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Phone number
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Your phone number"
                    {...form.register("phoneNumber")}
                  />
                </div>
                {form.formState.errors.phoneNumber ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.phoneNumber.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Date of birth
                </label>
                <Input type="date" {...form.register("dateOfBirth")} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-foreground">
                  Address
                </label>
                <span className="text-xs text-muted-foreground">
                  {addressValue.length}/500
                </span>
              </div>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Textarea
                  className="min-h-24 pl-9"
                  placeholder="Your address"
                  {...form.register("address")}
                />
              </div>
              {form.formState.errors.address ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.address.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-foreground">
                  About me
                </label>
                <span className="text-xs text-muted-foreground">
                  {aboutMeValue.length}/1000
                </span>
              </div>
              <Textarea
                className="min-h-32"
                placeholder="Tell travelers a little about yourself"
                {...form.register("aboutMe")}
              />
              {form.formState.errors.aboutMe ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.aboutMe.message}
                </p>
              ) : null}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  !form.formState.isDirty ||
                  !form.formState.isValid ||
                  isSavingProfile
                }
                className="rounded-xl"
              >
                {isSavingProfile ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSavingProfile ? "Saving…" : "Save profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
