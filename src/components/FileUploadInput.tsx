"use client";

import { useState } from "react";

interface FileUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  hint?: string;
  optional?: boolean;
}

export function FileUploadInput({
  label,
  value,
  onChange,
  accept = "image/*,application/pdf,.pdf,.zip,audio/*,video/*",
  hint = "Upload a file or paste a URL below.",
  optional = true,
}: FileUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const isImage =
    !!value &&
    (value.match(/\.(jpeg|jpg|gif|png|webp|svg|avif)($|\?)/i) ||
      value.startsWith("data:image/") ||
      (!value.endsWith(".pdf") && !value.endsWith(".zip") && !value.endsWith(".mp3") && !value.endsWith(".mp4")));

  async function handleFileChange(file: File) {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      setUploading(false);

      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      onChange(data.url);
    } catch (err: unknown) {
      setUploading(false);
      const msg = err instanceof Error ? err.message : "Failed to upload file";
      setError(msg);
    }
  }

  return (
    <div className="field">
      <label>
        {label} <span className="opt">{optional ? "optional" : "required"}</span>
      </label>

      {error && <p className="error-text" style={{ fontSize: ".84rem", margin: "4px 0 8px" }}>{error}</p>}

      {value ? (
        <div style={{ marginBottom: 12 }}>
          {isImage ? (
            <div style={{ position: "relative", display: "inline-block", maxWidth: "100%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Upload preview"
                className="detail-cover"
                style={{ maxHeight: 200, objectFit: "cover", borderRadius: 8, display: "block", marginBottom: 8 }}
                onError={(e) => {
                  // Fallback if image fails to render
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <label className="btn btn-outline btn-sm" style={{ cursor: "pointer", margin: 0 }}>
                  {uploading ? "Uploading…" : "Change image"}
                  <input
                    type="file"
                    accept={accept}
                    style={{ display: "none" }}
                    disabled={uploading}
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  />
                </label>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => onChange("")}
                >
                  Remove image
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: "12px 14px", border: "1px solid var(--border, #eee)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
                <span style={{ fontSize: "1.4rem" }}>📄</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: ".9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 280 }}>
                    {value.split("/").pop() || "Uploaded attachment"}
                  </div>
                  <a href={value} target="_blank" rel="noopener noreferrer" style={{ fontSize: ".8rem", color: "var(--ink-soft)" }}>
                    View / Download file ↗
                  </a>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <label className="btn btn-outline btn-sm" style={{ cursor: "pointer", margin: 0 }}>
                  {uploading ? "Uploading…" : "Replace file"}
                  <input
                    type="file"
                    accept={accept}
                    style={{ display: "none" }}
                    disabled={uploading}
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  />
                </label>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => onChange("")}
                >
                  Remove file
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <label className="btn btn-outline btn-sm" style={{ cursor: "pointer", margin: 0 }}>
              {uploading ? "Uploading file…" : "Choose file to upload"}
              <input
                type="file"
                accept={accept}
                style={{ display: "none" }}
                disabled={uploading}
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              />
            </label>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setShowUrlInput(!showUrlInput)}
            >
              {showUrlInput ? "Hide URL input" : "Or paste URL"}
            </button>
          </div>

          <div className="hint" style={{ marginTop: 6 }}>
            {uploading ? "Uploading your file…" : hint}
          </div>
        </div>
      )}

      {(showUrlInput || (!value && showUrlInput)) && (
        <input
          className="input"
          style={{ marginTop: 8 }}
          placeholder="https://… or /uploads/…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
