"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push(params.get("callbackUrl") || "/");
    router.refresh();
  }

  return (
    <section className="section" style={{ paddingTop: 64 }}>
      <div className="wrap">
        <form onSubmit={onSubmit} className="form-card" style={{ margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.6rem" }}>Sign in</h2>
          <p className="lede" style={{ fontSize: ".92rem" }}>
            Sign in to create your profile, publish work and award XP.
          </p>
          {error && <p className="error-text">{error}</p>}
          <div className="field">
            <label>Email</label>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              className="input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <p className="help-note">
            No account yet? <Link href="/signup" style={{ textDecoration: "underline" }}>Create one</Link>.
          </p>
        </form>
      </div>
    </section>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
