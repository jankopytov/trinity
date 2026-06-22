"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useT } from "@/lib/i18n";

export default function TypoPoster({ which }: { which: "poster1" | "poster2" }) {
  const ref = useRef<HTMLElement>(null);
  const t = useT();
  const lines = t.beschaffung[which];

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const els = ref.current?.querySelectorAll(".tp-line");
    if (!els) return;

    if (reduce) {
      gsap.set(els, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(els, {
        opacity: 0,
        y: 24,
        duration: 1,
        ease: "power2.out",
        stagger: 0.18,
        scrollTrigger: { trigger: ref.current!, start: "top 70%", once: true },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        padding: "8rem var(--gutter)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontWeight: 250,
          fontSize: "clamp(36px, 7vw, 104px)",
          lineHeight: 1.04,
          letterSpacing: "-0.025em",
          color: "var(--engine-ink)",
          margin: 0,
          textAlign: "left",
        }}
      >
        {lines.map((line, i) => (
          <span
            key={i}
            className="tp-line"
            style={{
              display: "block",
              ...(line.gradient
                ? {
                    background: "var(--accent)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    WebkitTextFillColor: "transparent",
                    // background-clip:text can crop descenders — give the "g" room.
                    lineHeight: 1.25,
                    paddingBottom: "0.18em",
                  }
                : null),
            }}
          >
            {line.text}
          </span>
        ))}
      </h2>
    </section>
  );
}
