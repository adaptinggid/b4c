import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function projectsWithXp(where: Prisma.ProjectWhereInput) {
  const projects = await prisma.project.findMany({
    where,
    include: {
      creator: { select: { id: true, displayName: true } },
      xpTransactions: { select: { amount: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return projects.map((p) => ({
    ...p,
    xpTotal: p.xpTransactions.reduce((s, t) => s + t.amount, 0),
  }));
}

export async function creatorsWithXp(where: Prisma.CreatorProfileWhereInput) {
  const creators = await prisma.creatorProfile.findMany({
    where,
    include: {
      projects: { include: { xpTransactions: { select: { amount: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return creators.map((c) => ({
    ...c,
    xpTotal: c.projects.reduce((s, p) => s + p.xpTransactions.reduce((s2, t) => s2 + t.amount, 0), 0),
  }));
}
