import type { CSSProperties } from "react";

type PenroseMode = "outline" | "filled-gradient";

interface PenroseProps {
  size?: number;
  mode?: PenroseMode;
  /** Optional stable id suffix so multiple instances don't collide on the gradient defs. */
  idSuffix?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Penrose impossible triangle, drawn as three interlocking bars.
 * Reused in the preloader, nav, and finale.
 */
export default function Penrose({
  size = 64,
  mode = "outline",
  idSuffix = "",
  className,
  style,
}: PenroseProps) {
  const gradId = `penrose-grad${idSuffix}`;
  const filled = mode === "filled-gradient";

  // The three bars of the impossible triangle. Each is a closed polygon.
  const bars = [
    "50,8 86,70 70,70 38,16",
    "86,70 50,132 38,112 70,70",
    "50,132 14,70 30,70 62,112",
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Trinity Pharma"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--teal)" />
          <stop offset="100%" stopColor="var(--indigo)" />
        </linearGradient>
      </defs>
      {bars.map((points, i) => (
        <polygon
          key={i}
          className="penrose-bar"
          data-bar={i}
          points={points}
          fill={filled ? `url(#${gradId})` : "none"}
          stroke={filled ? "transparent" : "var(--teal)"}
          strokeWidth={filled ? 0 : 4}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
