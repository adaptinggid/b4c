import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectRow, CreatorRow, XPRow } from "./AdminRows";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") {
    return (
      <section className="section" style={{ paddingTop: 64 }}>
        <div className="wrap">
          <div className="empty">
            <h4>Admin access required</h4>
            <p>Your account doesn&rsquo;t have admin permissions.</p>
          </div>
        </div>
      </section>
    );
  }

  const { tab: tabParam } = await searchParams;
  const tab = tabParam === "creators" ? "creators" : tabParam === "xp" ? "xp" : "projects";

  const [creatorCount, pendingProjectCount, publishedProjectCount, xpCount] = await Promise.all([
    prisma.creatorProfile.count(),
    prisma.project.count({ where: { status: "PENDING" } }),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.xPTransaction.count(),
  ]);

  let content;
  if (tab === "projects") {
    const projects = await prisma.project.findMany({
      include: { creator: { select: { displayName: true } }, xpTransactions: { select: { amount: true } } },
      orderBy: { createdAt: "desc" },
    });
    content = projects.length ? (
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Creator</th>
            <th>Category</th>
            <th>Status</th>
            <th>XP</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <ProjectRow
              key={p.id}
              id={p.id}
              title={p.title}
              creatorName={p.creator.displayName}
              category={p.category}
              status={p.status}
              xp={p.xpTransactions.reduce((s, t) => s + t.amount, 0)}
            />
          ))}
        </tbody>
      </table>
    ) : (
      <div className="empty">
        <h4>No projects yet</h4>
        <p>Nothing has been submitted.</p>
      </div>
    );
  } else if (tab === "creators") {
    const creators = await prisma.creatorProfile.findMany({
      include: { projects: { include: { xpTransactions: { select: { amount: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    content = creators.length ? (
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Status</th>
            <th>Participant</th>
            <th>XP</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {creators.map((c) => (
            <CreatorRow
              key={c.id}
              id={c.id}
              name={c.displayName}
              category={c.category}
              status={c.status}
              participant={c.participant}
              xp={c.projects.reduce((s, p) => s + p.xpTransactions.reduce((s2, t) => s2 + t.amount, 0), 0)}
            />
          ))}
        </tbody>
      </table>
    ) : (
      <div className="empty">
        <h4>No creators yet</h4>
        <p>Nobody has created a profile.</p>
      </div>
    );
  } else {
    const xps = await prisma.xPTransaction.findMany({
      include: { project: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    content = xps.length ? (
      <table className="table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Amount</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {xps.map((t) => (
            <XPRow key={t.id} id={t.id} projectTitle={t.project.title} amount={t.amount} date={t.createdAt.toISOString()} />
          ))}
        </tbody>
      </table>
    ) : (
      <div className="empty">
        <h4>No XP transactions yet</h4>
        <p>Nobody has awarded XP.</p>
      </div>
    );
  }

  return (
    <section className="section" style={{ paddingTop: 48 }}>
      <div className="wrap">
        <span className="eyebrow">Admin</span>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>Dashboard</h1>
        <div className="grid-4" style={{ margin: "26px 0" }}>
          <div className="side-card" style={{ textAlign: "center" }}>
            <div className="xp-total" style={{ fontSize: "1.9rem" }}>
              {creatorCount}
            </div>
            <div style={{ fontSize: ".8rem", color: "var(--ink-soft)" }}>Registered creators</div>
          </div>
          <div className="side-card" style={{ textAlign: "center" }}>
            <div className="xp-total" style={{ fontSize: "1.9rem" }}>
              {pendingProjectCount}
            </div>
            <div style={{ fontSize: ".8rem", color: "var(--ink-soft)" }}>Pending review</div>
          </div>
          <div className="side-card" style={{ textAlign: "center" }}>
            <div className="xp-total" style={{ fontSize: "1.9rem" }}>
              {publishedProjectCount}
            </div>
            <div style={{ fontSize: ".8rem", color: "var(--ink-soft)" }}>Published works</div>
          </div>
          <div className="side-card" style={{ textAlign: "center" }}>
            <div className="xp-total" style={{ fontSize: "1.9rem" }}>
              {xpCount}
            </div>
            <div style={{ fontSize: ".8rem", color: "var(--ink-soft)" }}>XP transactions</div>
          </div>
        </div>
        <div className="admin-tabs">
          <Link href="/admin?tab=projects" className={tab === "projects" ? "on" : ""}>
            Projects
          </Link>
          <Link href="/admin?tab=creators" className={tab === "creators" ? "on" : ""}>
            Creators
          </Link>
          <Link href="/admin?tab=xp" className={tab === "xp" ? "on" : ""}>
            XP
          </Link>
        </div>
        {content}
      </div>
    </section>
  );
}
