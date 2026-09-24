export function Mark({ size = 34 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <circle cx="32" cy="32" r="31" fill="#1C1712" />
      <circle cx="32" cy="32" r="31" fill="none" stroke="#C1560A" strokeWidth="1.4" strokeDasharray="2.6 2.6" />
      <path d="M20 22 L32 15 L44 22 L32 26 Z" fill="#E8792A" />
      <rect x="19" y="23" width="2" height="9" fill="#E8792A" />
      <text x="32" y="46" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight={700} fontSize="22" fill="#E8792A">
        B
      </text>
    </svg>
  );
}
