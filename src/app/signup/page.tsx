"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }
    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (signInRes?.error) {
      router.push("/signin");
      return;
    }
    router.push("/create");
    router.refresh();
  }

  return (
    <section className="section" style={{ paddingTop: 64 }}>
      <div className="wrap">
        <form onSubmit={onSubmit} className="form-card" style={{ margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.6rem" }}>Create an account</h2>
          <p className="lede" style={{ fontSize: ".92rem" }}>
            You&rsquo;ll use this to build your creator profile and publish work.
          </p>
          {error && <p className="error-text">{error}</p>}
          <div className="field">
            <label>Email</label>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Password <span className="opt">at least 8 characters</span></label>
            <input
              className="input"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
          <p className="help-note" style={{ textAlign: "center", fontSize: ".82rem", color: "var(--ink-soft)", marginTop: 12 }}>
            By creating an account, you agree to our{" "}
            <Link href="/terms" style={{ textDecoration: "underline" }}>Terms of Service</Link> and{" "}
            <Link href="/privacy" style={{ textDecoration: "underline" }}>Privacy Policy</Link>.
          </p>
          <p className="help-note" style={{ textAlign: "center", marginTop: 8 }}>
            Already have an account? <Link href="/signin" style={{ textDecoration: "underline" }}>Sign in</Link>.
          </p>
        </form>
      </div>
    </section>
  );
}
