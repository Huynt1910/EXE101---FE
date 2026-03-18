export { isLanguage, languages, type Language } from "./config";

import type { Language } from "./config";
import enCommon from "./locales/en/common.json";
import enFaq from "./locales/en/faq.json";
import enHome from "./locales/en/home.json";
import enProfile from "./locales/en/profile.json";
import viCommon from "./locales/vi/common.json";
import viFaq from "./locales/vi/faq.json";
import viHome from "./locales/vi/home.json";
import viProfile from "./locales/vi/profile.json";

export const localeMessages = {
  vi: {
    common: viCommon,
    home: viHome,
    faq: viFaq,
    profile: viProfile,
  },
  en: {
    common: enCommon,
    home: enHome,
    faq: enFaq,
    profile: enProfile,
  },
} as const;

export type LocaleNamespace = keyof (typeof localeMessages)["en"];

export function getLocaleBundle(language: Language) {
  return localeMessages[language];
}

export function getLocaleNamespace<NS extends LocaleNamespace>(
  language: Language,
  namespace: NS,
) {
  return localeMessages[language][namespace];
}

export function getHomepageContent(language: Language) {
  const bundle = getLocaleBundle(language);
  return {
    ...bundle.home,
    faq: bundle.faq,
  };
}

export function getCommonMessages(language: Language) {
  return getLocaleNamespace(language, "common");
}
