"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { KeyRound, LoaderCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BookingPanel,
  BookingPanelContent,
  BookingPanelDescription,
  BookingPanelHeader,
  BookingPanelTitle,
} from "@/components/ui/booking-panel";
import { Input } from "@/components/ui/input";
import { handleApiError } from "@/lib/error-handler";
import { useChangePasswordMutation } from "@/features/auth/hooks/useChangePassword";

const securitySchema = z
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

type SecurityFormValues = z.infer<typeof securitySchema>;

export function ProfileSecuritySection() {
  const changePasswordMutation = useChangePasswordMutation();
  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      form.reset();
      toast.success("Password changed successfully.");
    } catch (error) {
      handleApiError(error, { showTitle: false });
    }
  });

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.8fr)]">
      <BookingPanel>
        <BookingPanelHeader className="border-b border-border/70">
          <BookingPanelTitle className="text-2xl">Security</BookingPanelTitle>
          <BookingPanelDescription>
            Update your password to keep your bookings, chats, and travel plans
            protected.
          </BookingPanelDescription>
        </BookingPanelHeader>
        <BookingPanelContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Current password
              </label>
              <Input type="password" {...form.register("currentPassword")} />
              {form.formState.errors.currentPassword ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.currentPassword.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                New password
              </label>
              <Input type="password" {...form.register("newPassword")} />
              {form.formState.errors.newPassword ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.newPassword.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Confirm new password
              </label>
              <Input type="password" {...form.register("confirmPassword")} />
              {form.formState.errors.confirmPassword ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.confirmPassword.message}
                </p>
              ) : null}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="rounded-xl"
                disabled={
                  !form.formState.isValid ||
                  !form.formState.isDirty ||
                  changePasswordMutation.isPending
                }
              >
                {changePasswordMutation.isPending ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="h-4 w-4" />
                )}
                {changePasswordMutation.isPending
                  ? "Updating…"
                  : "Change password"}
              </Button>
            </div>
          </form>
        </BookingPanelContent>
      </BookingPanel>

      <BookingPanel>
        <BookingPanelHeader className="border-b border-border/70">
          <BookingPanelTitle>Security guidance</BookingPanelTitle>
          <BookingPanelDescription>
            Keep this account ready for future bookings and payment actions.
          </BookingPanelDescription>
        </BookingPanelHeader>
        <BookingPanelContent className="space-y-4 text-sm text-muted-foreground">
          <div className="rounded-2xl border border-border/70 bg-white/90 p-4">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Recommended habits
            </div>
            <ul className="mt-3 space-y-2">
              <li>
                Use a password you do not reuse on other travel or payment
                services.
              </li>
              <li>
                Change your password immediately if you shared access with
                anyone else.
              </li>
              <li>
                Review messages and payment actions after updating security
                settings.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-white/90 p-4">
            <p className="font-medium text-foreground">What happens next</p>
            <p className="mt-2">
              After a successful change, your current session remains active,
              but new sensitive actions will use the updated password.
            </p>
          </div>
        </BookingPanelContent>
      </BookingPanel>
    </div>
  );
}
