"use client";

// Network marquee — slow, controlled, seamless. Pure CSS transform loop
// (GPU-only), edge-faded, reduced-motion static.

import { useT } from "@/lib/i18n";

interface NetworkItem {
  name: string;
  /** UPGRADE SEAM: drop an SVG at public/logos/network/<file>.svg and set this
   *  path to render the logo instead of the wordmark. */
  logo?: string;
}

// Real partners. logo? renders the SVG/PNG/WebP seam (uniform ink-grey); the
// wordmark `name` is the per-item fallback when no clean transparent logo
// could be extracted from the brand's site.
const NETWORK: NetworkItem[] = [
  { name: "B. Braun", logo: "/logos/network/bbraun.svg" },
  { name: "Sarstedt" }, // only a CSS sprite on site, no standalone asset → wordmark
  { name: "PHOENIX" }, // header logo is a white-bg JPEG, not transparent → wordmark
  { name: "NOWEDA", logo: "/logos/network/noweda.svg" },
  { name: "Hartmann", logo: "/logos/network/hartmann.svg" },
  { name: "Schülke", logo: "/logos/network/schuelke.svg" },
  { name: "ratiopharm" }, // only an opaque white-bg PNG, no SVG → wordmark
  { name: "flowzz", logo: "/logos/network/flowzz.png" },
  { name: "STADA", logo: "/logos/network/stada.webp" },
  { name: "Hexal", logo: "/logos/network/hexal.png" },
];

function Group({ dup }: { dup?: boolean }) {
  return (
    <div className={`nm-group${dup ? " nm-dup" : ""}`} aria-hidden={dup || undefined}>
      {NETWORK.map((item, i) => (
        <span className="nm-item" key={i}>
          {item.logo ? (
            // UPGRADE SEAM: real logo when provided — ink-toned/grayscale so
            // mismatched brand marks read uniform. Wordmark is the fallback.
            // eslint-disable-next-line @next/next/no-img-element
            <img className="nm-logo" src={item.logo} alt={item.name} />
          ) : (
            <span className="nm-word">{item.name}</span>
          )}
          {/* faint teal→indigo dot divider */}
          <span className="nm-dot" aria-hidden />
        </span>
      ))}
    </div>
  );
}

export default function NetworkMarquee() {
  const t = useT();
  return (
    <section className="nm-section" aria-label={t.marquee.eyebrow}>
      <p className="nm-eyebrow">{t.marquee.eyebrow}</p>
      <div className="nm-mask">
        <div className="nm-track">
          <Group />
          {/* duplicate set → seamless translateX(-50%) loop */}
          <Group dup />
        </div>
      </div>
    </section>
  );
}
