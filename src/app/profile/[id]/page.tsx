import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LightningBox } from "@/components/LightningBox";
import { ProjectCard } from "@/components/ProjectCard";
import { SafeImage } from "@/components/SafeImage";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const creator = await prisma.creatorProfile.findUnique({
    where: { id },
    include: {
      projects: { include: { xpTransactions: { select: { amount: true } } }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!creator) notFound();

  const isMine = session?.user?.id === creator.userId;
  const isAdmin = session?.user?.role === "ADMIN";
  if (creator.status !== "APPROVED" && !isMine && !isAdmin) notFound();

  const projects = creator.projects.map((p) => ({
    ...p,
    xpTotal: p.xpTransactions.reduce((s, t) => s + t.amount, 0),
  }));
  const published = projects.filter((p) => p.status === "PUBLISHED");
  const others = projects.filter((p) => p.status !== "PUBLISHED");
  const xpTotal = projects.reduce((s, p) => s + p.xpTotal, 0);

  const avatarFallback = (
    <div className="avatar avatar-xl avatar-fallback" style={{ fontSize: "2.4rem" }}>
      {creator.displayName.charAt(0)}
    </div>
  );

  return (
    <section className="section" style={{ paddingTop: 48 }}>
      <div className="wrap">
        <div className="profile-header">
          <SafeImage
            src={creator.photoUrl}
            alt={creator.displayName}
            className="avatar avatar-xl"
            fallback={avatarFallback}
          />
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "2rem", margin: 0 }}>{creator.displayName}</h1>
              {creator.participant && <span className="badge-check">✓ B4C Participant</span>}
              {creator.status === "PENDING" && isMine && <span className="status-tag st-PENDING">Pending review</span>}
            </div>
            <p style={{ color: "var(--ink-soft)", margin: "6px 0" }}>
              {creator.category} · {creator.country}
            </p>
            <p style={{ maxWidth: 560, color: "var(--ink-soft)" }}>{creator.bio}</p>
            <div className="pill-row" style={{ margin: "12px 0" }}>
              {creator.skills.map((s) => (
                <span className="chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
            <div className="pill-row">
              <span className="chip chip-xp">{xpTotal} XP total</span>
              <span className={`chip ${creator.collaboration ? "chip-open" : "chip-closed"}`}>
                {creator.collaboration ? "Open to collaboration" : "Not currently open"}
              </span>
            </div>
            <div className="link-row">
              {creator.website && (
                <a href={creator.website} target="_blank" rel="noopener noreferrer">
                  Website ↗
                </a>
              )}
              {creator.x && (
                <a href={creator.x} target="_blank" rel="noopener noreferrer">
                  X ↗
                </a>
              )}
              {creator.instagram && (
                <a href={creator.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram ↗
                </a>
              )}
              {creator.linkedin && (
                <a href={creator.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn ↗
                </a>
              )}
              {creator.github && (
                <a href={creator.github} target="_blank" rel="noopener noreferrer">
                  GitHub ↗
                </a>
              )}
              {creator.telegram && (
                <a href={creator.telegram} target="_blank" rel="noopener noreferrer">
                  Telegram ↗
                </a>
              )}
            </div>
            {isMine && (
              <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                <Link href="/create" className="btn btn-outline btn-sm">
                  Edit profile
                </Link>
                <Link href="/upload" className="btn btn-primary btn-sm">
                  Publish work
                </Link>
              </div>
            )}
          </div>
          <div className="side-card" style={{ width: 260, flex: "0 0 auto" }}>
            <h4 style={{ fontSize: ".9rem", marginBottom: 6 }}>⚡ Support this creator</h4>
            <LightningBox address={creator.lightningAddress} creatorName={creator.displayName} />
          </div>
        </div>

        <div className="divider" />
        <h3 style={{ fontSize: "1.3rem" }}>Published work</h3>
        {published.length ? (
          <div className="grid-3">
            {published.map((p) => (
              <ProjectCard key={p.id} p={{ ...p, creator: { displayName: creator.displayName } }} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h4>No published work yet</h4>
            <p>{isMine ? "Publish your first project to show it here." : "This creator hasn't published anything yet."}</p>
            {isMine && (
              <Link href="/upload" className="btn btn-primary btn-sm">
                Publish work
              </Link>
            )}
          </div>
        )}

        {isMine && !!others.length && (
          <>
            <div className="divider" />
            <h3 style={{ fontSize: "1.2rem" }}>Your other work</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {others.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/project/${p.id}`}>{p.title}</Link>
                    </td>
                    <td>{p.category}</td>
                    <td>
                      <span className={`status-tag st-${p.status}`}>
                        {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </section>
  );
}
