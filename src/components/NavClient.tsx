"use client";

import { useState } from "react";
import Link from "next/link";
import { Mark } from "./Mark";
import { SafeImage } from "./SafeImage";
import { REGISTER_LINK } from "@/lib/constants";

interface NavClientProps {
  user?: { id: string; role?: string } | null;
  myProfile?: { id: string; displayName: string; photoUrl: string | null } | null;
  signOutAction: () => Promise<void>;
}

export function NavClient({ user, myProfile, signOutAction }: NavClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <Link href="/learn">Learn</Link>
          <Link href="/create">Create</Link>
          <Link href="/discover">Collaborate</Link>
          <Link href="/about">About</Link>
          <Link href="/support">Support</Link>
          {user?.role === "ADMIN" && <Link href="/admin">Admin</Link>}
        </nav>

        {/* Header Actions */}
        <div className="nav-actions">
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
                <span>My profile</span>
              </Link>
              <form action={signOutAction} className="hide-mobile">
                <button type="submit" className="btn btn-ghost btn-sm">Sign out</button>
              </form>
            </>
          ) : (
            <Link href="/signin" className="btn btn-ghost btn-sm hide-mobile">
              Sign in
            </Link>
          )}

          <a href={REGISTER_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm hide-mobile">
            Join B4C
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
            <Link href="/learn" onClick={() => setMobileMenuOpen(false)}>
              Learn
            </Link>
            <Link href="/create" onClick={() => setMobileMenuOpen(false)}>
              Create
            </Link>
            <Link href="/discover" onClick={() => setMobileMenuOpen(false)}>
              Collaborate
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/support" onClick={() => setMobileMenuOpen(false)}>
              Support
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
                  👤 My Profile
                </Link>
                <form action={signOutAction}>
                  <button type="submit" className="btn btn-ghost btn-block" style={{ justifyContent: "flex-start" }}>
                    Sign out
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
                Sign in
              </Link>
            )}

            <a
              href={REGISTER_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-block"
              style={{ textAlign: "center", marginTop: 6 }}
            >
              Join B4C ↗
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
