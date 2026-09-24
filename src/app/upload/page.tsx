import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UploadForm } from "./UploadForm";

export default async function UploadPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin?callbackUrl=/upload");
  }

  const profile = await prisma.creatorProfile.findUnique({ where: { userId: session.user.id } });

  if (!profile) {
    return (
      <section className="section" style={{ paddingTop: 64 }}>
        <div className="wrap">
          <div className="empty">
            <h4>Create a profile first</h4>
            <p>You&rsquo;ll need a creator profile before publishing work.</p>
            <Link href="/create" className="btn btn-primary btn-sm">
              Create your profile
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <span className="eyebrow">Create</span>
          <h1 style={{ fontSize: "2.2rem", maxWidth: 600 }}>Publish a piece of work</h1>
          <p className="lede">Your project enters review before it appears in Collaborate / Discover.</p>
        </div>
      </section>
      <section className="section-tight section-border-t">
        <div className="wrap">
          <UploadForm />
        </div>
      </section>
    </>
  );
}
