"use client";

import AmbientGlow from "@/components/AmbientGlow";
import Rail from "@/components/ui/Rail";

/** On-brand light prose shell shared by Impressum + Datenschutz. */
export default function LegalShell({
  eyebrow,
  headline,
  nonBinding,
  children,
}: {
  eyebrow: string;
  headline: string;
  nonBinding?: string;
  children: React.ReactNode;
}) {
  return (
    <main
      style={{
        position: "relative",
        isolation: "isolate",
        background: "var(--paper)",
        minHeight: "100dvh",
        overflowX: "hidden",
        padding: "9rem var(--gutter) 6rem",
      }}
    >
      <AmbientGlow />
      <div style={{ position: "relative", zIndex: 1, maxWidth: "72ch", margin: "0 auto" }}>
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-mono), monospace",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            fontSize: "0.72rem",
            color: "var(--ink-2)",
          }}
        >
          {eyebrow}
        </span>
        <h1
          style={{
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontWeight: 250,
            fontSize: "clamp(34px, 5vw, 60px)",
            letterSpacing: "-0.02em",
            lineHeight: 1.06,
            color: "var(--ink)",
            margin: "1rem 0 0",
          }}
        >
          {headline}
        </h1>

        {nonBinding ? (
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.82rem",
              fontStyle: "italic",
              color: "var(--ink-3)",
              maxWidth: "60ch",
            }}
          >
            {nonBinding}
          </p>
        ) : null}

        <Rail style={{ margin: "2.5rem 0 3rem" }} />

        <div
          style={{
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "var(--ink-2)",
            display: "flex",
            flexDirection: "column",
            gap: "1.9rem",
          }}
        >
          {children}
        </div>
      </div>
    </main>
  );
}

/** A labelled block: mono uppercase label over its value(s). */
export function LegalBlock({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div>
      {label ? (
        <h2
          style={{
            fontFamily: "var(--font-mono), monospace",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            fontSize: "0.7rem",
            color: "var(--ink-3)",
            margin: "0 0 0.6rem",
          }}
        >
          {label}
        </h2>
      ) : null}
      <div style={{ color: "var(--ink)" }}>{children}</div>
    </div>
  );
}
