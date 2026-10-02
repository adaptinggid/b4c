import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Mark } from "./Mark";
import { SafeImage } from "./SafeImage";
import { REGISTER_LINK } from "@/lib/constants";

export async function Nav() {
  const session = await auth();
  const myProfile = session?.user
    ? await prisma.creatorProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true, displayName: true, photoUrl: true },
      })
    : null;

  return (
    <div className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <Mark size={34} />
          <span className="brand-text">
            <b>Bitcoin for Creatives</b>
            <span>B4C · by BitEdu Network</span>
          </span>
        </Link>
        <nav className="nav-links">
          <Link href="/learn">Learn</Link>
          <Link href="/create">Create</Link>
          <Link href="/discover">Collaborate</Link>
          <Link href="/about">About</Link>
          <Link href="/support">Support</Link>
          {session?.user.role === "ADMIN" && <Link href="/admin">Admin</Link>}
        </nav>
        <div className="nav-actions">
          {session?.user ? (
            <>
              <Link
                href={myProfile ? `/profile/${myProfile.id}` : "/create"}
                className="btn btn-ghost btn-sm nav-profile-btn"
                title="View your creator profile"
              >
                {myProfile?.photoUrl ? (
                  <SafeImage
                    src={myProfile.photoUrl}
                    alt=""
                    className="avatar"
                    style={{ width: 22, height: 22, border: "none" }}
                  />
                ) : (
                  <span style={{ fontSize: "1rem" }}>👤</span>
                )}
                <span>My profile</span>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="btn btn-ghost btn-sm">Sign out</button>
              </form>
            </>
          ) : (
            <Link href="/signin" className="btn btn-ghost btn-sm">
              Sign in
            </Link>
          )}
          <a href={REGISTER_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm hide-mobile">
            Join B4C
          </a>
        </div>
      </div>
    </div>
  );
}
