"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface BeschaffungBeatProps {
  n: string;
  title: string;
  body: string;
  reverse?: boolean;
  children: React.ReactNode; // the bespoke graphic
}

export default function BeschaffungBeat({
  n,
  title,
  body,
  reverse = false,
  children,
}: BeschaffungBeatProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const text = rootRef.current?.querySelector(".bw-text");
    if (!text) return;

    if (reduce) {
      gsap.set(text, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(text, {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current!, start: "top 72%", once: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="section-pad"
      style={{ padding: "8rem var(--gutter)" }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div className={`bw-beat${reverse ? " bw-beat--reverse" : ""}`}>
          <div className="bw-text">
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.8rem",
                letterSpacing: "0.14em",
                color: "var(--teal)",
              }}
            >
              {n}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontWeight: 300,
                fontSize: "clamp(26px, 3.2vw, 44px)",
                letterSpacing: "-0.015em",
                lineHeight: 1.1,
                color: "var(--engine-ink)",
                margin: "0.8rem 0 1.25rem",
              }}
            >
              {title}
            </h2>
            <p
              style={{
                fontSize: "clamp(0.98rem, 1.2vw, 1.12rem)",
                lineHeight: 1.6,
                color: "var(--engine-ink-2)",
                maxWidth: "42ch",
                margin: 0,
              }}
            >
              {body}
            </p>
          </div>
          <div className="bw-graphic">{children}</div>
        </div>
      </div>
    </section>
  );
}
