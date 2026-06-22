"use client";

import Link from "next/link";
import Rail from "@/components/ui/Rail";
import { useT } from "@/lib/i18n";

export default function Footer() {
  const t = useT();
  const LINKS = [
    { href: "/kontakt", label: t.footer.kontakt },
    { href: "/impressum", label: t.footer.impressum },
    { href: "/datenschutz", label: t.footer.datenschutz },
  ];
  return (
    <footer
      style={{
        marginTop: "auto",
        padding: "3rem var(--gutter) 2.5rem",
        background: "var(--paper)",
        color: "var(--ink-2)",
      }}
    >
      <Rail style={{ marginBottom: "2rem" }} />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <nav style={{ display: "flex", gap: "1.5rem" }}>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-mono), monospace",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontSize: "0.72rem",
                textDecoration: "none",
                color: "var(--ink-2)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <span style={{ fontSize: "0.78rem", color: "var(--ink-3)" }}>
          {t.footer.copyright}
        </span>
      </div>
    </footer>
  );
}
