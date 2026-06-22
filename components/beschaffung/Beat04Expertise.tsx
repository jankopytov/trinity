"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { attachPointerParallax } from "@/components/beschaffung/pointerParallax";
import { useT } from "@/lib/i18n";

const CENTER = { x: 240, y: 184 };
// ordered near → far (national → international). extra → dropped on mobile.
const NODES = [
  { x: 240, y: 92, d: 3, extra: false },
  { x: 356, y: 150, d: 3, extra: false },
  { x: 126, y: 152, d: 2, extra: false },
  { x: 318, y: 268, d: 2, extra: false },
  { x: 156, y: 262, d: 2, extra: true },
  { x: 70, y: 206, d: 1, extra: true },
  { x: 420, y: 214, d: 1, extra: true },
  { x: 300, y: 70, d: 1, extra: true },
  { x: 180, y: 96, d: 1, extra: true },
];
const DEPTH: Record<number, { r: number; op: number; blur: number }> = {
  1: { r: 4, op: 0.5, blur: 1 },
  2: { r: 6, op: 0.85, blur: 0 },
  3: { r: 8, op: 1, blur: 0 },
};

export default function Beat04Expertise() {
  const ref = useRef<SVGSVGElement>(null);
  const t = useT();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const svg = ref.current;
    if (!svg) return;

    if (mobile) {
      svg.querySelectorAll<SVGElement>(".b4-extra").forEach((el) => (el.style.display = "none"));
    }
    const vis = (sel: string) =>
      Array.from(svg.querySelectorAll<SVGElement>(sel)).filter((el) => el.style.display !== "none");

    const net = svg.querySelector(".b4-net");
    const center = svg.querySelector(".b4-center");
    const lines = vis(".b4-line");
    const dots = vis(".b4-dot");
    const nodes = vis(".b4-node");
    const rings = vis(".b4-ring");
    const flows = vis(".b4-flow");
    const motes = vis(".b4-mote");
    const map = svg.querySelector(".b4-map");

    if (reduce) {
      gsap.set(net, { scale: 1 });
      gsap.set(center, { scale: 1, opacity: 1, transformOrigin: "50% 50%" });
      gsap.set(lines, { strokeDashoffset: 0, opacity: 0.55 });
      gsap.set(nodes, { scale: 1, opacity: 1 });
      gsap.set([dots, rings, flows], { opacity: 0 });
      gsap.set(motes, { opacity: 0.2 });
      gsap.set(map, { opacity: 0.06 });
      return;
    }

    const detachParallax = attachPointerParallax(svg);
    const triggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      lines.forEach((ln) => {
        const len = (ln as SVGGeometryElement).getTotalLength();
        gsap.set(ln, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.55 });
      });
      gsap.set(net, { scale: 0.78, transformOrigin: "50% 50%", svgOrigin: "240 184" });
      gsap.set(center, { scale: 0, opacity: 0, transformOrigin: "50% 50%" });
      gsap.set(nodes, { scale: 0, opacity: 0, transformOrigin: "50% 50%" });
      gsap.set(rings, { scale: 0.3, opacity: 0, transformOrigin: "50% 50%" });
      gsap.set([dots, flows], { opacity: 0 });
      gsap.set(motes, { opacity: 0.16 });
      gsap.set(map, { opacity: 0 });

      // idle loops (started after intro)
      const breathe = gsap.to(net, { scale: 1.012, duration: 4, ease: "sine.inOut", repeat: -1, yoyo: true, svgOrigin: "240 184", paused: true });
      const nodePulse = gsap.to(nodes, { scale: 1.12, duration: 2.6, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: { each: 0.25, from: "random" }, transformOrigin: "50% 50%", paused: true });
      const moteLoop = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
      motes.forEach((m, i) => moteLoop.to(m, { x: i % 2 ? 14 : -12, y: i % 2 ? -10 : 12, opacity: 0.32, duration: 6 + i, ease: "sine.inOut" }, 0));
      // data pulses flow back and forth on finished lines
      const flowLoop = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
      flows.forEach((f, i) => {
        const node = nodes[i];
        if (!node) return;
        const nx = +node.getAttribute("cx")!;
        const ny = +node.getAttribute("cy")!;
        flowLoop.fromTo(
          f,
          { attr: { cx: CENTER.x, cy: CENTER.y }, opacity: 0.7 },
          { attr: { cx: nx, cy: ny }, duration: 2.4 + (i % 3) * 0.6, ease: "sine.inOut" },
          0
        );
      });
      const idle = () => { breathe.play(); nodePulse.play(); moteLoop.play(); flowLoop.play(); };
      const idlePause = () => { breathe.pause(); nodePulse.pause(); moteLoop.pause(); flowLoop.pause(); };

      // ---- intro: ONE node → grow out near→far ----
      const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 72%", once: true }, onComplete: idle });
      tl.to(net, { scale: 1, duration: 1.4, ease: "power2.out" }, 0);
      tl.to(map, { opacity: 0.06, duration: 1.6, ease: "sine.out" }, 0);
      // 1 ONE NODE — the origin glows
      tl.to(center, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" }, 0.2);
      // 2/3 grow out, near → far
      lines.forEach((ln, i) => {
        const node = nodes[i];
        const ring = rings[i];
        const dot = dots[i];
        const nx = node ? +node.getAttribute("cx")! : CENTER.x;
        const ny = node ? +node.getAttribute("cy")! : CENTER.y;
        const at = 0.9 + i * 0.16;
        tl.to(ln, { strokeDashoffset: 0, duration: 0.6, ease: "power1.inOut" }, at);
        tl.fromTo(dot, { attr: { cx: CENTER.x, cy: CENTER.y }, opacity: 1 }, { attr: { cx: nx, cy: ny }, duration: 0.6, ease: "power1.inOut" }, at);
        tl.to(dot, { opacity: 0, duration: 0.2 }, at + 0.5);
        tl.to(node, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2)" }, at + 0.45);
        tl.fromTo(ring, { scale: 0.3, opacity: 0.5 }, { scale: 2, opacity: 0, duration: 0.8, ease: "sine.out" }, at + 0.45);
      });

      triggers.push(
        ScrollTrigger.create({
          trigger: svg,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => gsap.set(net, { y: 10 * (self.progress - 0.5) }),
        })
      );
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
    <svg ref={ref} viewBox="0 0 480 360" role="img" aria-label={t.beschaffung.beats[3].title}>
      <defs>
        <linearGradient id="b4-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--teal)" />
          <stop offset="100%" stopColor="var(--indigo)" />
        </linearGradient>
        <radialGradient id="b4-node" cx="42%" cy="40%" r="68%">
          <stop offset="0%" stopColor="#5fe0cd" />
          <stop offset="55%" stopColor="var(--teal)" />
          <stop offset="100%" stopColor="var(--indigo)" />
        </radialGradient>
        <filter id="b4-bloom" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* KING MOVE — very faint abstract map silhouette (Germany central, Europe hinted). Desktop only. */}
      <g className="b4-map b4-extra" opacity="0" stroke="var(--teal)" strokeWidth="1" fill="none">
        <path d="M210 120 Q236 104 262 124 Q286 140 278 176 Q286 214 256 244 Q232 262 214 240 Q196 214 204 180 Q198 146 210 120 Z" />
        <path d="M120 150 Q150 120 196 130" opacity="0.6" />
        <path d="M300 130 Q344 142 372 174" opacity="0.6" />
        <path d="M150 250 Q210 286 280 262" opacity="0.5" />
        <path d="M360 220 Q392 238 404 210" opacity="0.4" />
      </g>

      <g className="b4-net">
        {NODES.map((n, i) => (
          <line key={`ln${i}`} className={`b4-line${n.extra ? " b4-extra" : ""}`} x1={CENTER.x} y1={CENTER.y} x2={n.x} y2={n.y} stroke="url(#b4-grad)" strokeWidth="1.2" />
        ))}
        {NODES.map((n, i) => (
          <circle key={`rg${i}`} className={`b4-ring${n.extra ? " b4-extra" : ""}`} cx={n.x} cy={n.y} r={DEPTH[n.d].r + 3} fill="none" stroke="var(--teal)" strokeWidth="1.2" opacity="0" />
        ))}
        {NODES.map((n, i) => (
          <circle
            key={`nd${i}`}
            className={`b4-node${n.extra ? " b4-extra" : ""}`}
            cx={n.x}
            cy={n.y}
            r={DEPTH[n.d].r}
            fill="url(#b4-node)"
            opacity={DEPTH[n.d].op}
            filter={n.d === 3 ? "url(#b4-bloom)" : undefined}
            style={DEPTH[n.d].blur ? { filter: `blur(${DEPTH[n.d].blur}px)` } : undefined}
          />
        ))}
        {NODES.map((n, i) => (
          <circle key={`dt${i}`} className={`b4-dot${n.extra ? " b4-extra" : ""}`} cx={CENTER.x} cy={CENTER.y} r="2.5" fill="#bff7ec" opacity="0" filter="url(#b4-bloom)" />
        ))}
        {NODES.map((n, i) => (
          <circle key={`fl${i}`} className={`b4-flow${n.extra ? " b4-extra" : ""}`} cx={CENTER.x} cy={CENTER.y} r="1.6" fill="var(--teal)" opacity="0" />
        ))}
        <circle className="b4-center" cx={CENTER.x} cy={CENTER.y} r="10" fill="url(#b4-node)" filter="url(#b4-bloom)" />
      </g>

      {[
        [96, 110],
        [400, 130],
        [150, 300],
        [360, 280],
        [70, 230],
      ].map(([x, y], i) => (
        <circle key={`mote${i}`} className={`b4-mote${i >= 3 ? " b4-extra" : ""}`} cx={x} cy={y} r="1.6" fill="var(--teal)" opacity="0.16" style={{ filter: "blur(0.5px)" }} />
      ))}
    </svg>
  );
}
