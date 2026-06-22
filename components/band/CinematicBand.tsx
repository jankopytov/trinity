"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Reveal from "@/components/Reveal";
import { useT } from "@/lib/i18n";

// Drop the chosen frame at this path. Until then, the band shows the branded
// dark-wash fallback (no broken image).
const IMG = "/images/home/home-band.jpg";

export default function CinematicBand() {
  const ref = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  const t = useT();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px) and (hover: hover)").matches;
    const img = imgRef.current;
    if (!img || reduce || !desktop) return; // mobile / reduced-motion: static cover

    let trigger: ScrollTrigger | undefined;
    const ctx = gsap.context(() => {
      // image is 120% tall → it can drift without ever revealing an edge
      const t = gsap.fromTo(
        img,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
      trigger = t.scrollTrigger;
    }, ref);

    return () => {
      trigger?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={ref} className="cband" aria-label="Trinity Pharma">
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={IMG}
          alt=""
          aria-hidden
          loading="lazy"
          onError={() => setFailed(true)}
          style={{
            position: "absolute",
            left: 0,
            top: "-10%",
            width: "100%",
            height: "120%",
            objectFit: "cover",
            objectPosition: "center",
            willChange: "transform",
          }}
        />
      )}

      {/* soft bottom-up dark scrim for legibility */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(6,11,20,0.75), rgba(6,11,20,0.15) 45%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* very low teal→indigo wash to tie into the palette */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(21,194,171,0.12), rgba(58,46,190,0.14))",
          mixBlendMode: "soft-light",
          pointerEvents: "none",
        }}
      />

      {/* minimal overlay line, bottom-left in the gutter */}
      <Reveal
        as="p"
        style={{
          position: "absolute",
          left: "var(--gutter)",
          right: "var(--gutter)",
          bottom: "clamp(2rem, 6vh, 4rem)",
          margin: 0,
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontWeight: 250,
          fontSize: "clamp(22px, 3.4vw, 44px)",
          letterSpacing: "-0.015em",
          color: "#F1F4F6",
          maxWidth: "20ch",
        }}
      >
        {t.band.line}
      </Reveal>
    </section>
  );
}
