"use client";

import { useState } from "react";

interface ZapModalProps {
  lightningAddress: string;
  creatorName?: string;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_SATS = [21, 100, 500, 1000, 5000, 21000];

export function ZapModal({ lightningAddress, creatorName, isOpen, onClose }: ZapModalProps) {
  const [sats, setSats] = useState<number | "">(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invoice, setInvoice] = useState("");
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  async function handleGenerateInvoice(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError("");
    setInvoice("");
    setSuccess(false);

    const amount = Number(sats);
    if (!amount || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid sat amount greater than 0.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/zap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lightningAddress, amountSats: amount }),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Failed to generate Lightning invoice");
        return;
      }

      setInvoice(data.pr);

      // WebLN auto-pay attempt if available in browser/wallet extension
      if (typeof window !== "undefined" && (window as any).webln) {
        try {
          await (window as any).webln.enable();
          await (window as any).webln.sendPayment(data.pr);
          setSuccess(true);
        } catch {
          // WebLN payment cancelled or unavailable — user can use copy or QR code
        }
      }
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : "Failed to connect to Lightning provider";
      setError(msg);
    }
  }

  async function copyInvoice() {
    try {
      await navigator.clipboard.writeText(invoice);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback
    }
  }

  function handleReset() {
    setError("");
    setInvoice("");
    setSuccess(false);
    setLoading(false);
  }

  const qrSrc = invoice
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent("lightning:" + invoice)}`
    : "";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(28, 23, 18, 0.65)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        className="form-card"
        style={{
          width: "100%",
          maxWidth: 480,
          background: "var(--paper, #FFFDF8)",
          borderRadius: 8,
          padding: "28px 24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            background: "none",
            border: "none",
            fontSize: "1.4rem",
            cursor: "pointer",
            color: "var(--ink-soft)",
            padding: 4,
          }}
        >
          ✕
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: "1.5rem", color: "var(--orange)" }}>⚡</span>
          <h3 style={{ fontSize: "1.35rem", margin: 0 }}>
            Zap {creatorName ? creatorName : "Creator"}
          </h3>
        </div>
        <p style={{ fontSize: ".86rem", color: "var(--ink-soft)", marginBottom: 18 }}>
          Direct peer-to-peer Lightning payout to <code style={{ fontSize: ".82rem", background: "var(--cream-2)", padding: "2px 6px", borderRadius: 4 }}>{lightningAddress}</code>
        </p>

        {error && <p className="error-text" style={{ fontSize: ".85rem", marginBottom: 14 }}>{error}</p>}

        {success ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: 8 }}>⚡🎉</div>
            <h4 style={{ fontSize: "1.2rem", marginBottom: 6 }}>Zap Sent Successfully!</h4>
            <p style={{ fontSize: ".9rem", color: "var(--ink-soft)", marginBottom: 18 }}>
              Thank you for supporting this creator directly on the Lightning Network.
            </p>
            <button type="button" className="btn btn-primary btn-block" onClick={onClose}>
              Done
            </button>
          </div>
        ) : invoice ? (
          <div>
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrSrc} alt="Lightning QR Code" width={180} height={180} style={{ borderRadius: 6, border: "1px solid var(--line)" }} />
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              <a
                href={`lightning:${invoice}`}
                className="btn btn-primary btn-block"
                style={{ flex: 1, textDecoration: "none", textAlign: "center" }}
                onClick={() => setSuccess(true)}
              >
                ⚡ Pay with Lightning Wallet
              </a>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <input
                className="input"
                readOnly
                value={invoice}
                style={{ fontSize: ".76rem", fontFamily: "monospace", flex: 1 }}
              />
              <button type="button" className="btn btn-outline btn-sm" onClick={copyInvoice}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleReset}>
                ← Change amount
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleGenerateInvoice}>
            <div className="field">
              <label>Select amount (sats)</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {PRESET_SATS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    className={`tag-option ${sats === amt ? "on" : ""}`}
                    onClick={() => setSats(amt)}
                    style={{ fontSize: ".82rem" }}
                  >
                    ⚡ {amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                className="input"
                type="number"
                min={1}
                step={1}
                placeholder="Custom sat amount"
                value={sats}
                onChange={(e) => setSats(e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value) || 0))}
                required
              />
            </div>

            <button className="btn btn-primary btn-block" disabled={loading || !sats}>
              {loading ? "Generating invoice…" : `⚡ Zap ${sats ? Number(sats).toLocaleString() : ""} sats`}
            </button>

            <p style={{ fontSize: ".76rem", color: "var(--ink-soft)", textAlign: "center", marginTop: 10 }}>
              Non-custodial payout. Sats go directly to creator&apos;s wallet.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
