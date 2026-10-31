import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/game/progress — get user's game progress
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const progress = await prisma.gameProgress.findUnique({
    where: { userId: session.user.id },
  });

  const sessions = await prisma.gameSession.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  return NextResponse.json({
    progress: progress || {
      completedLevels: [],
      totalGamePoints: 0,
      totalWordsFound: 0,
    },
    sessions,
  });
}

// POST /api/game/progress — save completed game session
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { levelId, score, wordsFound, hintsUsed, elapsedSeconds, puzzleSeed, status } = body;

  if (!levelId || typeof score !== "number") {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  // Create or update game session
  const gameSession = await prisma.gameSession.create({
    data: {
      userId: session.user.id,
      levelId,
      score: Math.max(0, Math.min(score, 1000)), // cap score
      wordsFound: wordsFound || [],
      hintsUsed: hintsUsed || 0,
      elapsedSeconds: elapsedSeconds || 0,
      puzzleSeed: puzzleSeed || 0,
      status: status === "COMPLETED" ? "COMPLETED" : "PLAYING",
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
  });

  // Update progress if completed
  if (status === "COMPLETED") {
    await prisma.gameProgress.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        completedLevels: [levelId],
        totalGamePoints: score,
        totalWordsFound: (wordsFound || []).length,
        lastPlayedAt: new Date(),
      },
      update: {
        completedLevels: {
          push: levelId,
        },
        totalGamePoints: {
          increment: score,
        },
        totalWordsFound: {
          increment: (wordsFound || []).length,
        },
        lastPlayedAt: new Date(),
      },
    });
  }

  return NextResponse.json({ session: gameSession });
}
