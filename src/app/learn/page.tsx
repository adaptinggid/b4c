import Link from "next/link";
import { REGISTER_LINK } from "@/lib/constants";

export default function LearnPage() {
  return (
    <>
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <span className="eyebrow">Learn</span>
          <h1 style={{ fontSize: "2.6rem", maxWidth: 640 }}>Understand Bitcoin. Explore the ecosystem.</h1>
          <p className="lede">
            B4C creates accessible pathways for creatives to understand Bitcoin and discover where their skills can
            fit — starting with a five-day bootcamp, and continuing well past it.
          </p>
          <a href={REGISTER_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Join the movement ↗
          </a>
        </div>
      </section>

      <section className="section section-border-t">
        <div className="wrap">
          <div className="grid-2">
            <div>
              <h3 style={{ fontSize: "1.5rem" }}>Bitcoin for Creatives — 5-Day Bootcamp</h3>
              <p style={{ color: "var(--ink-soft)" }}>28 September – 2 October · 6:30–8:00 PM WAT</p>
              <p style={{ color: "var(--ink-soft)" }}>
                The programme moves from Bitcoin fundamentals, through the creative economy, into practical creative
                projects and positioning within the ecosystem.
              </p>
              <a href={REGISTER_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                Book a slot ↗
              </a>
            </div>
            <div className="side-card">
              <h4 style={{ fontSize: "1rem", marginBottom: 14 }}>The framework</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <b>Learn</b>
                  <p style={{ margin: "2px 0 0", fontSize: ".88rem", color: "var(--ink-soft)" }}>
                    Foundational knowledge about Bitcoin and the ecosystem.
                  </p>
                </div>
                <div>
                  <b>Create</b>
                  <p style={{ margin: "2px 0 0", fontSize: ".88rem", color: "var(--ink-soft)" }}>
                    Apply what you learn through your own creative skills.
                  </p>
                </div>
                <div>
                  <b>Collaborate</b>
                  <p style={{ margin: "2px 0 0", fontSize: ".88rem", color: "var(--ink-soft)" }}>
                    Discover other creatives and connect around shared ideas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-border-t">
        <div className="wrap">
          <h3 style={{ fontSize: "1.4rem", marginBottom: 18 }}>Already been through B4C?</h3>
          <p className="lede" style={{ fontSize: "1rem" }}>
            Once the B4C team has confirmed your participation, build your public profile here and publish your
            first piece of work.
          </p>
          <Link href="/create" className="btn btn-primary">
            Create your profile
          </Link>
        </div>
      </section>
    </>
  );
}
