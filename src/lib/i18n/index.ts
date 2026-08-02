import enDict from "../../../messages/en.json";
import ptBrDict from "../../../messages/pt-BR.json";

export type Language = "en" | "pt-BR";
export type Dictionary = typeof enDict;

const dictionaries: Record<Language, Dictionary> = {
  en: enDict,
  "pt-BR": ptBrDict,
};

function resolveLanguageFromEnv(): Language {
  const envLang =
    process.env.NEXT_PUBLIC_LANGUAGE || process.env.NEXT_PUBLIC_LOCALE;
  if (envLang === "pt-BR" || envLang === "pt") return "pt-BR";
  return "en";
}

export const DEFAULT_LANGUAGE: Language = resolveLanguageFromEnv();

/**
 * Get the dictionary for a given language code.
 * Falls back to DEFAULT_LANGUAGE (from env) if lang is not provided,
 * or to English if the requested language is unsupported.
 */
export function getDictionary(lang?: string | null): Dictionary {
  if (lang && lang in dictionaries) {
    return dictionaries[lang as Language];
  }
  // When no lang is passed, use the env-configured default.
  return dictionaries[DEFAULT_LANGUAGE] ?? dictionaries.en;
}

/**
 * Helper to safely get nested translation strings by path (e.g. "Nav.dashboard").
 */
export function translate(
  lang: string | null | undefined,
  path: string,
  fallback?: string
): string {
  const dict = getDictionary(lang);
  const keys = path.split(".");
  let current: any = dict;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      return fallback ?? path;
    }
  }

  return typeof current === "string" ? current : fallback ?? path;
}
