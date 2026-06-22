"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useUIStore } from "@/lib/store";
import { useT } from "@/lib/i18n";

const POSTER = "/video/hero/hero-poster.jpg";

const fillCover: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export default function Hero() {
  const [reduce, setReduce] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const preloaderDone = useUIStore((s) => s.preloaderDone);
  const t = useT();

  useEffect(() => {
    setReduce(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // Handoff: the video comes alive the moment the loader lifts — one continuous
  // motion off the same poster frame. No autoplay before that. Skip under reduced motion.
  useEffect(() => {
    if (!preloaderDone || reduce) return;
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, [preloaderDone, reduce]);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh", // fallback
        minHeight: "100dvh",
        overflow: "hidden",
        // If video + poster both fail to load, we land on clean paper.
        background: "var(--paper)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 var(--gutter) clamp(3rem, 8vh, 7rem)",
      }}
    >
      {reduce ? (
        // Reduced motion: poster only, no autoplay.
        <img src={POSTER} alt="" aria-hidden style={fillCover} />
      ) : (
        <video
          ref={videoRef}
          style={fillCover}
          muted
          loop
          playsInline
          preload="auto"
          poster={POSTER}
        >
          <source src="/video/hero/hero.webm" type="video/webm" />
          <source src="/video/hero/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Subtle bottom-up scrim so the light headline reads over the light
          hero footage. Kept light-touch — only the lower text area darkens. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(to top, rgba(6,11,20,0.58), rgba(6,11,20,0.22) 38%, transparent 68%)",
        }}
      />

      {/* Overlay content — lower-anchored, clear of the centered Penrose. */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "20ch" }}>
        <h1
          style={{
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontWeight: 250,
            fontSize: "clamp(40px, 6vw, 84px)",
            lineHeight: 1.04,
            letterSpacing: "-0.02em",
            color: "var(--paper)",
            margin: 0,
          }}
        >
          {t.hero.line1}{" "}
          <span
            style={{
              background: "var(--accent)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t.hero.line2}
          </span>
        </h1>

        <Link
          href="/kontakt"
          style={{
            display: "inline-block",
            marginTop: "2rem",
            background: "var(--indigo)",
            color: "#FFFFFF",
            padding: "0.85rem 1.6rem",
            borderRadius: 999,
            fontSize: "0.9rem",
            fontWeight: 600,
            letterSpacing: "0.01em",
            textDecoration: "none",
          }}
        >
          {t.hero.cta}
        </Link>
      </div>
    </section>
  );
}
