"use client";

import React from "react";
import {
  type Language,
  type Dictionary,
  getDictionary,
  translate,
  DEFAULT_LANGUAGE,
} from "@/lib/i18n";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  dict: Dictionary;
  t: (path: string, fallback?: string) => string;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(
  undefined
);

const COOKIE_NAME = "lb_lang";

function getInitialLanguage(initialLang?: Language): Language {
  if (initialLang) return initialLang;
  if (typeof window !== "undefined") {
    const saved = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${COOKIE_NAME}=`))
      ?.split("=")[1];
    if (saved === "en" || saved === "pt-BR") {
      return saved as Language;
    }
  }
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = DEFAULT_LANGUAGE;
  const dict = React.useMemo(() => getDictionary(lang), [lang]);

  const t = React.useCallback(
    (path: string, fallback?: string) => translate(lang, path, fallback),
    [lang]
  );

  const value = React.useMemo(
    () => ({ lang, setLang: () => {}, dict, t }),
    [lang, dict, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    const dict = getDictionary(DEFAULT_LANGUAGE);
    return {
      lang: DEFAULT_LANGUAGE,
      setLang: () => {},
      dict,
      t: (path: string, fallback?: string) => translate(DEFAULT_LANGUAGE, path, fallback),
    };
  }
  return context;
}
