"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";

export function UploadForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState("");
  const [story, setStory] = useState("");
  const [bitcoinConnection, setBitcoinConnection] = useState("");
  const [collaborators, setCollaborators] = useState("");
  const [collabRequest, setCollabRequest] = useState(false);
  const [coverUrl, setCoverUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCoverUpload(file: File) {
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
    setCoverUrl(data.url);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title || !category || !description || !bitcoinConnection) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        category,
        description,
        link,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        story,
        bitcoinConnection,
        collaborators,
        collabRequest,
        coverUrl: coverUrl || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }
    router.push(`/project/${data.project.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="form-card">
      {error && <p className="error-text">{error}</p>}

      <div className="field">
        <label>
          Cover image <span className="opt">optional</span>
        </label>
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt="" className="detail-cover" style={{ marginBottom: 10, maxHeight: 180 }} />
        )}
        <input
          className="input"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])}
        />
        <div className="hint">{uploading ? "Uploading…" : "Or paste an image URL below."}</div>
        <input
          className="input"
          style={{ marginTop: 8 }}
          placeholder="https://…"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
        />
      </div>

      <div className="field">
        <label>
          Project title <span className="opt">required</span>
        </label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="field">
        <label>
          Category <span className="opt">required</span>
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
          Description <span className="opt">required</span>
        </label>
        <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>

      <div className="field">
        <label>
          Project link <span className="opt">optional</span>
        </label>
        <input className="input" placeholder="https://" value={link} onChange={(e) => setLink(e.target.value)} />
      </div>

      <div className="field">
        <label>
          Tags <span className="opt">optional, comma separated</span>
        </label>
        <input className="input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="branding, research" />
      </div>

      <div className="field">
        <label>
          Project story <span className="opt">optional</span>
        </label>
        <textarea className="input" value={story} onChange={(e) => setStory(e.target.value)} />
      </div>

      <div className="field">
        <label>
          How does this connect to Bitcoin or the Bitcoin ecosystem? <span className="opt">required</span>
        </label>
        <textarea
          className="input"
          value={bitcoinConnection}
          onChange={(e) => setBitcoinConnection(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label>
          Collaborators <span className="opt">optional</span>
        </label>
        <input className="input" value={collaborators} onChange={(e) => setCollaborators(e.target.value)} />
      </div>

      <div className="field">
        <div className="toggle">
          <label className="switch">
            <input type="checkbox" checked={collabRequest} onChange={(e) => setCollabRequest(e.target.checked)} />
            <span className="track" />
          </label>
          <div>
            <b style={{ fontSize: ".88rem" }}>Open to collaboration on this project</b>
          </div>
        </div>
      </div>

      <div className="divider" />
      <button className="btn btn-primary btn-block" disabled={loading || uploading}>
        {loading ? "Submitting…" : "Submit for review"}
      </button>
      <p className="help-note">Your work will show as Pending Review until an admin publishes it.</p>
    </form>
  );
}
