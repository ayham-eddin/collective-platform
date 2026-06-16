import { useEffect, useMemo, useState, type ReactNode } from "react";
import { LanguageContext, languageOptions } from "./languageContextCore";
import type { LanguageCode } from "./language.types";

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const storedLanguage = localStorage.getItem("language");

    if (
      storedLanguage === "de" ||
      storedLanguage === "en" ||
      storedLanguage === "ar"
    ) {
      return storedLanguage;
    }

    return "de";
  });

  const setLanguage = (nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage);
    localStorage.setItem("language", nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      languageOptions,
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
