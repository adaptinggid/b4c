"use client";

import Link from "next/link";
import { Mark } from "./Mark";
import { BITEDU_X, BITEDU_TIKTOK } from "@/lib/constants";
import { useLanguage } from "./LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <div className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <Link href="/" className="brand" style={{ marginBottom: 10 }}>
              <Mark size={30} />
              <span className="brand-text">
                <b>{t("hero_title")}</b>
                <span>An initiative by BitEdu Network</span>
              </span>
            </Link>
            <p style={{ maxWidth: 340, color: "var(--ink-soft)", fontSize: ".88rem", marginTop: 14 }}>
              {t("hero_desc")}
            </p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h5>{t("footer_explore") || "Explore"}</h5>
              <Link href="/learn">{t("nav_learn")}</Link>
              <Link href="/create">{t("nav_create")}</Link>
              <Link href="/discover">{t("nav_collaborate")}</Link>
              <Link href="/about">{t("nav_about")}</Link>
              <Link href="/support">{t("nav_support")}</Link>
            </div>
            <div className="footer-col">
              <h5>{t("footer_legal") || "Legal & Policy"}</h5>
              <Link href="/terms">{t("legal_terms")}</Link>
              <Link href="/privacy">{t("legal_privacy")}</Link>
            </div>
            <div className="footer-col">
              <h5>BitEdu Network</h5>
              <a href={BITEDU_X} target="_blank" rel="noopener noreferrer">
                X / Twitter ↗
              </a>
              <a href={BITEDU_TIKTOK} target="_blank" rel="noopener noreferrer">
                TikTok ↗
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} BitEdu Network. Creators retain ownership of their work. ·{" "}
            <Link href="/terms" style={{ textDecoration: "underline" }}>{t("legal_terms")}</Link> ·{" "}
            <Link href="/privacy" style={{ textDecoration: "underline" }}>{t("legal_privacy")}</Link>
          </span>
          <span style={{ opacity: 0.7 }}>Proof of Work — built by creatives, for creatives.</span>
        </div>
      </div>
    </div>
  );
}
