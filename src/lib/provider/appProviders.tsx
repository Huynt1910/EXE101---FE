"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Toaster } from "sonner";
import { QueryProvider } from "./queryProvider";
import { isLanguage, type Language } from "@/i18n";
import { authStore } from "@/lib/store/authStore";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("vi");

  useEffect(() => {
    const stored = localStorage.getItem("language");
    if (stored && isLanguage(stored)) {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    authStore.restoreAuth();
  }, []);

  return (
    <QueryProvider>
      <LanguageProvider>
        {children}
        <Toaster
          position="bottom-center"
          richColors
          toastOptions={{ className: "font-sans" }}
        />
      </LanguageProvider>
    </QueryProvider>
  );
}
