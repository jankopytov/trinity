"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { attachPointerParallax } from "@/components/beschaffung/pointerParallax";
import { useT } from "@/lib/i18n";

const ROWS = [
  { y: 44, code: "RX-4821", extra: false },
  { y: 82, code: "RX-3390", extra: false },
  { y: 120, code: "RX-7765", extra: false },
  { y: 158, code: "RX-1042", extra: false }, // HOT
  { y: 196, code: "RX-5518", extra: true },
  { y: 234, code: "RX-6207", extra: true },
  { y: 272, code: "RX-9314", extra: true },
];
const HOT = 3;
const MUTED = "#6e5a5a"; // muted reject tone (not alarming)

export default function Beat03TrinityBuyer() {
  const ref = useRef<SVGSVGElement>(null);
  const t = useT();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const svg = ref.current;
    if (!svg) return;

    if (mobile) {
      svg.querySelectorAll<SVGElement>(".b3-extra").forEach((el) => (el.style.display = "none"));
    }

    const q = (s: string) => svg.querySelector<SVGElement>(s);
    const qa = (s: string) =>
      Array.from(svg.querySelectorAll<SVGElement>(s)).filter((e) => e.style.display !== "none");
    const hot = q(".b3-hot");
    const hotRect = q(".b3-hot-rect");
    const hotDot = q(".b3-hot-dot");
    const hotGlow = q(".b3-hot-glow");
    const hotLabel = q(".b3-hot-label");
    const loadbar = q(".b3-loadbar");
    const tick = svg.querySelector<SVGPathElement>(".b3-tick");
    const query = q(".b3-query");
    const live = q(".b3-live");
    const statusDots = qa(".b3-statusdot");
    const rejectDots = qa(".b3-statusdot.b3-reject");
    const radar = qa(".b3-radar");
    const tickLen = tick ? tick.getTotalLength() : 14;

    const settle = () => {
      gsap.set(hotGlow, { opacity: 0.35 });
      gsap.set(hotRect, { attr: { stroke: "#15C2AB" }, fillOpacity: 0.16 });
      gsap.set(hotDot, { attr: { fill: "#15C2AB" } });
      gsap.set(hotLabel, { opacity: 1 });
      gsap.set(tick, { strokeDasharray: tickLen, strokeDashoffset: 0 });
      gsap.set([query, radar], { opacity: 0 });
      gsap.set(loadbar, { scaleX: 1, transformOrigin: "0% 50%", opacity: 0 });
    };

    if (reduce) {
      settle();
      return;
    }

    const detachParallax = attachPointerParallax(svg);
    const triggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      gsap.set([hotLabel, hotGlow, query], { opacity: 0 });
      gsap.set(tick, { strokeDasharray: tickLen, strokeDashoffset: tickLen });
      gsap.set(loadbar, { scaleX: 0, transformOrigin: "0% 50%", opacity: 0 });

      // ---- continuous ambient: status dots "angefragt…", live blink, radar ----
      const dotPulse = gsap.to(statusDots, {
        opacity: 0.4,
        duration: 1.1,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.18, from: "random" },
        paused: true,
      });
      const liveBlink = gsap.to(live, {
        opacity: 0.25,
        duration: 0.9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        paused: true,
      });
      const radarTl = gsap.timeline({ repeat: -1, paused: true });
      radar.forEach((r, i) =>
        radarTl.fromTo(
          r,
          { scale: 0.2, opacity: 0.6, transformOrigin: "50% 50%" },
          { scale: 1, opacity: 0, duration: 2.4, ease: "sine.out" },
          i * 0.8
        )
      );

      // a query sweep through a given row's y
      const sweep = (y: number) =>
        gsap.fromTo(
          query,
          { attr: { x: 20, y: y + 1 }, opacity: 0 },
          { attr: { x: 452 }, opacity: 0.6, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: 1 }
        );

      // ---- master cycle: query → rejects → HIT → hold → reset (calm, repeats) ----
      const cycle = gsap.timeline({ repeat: -1, repeatDelay: 2.4, paused: true });
      cycle.add(sweep(ROWS[1].y), 0);
      cycle.add(sweep(ROWS[5] && !ROWS[5].extra ? ROWS[5].y : ROWS[2].y), 0.9);
      // rejects — a couple rows blink muted, then back
      cycle.to(rejectDots, { attr: { fill: MUTED }, duration: 0.25, stagger: 0.15 }, 1.4);
      cycle.to(rejectDots, { attr: { fill: "#33455c" }, duration: 0.6 }, 2.2);
      // HIT — loading bar fills on the hot row
      cycle.add(sweep(ROWS[HOT].y), 2.4);
      cycle.to(loadbar, { opacity: 0.9, duration: 0.1 }, 3.0);
      cycle.fromTo(loadbar, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power1.inOut" }, 3.0);
      cycle.to(loadbar, { opacity: 0, duration: 0.2 }, 3.9);
      // flare full teal + glow pulse + checkmark pop
      cycle.to(hotGlow, { opacity: 0.55, duration: 0.3 }, 3.9);
      cycle.to(hotRect, { attr: { stroke: "#15C2AB" }, fillOpacity: 0.16, duration: 0.3 }, 3.9);
      cycle.to(hotDot, { attr: { fill: "#15C2AB" }, duration: 0.25 }, 3.9);
      cycle.fromTo(hot, { scale: 1, transformOrigin: "50% 50%" }, { scale: 1.03, duration: 0.2, yoyo: true, repeat: 1 }, 3.9);
      cycle.to(tick, { strokeDashoffset: 0, duration: 0.35, ease: "back.out(3)" }, 4.0);
      cycle.to(hotLabel, { opacity: 1, duration: 0.35 }, 4.05);
      // settle to a soft glow, hold
      cycle.to(hotGlow, { opacity: 0.3, duration: 0.8 }, 4.5);
      // reset for the next calm pass
      cycle.to([hotLabel, hotGlow], { opacity: 0, duration: 0.8 }, "+=2.5");
      cycle.to(hotRect, { attr: { stroke: "#22324a" }, fillOpacity: 0, duration: 0.6 }, "<");
      cycle.to(hotDot, { attr: { fill: "#33455c" }, duration: 0.6 }, "<");
      cycle.set(tick, { strokeDashoffset: tickLen });

      const play = () => {
        dotPulse.play();
        liveBlink.play();
        radarTl.play();
        cycle.play();
      };
      const pause = () => {
        dotPulse.pause();
        liveBlink.pause();
        radarTl.pause();
        cycle.pause();
      };

      ScrollTrigger.create({ trigger: svg, start: "top 75%", once: true, onEnter: play });
      triggers.push(
        ScrollTrigger.create({
          trigger: svg,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            // resume only after it has started
            if (self.isActive) {
              if (cycle.totalTime() > 0 || cycle.isActive()) play();
            } else pause();
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

  const row = (i: number) => {
    const r = ROWS[i];
    const hot = i === HOT;
    // a few non-hot rows can flash a muted reject
    const reject = i === 1 || i === 4;
    return (
      <g key={i} className={`b3-row${hot ? " b3-hot" : ""}${r.extra ? " b3-extra" : ""}`} opacity={hot ? 1 : 0.3}>
        {hot && <rect className="b3-hot-glow" x="18" y={r.y - 2} width="444" height="34" rx="9" fill="var(--teal)" opacity="0" style={{ filter: "blur(8px)" }} />}
        <rect className={hot ? "b3-hot-rect" : undefined} x="20" y={r.y} width="440" height="30" rx="7" fill="var(--teal)" fillOpacity="0" stroke="#22324a" strokeWidth="1" />
        <circle className={`b3-statusdot${reject ? " b3-reject" : ""}${hot ? " b3-hot-dot" : ""}`} cx="40" cy={r.y + 15} r="3.5" fill="#33455c" />
        <text x="58" y={r.y + 19} fill="#46597190" fontFamily="var(--font-mono), monospace" fontSize="10" letterSpacing="1">{r.code}</text>
        <rect x="128" y={r.y + 11} width="120" height="7" rx="3.5" fill="#27374e" />
        {hot ? (
          <>
            <rect className="b3-loadbar" x="20" y={r.y + 27} width="440" height="2" rx="1" fill="var(--teal)" opacity="0" />
            <path className="b3-tick" d="M392 15 l5 5 l9 -11" transform={`translate(0 ${r.y})`} fill="none" stroke="#15C2AB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <text className="b3-hot-label" x="382" y={r.y + 19} textAnchor="end" fill="var(--teal)" fontFamily="var(--font-mono), monospace" fontSize="10" letterSpacing="1">{t.beschaffung.gAvailableOrdered}</text>
          </>
        ) : (
          <rect x="380" y={r.y + 11} width="60" height="7" rx="3.5" fill="#1c2a3a" />
        )}
      </g>
    );
  };

  return (
    <svg ref={ref} viewBox="0 0 480 320" role="img" aria-label="Trinity Buyer">
      <defs>
        <linearGradient id="b3-q" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#15C2AB" stopOpacity="0" />
          <stop offset="50%" stopColor="#15C2AB" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#15C2AB" stopOpacity="0" />
        </linearGradient>
      </defs>

      <text x="20" y="24" fill="var(--engine-ink-2)" fontFamily="var(--font-mono), monospace" fontSize="11" letterSpacing="2">
        TRINITY BUYER
      </text>

      {/* 24/7 radar + live indicator */}
      <g transform="translate(438 18)">
        <text x="0" y="4" textAnchor="end" fill="#46597190" fontFamily="var(--font-mono), monospace" fontSize="9" letterSpacing="1.5">24/7</text>
        {[0, 1, 2].map((i) => (
          <circle key={i} className="b3-radar" cx="8" cy="0" r="9" fill="none" stroke="var(--teal)" strokeWidth="1.2" opacity="0" />
        ))}
        <circle className="b3-live" cx="8" cy="0" r="2" fill="var(--teal)" />
      </g>

      {ROWS.map((_, i) => row(i))}

      {/* query sweep line (thin, bright) */}
      <rect className="b3-query" x="20" y="44" width="26" height="28" rx="3" fill="url(#b3-q)" opacity="0" />
    </svg>
  );
}
