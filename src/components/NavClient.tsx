"use client";

import { useState } from "react";
import Link from "next/link";
import { Mark } from "./Mark";
import { SafeImage } from "./SafeImage";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "./LanguageContext";
import { REGISTER_LINK } from "@/lib/constants";

interface NavClientProps {
  user?: { id: string; role?: string } | null;
  myProfile?: { id: string; displayName: string; photoUrl: string | null } | null;
  signOutAction: () => Promise<void>;
}

export function NavClient({ user, myProfile, signOutAction }: NavClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand" onClick={() => setMobileMenuOpen(false)}>
          <Mark size={34} />
          <span className="brand-text">
            <b>Bitcoin for Creatives</b>
            <span>B4C · by BitEdu Network</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="nav-links">
          <Link href="/learn">{t("nav_learn")}</Link>
          <Link href="/create">{t("nav_create")}</Link>
          <Link href="/discover">{t("nav_collaborate")}</Link>
          <Link href="/about">{t("nav_about")}</Link>
          <Link href="/support">{t("nav_support")}</Link>
          {user?.role === "ADMIN" && <Link href="/admin">Admin</Link>}
        </nav>

        {/* Header Actions */}
        <div className="nav-actions">
          <LanguageSwitcher className="hide-mobile" />

          {user ? (
            <>
              <Link
                href={myProfile ? `/profile/${myProfile.id}` : "/create"}
                className="btn btn-ghost btn-sm nav-profile-btn"
                title="View your creator profile"
              >
                {myProfile?.photoUrl ? (
                  <SafeImage
                    src={myProfile.photoUrl}
                    alt=""
                    className="avatar"
                    style={{ width: 22, height: 22, border: "none" }}
                  />
                ) : (
                  <span style={{ fontSize: "1rem" }}>👤</span>
                )}
                <span>{t("nav_my_profile")}</span>
              </Link>
              <form action={signOutAction} className="hide-mobile">
                <button type="submit" className="btn btn-ghost btn-sm">{t("nav_sign_out")}</button>
              </form>
            </>
          ) : (
            <Link href="/signin" className="btn btn-ghost btn-sm hide-mobile">
              {t("nav_sign_in")}
            </Link>
          )}

          <a href={REGISTER_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm hide-mobile">
            {t("nav_join")}
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 6 }}>
              <LanguageSwitcher />
            </div>

            <Link href="/learn" onClick={() => setMobileMenuOpen(false)}>
              {t("nav_learn")}
            </Link>
            <Link href="/create" onClick={() => setMobileMenuOpen(false)}>
              {t("nav_create")}
            </Link>
            <Link href="/discover" onClick={() => setMobileMenuOpen(false)}>
              {t("nav_collaborate")}
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
              {t("nav_about")}
            </Link>
            <Link href="/support" onClick={() => setMobileMenuOpen(false)}>
              {t("nav_support")}
            </Link>
            {user?.role === "ADMIN" && (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                Admin
              </Link>
            )}

            <div style={{ height: 1, background: "var(--line)", margin: "8px 0" }} />

            {user ? (
              <>
                <Link
                  href={myProfile ? `/profile/${myProfile.id}` : "/create"}
                  className="btn btn-ghost btn-block"
                  style={{ justifyContent: "flex-start" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  👤 {t("nav_my_profile")}
                </Link>
                <form action={signOutAction}>
                  <button type="submit" className="btn btn-ghost btn-block" style={{ justifyContent: "flex-start" }}>
                    {t("nav_sign_out")}
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/signin"
                className="btn btn-ghost btn-block"
                style={{ justifyContent: "flex-start" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav_sign_in")}
              </Link>
            )}

            <a
              href={REGISTER_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-block"
              style={{ textAlign: "center", marginTop: 6 }}
            >
              {t("nav_join")} ↗
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
