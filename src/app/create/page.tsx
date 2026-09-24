import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./ProfileForm";

export default async function CreatePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin?callbackUrl=/create");
  }

  const existing = await prisma.creatorProfile.findUnique({ where: { userId: session.user.id } });

  return (
    <>
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <span className="eyebrow">Create</span>
          <h1 style={{ fontSize: "2.4rem", maxWidth: 600 }}>
            {existing ? "Edit your profile" : "Turn skills and ideas into creative work."}
          </h1>
          <p className="lede">
            {existing
              ? "Update your public creator profile below."
              : "Build a public creator profile — your identity, skills and Lightning address — so people across the ecosystem can find and support you."}
          </p>
        </div>
      </section>
      <section className="section-tight section-border-t">
        <div className="wrap">
          <ProfileForm existing={existing} />
          {existing && (
            <p className="help-note" style={{ maxWidth: 620 }}>
              Your profile is live at{" "}
              <Link href={`/profile/${existing.id}`} style={{ textDecoration: "underline" }}>
                this link
              </Link>
              .
            </p>
          )}
        </div>
      </section>
    </>
  );
}
