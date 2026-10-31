import type { Metadata } from "next";
import { GamePlayClient } from "@/components/game/GamePlayClient";

export const metadata: Metadata = {
  title: "Playing — Bitcoin Word Search — B4C",
};

interface PageProps {
  params: Promise<{ level: string }>;
}

export default async function GamePlayPage({ params }: PageProps) {
  const { level } = await params;
  return <GamePlayClient levelSlug={level} />;
}
