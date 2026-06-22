"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Rail from "@/components/ui/Rail";
import Reveal from "@/components/Reveal";
import { useT } from "@/lib/i18n";

// PLACEHOLDER figure — swap COUNT_TARGET (and the "+" suffix) for the real number.
const COUNT_TARGET = 50;

// Sparse, abstract dot field behind the number (NOT a literal map). teal/indigo mix.
const DOTS: { x: number; y: number; teal: boolean }[] = [
  { x: 40, y: 30, teal: true }, { x: 120, y: 70, teal: false }, { x: 90, y: 150, teal: true },
  { x: 200, y: 40, teal: false }, { x: 260, y: 110, teal: true }, { x: 180, y: 170, teal: false },
  { x: 330, y: 60, teal: true }, { x: 300, y: 150, teal: false }, { x: 400, y: 30, teal: false },
  { x: 440, y: 120, teal: true }, { x: 380, y: 175, teal: true }, { x: 500, y: 70, teal: false },
  { x: 540, y: 150, teal: true }, { x: 560, y: 40, teal: true }, { x: 60, y: 110, teal: false },
  { x: 240, y: 185, teal: true }, { x: 470, y: 175, teal: false }, { x: 150, y: 25, teal: true },
  { x: 350, y: 110, teal: false }, { x: 520, y: 115, teal: false },
];

export default function PositionBar() {
  const sectionRef = useRef<HTMLElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const t = useT();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const svg = sectionRef.current;
    if (!svg) return;
    const dots = Array.from(svg.querySelectorAll<SVGElement>(".pb-dot"));

    if (reduce) {
      if (countRef.current) countRef.current.textContent = String(COUNT_TARGET);
      gsap.set(dots, { opacity: 0.18 });
      return;
    }

    const triggers: ScrollTrigger[] = [];
    const ctx = gsap.context(() => {
      // count up on scroll-in
      const proxy = { val: 0 };
      gsap.to(proxy, {
        val: COUNT_TARGET,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => {
          if (countRef.current) countRef.current.textContent = String(Math.round(proxy.val));
        },
        scrollTrigger: { trigger: sectionRef.current!, start: "top 78%", once: true },
      });

      // faint twinkle on the dot field, paused off-screen
      gsap.set(dots, { opacity: 0.1 });
      const twinkle = gsap.to(dots, {
        opacity: 0.28,
        duration: 2.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.18, from: "random" },
        paused: true,
      });
      triggers.push(
        ScrollTrigger.create({
          trigger: sectionRef.current!,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? twinkle.play() : twinkle.pause()),
        })
      );
    }, sectionRef);

    return () => {
      triggers.forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="position-bar"
      style={{ position: "relative", zIndex: 1, paddingInline: "var(--gutter)" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Rail style={{ marginBottom: "3.5rem" }} />

        {/* THE number moment — big counting figure over a sparse dot field */}
        <div style={{ position: "relative" }}>
          <svg
            className="pb-dotfield"
            viewBox="0 0 600 210"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            {DOTS.map((d, i) => (
              <circle key={i} className="pb-dot" cx={d.x} cy={d.y} r="2.2" fill={d.teal ? "var(--teal)" : "var(--indigo)"} opacity="0.1" />
            ))}
          </svg>

          <Reveal stagger={0.1} style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontWeight: 200,
                fontSize: "clamp(72px, 20vw, 200px)",
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                color: "var(--ink)",
              }}
            >
              <span ref={countRef}>0</span>
              <span style={{ background: "var(--accent)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>
                {t.position.suffix}
              </span>
            </div>
            <div
              style={{
                marginTop: "0.5rem",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontWeight: 300,
                fontSize: "clamp(1.1rem, 2.4vw, 1.6rem)",
                color: "var(--ink-2)",
              }}
            >
              {t.position.countLabel}
            </div>
          </Reveal>
        </div>

        <Reveal
          as="p"
          style={{
            marginTop: "3rem",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontWeight: 250,
            fontSize: "clamp(26px, 3.6vw, 48px)",
            lineHeight: 1.1,
            letterSpacing: "-0.015em",
            color: "var(--ink)",
            maxWidth: "18ch",
          }}
        >
          {t.position.statement}
        </Reveal>

        {/* mono support row in the frosted glass panel */}
        <Reveal
          className="glass-panel--light"
          style={{
            marginTop: "2.5rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.85rem",
            padding: "1rem 1.5rem",
            width: "fit-content",
            maxWidth: "100%",
            fontFamily: "var(--font-mono), monospace",
            fontSize: "13.5px",
            letterSpacing: "0.08em",
            color: "var(--ink-3)",
          }}
        >
          {t.position.support.map((label, i) => (
            <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: "0.85rem" }}>
              {i > 0 && (
                <span aria-hidden style={{ color: "var(--teal)" }}>
                  ·
                </span>
              )}
              <span>{label}</span>
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
