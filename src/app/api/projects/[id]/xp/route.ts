import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { XP_VALUES } from "@/lib/constants";

const schema = z.object({
  amount: z.number().refine((v) => (XP_VALUES as readonly number[]).includes(v), "Invalid XP amount"),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to award XP" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const already = await prisma.xPTransaction.findUnique({
    where: { projectId_userId: { projectId: id, userId: session.user.id } },
  });
  if (already) {
    return NextResponse.json({ error: "You've already given XP to this project" }, { status: 409 });
  }

  const tx = await prisma.xPTransaction.create({
    data: { projectId: id, userId: session.user.id, amount: parsed.data.amount },
  });

  const total = await prisma.xPTransaction.aggregate({
    where: { projectId: id },
    _sum: { amount: true },
  });

  return NextResponse.json({ tx, total: total._sum.amount ?? 0 }, { status: 201 });
}
