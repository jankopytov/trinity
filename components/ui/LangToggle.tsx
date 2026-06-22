"use client";

import { useUIStore } from "@/lib/store";
import { useT } from "@/lib/i18n";

/**
 * de/en pill toggle with a sliding teal→indigo indicator. Two real buttons
 * (aria-pressed) for keyboard + screen-reader access; the thumb animates via
 * CSS transform (disabled under reduced-motion). `size="lg"` is the larger
 * touch target used inside the mobile menu.
 */
export default function LangToggle({ size = "sm" }: { size?: "sm" | "lg" }) {
  const lang = useUIStore((s) => s.lang);
  const setLang = useUIStore((s) => s.setLang);
  const t = useT();

  return (
    <div
      className={`lang-toggle${size === "lg" ? " lang-toggle--lg" : ""}`}
      role="group"
      aria-label={t.langToggle.label}
    >
      <span
        className="lang-toggle-thumb"
        aria-hidden
        style={{ transform: lang === "en" ? "translateX(100%)" : "translateX(0%)" }}
      />
      <button
        type="button"
        className={`lang-toggle-btn${lang === "de" ? " is-active" : ""}`}
        aria-pressed={lang === "de"}
        onClick={() => setLang("de")}
      >
        {t.langToggle.de}
      </button>
      <button
        type="button"
        className={`lang-toggle-btn${lang === "en" ? " is-active" : ""}`}
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
      >
        {t.langToggle.en}
      </button>
    </div>
  );
}
