import Link from "next/link";
import { Mark } from "./Mark";
import { BITEDU_X, BITEDU_TIKTOK } from "@/lib/constants";

export function Footer() {
  return (
    <div className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <Link href="/" className="brand" style={{ marginBottom: 10 }}>
              <Mark size={30} />
              <span className="brand-text">
                <b>Bitcoin for Creatives</b>
                <span>An initiative by BitEdu Network</span>
              </span>
            </Link>
            <p style={{ maxWidth: 340, color: "var(--ink-soft)", fontSize: ".88rem", marginTop: 14 }}>
              A growing movement creating space for creatives to explore Bitcoin, showcase their skills and connect
              with others in the ecosystem.
            </p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h5>Explore</h5>
              <Link href="/learn">Learn</Link>
              <Link href="/create">Create</Link>
              <Link href="/discover">Collaborate</Link>
              <Link href="/about">About</Link>
              <Link href="/support">Support</Link>
            </div>
            <div className="footer-col">
              <h5>Legal &amp; Policy</h5>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/privacy">Privacy Policy</Link>
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
            <Link href="/terms" style={{ textDecoration: "underline" }}>Terms</Link> ·{" "}
            <Link href="/privacy" style={{ textDecoration: "underline" }}>Privacy</Link>
          </span>
          <span style={{ opacity: 0.7 }}>Proof of Work — built by creatives, for creatives.</span>
        </div>
      </div>
    </div>
  );
}
