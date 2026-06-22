"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useUIStore } from "@/lib/store";

const MIN_DISPLAY_MS = 2200;
const HOLD_MS = 300;
const POSTER = "/video/hero/hero-poster.jpg";
const POSTER_PORTRAIT = "/video/hero/hero-poster-portrait.jpg";
const MOBILE_MQ = "(max-width: 768px)";
const WORDMARK = "TRINITY PHARMA";

/** Resolve on window load (or immediately if already loaded). */
function whenWindowLoaded(): Promise<void> {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

/** Preload the hero poster; resolve regardless of success so we never hang. */
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export default function Preloader() {
  const setPreloaderDone = useUIStore((s) => s.setPreloaderDone);

  const overlayRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const [hidden, setHidden] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [portraitFailed, setPortraitFailed] = useState(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // On mobile the portrait poster is the visible centerpiece, so gate on it.
    const isMobile = window.matchMedia(MOBILE_MQ).matches;
    const gatePoster = isMobile ? POSTER_PORTRAIT : POSTER;

    const start = performance.now();

    const gate = Promise.all([
      whenWindowLoaded(),
      document.fonts ? document.fonts.ready : Promise.resolve(),
      preloadImage(gatePoster),
    ]).then(() => {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
      return new Promise<void>((r) => window.setTimeout(r, wait));
    });

    const done = () => {
      setPreloaderDone(true);
      setHidden(true);
    };

    // ---- Reduced motion: everything static, quick fade after the gate. ----
    if (reduce) {
      gsap.set(railRef.current, { scaleX: 1 });
      gate.then(() => {
        setPreloaderDone(true);
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3,
          delay: 0,
          onComplete: () => setHidden(true),
        });
      });
      return;
    }

    const ctx = gsap.context(() => {
      // 5. Progress rail crawls to 0.9 over the min-display window.
      gsap.fromTo(
        railRef.current,
        { scaleX: 0 },
        { scaleX: 0.9, duration: MIN_DISPLAY_MS / 1000, ease: "power1.out" }
      );

      const tl = gsap.timeline();

      // 1. Logo surfaces into focus.
      tl.fromTo(
        logoWrapRef.current,
        { opacity: 0, scale: 1.06, filter: "blur(8px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power3.out",
        },
        0
      );

      // 3. Ripple ring on settle.
      tl.fromTo(
        rippleRef.current,
        { scale: 0.6, opacity: 0.5 },
        { scale: 1.6, opacity: 0, duration: 1.2, ease: "power2.out" },
        0.15
      );

      // 2. Gloss light-sweep across the logo.
      tl.fromTo(
        sweepRef.current,
        { xPercent: -160, opacity: 0 },
        { xPercent: 160, opacity: 1, duration: 0.9, ease: "power2.inOut" },
        0.4
      );
      tl.to(sweepRef.current, { opacity: 0, duration: 0.25 }, 1.3);

      // 4. Wordmark reveals letter-by-letter.
      const glyphs = wordmarkRef.current?.querySelectorAll(".pl-glyph-inner");
      if (glyphs && glyphs.length) {
        tl.fromTo(
          glyphs,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.04,
          },
          0.5
        );
      }
    }, overlay);

    gate.then(() => {
      gsap.to(railRef.current, {
        scaleX: 1,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          window.setTimeout(() => {
            setPreloaderDone(true);
            // 0.7s dissolve — invisible because the hero opens on the same frame.
            gsap.to(overlay, {
              opacity: 0,
              duration: 0.7,
              ease: "power2.inOut",
              onComplete: () => setHidden(true),
            });
          }, HOLD_MS);
        },
      });
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPreloaderDone]);

  if (hidden) return null;

  return (
    <div
      ref={overlayRef}
      className={`pl-overlay${portraitFailed ? " pl-portrait-missing" : ""}`}
    >
      {/* Centerpiece: the rendered glossy Penrose (hero poster), or SVG fallback. */}
      <div ref={logoWrapRef} className="pl-stage">
        {posterFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/brand/logo-mark.svg" alt="Trinity Pharma" aria-hidden className="pl-fallback" />
        ) : (
          <>
            {/* Desktop: full-bleed landscape poster. Also the mobile fallback
                if the portrait poster is missing (shown contained via CSS). */}
            <img
              src={POSTER}
              alt=""
              aria-hidden
              onError={() => setPosterFailed(true)}
              className="pl-poster"
            />
            {/* Mobile (≤768px): portrait 9:16 poster, contained. */}
            {!portraitFailed && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={POSTER_PORTRAIT}
                alt=""
                aria-hidden
                onError={() => setPortraitFailed(true)}
                className="pl-poster-portrait"
              />
            )}
          </>
        )}

        {/* 3. Ripple ring centered under the triangle. */}
        <div ref={rippleRef} aria-hidden className="pl-ripple" />

        {/* 2. Gloss light-sweep. */}
        <div ref={sweepRef} aria-hidden className="pl-sweep" />
      </div>

      {/* 4. Wordmark, lower-center, clear of the triangle. */}
      <div ref={wordmarkRef} aria-label={WORDMARK} className="pl-wordmark">
        {WORDMARK.split("").map((ch, i) => (
          <span
            key={i}
            aria-hidden
            style={{
              display: "inline-block",
              overflow: "hidden",
              // preserve spaces as fixed width
              width: ch === " " ? "0.55em" : undefined,
            }}
          >
            <span
              className="pl-glyph-inner"
              style={{ display: "inline-block", willChange: "transform" }}
            >
              {ch === " " ? " " : ch}
            </span>
          </span>
        ))}
      </div>

      {/* 5. Progress rail — pinned bottom on desktop, below the wordmark on mobile. */}
      <div ref={railRef} aria-hidden className="pl-rail" />
    </div>
  );
}
