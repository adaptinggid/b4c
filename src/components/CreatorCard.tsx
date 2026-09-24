import Link from "next/link";

export type CreatorCardData = {
  id: string;
  displayName: string;
  bio: string;
  category: string;
  photoUrl: string | null;
  participant: boolean;
  collaboration: boolean;
  xpTotal: number;
};

export function CreatorCard({ c }: { c: CreatorCardData }) {
  return (
    <Link href={`/profile/${c.id}`} className="card">
      <div
        className="card-media"
        style={{
          aspectRatio: "auto",
          height: "auto",
          background: "none",
          padding: "20px 18px 0",
          display: "flex",
        }}
      >
        {c.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.photoUrl} alt="" className="avatar avatar-lg" />
        ) : (
          <div className="avatar avatar-lg avatar-fallback" style={{ fontSize: "1.6rem" }}>
            {c.displayName.charAt(0)}
          </div>
        )}
      </div>
      <div className="card-body">
        <span className="card-cat">{c.category}</span>
        <h4>{c.displayName}</h4>
        <p style={{ fontSize: ".86rem", color: "var(--ink-soft)", margin: 0 }}>
          {c.bio.slice(0, 90)}
          {c.bio.length > 90 ? "…" : ""}
        </p>
        <div className="card-meta">
          {c.participant && <span className="chip chip-badge">✓ B4C</span>}
          <span className="chip chip-xp">{c.xpTotal} XP</span>
          <span className={`chip ${c.collaboration ? "chip-open" : "chip-closed"}`}>
            {c.collaboration ? "Open to collab" : "Not open"}
          </span>
        </div>
      </div>
    </Link>
  );
}
