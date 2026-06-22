"use client";

import LegalShell, { LegalBlock } from "@/components/legal/LegalShell";
import { useT } from "@/lib/i18n";

export default function DatenschutzView() {
  const t = useT();
  const ds = t.legal.datenschutz;

  return (
    <LegalShell eyebrow={ds.eyebrow} headline={ds.headline} nonBinding={t.legal.nonBinding || undefined}>
      {ds.sections.map((section, i) => (
        <LegalBlock key={i} label={section.heading}>
          {section.body.map((para, j) => (
            <p key={j} style={{ margin: j === 0 ? 0 : "0.7rem 0 0", color: "var(--ink-2)" }}>
              {para}
            </p>
          ))}
          {section.bullets ? (
            <ul style={{ margin: "0.9rem 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {section.bullets.map((b, k) => (
                <li key={k} style={{ display: "flex", gap: "0.6rem", color: "var(--ink)" }}>
                  <span aria-hidden style={{ color: "var(--teal)", flexShrink: 0 }}>
                    —
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </LegalBlock>
      ))}
    </LegalShell>
  );
}
