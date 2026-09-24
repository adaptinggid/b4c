import Link from "next/link";
import { Prisma } from "@prisma/client";
import { projectsWithXp, creatorsWithXp } from "@/lib/data";
import { ProjectCard } from "@/components/ProjectCard";
import { CreatorCard } from "@/components/CreatorCard";
import { CATEGORIES } from "@/lib/constants";

type SearchParams = {
  view?: string;
  q?: string;
  cat?: string;
  sort?: string;
  collab?: string;
};

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const view = sp.view === "creators" ? "creators" : "works";
  const q = sp.q?.trim() || "";
  const cat = sp.cat || "";
  const sort = sp.sort === "xp" ? "xp" : "newest";
  const collabOnly = sp.collab === "1";

  const qsBase = (overrides: Partial<SearchParams>) => {
    const merged = { view, q, cat, sort, collab: collabOnly ? "1" : "", ...overrides };
    const params = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    return `/discover?${params.toString()}`;
  };

  let content;

  if (view === "works") {
    const where: Prisma.ProjectWhereInput = { status: "PUBLISHED" };
    if (cat) where.category = cat;
    if (collabOnly) where.collabRequest = true;
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
        { creator: { displayName: { contains: q, mode: "insensitive" } } },
      ];
    }
    let items = await projectsWithXp(where);
    if (sort === "xp") items = items.sort((a, b) => b.xpTotal - a.xpTotal);
    content = items.length ? (
      <div className="grid-3">
        {items.map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>
    ) : (
      <div className="empty">
        <h4>No works found</h4>
        <p>Try a different search or filter.</p>
      </div>
    );
  } else {
    const where: Prisma.CreatorProfileWhereInput = { status: "APPROVED" };
    if (cat) where.category = cat;
    if (collabOnly) where.collaboration = true;
    if (q) {
      where.OR = [
        { displayName: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
      ];
    }
    let items = await creatorsWithXp(where);
    if (sort === "xp") items = items.sort((a, b) => b.xpTotal - a.xpTotal);
    content = items.length ? (
      <div className="grid-3">
        {items.map((c) => (
          <CreatorCard key={c.id} c={c} />
        ))}
      </div>
    ) : (
      <div className="empty">
        <h4>No creators match your search</h4>
        <p>Try a different search or filter.</p>
      </div>
    );
  }

  return (
    <section className="section" style={{ paddingTop: 52, paddingBottom: 20 }}>
      <div className="wrap">
        <span className="eyebrow">Collaborate</span>
        <h1 style={{ fontSize: "2.2rem" }}>Discover creators &amp; projects</h1>
        <p className="lede" style={{ marginBottom: 26 }}>
          Search, filter, and find who&rsquo;s building what across the B4C ecosystem.
        </p>

        <div className="view-toggle" style={{ marginBottom: 20 }}>
          <Link href={qsBase({ view: "works" })} className={view === "works" ? "on" : ""}>
            Works
          </Link>
          <Link href={qsBase({ view: "creators" })} className={view === "creators" ? "on" : ""}>
            Creators
          </Link>
        </div>

        <form method="get" className="search-bar" style={{ flexDirection: "column", alignItems: "stretch" }}>
          <input type="hidden" name="view" value={view} />
          <div className="search-bar">
            <input className="input" name="q" placeholder="Search by title, creator or category" defaultValue={q} />
            <button className="btn btn-outline btn-sm">Search</button>
          </div>
          <div className="filters">
            <select className="filter-select" name="cat" defaultValue={cat}>
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select className="filter-select" name="sort" defaultValue={sort}>
              <option value="newest">Newest</option>
              <option value="xp">Highest XP</option>
            </select>
            <label className="filter-select" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" name="collab" value="1" defaultChecked={collabOnly} /> Open to collaboration
            </label>
            <button className="btn btn-ghost btn-sm">Apply filters</button>
          </div>
        </form>

        {content}
      </div>
    </section>
  );
}
