"use client";

import { useState } from "react";

export function LightningBox({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard may be unavailable — the address is still selectable text
    }
  }

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    "lightning:" + address
  )}`;

  return (
    <div>
      <div className="lightning-box">
        <span style={{ color: "var(--orange)" }}>⚡</span>
        <span className="lightning-addr">{address}</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={copy}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowQR((v) => !v)}>
          QR
        </button>
      </div>
      {showQR && (
        <div style={{ marginTop: 12, background: "#fff", padding: 12, borderRadius: 4, display: "inline-block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrSrc} alt={`QR code for ${address}`} width={160} height={160} />
        </div>
      )}
    </div>
  );
}
