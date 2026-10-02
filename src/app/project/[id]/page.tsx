import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LightningBox } from "@/components/LightningBox";
import { SafeImage } from "@/components/SafeImage";
import { XPButtons } from "./XPButtons";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      creator: true,
      xpTransactions: { select: { amount: true, userId: true } },
    },
  });

  if (!project) notFound();

  const isMine = !!session?.user && project.creator.userId === session.user.id;
  const isAdmin = session?.user?.role === "ADMIN";
  if (project.status !== "PUBLISHED" && !isMine && !isAdmin) notFound();

  const xpTotal = project.xpTransactions.reduce((s, t) => s + t.amount, 0);
  const alreadyVoted = session?.user ? project.xpTransactions.some((t) => t.userId === session.user.id) : false;

  const isNonImageCover =
    !!project.coverUrl &&
    (project.coverUrl.endsWith(".pdf") ||
      project.coverUrl.endsWith(".zip") ||
      project.coverUrl.endsWith(".mp3") ||
      project.coverUrl.endsWith(".mp4") ||
      project.coverUrl.endsWith(".txt") ||
      project.coverUrl.endsWith(".md"));

  const fallbackCategoryBox = (
    <div
      className="detail-cover"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--ink-soft)",
        marginBottom: 22,
        fontFamily: "Fraunces, serif",
      }}
    >
      {project.category}
    </div>
  );

  return (
    <section className="section" style={{ paddingTop: 44 }}>
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <Link href="/discover" style={{ fontSize: ".85rem", color: "var(--ink-soft)" }}>
            ← Back to discover
          </Link>

          {(isMine || isAdmin) && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className={`status-tag st-${project.status}`}>
                {project.status.charAt(0) + project.status.slice(1).toLowerCase()}
              </span>
              <Link href={`/project/${project.id}/edit`} className="btn btn-outline btn-sm">
                ✏️ Edit project
              </Link>
            </div>
          )}
        </div>

        <div style={{ marginTop: 18 }} className="detail-hero">
          <div>
            <span className="card-cat">{project.category}</span>
            <h1 style={{ fontSize: "2.1rem", margin: "6px 0 14px" }}>{project.title}</h1>

            {project.coverUrl ? (
              isNonImageCover ? (
                <div
                  className="detail-cover"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    marginBottom: 22,
                    padding: 24,
                    background: "var(--bg-subtle, #f9f9f9)",
                    border: "1px dashed var(--border, #ccc)",
                    borderRadius: 8,
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>📄</span>
                  <div style={{ fontWeight: 600 }}>Attached Project File</div>
                  <a
                    href={project.coverUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    View / Download Attachment ↗
                  </a>
                </div>
              ) : (
                <SafeImage
                  src={project.coverUrl}
                  alt={project.title}
                  className="detail-cover"
                  style={{ marginBottom: 22 }}
                  fallback={fallbackCategoryBox}
                />
              )
            ) : (
              fallbackCategoryBox
            )}

            <p style={{ fontSize: "1.05rem", color: "var(--ink-soft)" }}>{project.description}</p>
            {project.story && (
              <>
                <h4 style={{ fontSize: "1rem", marginTop: 26 }}>The story</h4>
                <p style={{ color: "var(--ink-soft)" }}>{project.story}</p>
              </>
            )}
            <h4 style={{ fontSize: "1rem", marginTop: 26 }}>Bitcoin connection</h4>
            <p style={{ color: "var(--ink-soft)" }}>{project.bitcoinConnection}</p>
            {project.collaborators && (
              <>
                <h4 style={{ fontSize: "1rem", marginTop: 26 }}>Collaborators</h4>
                <p style={{ color: "var(--ink-soft)" }}>{project.collaborators}</p>
              </>
            )}
            {!!project.tags.length && (
              <div className="pill-row" style={{ marginTop: 18 }}>
                {project.tags.map((t) => (
                  <span className="chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            {project.link && (
              <div style={{ marginTop: 22 }}>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                  View the work ↗
                </a>
              </div>
            )}
          </div>

          <div>
            <div className="side-card" style={{ textAlign: "center" }}>
              <div className="xp-total">{xpTotal}</div>
              <div style={{ fontSize: ".8rem", color: "var(--ink-soft)", marginBottom: 4 }}>Total XP</div>
              <XPButtons projectId={project.id} signedIn={!!session?.user} alreadyVoted={alreadyVoted} />
            </div>
            <div className="side-card">
              <div className="profile-header" style={{ alignItems: "center", gap: 14 }}>
                <SafeImage
                  src={project.creator.photoUrl}
                  alt={project.creator.displayName}
                  className="avatar"
                  fallback={
                    <div className="avatar avatar-fallback">{project.creator.displayName.charAt(0)}</div>
                  }
                />
                <div>
                  <div style={{ fontWeight: 600 }}>{project.creator.displayName}</div>
                  <div style={{ fontSize: ".8rem", color: "var(--ink-soft)" }}>{project.creator.category}</div>
                </div>
              </div>
              <Link href={`/profile/${project.creatorId}`} className="btn btn-ghost btn-sm btn-block" style={{ marginTop: 14 }}>
                View creator
              </Link>
            </div>
            <div className="side-card">
              <h4 style={{ fontSize: ".92rem", marginBottom: 6 }}>⚡ Support this creator</h4>
              <LightningBox address={project.creator.lightningAddress} creatorName={project.creator.displayName} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
