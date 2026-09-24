import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/constants";

const schema = z.object({
  displayName: z.string().min(1).max(80),
  bio: z.string().min(1).max(600),
  country: z.string().min(1).max(80),
  category: z.enum(CATEGORIES),
  skills: z.array(z.string()).max(20).default([]),
  lightningAddress: z.string().min(3).max(160),
  participant: z.boolean().default(false),
  collaboration: z.boolean().default(false),
  photoUrl: z.string().url().optional().or(z.literal("")).optional(),
  website: z.string().optional(),
  x: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  telegram: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const profile = await prisma.creatorProfile.findUnique({ where: { id } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  if (profile.userId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const d = parsed.data;
  const updated = await prisma.creatorProfile.update({
    where: { id },
    data: {
      displayName: d.displayName,
      bio: d.bio,
      country: d.country,
      category: d.category,
      skills: d.skills,
      lightningAddress: d.lightningAddress,
      participant: d.participant,
      collaboration: d.collaboration,
      photoUrl: d.photoUrl || null,
      website: d.website || null,
      x: d.x || null,
      instagram: d.instagram || null,
      linkedin: d.linkedin || null,
      github: d.github || null,
      telegram: d.telegram || null,
    },
  });

  return NextResponse.json({ profile: updated });
}
