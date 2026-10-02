"use client";

import { useLanguage } from "./LanguageContext";
import { LANGUAGES, Language } from "@/lib/i18n";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`lang-switcher ${className}`} style={{ display: "inline-flex", alignItems: "center" }}>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Language)}
        style={{
          background: "var(--white, #FFFDF8)",
          border: "1px solid var(--line, #DCD0B8)",
          borderRadius: 4,
          padding: "4px 8px",
          fontSize: ".8rem",
          fontWeight: 600,
          color: "var(--ink)",
          cursor: "pointer",
        }}
        aria-label="Select Language"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.flag} {l.name}
          </option>
        ))}
      </select>
    </div>
  );
}
