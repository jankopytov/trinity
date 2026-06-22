"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Rail from "@/components/ui/Rail";
import { useT } from "@/lib/i18n";

export default function Finale() {
  const sectionRef = useRef<HTMLElement>(null);
  const t = useT();
  const STATEMENT = t.finale.statement;

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const words = sectionRef.current?.querySelectorAll(".finale-word-inner");
      if (!words || !words.length) return;

      if (reduce) {
        gsap.set(words, { yPercent: 0 });
        return;
      }

      gsap.fromTo(
        words,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: "top 70%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pad"
      style={{
        position: "relative",
        zIndex: 1,
        padding: "9rem var(--gutter)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: 820,
          margin: "0 auto",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Faint teal→indigo radial glow, centered behind the statement. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            // cap to viewport so the centered glow never bleeds past the edge on mobile
            width: "min(560px, 86vw)",
            height: "min(560px, 86vw)",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(21,194,171,0.20), rgba(58,46,190,0.14) 40%, transparent 68%)",
            filter: "blur(8px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <h2
          aria-label={STATEMENT}
          style={{
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontWeight: 250,
            fontSize: "clamp(30px, 4.5vw, 64px)",
            letterSpacing: "-0.015em",
            lineHeight: 1.12,
            color: "var(--ink)",
            margin: "0 0 2.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 0.28em",
          }}
        >
          {STATEMENT.split(" ").map((word, i) => (
            <span
              key={i}
              aria-hidden
              style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.08em" }}
            >
              <span
                className="finale-word-inner"
                style={{ display: "inline-block", willChange: "transform" }}
              >
                {word}
              </span>
            </span>
          ))}
        </h2>

        <Rail style={{ maxWidth: 420, marginBottom: "2.5rem" }} />

        <Link
          href="/kontakt"
          style={{
            display: "inline-block",
            background: "var(--indigo)",
            color: "#FFFFFF",
            padding: "0.9rem 1.8rem",
            borderRadius: 999,
            fontSize: "0.9rem",
            fontWeight: 600,
            letterSpacing: "0.01em",
            textDecoration: "none",
          }}
        >
          {t.finale.cta}
        </Link>
        </div>
      </div>
    </section>
  );
}
