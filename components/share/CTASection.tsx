"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/share/AppProviders";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const API_URL = "https://bonddyplatform.onrender.com/api/Contacts";

type ContactPayload = {
  name: string;
  gmail: string;
  phoneNumber: string;
};

type Status = "idle" | "loading" | "success" | "error";

function isObjectWithMessage(x: unknown): x is { message?: string } {
  return typeof x === "object" && x !== null && "message" in x;
}

export default function CTALeadFormSection() {
  const { language } = useLanguage();
  const content = {
    vi: {
      sectionTitle: "Đăng ký nhận thông báo",
      sectionDesc:
        "Để lại thông tin, chúng tôi sẽ thông báo khi website chính thức ra mắt.",
      button: "Nhận thông báo",
      dialogTitle: "Đăng ký ngay",
      dialogDesc:
        "Vui lòng để lại thông tin liên hệ, Bonddy sẽ thông báo về website sớm nhất cho bạn.",
      nameLabel: "Họ và tên",
      namePlaceholder: "Ví dụ: Nguyễn Văn A",
      emailLabel: "Gmail",
      emailPlaceholder: "user@gmail.com",
      phoneLabel: "Số điện thoại",
      phonePlaceholder: "Ví dụ: 09xx xxx xxx",
      submitIdle: "Đăng ký ngay",
      submitLoading: "Đang gửi...",
      successTitle: "Gửi yêu cầu thành công!",
      successDesc: "Cảm ơn bạn. Chúng tôi sẽ liên hệ trong vòng 24 giờ.",
      close: "Đóng",
      errorFallback: "Có lỗi xảy ra. Vui lòng thử lại.",
      errorServer: "Gửi yêu cầu thất bại. Vui lòng thử lại.",
    },
    en: {
      sectionTitle: "Start your trip the right way",
      sectionDesc:
        "Leave your details and we will reach out with a tailored plan within 24 hours.",
      button: "Get started",
      dialogTitle: "Quick consultation",
      dialogDesc:
        "Leave your contact info and Bonddy will get back to you soon.",
      nameLabel: "Full name",
      namePlaceholder: "Example: Alex Nguyen",
      emailLabel: "Email",
      emailPlaceholder: "user@gmail.com",
      phoneLabel: "Phone number",
      phonePlaceholder: "Example: 09xx xxx xxx",
      submitIdle: "Get started",
      submitLoading: "Sending...",
      successTitle: "Request sent successfully!",
      successDesc: "Thanks! We will reach out within 24 hours.",
      close: "Close",
      errorFallback: "Something went wrong. Please try again.",
      errorServer: "Request failed. Please try again.",
    },
  } as const;
  const t = content[language];

  const [form, setForm] = useState<ContactPayload>({
    name: "",
    gmail: "",
    phoneNumber: "",
  });

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value } as ContactPayload));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const contentType = res.headers.get("content-type") || "";
      const data: unknown = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        const serverMsg =
          (isObjectWithMessage(data) &&
            typeof data.message === "string" &&
            data.message) ||
          (typeof data === "string" && data) ||
          t.errorServer;
        throw new Error(serverMsg);
      }

      setStatus("success");
      setForm({ name: "", gmail: "", phoneNumber: "" });
    } catch (err: unknown) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : t.errorFallback;
      setErrorMsg(msg);
    }
  }

  return (
    <section id="lead-form" className="bg-primary py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="pointer-events-none absolute -left-16 top-8 h-36 w-36 rounded-full border-2 border-primary/20 opacity-40" />
        <div className="pointer-events-none absolute -right-10 bottom-6 h-24 w-24 rounded-full border-2 border-accent/30 opacity-40" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

        <h2 className="text-4xl text-center text-balance text-accent-foreground font-bold sm:text-4xl">
          {t.sectionTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-white text-center text-sm text-muted-foreground sm:text-base">
          {t.sectionDesc}
        </p>

        <div className="mt-8 flex justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="
    rounded-full
    bg-primary text-accent-foreground
    border border-accent-foreground
    transition-colors duration-200
    hover:bg-accent-foreground hover:text-primary
    hover:border-primary
  "
              >
                {t.button}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border border-border bg-background p-0 sm:max-w-[560px]">
              <div className="rounded-2xl p-6 sm:p-8">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center text-2xl font-bold text-foreground">
                    {t.dialogTitle}
                  </AlertDialogTitle>
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    {t.dialogDesc}
                  </p>
                </AlertDialogHeader>

                {status !== "success" ? (
                  <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        {t.nameLabel}
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        required
                        placeholder={t.namePlaceholder}
                        autoComplete="name"
                        className="w-full rounded-lg border bg-input px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                        disabled={status === "loading"}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        {t.emailLabel}
                      </label>
                      <input
                        type="email"
                        name="gmail"
                        value={form.gmail}
                        onChange={onChange}
                        required
                        placeholder={t.emailPlaceholder}
                        autoComplete="email"
                        className="w-full rounded-lg border bg-input px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                        disabled={status === "loading"}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        {t.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={onChange}
                        required
                        placeholder={t.phonePlaceholder}
                        autoComplete="tel"
                        className="w-full rounded-lg border bg-input px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                        disabled={status === "loading"}
                      />
                    </div>

                    {status === "error" && (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                        {errorMsg}
                      </div>
                    )}

                    <div className="flex justify-center">
                      <Button
                        type="submit"
                        className="w-1/2 rounded-full bg-accent p-3 text-sm font-semibold text-accent-foreground hover:opacity-90"
                        disabled={status === "loading"}
                      >
                        {status === "loading" ? t.submitLoading : t.submitIdle}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-6 rounded-xl border bg-card p-5 text-center">
                    <h3 className="text-base font-semibold text-foreground">
                      {t.successTitle}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t.successDesc}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex justify-center">
                  <AlertDialogCancel className="rounded-full border border-border bg-background px-6 py-2 text-sm text-foreground hover:bg-secondary">
                    {t.close}
                  </AlertDialogCancel>
                </div>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </section>
  );
}
