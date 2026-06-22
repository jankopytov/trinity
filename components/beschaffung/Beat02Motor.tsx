"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { attachPointerParallax } from "@/components/beschaffung/pointerParallax";

// depth layers: far (small/blurred/slow) → near (big/crisp/fast)
const LAYERS = [
  { cls: "far", h: 2, w: 10, op: 0.3, blur: 1.2, dur: 9, y: 148 },
  { cls: "mid", h: 2.5, w: 13, op: 0.6, blur: 0.4, dur: 7, y: 150 },
  { cls: "near", h: 3.5, w: 18, op: 1, blur: 0, dur: 5.2, y: 152 },
];

export default function Beat02Motor() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const svg = ref.current;
    if (!svg) return;

    const railLive = svg.querySelector<SVGRectElement>(".b2-rail-live");
    const allRight = Array.from(svg.querySelectorAll<SVGElement>(".b2-right"));
    const allLeft = Array.from(svg.querySelectorAll<SVGElement>(".b2-left"));

    // Mobile: lighter — drop the densest extras.
    if (mobile) {
      svg.querySelectorAll<SVGElement>(".b2-extra").forEach((el) => {
        el.style.display = "none";
      });
    }
    const vis = (arr: SVGElement[]) => arr.filter((el) => el.style.display !== "none");
    const rights = vis(allRight);
    const lefts = vis(allLeft);

    if (reduce) {
      rights.forEach((el, i) => gsap.set(el, { x: 60 + i * 90 }));
      lefts.forEach((el, i) => gsap.set(el, { x: 360 - i * 90 }));
      return;
    }

    const detachParallax = attachPointerParallax(svg);
    const triggers: ScrollTrigger[] = [];
    const ctx = gsap.context(() => {
      const loop = gsap.timeline({ repeat: -1, paused: true });

      const stream = (el: SVGElement, dir: 1 | -1) => {
        const dur = parseFloat(el.dataset.dur || "6") * (mobile ? 1.25 : 1);
        const from = dir === 1 ? -30 : 510;
        const to = dir === 1 ? 510 : -30;
        const t = gsap.fromTo(
          el,
          { x: from },
          { x: to, duration: dur, ease: "none", repeat: -1 }
        );
        // even phase spread
        t.progress(Math.random()); // varied start; index-free
        loop.add(t, 0);
      };
      rights.forEach((el) => stream(el, 1));
      lefts.forEach((el) => stream(el, -1));

      // a faint pulse travelling the rail itself
      const railLen = railLive ? railLive.width.baseVal.value : 440;
      gsap.set(railLive, { strokeDasharray: `40 ${railLen}` });
      const railPulse = gsap.fromTo(
        railLive,
        { strokeDashoffset: railLen + 40 },
        { strokeDashoffset: 0, duration: 6, ease: "none", repeat: -1, paused: true }
      );

      // subtle parallax on the depth layers
      const far = svg.querySelector(".b2-layer-far");
      const near = svg.querySelector(".b2-layer-near");
      triggers.push(
        ScrollTrigger.create({
          trigger: svg,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            gsap.set(far, { y: -8 * self.progress });
            gsap.set(near, { y: 14 * self.progress });
          },
        })
      );

      triggers.push(
        ScrollTrigger.create({
          trigger: svg,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            if (self.isActive) {
              loop.play();
              railPulse.play();
            } else {
              loop.pause();
              railPulse.pause();
            }
          },
        })
      );
    }, svg);

    return () => {
      detachParallax();
      triggers.forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);

  // build streaks per direction across depth layers
  const streaks = (dir: "right" | "left") =>
    LAYERS.flatMap((layer, li) =>
      // near layer = 1, others = 2 (the 2nd is .b2-extra for mobile)
      Array.from({ length: layer.cls === "near" ? 1 : 2 }).map((_, k) => (
        <rect
          key={`${dir}-${li}-${k}`}
          className={`b2-${dir} b2-layer-${layer.cls}${k === 1 ? " b2-extra" : ""}`}
          data-dur={layer.dur}
          x="0"
          y={dir === "right" ? layer.y : layer.y + 56}
          width={layer.w}
          height={layer.h}
          rx={layer.h / 2}
          fill={dir === "right" ? "url(#b2-trail-r)" : "url(#b2-trail-l)"}
          opacity={layer.op}
          filter={layer.cls === "near" ? "url(#b2-bloom)" : undefined}
          style={layer.blur ? { filter: `blur(${layer.blur}px)` } : undefined}
        />
      ))
    );

  return (
    <svg ref={ref} viewBox="0 0 480 360" role="img" aria-label="Der Motor">
      <defs>
        <linearGradient id="b2-rail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--teal)" />
          <stop offset="100%" stopColor="var(--indigo)" />
        </linearGradient>
        {/* comet trails: bright head, faded tail (per travel direction) */}
        <linearGradient id="b2-trail-r" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--teal)" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="b2-trail-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--indigo)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--indigo)" stopOpacity="0" />
        </linearGradient>
        <filter id="b2-bloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <text x="22" y="118" fill="var(--engine-ink-2)" fontFamily="var(--font-mono), monospace" fontSize="11" letterSpacing="2">
        BESTELLUNG →
      </text>
      <text x="458" y="262" textAnchor="end" fill="var(--engine-ink-2)" fontFamily="var(--font-mono), monospace" fontSize="11" letterSpacing="2">
        ← LIEFERUNG
      </text>

      {/* the rail + a faint travelling pulse along it */}
      <rect x="20" y="186" width="440" height="3" rx="1.5" fill="url(#b2-rail)" opacity="0.7" />
      <rect className="b2-rail-live" x="20" y="186" width="440" height="3" rx="1.5" fill="none" stroke="#bff7ec" strokeWidth="3" opacity="0.5" filter="url(#b2-bloom)" />

      {/* depth-layered streaks (near layer gets bloom) */}
      {streaks("right")}
      {streaks("left")}
    </svg>
  );
}
