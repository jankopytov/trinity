import { gsap } from "@/lib/gsap";

/**
 * Subtle, eased, rAF-throttled cursor-follow for a graphic. Desktop-only
 * (hover + fine pointer). Translates the whole <svg> toward the pointer so the
 * graphic feels alive without fighting the per-layer scroll parallax inside it
 * (which targets inner groups, not the svg root). Returns a cleanup fn.
 */
export function attachPointerParallax(svg: SVGSVGElement, mag = 9): () => void {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return () => {};
  }
  const setX = gsap.quickTo(svg, "x", { duration: 0.7, ease: "power3" });
  const setY = gsap.quickTo(svg, "y", { duration: 0.7, ease: "power3" });
  let tx = 0;
  let ty = 0;
  let raf = 0;
  let queued = false;

  const apply = () => {
    queued = false;
    setX(tx);
    setY(ty);
  };
  const onMove = (e: MouseEvent) => {
    const r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    tx = Math.max(-1, Math.min(1, nx)) * mag;
    ty = Math.max(-1, Math.min(1, ny)) * mag;
    if (!queued) {
      queued = true;
      raf = requestAnimationFrame(apply);
    }
  };
  window.addEventListener("mousemove", onMove, { passive: true });
  return () => {
    window.removeEventListener("mousemove", onMove);
    cancelAnimationFrame(raf);
    gsap.set(svg, { x: 0, y: 0 });
  };
}
