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
  coverUrl: z.string().trim().max(1000).optional().or(z.literal("")).optional(),
  link: z.string().optional(),
  tags: z.array(z.string()).max(15).default([]),
  story: z.string().max(2000).optional(),
  collaborators: z.string().max(300).optional(),
  collabRequest: z.boolean().default(false),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const profile = await prisma.creatorProfile.findUnique({ where: { userId: session.user.id } });
  if (!profile) {
    return NextResponse.json({ error: "Create a creator profile before publishing work" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const d = parsed.data;
  const project = await prisma.project.create({
    data: {
      creatorId: profile.id,
      title: d.title,
      category: d.category,
      description: d.description,
      bitcoinConnection: d.bitcoinConnection,
      coverUrl: d.coverUrl || null,
      link: d.link || null,
      tags: d.tags,
      story: d.story || null,
      collaborators: d.collaborators || null,
      collabRequest: d.collabRequest,
      status: "PENDING",
    },
  });

  return NextResponse.json({ project }, { status: 201 });
}
