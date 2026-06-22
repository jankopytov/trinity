"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Reveal from "@/components/Reveal";
import { useT } from "@/lib/i18n";

export default function PharmacyJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const STEPS = t.journey.steps;

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const steps = sectionRef.current?.querySelectorAll(".journey-step");

      if (reduce) {
        gsap.set(lineRef.current, { scaleX: 1 });
        if (steps) gsap.set(steps, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top 70%",
          once: true,
        },
      });

      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: "power2.out" }
      );
      if (steps) {
        tl.from(
          steps,
          { opacity: 0, y: 28, duration: 0.6, ease: "power3.out", stagger: 0.15 },
          0.2
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pad"
      style={{ position: "relative", zIndex: 1, padding: "7rem var(--gutter)" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal stagger={0.12} style={{ marginBottom: "4.5rem" }}>
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-mono), monospace",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontSize: "0.72rem",
              color: "var(--ink-2)",
            }}
          >
            {t.journey.eyebrow}
          </span>
          <h2
            style={{
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontWeight: 250,
              fontSize: "clamp(28px, 4vw, 56px)",
              letterSpacing: "-0.015em",
              lineHeight: 1.08,
              color: "var(--ink)",
              maxWidth: "22ch",
              margin: "1rem 0 0",
            }}
          >
            {t.journey.headline}
          </h2>
        </Reveal>

        <div className="journey-steps" style={{ position: "relative" }}>
          {/* Threading rail — horizontal teal→indigo line behind the node markers. */}
          <div
            ref={lineRef}
            aria-hidden
            className="journey-line"
            style={{
              position: "absolute",
              top: 5,
              left: 0,
              right: 0,
              height: 1,
              background: "var(--accent)",
              transformOrigin: "left center",
            }}
          />
          {STEPS.map((step) => (
            <div key={step.n} className="journey-step">
              <span
                aria-hidden
                style={{
                  display: "block",
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  background: "var(--teal)",
                  position: "relative",
                  zIndex: 1,
                  marginBottom: "1.5rem",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "0.74rem",
                  letterSpacing: "0.1em",
                  color: "var(--ink-3)",
                }}
              >
                {step.n}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: "1.4rem",
                  letterSpacing: "-0.01em",
                  color: "var(--ink)",
                  margin: "0.6rem 0 0.8rem",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.55,
                  color: "var(--ink-2)",
                  margin: 0,
                  maxWidth: "28ch",
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
