"use client";

import { useState } from "react";
import { ZapButton } from "./ZapButton";

export function LightningBox({ address, creatorName }: { address: string; creatorName?: string }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard fallback
    }
  }

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    "lightning:" + address
  )}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <ZapButton lightningAddress={address} creatorName={creatorName} size="block" buttonText="⚡ Zap Creator" />

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
        <div style={{ background: "#fff", padding: 12, borderRadius: 4, textAlign: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrSrc} alt={`QR code for ${address}`} width={160} height={160} style={{ margin: "0 auto" }} />
        </div>
      )}
    </div>
  );
}
