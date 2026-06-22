import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function SystemCloser() {
  return (
    <section style={{ padding: "9rem var(--gutter)", textAlign: "center" }}>
      <Reveal stagger={0.12}>
        <h2
          style={{
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontWeight: 250,
            fontSize: "clamp(26px, 4vw, 52px)",
            letterSpacing: "-0.015em",
            lineHeight: 1.12,
            color: "var(--ink)",
            maxWidth: "20ch",
            margin: "0 auto 2.5rem",
          }}
        >
          Welche Leistung passt zu Ihrer Apotheke?
        </h2>
        <Link
          href="/kontakt"
          style={{
            display: "inline-block",
            background: "var(--indigo)",
            color: "#FFFFFF",
            padding: "0.95rem 1.9rem",
            borderRadius: 999,
            fontSize: "0.92rem",
            fontWeight: 600,
            letterSpacing: "0.01em",
            textDecoration: "none",
          }}
        >
          Erstgespräch vereinbaren
        </Link>
      </Reveal>
    </section>
  );
}
