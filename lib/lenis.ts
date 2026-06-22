"use client";

import Lenis from "lenis";

/**
 * Create a Lenis smooth-scroll instance with the Trinity easing feel.
 * Caller owns the rAF loop and cleanup (see components/SmoothScroll.tsx).
 */
export function createLenis() {
  return new Lenis({
    duration: 1.1,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
  });
}

export type { Lenis };
