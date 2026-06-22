"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Very faint teal→indigo radial glows that drift slowly behind content on
 * light pages — ambient cinematic depth, never loud. Absolute, z:0,
 * pointer-events:none. Reduced-motion: static. Paused off-screen.
 */
export default function AmbientGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = ref.current;
    if (!root || reduce) return;
    const blobs = Array.from(root.querySelectorAll<HTMLElement>(".ag-blob"));
    const triggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
      tl.to(blobs[0], { x: 60, y: 40, duration: 22, ease: "sine.inOut" }, 0);
      tl.to(blobs[1], { x: -50, y: -30, duration: 26, ease: "sine.inOut" }, 0);
      triggers.push(
        ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
        })
      );
    }, ref);

    return () => {
      triggers.forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}
    >
      <div
        className="ag-blob"
        style={{
          position: "absolute",
          top: "12%",
          left: "8%",
          width: "46vw",
          height: "46vw",
          maxWidth: 620,
          maxHeight: 620,
          background: "radial-gradient(circle, rgba(21,194,171,0.10), transparent 65%)",
          willChange: "transform",
        }}
      />
      <div
        className="ag-blob"
        style={{
          position: "absolute",
          bottom: "10%",
          right: "6%",
          width: "44vw",
          height: "44vw",
          maxWidth: 600,
          maxHeight: 600,
          background: "radial-gradient(circle, rgba(58,46,190,0.09), transparent 65%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
