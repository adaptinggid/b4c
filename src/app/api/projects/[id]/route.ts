import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/constants";

const schema = z.object({
  title: z.string().min(1).max(120),
  category: z.enum(CATEGORIES),
  description: z.string().min(1).max(600),
  bitcoinConnection: z.string().min(1).max(600),
  coverUrl: z.string().trim().max(15000000).optional().or(z.literal("")).optional(),
  link: z.string().optional(),
  tags: z.array(z.string()).max(15).default([]),
  story: z.string().max(2000).optional(),
  collaborators: z.string().max(300).optional(),
  collabRequest: z.boolean().default(false),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({ include: { creator: true }, where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  if (project.creator.userId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const d = parsed.data;
  const updated = await prisma.project.update({
    where: { id },
    data: {
      title: d.title,
      category: d.category,
      description: d.description,
      bitcoinConnection: d.bitcoinConnection,
      coverUrl: d.coverUrl ?? null,
      link: d.link || null,
      tags: d.tags,
      story: d.story || null,
      collaborators: d.collaborators || null,
      collabRequest: d.collabRequest,
    },
  });

  return NextResponse.json({ project: updated });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({ include: { creator: true }, where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  if (project.creator.userId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
