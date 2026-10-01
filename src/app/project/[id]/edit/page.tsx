import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectEditForm } from "../ProjectEditForm";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/signin?callbackUrl=/project/${id}/edit`);
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: { creator: true },
  });

  if (!project) notFound();

  const isMine = project.creator.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isMine && !isAdmin) {
    notFound();
  }

  return (
    <>
      <section className="section" style={{ paddingTop: 44 }}>
        <div className="wrap">
          <Link href={`/project/${project.id}`} style={{ fontSize: ".85rem", color: "var(--ink-soft)" }}>
            ← Back to project details
          </Link>
          <div style={{ marginTop: 14 }}>
            <span className="eyebrow">Edit project</span>
            <h1 style={{ fontSize: "2.2rem", margin: "4px 0 10px" }}>{project.title}</h1>
            <p className="lede">Update your project details, cover image, or file attachments below.</p>
          </div>
        </div>
      </section>

      <section className="section-tight section-border-t">
        <div className="wrap">
          <ProjectEditForm project={project} />
        </div>
      </section>
    </>
  );
}
