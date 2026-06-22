"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useT } from "@/lib/i18n";

export default function BeschaffungCloser() {
  const ref = useRef<HTMLElement>(null);
  const t = useT();

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;
    const mark = ref.current?.querySelector(".bw-closer-mark");
    if (!mark) return;

    const ctx = gsap.context(() => {
      // one gentle, slow breathing pulse — the Motor at rest
      gsap.to(mark, {
        scale: 1.04,
        duration: 2.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "50% 50%",
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        padding: "11rem var(--gutter)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div className="bw-closer-mark" style={{ marginBottom: "3rem" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-mark.svg"
          alt="Trinity Pharma"
          style={{ height: 110, width: "auto", display: "block" }}
        />
      </div>
      <p
        style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontWeight: 250,
          fontSize: "clamp(26px, 4vw, 52px)",
          letterSpacing: "-0.015em",
          lineHeight: 1.1,
          color: "var(--engine-ink)",
          maxWidth: "20ch",
          margin: "0 0 2.5rem",
        }}
      >
        {t.beschaffung.closerLine}
      </p>
      <Link
        href="/kontakt"
        style={{
          display: "inline-block",
          background: "var(--indigo)",
          color: "#FFFFFF",
          padding: "0.95rem 1.9rem",
          borderRadius: 999,
          fontSize: "0.92rem",
          fontWeight: 600,
          letterSpacing: "0.01em",
          textDecoration: "none",
        }}
      >
        {t.beschaffung.closerCta}
      </Link>
    </section>
  );
}
