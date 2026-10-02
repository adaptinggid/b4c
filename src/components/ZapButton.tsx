"use client";

import { useState } from "react";
import { ZapModal } from "./ZapModal";

interface ZapButtonProps {
  lightningAddress: string;
  creatorName?: string;
  buttonText?: string;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "normal" | "sm" | "block";
}

export function ZapButton({
  lightningAddress,
  creatorName,
  buttonText = "⚡ Zap Creator",
  variant = "primary",
  size = "normal",
  className = "",
}: ZapButtonProps) {
  const [open, setOpen] = useState(false);

  if (!lightningAddress) return null;

  const variantClass =
    variant === "primary" ? "btn-primary" : variant === "outline" ? "btn-outline" : "btn-ghost";
  const sizeClass = size === "sm" ? "btn-sm" : size === "block" ? "btn-block" : "";

  return (
    <>
      <button
        type="button"
        className={`btn ${variantClass} ${sizeClass} ${className}`}
        style={{
          background: variant === "primary" ? "linear-gradient(135deg, #E8792A 0%, #C1560A 100%)" : undefined,
          color: variant === "primary" ? "#FFFDF8" : undefined,
        }}
        onClick={() => setOpen(true)}
      >
        {buttonText}
      </button>

      <ZapModal
        lightningAddress={lightningAddress}
        creatorName={creatorName}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
