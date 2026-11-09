const SANS = "var(--font-geist-sans), Geist, sans-serif";

export function DiamondMark({
  size = 28,
  onDark = false,
}: {
  size?: number;
  onDark?: boolean;
}) {
  const top = onDark ? "#FFFFFF" : "#F7F2FF";
  const left = onDark ? "#DCCBFF" : "#9666F5";
  const right = onDark ? "#FFC9E8" : "#5935A8";
  const line = onDark ? "#5935A8" : "#FFFFFF";

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 4 L58 26 L32 60 L6 26 Z" fill={right} />
      <path d="M32 4 L58 26 L32 30 L6 26 Z" fill={top} />
      <path d="M6 26 L32 30 L32 60 Z" fill={left} />
      <path d="M32 4 V60" stroke={line} strokeWidth="2" opacity="0.75" />
      <path d="M6 26 H58" stroke={line} strokeWidth="2" opacity="0.6" />
    </svg>
  );
}

export function Logo({
  height = 28,
  onDark = false,
  wordmark,
}: {
  height?: number;
  onDark?: boolean;
  wordmark?: string;
}) {
  const color = wordmark ?? (onDark ? "#FFFFFF" : "#24143D");

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: Math.round(height * 0.34),
        color,
      }}
    >
      <DiamondMark size={height} onDark={onDark} />
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          letterSpacing: "0.14em",
          fontSize: Math.max(11, Math.round(height * 0.46)),
          lineHeight: 1,
        }}
      >
        ALPHAGEMS
      </span>
    </span>
  );
}
