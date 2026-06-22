"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { attachPointerParallax } from "@/components/beschaffung/pointerParallax";

const BASE = 300; // baseline for the bars
const SURFACE = 200;
const BARS = [
  { x: 60, top: 150, extra: true },
  { x: 116, top: 100, extra: false },
  { x: 172, top: 168, extra: false },
  { x: 228, top: 78, extra: false },
  { x: 284, top: 138, extra: false },
  { x: 340, top: 110, extra: true },
  { x: 396, top: 160, extra: true },
];

export default function Beat05Ergebnis() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const svg = ref.current;
    if (!svg) return;

    if (mobile) {
      svg.querySelectorAll<SVGElement>(".b5-extra").forEach((el) => (el.style.display = "none"));
    }
    const vis = (sel: string) =>
      Array.from(svg.querySelectorAll<SVGElement>(sel)).filter((el) => el.style.display !== "none");
    const bars = vis(".b5-bar");
    const refls = vis(".b5-refl");
    const tips = vis(".b5-tip");
    const surface = svg.querySelector(".b5-surface-glow");
    const core = svg.querySelector(".b5-surface-core");
    const railpulse = svg.querySelector(".b5-railpulse");
    const caustics = vis(".b5-caustic");
    const streams = vis(".b5-stream");

    if (reduce) {
      gsap.set(bars, { scaleY: 1, transformOrigin: "50% 100%" });
      gsap.set(refls, { scaleY: 1, transformOrigin: "50% 0%" });
      gsap.set(surface, { opacity: 0.6 });
      gsap.set(core, { opacity: 0.7 });
      gsap.set(caustics, { opacity: 0.4 });
      gsap.set([streams, tips, railpulse], { opacity: 0 });
      return;
    }

    const detachParallax = attachPointerParallax(svg);
    const triggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      // FLAT
      gsap.set(bars, { scaleY: 0.04, transformOrigin: "50% 100%" });
      gsap.set(refls, { scaleY: 0, transformOrigin: "50% 0%" });
      gsap.set([surface, core, ...caustics, ...tips, railpulse, ...streams], { opacity: 0 });

      // idle: bars breathe; gentle stream loop (started after intro)
      const breathe = gsap.to(bars, { scaleY: 1.015, duration: 3.4, ease: "sine.inOut", repeat: -1, yoyo: true, transformOrigin: "50% 100%", stagger: { each: 0.3, from: "center" }, paused: true });
      const streamLoop = gsap.timeline({ repeat: -1, paused: true });
      if (!mobile) {
        streams.forEach((el, i) => {
          const bar = bars[i] || bars[0];
          const topY = bar ? +bar.getAttribute("y")! : SURFACE;
          streamLoop.fromTo(
            el,
            { attr: { cx: +(bar?.getAttribute("x") ?? 200) + 15, cy: topY }, opacity: 0 },
            { attr: { cy: topY - 130 }, opacity: 0.5, duration: 3.6, ease: "sine.out" },
            i * 1.1
          );
          streamLoop.to(el, { opacity: 0, duration: 0.4 }, i * 1.1 + 3.2);
        });
      }
      const idle = () => { breathe.play(); if (!mobile) streamLoop.play(); };
      const idlePause = () => { breathe.pause(); streamLoop.pause(); };

      // ---- timed sequence on enter ----
      const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 78%", once: true }, onComplete: idle });
      // 2 SCHIENE PULSE along the surface rail
      tl.fromTo(railpulse, { attr: { cx: -10 }, opacity: 0 }, { attr: { cx: 490 }, opacity: 0.85, duration: 1.1, ease: "sine.inOut" }, 0.2);
      tl.to(railpulse, { opacity: 0, duration: 0.3 }, 1.1);
      // surface glow/core/caustics fade in
      tl.to(surface, { opacity: 0.6, duration: 1.2, ease: "sine.out" }, 0.9);
      tl.to(core, { opacity: 0.75, duration: 1.2, ease: "sine.out" }, 0.9);
      tl.to(caustics, { opacity: 0.45, duration: 1.2, ease: "sine.out" }, 0.9);
      // 3 GROW left→right, staggered; 4 particles rise; 5 tip glow
      bars.forEach((bar, i) => {
        const at = 0.9 + i * 0.16;
        const bx = +(bar.getAttribute("x") ?? "0") + 15;
        const by = +(bar.getAttribute("y") ?? "0");
        tl.to(bar, { scaleY: 1, duration: 0.7, ease: "power2.out" }, at);
        tl.to(refls[i], { scaleY: 1, duration: 0.7, ease: "power2.out" }, at);
        // tip glow as it maxes
        tl.fromTo(tips[i], { opacity: 0, scale: 0.5, transformOrigin: "50% 50%" }, { opacity: 0.85, scale: 1, duration: 0.3, ease: "power2.out", yoyo: true, repeat: 1 }, at + 0.55);
        // a particle detaches from the tip and rises out
        if (!mobile && streams[i]) {
          tl.fromTo(streams[i], { attr: { cx: bx, cy: by }, opacity: 0.7 }, { attr: { cy: by - 120 }, opacity: 0, duration: 1.6, ease: "sine.out" }, at + 0.5);
        }
      });

      triggers.push(
        ScrollTrigger.create({
          trigger: svg,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            if (self.isActive) {
              if (tl.progress() === 1) idle();
            } else idlePause();
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

  return (
    <svg ref={ref} viewBox="0 0 480 360" role="img" aria-label="Das Ergebnis">
      <defs>
        <linearGradient id="b5-bar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--teal)" />
          <stop offset="100%" stopColor="var(--indigo)" />
        </linearGradient>
        <filter id="b5-bloom" x="-30%" y="-200%" width="160%" height="500%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <text x="20" y="32" fill="var(--engine-ink-2)" fontFamily="var(--font-mono), monospace" fontSize="11" letterSpacing="2">
        WIEDERKEHRENDE ERTRÄGE
      </text>

      {/* machine layer */}
      <rect x="0" y={BASE} width="480" height="60" fill="var(--engine-raise)" />

      {/* faint reflections */}
      <g opacity="0.16">
        {BARS.map((b, i) => (
          <rect key={`r${i}`} className={`b5-refl${b.extra ? " b5-extra" : ""}`} x={b.x} y={BASE} width="30" height={Math.min((BASE - b.top) * 0.32, 52)} rx="4" fill="url(#b5-bar)" />
        ))}
      </g>

      {/* surface line — bloom + bright core + caustics + a travelling Schiene pulse */}
      <rect className="b5-surface-glow" x="0" y={SURFACE - 4} width="480" height="8" fill="var(--teal)" opacity="0" filter="url(#b5-bloom)" />
      {[170, 250, 330].map((x, i) => (
        <line key={i} className={`b5-caustic${i >= 2 ? " b5-extra" : ""}`} x1={x - 26} y1={SURFACE} x2={x + 26} y2={SURFACE} stroke="#bff7ec" strokeWidth="1" opacity="0" filter="url(#b5-bloom)" />
      ))}
      <rect className="b5-surface-core" x="0" y={SURFACE - 0.75} width="480" height="1.5" fill="#bff7ec" opacity="0" />
      <line x1="0" y1={SURFACE} x2="480" y2={SURFACE} stroke="#22324a" strokeWidth="1" strokeDasharray="3 5" />
      <circle className="b5-railpulse" cx="-10" cy={SURFACE} r="3.5" fill="#bff7ec" opacity="0" filter="url(#b5-bloom)" />

      {/* rising bars + tip glow */}
      {BARS.map((b, i) => (
        <rect key={i} className={`b5-bar${b.extra ? " b5-extra" : ""}`} x={b.x} y={b.top} width="30" height={BASE - b.top} rx="4" fill="url(#b5-bar)" />
      ))}
      {BARS.map((b, i) => (
        <circle key={`t${i}`} className={`b5-tip${b.extra ? " b5-extra" : ""}`} cx={b.x + 15} cy={b.top} r="7" fill="var(--teal)" opacity="0" filter="url(#b5-bloom)" />
      ))}

      {/* rising light particles */}
      {[120, 200, 280, 360, 90, 420, 250].map((x, i) => (
        <circle key={i} className={`b5-stream${BARS[i]?.extra ? " b5-extra" : ""}`} cx={x} cy={SURFACE - 6} r="2" fill="#bff7ec" opacity="0" />
      ))}
    </svg>
  );
}
