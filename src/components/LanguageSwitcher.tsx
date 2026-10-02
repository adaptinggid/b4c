"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import { LANGUAGES, Language } from "@/lib/i18n";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <div
      ref={ref}
      className={`lang-switcher ${className}`}
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={`Language: ${current.name}`}
        aria-expanded={open}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "1px solid var(--line, #DCD0B8)",
          borderRadius: "var(--radius, 3px)",
          padding: "6px 10px",
          cursor: "pointer",
          color: "var(--ink-soft, #4A4038)",
          fontSize: ".82rem",
          fontWeight: 600,
          lineHeight: 1,
          transition: "border-color .15s, color .15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--ink)";
          e.currentTarget.style.color = "var(--ink)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--line)";
          e.currentTarget.style.color = "var(--ink-soft)";
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="lang-switcher-label">{current.flag}</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            minWidth: 180,
            background: "var(--white, #FFFDF8)",
            border: "1px solid var(--line, #DCD0B8)",
            borderRadius: "var(--radius-lg, 5px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 100,
            overflow: "hidden",
          }}
          role="listbox"
          aria-label="Select language"
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              role="option"
              aria-selected={l.code === lang}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 14px",
                background: l.code === lang ? "var(--cream, #F7F1E4)" : "transparent",
                border: "none",
                borderBottom: "1px solid var(--line-soft, #E9E0CB)",
                cursor: "pointer",
                fontSize: ".86rem",
                fontWeight: l.code === lang ? 600 : 400,
                color: l.code === lang ? "var(--orange-deep, #9B4508)" : "var(--ink, #1C1712)",
                textAlign: "left",
                fontFamily: "inherit",
                transition: "background .1s",
              }}
              onMouseEnter={(e) => {
                if (l.code !== lang) e.currentTarget.style.background = "var(--cream-2, #EFE6D2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = l.code === lang ? "var(--cream)" : "transparent";
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>{l.flag}</span>
              <span>{l.name}</span>
              {l.code === lang && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginLeft: "auto" }}
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
