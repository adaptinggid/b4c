import Link from "next/link";
import type { Metadata } from "next";
import { WordSearchLanding } from "@/components/game/WordSearchLanding";

export const metadata: Metadata = {
  title: "Bitcoin Word Search — B4C Play",
  description:
    "Explore Bitcoin through an interactive word-search experience. Discover the language, technology, and ideas behind the Bitcoin ecosystem, one puzzle at a time.",
};

export default function WordSearchPage() {
  return <WordSearchLanding />;
}
