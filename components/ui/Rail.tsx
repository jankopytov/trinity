import type { CSSProperties } from "react";

interface RailProps {
  className?: string;
  style?: CSSProperties;
}

/**
 * Teal → indigo hairline rail (horizontal). Reusable accent line.
 */
export default function Rail({ className, style }: RailProps) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        display: "block",
        height: 1,
        width: "100%",
        background: "var(--accent)",
        ...style,
      }}
    />
  );
}
