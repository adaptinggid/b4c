import Link from "next/link";
import { SafeImage } from "./SafeImage";

export type ProjectCardData = {
  id: string;
  title: string;
  category: string;
  coverUrl: string | null;
  collabRequest: boolean;
  creator: { displayName: string } | null;
  xpTotal: number;
};

export function ProjectCard({ p }: { p: ProjectCardData }) {
  const isNonImage =
    !!p.coverUrl &&
    (p.coverUrl.endsWith(".pdf") ||
      p.coverUrl.endsWith(".zip") ||
      p.coverUrl.endsWith(".mp3") ||
      p.coverUrl.endsWith(".mp4") ||
      p.coverUrl.endsWith(".txt") ||
      p.coverUrl.endsWith(".md"));

  const fallbackBox = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--ink-soft)",
        fontFamily: "Fraunces, serif",
        fontSize: ".85rem",
        background: "var(--bg-subtle, #f5f5f5)",
      }}
    >
      {p.category}
    </div>
  );

  return (
    <Link href={`/project/${p.id}`} className="card">
      <div className="card-media">
        {p.coverUrl && !isNonImage ? (
          <SafeImage src={p.coverUrl} alt={p.title} fallback={fallbackBox} />
        ) : (
          fallbackBox
        )}
      </div>
      <div className="card-body">
        <span className="card-cat">{p.category}</span>
        <h4>{p.title}</h4>
        <p style={{ fontSize: ".86rem", color: "var(--ink-soft)", margin: 0 }}>
          by {p.creator ? p.creator.displayName : "Unknown creator"}
        </p>
        <div className="card-meta">
          <span className="chip chip-xp">{p.xpTotal} XP</span>
          {p.collabRequest && <span className="chip chip-open">Seeking collab</span>}
        </div>
      </div>
    </Link>
  );
}
