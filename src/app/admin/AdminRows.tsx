"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function statusLabel(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

export function ProjectRow({
  id,
  title,
  creatorName,
  category,
  status,
  xp,
}: {
  id: string;
  title: string;
  creatorName: string;
  category: string;
  status: string;
  xp: number;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(newStatus: string) {
    setBusy(true);
    await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setBusy(false);
    router.refresh();
  }

  async function del() {
    if (!confirm("Delete this project permanently?")) return;
    setBusy(true);
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <tr>
      <td>
        <Link href={`/project/${id}`}>{title}</Link>
      </td>
      <td>{creatorName}</td>
      <td>{category}</td>
      <td>
        <span className={`status-tag st-${status}`}>{statusLabel(status)}</span>
      </td>
      <td>{xp}</td>
      <td style={{ whiteSpace: "nowrap" }}>
        {status !== "PUBLISHED" && (
          <button className="btn btn-sm btn-outline" disabled={busy} onClick={() => setStatus("PUBLISHED")}>
            Publish
          </button>
        )}{" "}
        {status !== "REJECTED" && (
          <button className="btn btn-sm btn-ghost" disabled={busy} onClick={() => setStatus("REJECTED")}>
            Reject
          </button>
        )}{" "}
        {status !== "ARCHIVED" && (
          <button className="btn btn-sm btn-ghost" disabled={busy} onClick={() => setStatus("ARCHIVED")}>
            Archive
          </button>
        )}{" "}
        <button className="btn btn-sm btn-danger" disabled={busy} onClick={del}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export function CreatorRow({
  id,
  name,
  category,
  status,
  participant,
  xp,
}: {
  id: string;
  name: string;
  category: string;
  status: string;
  participant: boolean;
  xp: number;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    await fetch(`/api/admin/creators/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    router.refresh();
  }

  async function del() {
    if (!confirm("Delete this creator and all their projects?")) return;
    setBusy(true);
    await fetch(`/api/admin/creators/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <tr>
      <td>
        <Link href={`/profile/${id}`}>{name}</Link>
      </td>
      <td>{category}</td>
      <td>
        <span className={`status-tag st-${status}`}>{statusLabel(status)}</span>
      </td>
      <td>{participant ? "✓ Yes" : "No"}</td>
      <td>{xp}</td>
      <td style={{ whiteSpace: "nowrap" }}>
        {status !== "APPROVED" && (
          <button className="btn btn-sm btn-outline" disabled={busy} onClick={() => patch({ status: "APPROVED" })}>
            Approve
          </button>
        )}{" "}
        <button className="btn btn-sm btn-ghost" disabled={busy} onClick={() => patch({ participant: !participant })}>
          {participant ? "Revoke badge" : "Grant badge"}
        </button>{" "}
        <button className="btn btn-sm btn-danger" disabled={busy} onClick={del}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export function XPRow({
  id,
  projectTitle,
  amount,
  date,
}: {
  id: string;
  projectTitle: string;
  amount: number;
  date: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function del() {
    setBusy(true);
    await fetch(`/api/admin/xp/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <tr>
      <td>{projectTitle}</td>
      <td>+{amount} XP</td>
      <td>{new Date(date).toLocaleString()}</td>
      <td>
        <button className="btn btn-sm btn-danger" disabled={busy} onClick={del}>
          Remove
        </button>
      </td>
    </tr>
  );
}
