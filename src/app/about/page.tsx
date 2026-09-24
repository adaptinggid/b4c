import { BITEDU_X, BITEDU_TIKTOK } from "@/lib/constants";

export default function AboutPage() {
  return (
    <>
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <span className="eyebrow">About</span>
          <h1 style={{ fontSize: "2.6rem", maxWidth: 640 }}>A creative network emerging from the Bitcoin ecosystem.</h1>
        </div>
      </section>
      <section className="section-tight section-border-t">
        <div className="wrap">
          <div className="about-block">
            <h3>What is Bitcoin for Creatives?</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              Bitcoin for Creatives (B4C) is a BitEdu Network initiative created to bring creatives into the Bitcoin
              ecosystem, help them understand the space, explore opportunities, and discover how their skills can
              contribute. B4C is more than a bootcamp — it&rsquo;s the first phase of an ongoing movement.
            </p>
          </div>
          <div className="about-block">
            <h3>Why it exists</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              Contribution to Bitcoin extends far beyond technical development. Writers, designers, filmmakers,
              musicians and researchers all have a role to play — B4C exists to make that role visible and give it a
              home.
            </p>
          </div>
          <div className="about-block">
            <h3>Who it&rsquo;s for</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              B4C is for people already creating, and for people just beginning to explore creative work — whether
              they&rsquo;re deep in the Bitcoin ecosystem already or completely new to it.
            </p>
          </div>
          <div className="about-block">
            <h3>What we want to achieve</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              A growing, self-sustaining network of Bitcoin creatives who learn together, publish real work, and find
              each other to collaborate — long after any single bootcamp ends.
            </p>
          </div>
          <div className="about-block">
            <h3>The framework</h3>
            <p
              style={{
                color: "var(--orange-deep)",
                fontFamily: "Fraunces, serif",
                fontSize: "1.3rem",
                fontStyle: "italic",
              }}
            >
              Learn → Create → Collaborate
            </p>
          </div>
          <div className="about-block">
            <h3>The future</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              B4C is intended to grow beyond a single bootcamp into an ongoing creative network and ecosystem — with
              new cohorts, new work, and a growing directory of Bitcoin creatives.
            </p>
          </div>
          <div className="divider" />
          <div className="about-block">
            <h3>BitEdu Network</h3>
            <p style={{ color: "var(--ink-soft)" }}>
              BitEdu Network is a nonprofit Bitcoin education initiative focused on making quality Bitcoin education
              more accessible, practical and easier to navigate. Bitcoin for Creatives is an initiative of BitEdu
              Network.
            </p>
            <div className="link-row">
              <a href={BITEDU_X} target="_blank" rel="noopener noreferrer">
                X / Twitter ↗
              </a>
              <a href={BITEDU_TIKTOK} target="_blank" rel="noopener noreferrer">
                TikTok ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
