"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@prisma/client";
import { CATEGORIES } from "@/lib/constants";
import { FileUploadInput } from "@/components/FileUploadInput";

export function ProjectEditForm({ project }: { project: Project }) {
  const router = useRouter();
  const [title, setTitle] = useState(project.title ?? "");
  const [category, setCategory] = useState(project.category ?? "");
  const [description, setDescription] = useState(project.description ?? "");
  const [link, setLink] = useState(project.link ?? "");
  const [tags, setTags] = useState(project.tags ? project.tags.join(", ") : "");
  const [story, setStory] = useState(project.story ?? "");
  const [bitcoinConnection, setBitcoinConnection] = useState(project.bitcoinConnection ?? "");
  const [collaborators, setCollaborators] = useState(project.collaborators ?? "");
  const [collabRequest, setCollabRequest] = useState(project.collabRequest ?? false);
  const [coverUrl, setCoverUrl] = useState(project.coverUrl ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title || !category || !description || !bitcoinConnection) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
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
      setError(data.error || "Failed to update project.");
      return;
    }
    router.push(`/project/${project.id}`);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    setDeleting(true);
    const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to delete project.");
      return;
    }
    router.push("/discover");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="form-card">
      {error && <p className="error-text">{error}</p>}

      <FileUploadInput
        label="Cover image or project attachment"
        value={coverUrl}
        onChange={setCoverUrl}
        accept="image/*,application/pdf,.pdf,.zip,audio/*,video/*"
        hint="Upload a new cover image or file attachment, or paste a URL."
        optional
      />

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
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button className="btn btn-primary" style={{ flex: 1 }} disabled={loading || deleting}>
          {loading ? "Saving changes…" : "Save changes"}
        </button>
        <button type="button" className="btn btn-danger" disabled={loading || deleting} onClick={handleDelete}>
          {deleting ? "Deleting…" : "Delete project"}
        </button>
      </div>
    </form>
  );
}
