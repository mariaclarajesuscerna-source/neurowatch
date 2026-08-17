"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getTranslations,
  type Language,
  type TranslationKey,
} from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext =
  createContext<LanguageContextType | null>(null);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<Language>("es");

  useEffect(() => {
    const saved =
      window.localStorage.getItem(
        "neurowatch-language"
      );

    if (saved === "es" || saved === "qu") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (
    newLanguage: Language
  ) => {
    setLanguageState(newLanguage);

    window.localStorage.setItem(
      "neurowatch-language",
      newLanguage
    );

    document.documentElement.lang =
      newLanguage === "es"
        ? "es"
        : "qu";
  };

  const toggleLanguage = () => {
    setLanguage(
      language === "es"
        ? "qu"
        : "es"
    );
  };

  const dictionary =
    getTranslations(language);

  const t = (
    key: TranslationKey
  ) => dictionary[key];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context =
    useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage debe utilizarse dentro de LanguageProvider"
    );
  }

  return context;
}
