"use client";

import LegalShell, { LegalBlock } from "@/components/legal/LegalShell";
import { useT } from "@/lib/i18n";

export default function ImpressumView() {
  const t = useT();
  const im = t.legal.impressum;

  return (
    <LegalShell eyebrow={im.eyebrow} headline={im.headline} nonBinding={t.legal.nonBinding || undefined}>
      <LegalBlock label={im.section5}>
        <p style={{ margin: 0 }}>
          {im.company}
          <br />
          {im.address}
          <br />
          {im.country}
        </p>
      </LegalBlock>

      <LegalBlock label={im.vertretenLabel}>
        <p style={{ margin: 0 }}>{im.vertreten}</p>
      </LegalBlock>

      <LegalBlock label={im.kontaktLabel}>
        <p style={{ margin: 0 }}>
          <a href={`mailto:${im.kontaktEmail}`} className="kv-direct-link">
            {im.kontaktEmail}
          </a>
        </p>
      </LegalBlock>

      <LegalBlock label={im.registerLabel}>
        <p style={{ margin: 0 }}>{im.register}</p>
      </LegalBlock>

      <LegalBlock label={im.ustLabel}>
        <p style={{ margin: 0 }}>{im.ust}</p>
      </LegalBlock>

      <LegalBlock label={im.verantwortlichLabel}>
        <p style={{ margin: 0 }}>{im.verantwortlich}</p>
      </LegalBlock>

      <LegalBlock label={im.haftungLabel}>
        <p style={{ margin: 0, color: "var(--ink-2)" }}>{im.haftung}</p>
      </LegalBlock>
    </LegalShell>
  );
}
