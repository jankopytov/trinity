"use client";

import { useEffect, useRef } from "react";

// "eine Schiene" — one continuous teal→indigo hairline threading the whole page,
// with faint light pulses that travel down it, scroll-coupled. One rAF, 3 dots.
const PULSES = [0, 0.34, 0.67];

export default function Schiene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const root = ref.current;
    if (!root) return;
    const dots = Array.from(root.querySelectorAll<HTMLElement>(".schiene-pulse"));

    if (reduce) {
      dots.forEach((d, i) => {
        d.style.top = `${PULSES[i] * 100}%`;
        d.style.opacity = "0.4";
      });
      return;
    }

    let raf = 0;
    let visible = !document.hidden;
    let idle = 0;
    let last = performance.now();

    const tick = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;
      idle += dt * 0.00002; // very slow autonomous drift
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const sp = Math.min(1, Math.max(0, window.scrollY / max));
      const flow = idle + sp; // scroll-coupled
      dots.forEach((d, i) => {
        const p = (((flow + PULSES[i]) % 1) + 1) % 1;
        d.style.top = `${p * 100}%`;
        const edge = Math.min(p, 1 - p); // fade near the ends
        d.style.opacity = String(0.12 + 0.6 * Math.min(1, edge * 6));
      });
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf && visible) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVis = () => {
      visible = !document.hidden;
      visible ? start() : stop();
    };
    document.addEventListener("visibilitychange", onVis);
    start();
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 6,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/* the rail */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(21,194,171,0.16) 6%, rgba(58,46,190,0.16) 94%, transparent 100%)",
        }}
      />
      {PULSES.map((_, i) => (
        <div
          key={i}
          className="schiene-pulse"
          style={{
            position: "absolute",
            left: "50%",
            top: "0%",
            transform: "translate(-50%, -50%)",
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "var(--teal)",
            boxShadow: "0 0 10px 2px rgba(21,194,171,0.7)",
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
