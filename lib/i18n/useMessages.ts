import { useLanguage } from "@/components/AppProviders";
import { messages } from "@/lib/i18n/messages";

export function useMessages() {
  const { language } = useLanguage();
  return messages[language];
}
