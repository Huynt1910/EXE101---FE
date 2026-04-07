"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Camera,
  KeyRound,
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
import { AvatarCropDialog } from "@/components/common/avatar-crop-dialog";
import {
  BookingPanel,
  BookingPanelContent,
  BookingPanelHeader,
  BookingPanelTitle,
} from "@/components/ui/booking-panel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useChangePasswordMutation } from "@/features/auth/hooks/useChangePassword";
import { handleApiError } from "@/lib/error-handler";
import {
  useUserProfile,
  useUserProfileMutations,
} from "@/features/user/hooks/useUserProfile";
import {
  cropAvatarFile,
  type AvatarCropTransform,
} from "@/utils/optimizeAvatarFile";
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

const passwordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters."),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters."),
    confirmPassword: z
      .string()
      .min(6, "Please confirm the new password."),
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    message: "New password should be different from the current password.",
    path: ["newPassword"],
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Password confirmation does not match.",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

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

function ProfileSummarySkeleton() {
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
            <Skeleton className="h-4 w-16" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
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
        </BookingPanelContent>
      </BookingPanel>
    </div>
  );
}

export function ProfileSummaryCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const appliedProfileSnapshotRef = useRef<string | null>(null);
  const profileQuery = useUserProfile();
  const { updateProfileMutation, uploadAvatarMutation } =
    useUserProfileMutations();
  const changePasswordMutation = useChangePasswordMutation();
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [cropDialogImageSrc, setCropDialogImageSrc] = useState<string | null>(
    null,
  );
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: getInitialFormValues(),
  });
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
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
      revokeObjectUrl(cropDialogImageSrc);
    };
  }, [avatarPreviewUrl, cropDialogImageSrc]);

  const profile = profileQuery.data?.data;
  const avatarSrc = avatarPreviewUrl || profile?.profilePicture || undefined;
  const isSavingProfile = updateProfileMutation.isPending;
  const isUploadingAvatar = uploadAvatarMutation.isPending;

  const closeCropDialog = () => {
    revokeObjectUrl(cropDialogImageSrc);
    setCropDialogImageSrc(null);
    setPendingAvatarFile(null);
  };

  const handleSave = form.handleSubmit(async (values) => {
    try {
      await updateProfileMutation.mutateAsync(toUpdatePayload(values));
      toast.success("Profile updated successfully.");
    } catch (error) {
      handleApiError(error, { showTitle: false });
    }
  });

  const handlePasswordSave = passwordForm.handleSubmit(async (values) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      passwordForm.reset();
      setIsPasswordDialogOpen(false);
      toast.success("Password changed successfully.");
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

      await uploadAvatarMutation.mutateAsync(optimizedFile);
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
    return <ProfileSummarySkeleton />;
  }

  if (profileQuery.isError || !profile) {
    return (
      <BookingPanel className="border-destructive/20">
        <BookingPanelContent>
          <p className="text-sm text-destructive">
            Unable to load your profile information.
          </p>
        </BookingPanelContent>
      </BookingPanel>
    );
  }

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <BookingPanel>
          <BookingPanelContent className="space-y-6">
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
                <p>
                  {profile.isEmailVerified
                    ? "Email verified"
                    : "Email not verified"}
                </p>
                <p>Joined {formatDateLabel(profile.createdAt)}</p>
                <p>Last update {formatDateLabel(profile.updatedAt)}</p>
              </div>
            </div>
          </BookingPanelContent>
        </BookingPanel>

        <BookingPanel className="py-2">
          <BookingPanelHeader className="border-b border-border/70 pb-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <BookingPanelTitle className="text-2xl text-foreground">
                  Profile details
                </BookingPanelTitle>
                <p className="text-sm text-muted-foreground">
                  Review your self-service profile and save text changes
                  separately from the avatar upload.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setIsPasswordDialogOpen(true)}
              >
                <KeyRound className="h-4 w-4" />
                Change password
              </Button>
            </div>
          </BookingPanelHeader>

          <BookingPanelContent>
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
                  {isSavingProfile ? "Saving..." : "Save profile"}
                </Button>
              </div>
            </form>
          </BookingPanelContent>
        </BookingPanel>
      </div>

      <AvatarCropDialog
        open={Boolean(cropDialogImageSrc)}
        imageSrc={cropDialogImageSrc}
        isSubmitting={isUploadingAvatar}
        onOpenChange={(open) => {
          if (!open) closeCropDialog();
        }}
        onConfirm={handleConfirmAvatarCrop}
      />

      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={(open) => {
          setIsPasswordDialogOpen(open);
          if (!open) {
            passwordForm.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one for this
              account.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handlePasswordSave}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Current password
              </label>
              <Input
                type="password"
                {...passwordForm.register("currentPassword")}
              />
              {passwordForm.formState.errors.currentPassword ? (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                New password
              </label>
              <Input type="password" {...passwordForm.register("newPassword")} />
              {passwordForm.formState.errors.newPassword ? (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Confirm new password
              </label>
              <Input
                type="password"
                {...passwordForm.register("confirmPassword")}
              />
              {passwordForm.formState.errors.confirmPassword ? (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              ) : null}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  passwordForm.reset();
                  setIsPasswordDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !passwordForm.formState.isValid ||
                  !passwordForm.formState.isDirty ||
                  changePasswordMutation.isPending
                }
              >
                {changePasswordMutation.isPending ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="h-4 w-4" />
                )}
                {changePasswordMutation.isPending
                  ? "Updating..."
                  : "Change password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
