"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useT } from "@/lib/i18n";

const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export default function Testimonial() {
  const ref = useRef<HTMLElement>(null);
  const t = useT();
  const QUOTE = t.testimonial.quote;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const words = el.querySelectorAll(".tm-word-inner");
    const chip = el.querySelector(".tm-chip");
    if (!words.length) return;

    if (reduce) {
      gsap.set(words, { yPercent: 0 });
      gsap.set(chip, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 72%", once: true },
      });
      tl.from(words, {
        yPercent: 110,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.035,
      });
      tl.from(
        chip,
        { opacity: 0, y: 18, duration: 0.7, ease: "power3.out" },
        "-=0.2"
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        padding: "6rem var(--gutter)",
        background: "var(--accent)",
        color: "#FFFFFF",
      }}
    >
      {/* deeper gradient wash so it's not flat */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 90% at 15% 10%, rgba(21,194,171,0.55), transparent 55%), radial-gradient(120% 90% at 90% 100%, rgba(58,46,190,0.6), transparent 55%)",
          mixBlendMode: "soft-light",
        }}
      />
      {/* faint glassmorphism sheen band */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "-20%",
          width: "45%",
          transform: "skewX(-14deg)",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)",
          pointerEvents: "none",
        }}
      />
      {/* film grain */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("${GRAIN}")`,
          backgroundSize: "140px 140px",
          opacity: 0.06,
          mixBlendMode: "soft-light",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            fontSize: "0.72rem",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {t.testimonial.eyebrow}
        </span>

        <blockquote
          aria-label={QUOTE}
          style={{
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontWeight: 250,
            fontSize: "clamp(28px, 4vw, 48px)",
            lineHeight: 1.22,
            letterSpacing: "-0.015em",
            maxWidth: "24ch",
            margin: "1.5rem 0 2.5rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0 0.26em",
          }}
        >
          {QUOTE.split(" ").map((w, i) => (
            <span
              key={i}
              aria-hidden
              style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.06em" }}
            >
              <span className="tm-word-inner" style={{ display: "inline-block", willChange: "transform" }}>
                {w}
              </span>
            </span>
          ))}
        </blockquote>

        {/* frosted glass attribution chip */}
        <div className="tm-chip glass-chip">
          <span
            aria-hidden
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.3)",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "0.8rem",
              letterSpacing: "0.04em",
              color: "#FFFFFF",
            }}
          >
            CP
          </span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
            <span style={{ fontWeight: 600, fontSize: "0.92rem" }}>{t.testimonial.name}</span>
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.72)",
              }}
            >
              {t.testimonial.role}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
