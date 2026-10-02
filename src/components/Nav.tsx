import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NavClient } from "./NavClient";

export async function Nav() {
  const session = await auth();
  const myProfile = session?.user
    ? await prisma.creatorProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true, displayName: true, photoUrl: true },
      })
    : null;

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <NavClient
      user={session?.user || null}
      myProfile={myProfile}
      signOutAction={handleSignOut}
    />
  );
}
