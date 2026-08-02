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
export const DEFAULT_TIMEZONE: string = process.env.NEXT_PUBLIC_TIMEZONE || "UTC";

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

/**
 * Format a YYYY-MM-DD or ISO date string using language and timezone from env/props.
 */
export function formatDateLabel(
  isoDate: string,
  lang: string = DEFAULT_LANGUAGE,
  tz: string = DEFAULT_TIMEZONE
): string {
  const d = new Date(isoDate.includes("T") ? isoDate : isoDate + "T00:00:00Z");
  const locale = lang === "pt-BR" || lang === "pt" ? "pt-BR" : "en-US";
  try {
    return d.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      timeZone: tz,
    });
  } catch {
    return d.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  }
}
