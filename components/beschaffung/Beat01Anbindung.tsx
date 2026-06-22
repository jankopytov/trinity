"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { attachPointerParallax } from "@/components/beschaffung/pointerParallax";

const ROWS = [83, 113, 143, 173];
const ACTIVE_ROW = 2; // ends full teal
const DOTS = [80, 92, 104];

export default function Beat01Anbindung() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const svg = ref.current;
    if (!svg) return;

    const q = <T extends Element>(s: string) => svg.querySelector<T>(s);
    const qa = (s: string) => Array.from(svg.querySelectorAll<SVGElement>(s));
    const connector = q(".b1-connector");
    const flash = q(".b1-flash");
    const shock = q(".b1-shock");
    const circuit = q<SVGPathElement>(".b1-circuit-live");
    const machineGlow = q(".b1-machine-glow");
    const panelGlow = q(".b1-panelglow");
    const rows = qa(".b1-row");
    const dots = qa(".b1-dot");
    const bg = q(".b1-bg");
    const len = circuit ? circuit.getTotalLength() : 100;

    // SETTLED end-state — used directly for reduced motion.
    const settle = () => {
      gsap.set(connector, { scaleY: 1, transformOrigin: "50% 100%", opacity: 1 });
      gsap.set(rows, { opacity: 1 });
      gsap.set(rows[ACTIVE_ROW], { attr: { stroke: "#15C2AB" } });
      gsap.set(dots, { attr: { fill: "#15C2AB" } });
      gsap.set(machineGlow, { opacity: 0.4 });
      gsap.set(panelGlow, { opacity: 0.3 });
      gsap.set(circuit, { strokeDasharray: `${len}`, strokeDashoffset: 0, opacity: 0.5 });
      gsap.set([flash, shock], { opacity: 0 });
    };

    if (reduce) {
      settle();
      return;
    }

    const detachParallax = attachPointerParallax(svg);
    const triggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      // ---- OFF state ----
      gsap.set(connector, { scaleY: 0, transformOrigin: "50% 100%", opacity: 1 });
      gsap.set(rows, { opacity: 0.2 });
      gsap.set(rows[ACTIVE_ROW], { attr: { stroke: "#27374e" } });
      gsap.set(dots, { attr: { fill: "#33455c" } });
      gsap.set(machineGlow, { opacity: 0 });
      gsap.set(panelGlow, { opacity: 0 });
      gsap.set(circuit, { strokeDasharray: `16 ${len}`, strokeDashoffset: 16, opacity: 0 });
      gsap.set(flash, { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" });
      gsap.set(shock, { opacity: 0, scale: 0.3, transformOrigin: "50% 50%" });

      // subtle bg parallax
      triggers.push(
        ScrollTrigger.create({
          trigger: svg,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => gsap.set(bg, { y: -16 * self.progress }),
        })
      );

      // ---- idle loops (started after intro) ----
      const heartbeat = gsap.to(dots[0], {
        opacity: 0.45,
        duration: 1,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        paused: true,
      });
      const connPulse = gsap.fromTo(
        circuit,
        { strokeDashoffset: 16, opacity: 0.9 },
        { strokeDashoffset: -len, duration: 1.4, ease: "power1.inOut", repeat: -1, repeatDelay: 3, paused: true }
      );
      const breathe = gsap.to(panelGlow, {
        opacity: 0.45,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        paused: true,
      });
      const idle = () => {
        heartbeat.play();
        connPulse.play();
        breathe.play();
      };
      const idlePause = () => {
        heartbeat.pause();
        connPulse.pause();
        breathe.pause();
      };

      // ---- one-shot intro ----
      const intro = gsap.timeline({
        scrollTrigger: { trigger: svg, start: "top 72%", once: true },
        onComplete: idle,
      });
      // 1 OFF (hold ~0.6s), 2 CONNECT
      intro.to(connector, { scaleY: 1, duration: 0.8, ease: "power2.out" }, 0.6);
      // dock: flash + shockwave
      intro.to(flash, { opacity: 0.9, scale: 1.1, duration: 0.16, ease: "power2.out" }, 1.3);
      intro.to(flash, { opacity: 0, duration: 0.5, ease: "power2.in" }, ">");
      intro.fromTo(
        shock,
        { opacity: 0.6, scale: 0.3 },
        { opacity: 0, scale: 3, duration: 0.7, ease: "power2.out" },
        1.32
      );
      // 3 PULSE DOWN + machine wakes
      intro.set(circuit, { opacity: 0.95 }, 1.5);
      intro.fromTo(
        circuit,
        { strokeDashoffset: 16 },
        { strokeDashoffset: -len, duration: 0.8, ease: "power1.in" },
        1.5
      );
      intro.to(machineGlow, { opacity: 0.4, duration: 0.8, ease: "sine.out" }, 1.6);
      // 4 AWAKEN: rows ignite top→bottom, active → teal; dots flip green
      intro.to(rows, { opacity: 1, duration: 0.4, ease: "power2.out", stagger: 0.1 }, 2.2);
      intro.to(rows[ACTIVE_ROW], { attr: { stroke: "#15C2AB" }, duration: 0.5 }, 2.4);
      intro.to(dots, { attr: { fill: "#15C2AB" }, duration: 0.4, stagger: 0.08 }, 2.5);
      intro.set(circuit, { strokeDasharray: `16 ${len}`, strokeDashoffset: 16, opacity: 0.5 }, 3.2);

      triggers.push(
        ScrollTrigger.create({
          trigger: svg,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            // only idle once intro finished (heartbeat etc. are paused until then)
            if (self.isActive) {
              if (intro.progress() === 1) idle();
            } else {
              idlePause();
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

  return (
    <svg ref={ref} viewBox="0 0 480 360" role="img" aria-label="Anbindung">
      <defs>
        <linearGradient id="b1-conn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--teal)" />
          <stop offset="100%" stopColor="var(--indigo)" />
        </linearGradient>
        <filter id="b1-bloom" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="b1-glass" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.10" />
          <stop offset="22%" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* depth: blurred background grid */}
      <g className="b1-bg" opacity="0.5" style={{ filter: "blur(1.4px)" }}>
        <g stroke="#16243a" strokeWidth="1">
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1="20" y1={50 + i * 52} x2="460" y2={50 + i * 52} />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={40 + i * 50} y1="40" x2={40 + i * 50} y2="320" />
          ))}
        </g>
      </g>

      {/* machine layer beneath + its glow */}
      <ellipse className="b1-machine-glow" cx="240" cy="304" rx="170" ry="34" fill="var(--teal)" opacity="0" style={{ filter: "blur(16px)" }} />
      <rect x="0" y="300" width="480" height="60" fill="var(--engine-raise)" />
      <line x1="0" y1="300" x2="480" y2="300" stroke="#1c2a3a" strokeWidth="1" />
      <g stroke="#1c2a3a" strokeWidth="1">
        <line x1="40" y1="320" x2="110" y2="320" />
        <line x1="150" y1="332" x2="220" y2="332" />
        <line x1="320" y1="320" x2="380" y2="320" />
      </g>

      {/* software panel */}
      <rect className="b1-panelglow" x="58" y="32" width="364" height="174" rx="13" fill="var(--teal)" opacity="0" style={{ filter: "blur(10px)" }} />
      <rect x="60" y="34" width="360" height="170" rx="12" fill="var(--engine-raise)" stroke="#22324a" strokeWidth="1" />
      <rect x="60" y="34" width="360" height="170" rx="12" fill="url(#b1-glass)" />
      <line x1="72" y1="35.5" x2="408" y2="35.5" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1" />
      <rect x="60" y="34" width="360" height="26" rx="12" fill="#0a1422" fillOpacity="0.7" />
      {DOTS.map((cx, i) => (
        <circle key={i} className="b1-dot" cx={cx} cy="47" r="3" fill="#33455c" />
      ))}
      <text x="360" y="51" textAnchor="end" fill="#3a4d66" fontFamily="var(--font-mono), monospace" fontSize="9" letterSpacing="1.5">MSV3</text>
      <g fontFamily="var(--font-mono), monospace" fontSize="8" fill="#3a4d66" letterSpacing="1">
        <text x="78" y="86">ENDPOINT</text>
        <text x="78" y="116">AUTH</text>
        <text x="78" y="146">SYNC</text>
        <text x="78" y="176">STATUS</text>
      </g>
      <g strokeWidth="5" strokeLinecap="round">
        {ROWS.map((y, i) => (
          <line key={i} className="b1-row" x1="150" y1={y} x2={i === 1 ? 330 : i === 3 ? 300 : 360} y2={y} stroke="#27374e" />
        ))}
      </g>
      <rect x="228" y="196" width="24" height="10" rx="3" fill="#0a1320" stroke="#22324a" />

      {/* circuit path the pulse travels */}
      <path d="M240 206 V250 H300 V300" fill="none" stroke="#1f3047" strokeWidth="2" />
      <path className="b1-circuit-live" d="M240 206 V250 H300 V300" fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" filter="url(#b1-bloom)" />

      <g className="b1-fg">
        {/* connector that grows up from the machine and docks at the panel */}
        <g className="b1-connector">
          <rect x="230" y="200" width="20" height="86" rx="4" fill="url(#b1-conn)" filter="url(#b1-bloom)" />
          <rect x="226" y="198" width="28" height="8" rx="3" fill="var(--teal)" />
        </g>
        {/* shockwave ring + flash at the dock point */}
        <circle className="b1-shock" cx="240" cy="202" r="10" fill="none" stroke="var(--teal)" strokeWidth="2" opacity="0" />
        <circle className="b1-flash" cx="240" cy="202" r="16" fill="#bff7ec" opacity="0" filter="url(#b1-bloom)" />
      </g>
    </svg>
  );
}
