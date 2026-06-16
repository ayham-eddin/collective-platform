export type LanguageCode = "de" | "en" | "ar";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  shortLabel: string;
  flag: string;
}

export interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  languageOptions: LanguageOption[];
}
