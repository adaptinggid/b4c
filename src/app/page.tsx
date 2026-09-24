import Link from "next/link";
import { projectsWithXp, creatorsWithXp } from "@/lib/data";
import { ProjectCard } from "@/components/ProjectCard";
import { CATEGORIES, REGISTER_LINK } from "@/lib/constants";

export default async function HomePage() {
  const projects = (await projectsWithXp({ status: "PUBLISHED" })).slice(0, 6);
  const creators = (await creatorsWithXp({ status: "APPROVED" }))
    .sort((a, b) => b.xpTotal - a.xpTotal)
    .slice(0, 5);

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-inner">
            <span className="eyebrow">An initiative by BitEdu Network</span>
            <h1>
              Bitcoin for
              <br />
              Creatives
            </h1>
            <div className="sub">Learn. Create. Collaborate.</div>
            <p className="desc">
              A growing movement creating space for creatives to explore Bitcoin, showcase their skills and connect
              with others contributing to the ecosystem.
            </p>
            <div className="cta-row" style={{ marginTop: 22 }}>
              <a href={REGISTER_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Join B4C
              </a>
              <Link href="/create" className="btn btn-outline">
                Create your profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="framework">
        <div className="fstep">
          <span className="fnum">01</span>
          <h3>Learn</h3>
          <p>Understand Bitcoin and explore where your creative skills fit in the ecosystem.</p>
          <a href={REGISTER_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
            Join the movement
          </a>
        </div>
        <div className="fstep">
          <span className="fnum">02</span>
          <h3>Create</h3>
          <p>Build a public creator profile and turn your skills and ideas into published work.</p>
          <Link href="/create" className="btn btn-ghost btn-sm">
            Create your profile
          </Link>
        </div>
        <div className="fstep">
          <span className="fnum">03</span>
          <h3>Collaborate</h3>
          <p>Discover creators and projects across the ecosystem, and find people to build with.</p>
          <Link href="/discover" className="btn btn-ghost btn-sm">
            Discover works
          </Link>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 26, flexWrap: "wrap", gap: 14 }}>
            <div>
              <span className="eyebrow">Recent works</span>
              <h2 style={{ margin: 0, fontSize: "1.9rem" }}>What creatives are making</h2>
            </div>
            <Link href="/discover" className="btn btn-ghost btn-sm">
              Explore all works
            </Link>
          </div>
          {projects.length ? (
            <div className="grid-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h4>No works published yet</h4>
              <p>Be the first to publish something.</p>
              <Link href="/upload" className="btn btn-primary btn-sm">
                Publish work
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="section section-border-t">
        <div className="wrap">
          <span className="eyebrow">Creative categories</span>
          <h2 style={{ fontSize: "1.9rem", marginBottom: 22 }}>Sixteen ways to contribute</h2>
          <div className="category-scroll">
            {CATEGORIES.map((cat) => (
              <Link key={cat} href={`/discover?cat=${encodeURIComponent(cat)}`} className="cat-pill">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-border-t">
        <div className="wrap">
          <div className="grid-2">
            <div>
              <span className="eyebrow">Recognition</span>
              <h2 style={{ fontSize: "1.9rem" }}>Top creators</h2>
              <p className="lede" style={{ fontSize: ".98rem" }}>
                XP reflects community recognition — not a rating, a form of contribution.
              </p>
            </div>
            <div className="side-card" style={{ marginTop: 6 }}>
              {creators.length ? (
                creators.map((c, i) => (
                  <div className="rank-row" key={c.id}>
                    <span className="rank-num">{String(i + 1).padStart(2, "0")}</span>
                    {c.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.photoUrl} className="avatar" style={{ width: 40, height: 40 }} alt="" />
                    ) : (
                      <div className="avatar avatar-fallback" style={{ width: 40, height: 40 }}>
                        {c.displayName.charAt(0)}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <Link href={`/profile/${c.id}`} style={{ fontWeight: 600, fontSize: ".92rem" }}>
                        {c.displayName}
                      </Link>
                      <div style={{ fontSize: ".78rem", color: "var(--ink-soft)" }}>{c.category}</div>
                    </div>
                    <span className="chip chip-xp">{c.xpTotal} XP</span>
                  </div>
                ))
              ) : (
                <p style={{ color: "var(--ink-soft)" }}>No creators yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-border-t">
        <div className="wrap">
          <div
            style={{
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-lg)",
              background: "var(--paper)",
              padding: "44px 40px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 30,
              flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: 520 }}>
              <h2 style={{ fontSize: "1.7rem" }}>Ready to join the movement?</h2>
              <p style={{ color: "var(--ink-soft)", margin: 0 }}>
                Bootcamp registration happens off-site. Once you&rsquo;re a participant, come back here to build your
                public profile and publish your first piece of work.
              </p>
            </div>
            <div className="cta-row">
              <a href={REGISTER_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Join B4C
              </a>
              <Link href="/create" className="btn btn-outline">
                Create profile
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
