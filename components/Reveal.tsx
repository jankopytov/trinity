"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";
import { gsap } from "@/lib/gsap";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  /** Stagger direct children instead of revealing the wrapper as one unit. */
  stagger?: number;
  y?: number;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Calm, consistent scroll reveal: fade + translateY + slight blur-in, once.
 * Reduced-motion: everything visible, no animation.
 */
export default function Reveal({
  children,
  as,
  stagger,
  y = 24,
  delay = 0,
  className,
  style,
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const targets =
      stagger != null ? Array.from(el.children) : [el];
    if (!targets.length) return;

    if (reduce) {
      gsap.set(targets, { opacity: 1, y: 0, filter: "none" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y,
        filter: "blur(8px)",
        duration: 0.8,
        delay,
        ease: "power3.out",
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
    }, ref);

    return () => ctx.revert();
  }, [stagger, y, delay]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
