"use client";

import React from "react";
import { useLanguage } from "@/components/providers/language-provider";
import type { Language } from "@/lib/i18n";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`inline-flex items-center rounded-lg border border-white/10 bg-white/5 p-1 text-xs backdrop-blur-sm ${className}`}>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`flex items-center gap-1.5 rounded px-2 py-1 font-medium transition-all ${
          lang === "en"
            ? "bg-white/20 text-white shadow-sm"
            : "text-zinc-400 hover:text-zinc-200"
        }`}
        title="English"
      >
        <span>🇺🇸</span>
        <span>EN</span>
      </button>
      <button
        type="button"
        onClick={() => setLang("pt-BR")}
        className={`flex items-center gap-1.5 rounded px-2 py-1 font-medium transition-all ${
          lang === "pt-BR"
            ? "bg-white/20 text-white shadow-sm"
            : "text-zinc-400 hover:text-zinc-200"
        }`}
        title="Português (Brasil)"
      >
        <span>🇧🇷</span>
        <span>PT</span>
      </button>
    </div>
  );
}
