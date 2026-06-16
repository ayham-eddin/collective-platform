import { createContext } from "react";
import type { LanguageContextValue, LanguageOption } from "./language.types";

export const languageOptions: LanguageOption[] = [
  {
    code: "de",
    label: "Deutsch",
    shortLabel: "DE",
    flag: "🇩🇪",
  },
  {
    code: "en",
    label: "English",
    shortLabel: "EN",
    flag: "🇬🇧",
  },
  {
    code: "ar",
    label: "العربية",
    shortLabel: "AR",
    flag: "🇸🇾",
  },
];

export const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);
