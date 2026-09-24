import { LightningBox } from "@/components/LightningBox";
import { BITEDU_LIGHTNING, BITEDU_X, BITEDU_TIKTOK } from "@/lib/constants";

export default function SupportPage() {
  return (
    <>
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <span className="eyebrow">Support</span>
          <h1 style={{ fontSize: "2.4rem", maxWidth: 600 }}>Support Bitcoin for Creatives</h1>
          <p className="lede">
            Support helps B4C continue creating educational opportunities, creative programmes, collaborations and
            community initiatives.
          </p>
        </div>
      </section>
      <section className="section-tight section-border-t">
        <div className="wrap">
          <div className="grid-2">
            <div className="side-card">
              <h4 style={{ marginBottom: 6 }}>⚡ Support BitEdu Network</h4>
              <p style={{ color: "var(--ink-soft)", fontSize: ".9rem" }}>
                Send sats directly to BitEdu Network via Lightning. Nothing is custodied by this platform — the
                payment goes straight from your wallet to theirs.
              </p>
              <LightningBox address={BITEDU_LIGHTNING} />
            </div>
            <div className="side-card">
              <h4 style={{ marginBottom: 6 }}>Other ways to help</h4>
              <ul style={{ color: "var(--ink-soft)", fontSize: ".9rem", paddingLeft: 18, margin: 0 }}>
                <li style={{ marginBottom: 8 }}>Share B4C with a creative you know.</li>
                <li style={{ marginBottom: 8 }}>
                  Follow along on{" "}
                  <a href={BITEDU_X} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                    X
                  </a>{" "}
                  and{" "}
                  <a href={BITEDU_TIKTOK} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                    TikTok
                  </a>
                  .
                </li>
                <li>Support individual creators directly on their profile pages.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
