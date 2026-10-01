"use client";

import { useState } from "react";

interface SafeImageProps {
  src?: string | null;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
}

export function SafeImage({ src, alt = "", className, style, fallback }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return <>{fallback || null}</>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setError(true)}
    />
  );
}
