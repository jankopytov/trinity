"use client";

import { useEffect, useRef } from "react";
import { createLenis, type Lenis } from "@/lib/lenis";
import { useUIStore } from "@/lib/store";

/**
 * Lenis smooth scroll on DESKTOP ONLY (pointer + min-width 768px).
 * Touch/mobile keeps native scrolling for performance and correctness.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const menuOpen = useUIStore((s) => s.menuOpen);

  useEffect(() => {
    const mq = window.matchMedia("(min-width:768px) and (hover:hover)");
    if (!mq.matches) return;

    const lenis = createLenis();
    lenisRef.current = lenis;
    let rafId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Lock smooth scroll while the mobile menu is open (body overflow is handled in MobileMenu).
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (menuOpen) lenis.stop();
    else lenis.start();
  }, [menuOpen]);

  return <>{children}</>;
}
