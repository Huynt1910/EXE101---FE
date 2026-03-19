"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Camera, Mail, MapPin, Phone, Save, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useUserProfile,
  useUserProfileMutations,
} from "@/features/user/hooks/useUserProfile";
import type { UpdateUserProfileRequest } from "@/features/user/type";

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

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

export function ProfileSummaryCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileQuery = useUserProfile();
  const { updateProfileMutation, uploadAvatarMutation } =
    useUserProfileMutations();
  const [formState, setFormState] = useState<UpdateUserProfileRequest>({
    fullName: "",
    gender: "Male",
    phoneNumber: "",
    address: "",
    dateOfBirth: null,
    aboutMe: "",
  });

  useEffect(() => {
    const profile = profileQuery.data?.data;
    if (!profile) return;

    setFormState({
      fullName: profile.fullName || "",
      gender: profile.gender || "Male",
      phoneNumber: profile.phoneNumber || "",
      address: profile.address || "",
      dateOfBirth: profile.dateOfBirth || null,
      aboutMe: profile.aboutMe || "",
    });
  }, [profileQuery.data?.data]);

  const profile = profileQuery.data?.data;

  const hasChanges = useMemo(() => {
    if (!profile) return false;

    return (
      formState.fullName !== (profile.fullName || "") ||
      formState.gender !== (profile.gender || "Male") ||
      formState.phoneNumber !== (profile.phoneNumber || "") ||
      formState.address !== (profile.address || "") ||
      (formState.dateOfBirth || null) !== (profile.dateOfBirth || null) ||
      formState.aboutMe !== (profile.aboutMe || "")
    );
  }, [formState, profile]);

  const handleFieldChange = <K extends keyof UpdateUserProfileRequest>(
    key: K,
    value: UpdateUserProfileRequest[K],
  ) => {
    setFormState((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync(formState);
      toast.success("Profile updated successfully.");
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "Unable to update your profile.";

      toast.error(message);
    }
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadAvatarMutation.mutateAsync(file);
      toast.success("Avatar updated successfully.");
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "Unable to upload avatar.";

      toast.error(message);
    } finally {
      event.target.value = "";
    }
  };

  if (profileQuery.isLoading) {
    return (
      <section className="rounded-[1.75rem] bg-card p-5 shadow-sm md:p-6">
        <p className="text-sm text-muted-foreground">Loading profile...</p>
      </section>
    );
  }

  if (profileQuery.isError || !profile) {
    return (
      <section className="rounded-[1.75rem] bg-card p-5 shadow-sm md:p-6">
        <p className="text-sm text-destructive">
          Unable to load your profile information.
        </p>
      </section>
    );
  }

  return (
    <section className="relative rounded-[1.75rem] bg-card p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="shrink-0 space-y-4">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border border-border bg-secondary">
            {profile.profilePicture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.profilePicture}
                alt={profile.fullName || "Profile avatar"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-muted-foreground">
                <UserRound className="h-10 w-10" />
              </div>
            )}
          </div>

          <div className="space-y-2">
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
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadAvatarMutation.isPending}
            >
              <Camera className="mr-2 h-4 w-4" />
              {uploadAvatarMutation.isPending ? "Uploading..." : "Upload avatar"}
            </Button>

            <div className="rounded-2xl border border-border bg-secondary/40 p-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                {profile.isEmailVerified ? "Email verified" : "Email not verified"}
              </p>
              <p className="mt-1">
                Joined {formatDateLabel(profile.createdAt)}
              </p>
              <p className="mt-1">Last update {formatDateLabel(profile.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {profile.fullName || "Your profile"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your public information and contact details.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges || updateProfileMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {updateProfileMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Full name
              </label>
              <Input
                value={formState.fullName}
                onChange={(event) =>
                  handleFieldChange("fullName", event.target.value)
                }
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Gender
              </label>
              <select
                value={formState.gender || "Male"}
                onChange={(event) =>
                  handleFieldChange("gender", event.target.value)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="flex h-10 items-center rounded-md border border-input bg-secondary/40 px-3 text-sm text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                {profile.email}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Roles
              </label>
              <div className="flex min-h-10 flex-wrap items-center gap-2 rounded-md border border-input bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                {profile.roles && profile.roles.length > 0
                  ? profile.roles.join(", ")
                  : "User"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Phone number
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  value={formState.phoneNumber}
                  onChange={(event) =>
                    handleFieldChange("phoneNumber", event.target.value)
                  }
                  placeholder="Your phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Date of birth
              </label>
              <Input
                type="date"
                value={toDateInputValue(formState.dateOfBirth)}
                onChange={(event) =>
                  handleFieldChange(
                    "dateOfBirth",
                    event.target.value
                      ? `${event.target.value}T00:00:00.000Z`
                      : null,
                  )
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Address
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Textarea
                className="min-h-24 pl-9"
                value={formState.address}
                onChange={(event) =>
                  handleFieldChange("address", event.target.value)
                }
                placeholder="Your address"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              About me
            </label>
            <Textarea
              className="min-h-28"
              value={formState.aboutMe}
              onChange={(event) =>
                handleFieldChange("aboutMe", event.target.value)
              }
              placeholder="Tell travelers a little about yourself"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
