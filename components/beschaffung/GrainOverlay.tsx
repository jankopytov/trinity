"use client";

// Very subtle static film grain across the dark page. Pure CSS (inline SVG noise),
// no rAF — zero perf cost. pointer-events:none so it never blocks interaction.
const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export default function GrainOverlay() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5,
        pointerEvents: "none",
        backgroundImage: `url("${NOISE}")`,
        backgroundSize: "140px 140px",
        opacity: 0.05,
        mixBlendMode: "soft-light",
      }}
    />
  );
}
