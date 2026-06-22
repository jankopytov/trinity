"use client";

import Reveal from "@/components/Reveal";
import SystemMap from "@/components/system/SystemMap";
import { useT } from "@/lib/i18n";

// Homepage placement of the interactive infrastructure map (replaces the old
// "two paths / cards" section). This wrapper is homepage-only.
export default function SystemSection() {
  const t = useT();
  return (
    <section className="section-pad" style={{ position: "relative", zIndex: 1, padding: "7rem var(--gutter)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal stagger={0.12} style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-mono), monospace",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontSize: "0.74rem",
              color: "var(--ink-2)",
            }}
          >
            {t.system.eyebrow}
          </span>
          <h2
            style={{
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontWeight: 250,
              fontSize: "clamp(28px, 4.4vw, 56px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
              color: "var(--ink)",
              maxWidth: "20ch",
              margin: "1.1rem auto 0",
            }}
          >
            {t.system.headline}
          </h2>
        </Reveal>

        <SystemMap />
      </div>
    </section>
  );
}
