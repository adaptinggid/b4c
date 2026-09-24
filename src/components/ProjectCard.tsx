import Link from "next/link";

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
  return (
    <Link href={`/project/${p.id}`} className="card">
      <div className="card-media">
        {p.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.coverUrl} alt="" />
        ) : (
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
            }}
          >
            {p.category}
          </div>
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
