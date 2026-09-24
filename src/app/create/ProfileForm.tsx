"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CreatorProfile } from "@prisma/client";
import { CATEGORIES, SKILL_OPTIONS } from "@/lib/constants";

export function ProfileForm({ existing }: { existing: CreatorProfile | null }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(existing?.displayName ?? "");
  const [country, setCountry] = useState(existing?.country ?? "");
  const [category, setCategory] = useState(existing?.category ?? "");
  const [skills, setSkills] = useState<string[]>(existing?.skills ?? []);
  const [bio, setBio] = useState(existing?.bio ?? "");
  const [lightningAddress, setLightningAddress] = useState(existing?.lightningAddress ?? "");
  const [participant, setParticipant] = useState(existing?.participant ?? false);
  const [collaboration, setCollaboration] = useState(existing?.collaboration ?? false);
  const [photoUrl, setPhotoUrl] = useState(existing?.photoUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [website, setWebsite] = useState(existing?.website ?? "");
  const [x, setX] = useState(existing?.x ?? "");
  const [instagram, setInstagram] = useState(existing?.instagram ?? "");
  const [linkedin, setLinkedin] = useState(existing?.linkedin ?? "");
  const [github, setGithub] = useState(existing?.github ?? "");
  const [telegram, setTelegram] = useState(existing?.telegram ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleSkill(s: string) {
    setSkills((prev) => (prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]));
  }

  async function handlePhotoUpload(file: File) {
    setUploading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(data.error || "Upload failed");
      return;
    }
    setPhotoUrl(data.url);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!displayName || !country || !category || !bio || !lightningAddress) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    const payload = {
      displayName,
      country,
      category,
      skills,
      bio,
      lightningAddress,
      participant,
      collaboration,
      photoUrl: photoUrl || undefined,
      website,
      x,
      instagram,
      linkedin,
      github,
      telegram,
    };
    const res = await fetch(existing ? `/api/creators/${existing.id}` : "/api/creators", {
      method: existing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }
    const id = existing ? existing.id : data.profile.id;
    router.push(`/profile/${id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="form-card">
      {error && <p className="error-text">{error}</p>}

      <div className="field">
        <label>
          Profile photo <span className="opt">optional</span>
        </label>
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="" className="avatar avatar-lg" style={{ marginBottom: 10 }} />
        )}
        <input
          className="input"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
        />
        <div className="hint">{uploading ? "Uploading…" : "Or paste an image URL below."}</div>
        <input
          className="input"
          style={{ marginTop: 8 }}
          placeholder="https://…"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
        />
      </div>

      <div className="field">
        <label>
          Display name <span className="opt">required</span>
        </label>
        <input className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
      </div>

      <div className="field">
        <label>
          Country <span className="opt">required</span>
        </label>
        <input className="input" value={country} onChange={(e) => setCountry(e.target.value)} required />
      </div>

      <div className="field">
        <label>
          Creative category <span className="opt">required</span>
        </label>
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>
          Skills <span className="opt">select all that apply</span>
        </label>
        <div className="tag-select">
          {SKILL_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className={`tag-option ${skills.includes(s) ? "on" : ""}`}
              onClick={() => toggleSkill(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>
          Short bio <span className="opt">required</span>
        </label>
        <textarea className="input" value={bio} onChange={(e) => setBio(e.target.value)} required />
      </div>

      <div className="field">
        <label>
          Lightning address <span className="opt">required</span>
        </label>
        <input
          className="input"
          placeholder="you@walletprovider.com"
          value={lightningAddress}
          onChange={(e) => setLightningAddress(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <div className="toggle">
          <label className="switch">
            <input type="checkbox" checked={participant} onChange={(e) => setParticipant(e.target.checked)} />
            <span className="track" />
          </label>
          <div>
            <b style={{ fontSize: ".88rem" }}>I&rsquo;m a confirmed B4C participant</b>
            <div className="hint" style={{ marginTop: 2 }}>
              Badge/tag confirmed manually by the B4C team. An admin can verify this before it&rsquo;s trusted publicly.
            </div>
          </div>
        </div>
      </div>

      <div className="field">
        <div className="toggle">
          <label className="switch">
            <input type="checkbox" checked={collaboration} onChange={(e) => setCollaboration(e.target.checked)} />
            <span className="track" />
          </label>
          <div>
            <b style={{ fontSize: ".88rem" }}>Open to collaboration</b>
          </div>
        </div>
      </div>

      <div className="divider" />
      <h4 style={{ fontSize: "1rem", marginBottom: 14 }}>
        Portfolio &amp; social links <span className="opt">optional</span>
      </h4>
      <div className="form-row2">
        <div className="field">
          <label>Website</label>
          <input className="input" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" />
        </div>
        <div className="field">
          <label>X</label>
          <input className="input" value={x} onChange={(e) => setX(e.target.value)} placeholder="https://x.com/you" />
        </div>
      </div>
      <div className="form-row2">
        <div className="field">
          <label>Instagram</label>
          <input className="input" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
        </div>
        <div className="field">
          <label>LinkedIn</label>
          <input className="input" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
        </div>
      </div>
      <div className="form-row2">
        <div className="field">
          <label>GitHub</label>
          <input className="input" value={github} onChange={(e) => setGithub(e.target.value)} />
        </div>
        <div className="field">
          <label>Telegram</label>
          <input className="input" value={telegram} onChange={(e) => setTelegram(e.target.value)} />
        </div>
      </div>

      <div className="divider" />
      <button className="btn btn-primary btn-block" disabled={loading || uploading}>
        {loading ? "Saving…" : existing ? "Save changes" : "Save profile"}
      </button>
      {!existing && (
        <p className="help-note">
          New profiles enter a short admin review before appearing in Collaborate / Discover.
        </p>
      )}
    </form>
  );
}
