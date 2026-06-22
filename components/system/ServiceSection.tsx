import Link from "next/link";
import Rail from "@/components/ui/Rail";
import Reveal from "@/components/Reveal";
import type { SystemNode } from "@/components/system/systemData";

const eyebrow = {
  display: "block",
  fontFamily: "var(--font-mono), monospace",
  textTransform: "uppercase" as const,
  letterSpacing: "0.18em",
  fontSize: "0.72rem",
  color: "var(--ink-2)",
};
const headline = {
  fontFamily: "var(--font-sans), system-ui, sans-serif",
  fontWeight: 300,
  fontSize: "clamp(24px, 3.2vw, 40px)",
  letterSpacing: "-0.015em",
  lineHeight: 1.1,
  color: "var(--ink)",
  margin: "1rem 0 0",
} as const;

export default function ServiceSection({
  node,
  index,
}: {
  node: SystemNode;
  index: number;
}) {
  return (
    <section className="section-pad" style={{ padding: "6rem var(--gutter)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Rail style={{ marginBottom: "3rem" }} />

        {node.href ? (
          // Has a deep page — link to it instead of repeating the detail here.
          <Reveal stagger={0.1}>
            <span style={eyebrow}>
              {`${node.flagship ? "FLAGSCHIFF" : "LEISTUNG"} ${String(index + 1).padStart(2, "0")}`}
            </span>
            <h2 style={headline}>{node.title}</h2>
            <p style={{ maxWidth: "46ch", margin: "1.25rem 0 1.75rem", lineHeight: 1.6, color: "var(--ink-2)" }}>
              {node.line}
            </p>
            <Link
              href={node.href}
              style={{
                fontFamily: "var(--font-mono), monospace",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: "0.74rem",
                color: "var(--ink)",
                textDecoration: "none",
                borderBottom: "1px solid var(--teal)",
                paddingBottom: 2,
              }}
            >
              Vertiefung ansehen →
            </Link>
          </Reveal>
        ) : (
          <Reveal stagger={0.1}>
            <span style={eyebrow}>
              {`LEISTUNG ${String(index + 1).padStart(2, "0")}`}
            </span>
            <h2 style={headline}>{node.title}</h2>
            <p style={{ maxWidth: "52ch", margin: "1.25rem 0 2rem", lineHeight: 1.6, color: "var(--ink-2)" }}>
              {node.line}
            </p>
            {node.detail && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "2rem",
                  maxWidth: 720,
                }}
              >
                <PointList title="Was wir übernehmen" points={node.detail.wir} />
                <PointList title="Was Sie tun" points={node.detail.sie} />
              </div>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}

function PointList({ title, points }: { title: string; points: string[] }) {
  return (
    <div>
      <h3
        style={{
          fontFamily: "var(--font-mono), monospace",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontSize: "0.68rem",
          color: "var(--ink-3)",
          margin: "0 0 0.9rem",
        }}
      >
        {title}
      </h3>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {points.map((p, i) => (
          <li key={i} style={{ display: "flex", gap: "0.6rem", fontSize: "0.95rem", lineHeight: 1.5, color: "var(--ink)" }}>
            <span aria-hidden style={{ color: "var(--teal)", flexShrink: 0 }}>—</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
