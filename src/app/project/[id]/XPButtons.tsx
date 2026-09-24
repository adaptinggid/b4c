"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { XP_VALUES } from "@/lib/constants";

export function XPButtons({
  projectId,
  signedIn,
  alreadyVoted,
}: {
  projectId: string;
  signedIn: boolean;
  alreadyVoted: boolean;
}) {
  const router = useRouter();
  const [voted, setVoted] = useState(alreadyVoted);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!signedIn) {
    return (
      <p style={{ fontSize: ".82rem", color: "var(--ink-soft)" }}>
        <Link href={`/signin?callbackUrl=/project/${projectId}`} style={{ textDecoration: "underline" }}>
          Sign in
        </Link>{" "}
        to award XP.
      </p>
    );
  }

  if (voted) {
    return <p style={{ fontSize: ".82rem", color: "var(--ok)" }}>You&rsquo;ve awarded XP to this project. Thank you!</p>;
  }

  async function give(amount: number) {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/projects/${projectId}/xp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }
    setVoted(true);
    router.refresh();
  }

  return (
    <div>
      {error && <p className="error-text">{error}</p>}
      <div className="xp-btns" style={{ justifyContent: "center" }}>
        {XP_VALUES.map((v) => (
          <button key={v} className="btn btn-outline btn-sm" disabled={loading} onClick={() => give(v)}>
            +{v} XP
          </button>
        ))}
      </div>
    </div>
  );
}
