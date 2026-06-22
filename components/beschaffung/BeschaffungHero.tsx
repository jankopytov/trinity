"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useT } from "@/lib/i18n";

export default function BeschaffungHero() {
  const railRef = useRef<HTMLDivElement>(null);
  const t = useT();

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce || !railRef.current) return;

    // The Motor under the calm surface: a slow breathing glow.
    const ctx = gsap.context(() => {
      gsap.to(railRef.current, {
        opacity: 1,
        filter: "brightness(1.35)",
        boxShadow: "0 0 38px 2px rgba(21,194,171,0.55)",
        duration: 2.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, railRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      style={{
        minHeight: "92dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "9rem var(--gutter) 6rem",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontWeight: 250,
          fontSize: "clamp(34px, 5.4vw, 76px)",
          lineHeight: 1.06,
          letterSpacing: "-0.02em",
          color: "var(--engine-ink)",
          maxWidth: "20ch",
          margin: 0,
        }}
      >
        {t.beschaffung.heroTitle}
      </h1>
      <p
        style={{
          marginTop: "1.6rem",
          maxWidth: "46ch",
          fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
          lineHeight: 1.5,
          color: "var(--engine-ink-2)",
        }}
      >
        {t.beschaffung.heroSub}
      </p>

      {/* The Motor: a glowing teal→indigo rail beneath the calm copy. */}
      <div
        ref={railRef}
        aria-hidden
        style={{
          marginTop: "3.5rem",
          height: 2,
          width: "min(420px, 70%)",
          background: "var(--accent)",
          borderRadius: 2,
          opacity: 0.6,
          boxShadow: "0 0 18px 1px rgba(21,194,171,0.35)",
          willChange: "opacity, box-shadow, filter",
        }}
      />
    </section>
  );
}
