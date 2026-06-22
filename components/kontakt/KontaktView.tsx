"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Rail from "@/components/ui/Rail";
import AmbientGlow from "@/components/AmbientGlow";
import KontaktForm from "@/components/kontakt/KontaktForm";
import { isIntentKey } from "@/lib/intents";
import { useT, useLang } from "@/lib/i18n";

// Direct-contact channels. Left empty until the client supplies real numbers —
// we never invent contact data. Set these to light up the Telefon / WhatsApp
// rows (the email below is the real, always-on channel).
const PHONE: string = ""; // e.g. "+49 30 1234567"
const WHATSAPP: string = ""; // e.g. "+49 151 12345678"

const eyebrowStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-mono), monospace",
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  fontSize: "0.72rem",
  color: "var(--teal)",
};

export default function KontaktView() {
  const params = useSearchParams();
  const t = useT();
  const lang = useLang();
  const thema = params.get("thema");
  const valid = isIntentKey(thema);
  const key = valid ? thema : null;
  const intent = valid
    ? t.intents[thema]
    : { ueberschrift: t.kontakt.fallback.ueberschrift, untertitel: t.kontakt.fallback.untertitel, betreff: "" };

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

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
        {/* Re-keyed on the intent so the headline gently re-intros on deep-link nav. */}
        <div key={key ?? "fallback"}>
          {valid && (
            <span className="kv-intro" style={eyebrowStyle}>
              {t.kontakt.eyebrow}
            </span>
          )}
          <h1
            className="kv-intro kv-intro--2"
            style={{
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontWeight: 250,
              fontSize: "clamp(34px, 5.4vw, 68px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.06,
              color: "var(--ink)",
              margin: valid ? "1rem 0 0" : "0",
              maxWidth: "20ch",
            }}
          >
            {intent.ueberschrift}
          </h1>
          <p
            className="kv-intro kv-intro--3"
            style={{
              marginTop: "1.25rem",
              maxWidth: "52ch",
              fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
              lineHeight: 1.55,
              color: "var(--ink-2)",
            }}
          >
            {intent.untertitel}
          </p>
        </div>

        <Rail style={{ margin: "3rem 0" }} />

        <div className="kontakt-cols">
          <div>
            {/* Re-key on intent AND language so a deep-link nav or a language
                flip refreshes the prefilled Betreff. */}
            <KontaktForm key={`${key ?? "fallback"}-${lang}`} initialBetreff={intent.betreff} />

            {/* Trust line — directly under the submit. */}
            <p
              style={{
                marginTop: "1.25rem",
                fontSize: "0.85rem",
                lineHeight: 1.5,
                color: "var(--ink-3)",
                maxWidth: "44ch",
              }}
            >
              {t.kontakt.trust}
            </p>
          </div>

          <aside className="glass-panel--light" style={{ padding: "1.75rem" }}>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-mono), monospace",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontSize: "0.66rem",
                color: "var(--ink-3)",
                marginBottom: "0.9rem",
              }}
            >
              {t.kontakt.direct.eyebrow}
            </span>

            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              {PHONE && (
                <li>
                  <ContactRow label={t.kontakt.direct.telefon} />
                  <a href={`tel:${PHONE.replace(/\s+/g, "")}`} className="kv-direct-link">
                    {PHONE}
                  </a>
                </li>
              )}
              <li>
                <ContactRow label={t.kontakt.direct.email} />
                <a
                  href="mailto:info@trinity-pharma.de?subject=Anfrage"
                  className="kv-direct-link"
                >
                  info@trinity-pharma.de
                </a>
              </li>
              {WHATSAPP && (
                <li>
                  <ContactRow label={t.kontakt.direct.whatsapp} />
                  <a
                    href={`https://wa.me/${WHATSAPP.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kv-direct-link"
                  >
                    {t.kontakt.direct.whatsappCta}
                  </a>
                </li>
              )}
            </ul>

            <p style={{ marginTop: "1.25rem", fontSize: "0.92rem", lineHeight: 1.55, color: "var(--ink-2)" }}>
              {t.kontakt.direct.note}
            </p>

            <div style={{ marginTop: "1.75rem", display: "flex", gap: "1.25rem", fontFamily: "var(--font-mono), monospace", fontSize: "0.7rem", letterSpacing: "0.08em" }}>
              <Link href="/impressum" style={{ color: "var(--ink-2)", textDecoration: "none" }}>
                {t.footer.impressum}
              </Link>
              <Link href="/datenschutz" style={{ color: "var(--ink-2)", textDecoration: "none" }}>
                {t.footer.datenschutz}
              </Link>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-mark.svg"
              alt="Trinity Pharma"
              style={{ height: 48, width: "auto", display: "block", marginTop: "2rem", opacity: 0.9 }}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

function ContactRow({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "block",
        fontFamily: "var(--font-mono), monospace",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        fontSize: "0.6rem",
        color: "var(--ink-3)",
        marginBottom: "0.2rem",
      }}
    >
      {label}
    </span>
  );
}
