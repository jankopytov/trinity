"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { systemNodes } from "@/components/system/systemData";
import { useT } from "@/lib/i18n";

// ---- orbital geometry (0..100 viewBox units, centre 50,50) ----------------
const NODE_N = systemNodes.length; // 8
const RADII = [33, 27]; // outer ring (even idx), inner ring (odd idx)
const ringOf = (i: number) => (i % 2 === 0 ? 0 : 1);
const BASE = (i: number) => ((-90 + i * (360 / NODE_N)) * Math.PI) / 180; // clockwise from 12:00
const SPOKE_LEN = 11.5; // every spoke is the SAME length → uniform, pointing at the core
const RING_GUIDES = [13, 20, 27, 33]; // faint layered concentric rings
// very slow, barely-perceptible drift; rings counter-rotate at different speeds
const OMEGA = [(2 * Math.PI) / 120, -(2 * Math.PI) / 95]; // rad/s [outer, inner]
const INTRO_DUR = 1.8; // seconds
const LABEL_D = 42; // px the label floats outward from its node

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function arcPath(ringR: number, ang: number): string {
  const d = 0.32;
  const x0 = 50 + ringR * Math.cos(ang - d);
  const y0 = 50 + ringR * Math.sin(ang - d);
  const x1 = 50 + ringR * Math.cos(ang + d);
  const y1 = 50 + ringR * Math.sin(ang + d);
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${ringR} ${ringR} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

export default function SystemMap() {
  const ref = useRef<HTMLDivElement>(null);
  const sizeRef = useRef(560); // square container px (cached, updated by ResizeObserver)
  const hoverRef = useRef<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const t = useT();

  // element ref arrays (callback refs)
  const nodeEls = useRef<(HTMLButtonElement | null)[]>([]);
  const labelEls = useRef<(HTMLElement | null)[]>([]);
  const dotEls = useRef<(HTMLElement | null)[]>([]);
  const spokeEls = useRef<(SVGLineElement | null)[]>([]);
  const pulseEls = useRef<(SVGCircleElement | null)[]>([]);
  const ringsGroup = useRef<SVGGElement | null>(null);
  const hoverArc = useRef<SVGPathElement | null>(null);
  const penroseInner = useRef<HTMLDivElement | null>(null);

  // ---------- the orbital engine ----------
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const container = root.querySelector<HTMLElement>(".sys-orbit");
    if (!container) return;

    const measure = () => {
      const w = container.clientWidth;
      if (w > 0) sizeRef.current = w;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);

    // one frame of layout. introT 0..1 drives the entrance; ti = idle time (s).
    const frame = (introT: number, ti: number) => {
      const W = sizeRef.current;
      const e = easeOut(introT);
      const nodeAppear = clamp01((e - 0.5) / 0.5);
      const spokeGrow = clamp01((e - 0.4) / 0.6);
      const breathe = reduce ? 0 : 1;

      // core
      if (penroseInner.current) {
        const s = lerp(0.9, 1, e) * (1 + 0.035 * Math.sin(ti * 0.85) * breathe * e);
        penroseInner.current.style.transform = `scale(${s.toFixed(4)})`;
        penroseInner.current.style.opacity = String(lerp(0.4, 1, e));
      }
      // guide rings expand from centre + faint breathe
      if (ringsGroup.current) {
        const rs = e * (1 + 0.012 * Math.sin(ti * 0.5) * breathe);
        ringsGroup.current.setAttribute("transform", `translate(50 50) scale(${rs.toFixed(4)}) translate(-50 -50)`);
        ringsGroup.current.style.opacity = String(e);
      }

      for (let i = 0; i < NODE_N; i++) {
        const ring = ringOf(i);
        const R = RADII[ring] * e;
        const ang = BASE(i) + OMEGA[ring] * ti * breathe;
        const ca = Math.cos(ang);
        const sa = Math.sin(ang);
        const nx = 50 + R * ca;
        const ny = 50 + R * sa;
        const sl = SPOKE_LEN * spokeGrow;
        const ex = 50 + (R - sl) * ca;
        const ey = 50 + (R - sl) * sa;
        const isHover = hoverRef.current === i;

        // spoke (uniform; redrawn every frame so it always follows its node)
        const sp = spokeEls.current[i];
        if (sp) {
          sp.setAttribute("x1", nx.toFixed(2));
          sp.setAttribute("y1", ny.toFixed(2));
          sp.setAttribute("x2", ex.toFixed(2));
          sp.setAttribute("y2", ey.toFixed(2));
          sp.setAttribute("stroke-width", String(isHover ? 1.6 : 0.95));
          sp.setAttribute("opacity", String(spokeGrow * (isHover ? 1 : 0.6)));
        }
        // data packet travelling inner→node, then fading
        const pu = pulseEls.current[i];
        if (pu) {
          if (reduce || e < 0.6) {
            pu.setAttribute("opacity", "0");
          } else {
            const pf = (ti * 0.4 + i * 0.13) % 1;
            pu.setAttribute("cx", lerp(ex, nx, pf).toFixed(2));
            pu.setAttribute("cy", lerp(ey, ny, pf).toFixed(2));
            pu.setAttribute("opacity", (Math.sin(pf * Math.PI) * 0.9 * (isHover ? 1.5 : 1)).toFixed(2));
          }
        }
        // DOM node — positioned by transform only (no rotation → label upright)
        const nb = nodeEls.current[i];
        if (nb) {
          nb.style.transform = `translate(-50%,-50%) translate(${(((nx - 50) / 100) * W).toFixed(1)}px, ${(((ny - 50) / 100) * W).toFixed(1)}px)`;
          nb.style.opacity = String(nodeAppear);
        }
        // label floats outward from the node, upright
        const lb = labelEls.current[i];
        if (lb) {
          lb.style.transform = `translate(-50%,-50%) translate(${(ca * LABEL_D).toFixed(1)}px, ${(sa * LABEL_D).toFixed(1)}px)`;
        }
        // node dot soft breathe + ignite scale
        const dt = dotEls.current[i];
        if (dt) {
          const ds = lerp(0.4, 1, nodeAppear) * (1 + 0.08 * Math.sin(ti * 1.05 + i * 0.8) * breathe);
          dt.style.transform = `scale(${ds.toFixed(4)})`;
        }
      }
      // hover ring-arc highlight
      if (hoverArc.current) {
        const h = hoverRef.current;
        if (h != null && e > 0.99) {
          const ang = BASE(h) + OMEGA[ringOf(h)] * ti * breathe;
          hoverArc.current.setAttribute("d", arcPath(RADII[ringOf(h)], ang));
          hoverArc.current.style.opacity = "0.95";
        } else {
          hoverArc.current.style.opacity = "0";
        }
      }
    };

    // ---- reduced motion: one settled static frame, no loop ----
    if (reduce) {
      frame(1, 0);
      const onR = () => { measure(); frame(1, 0); };
      window.addEventListener("resize", onR);
      return () => { window.removeEventListener("resize", onR); ro.disconnect(); };
    }

    // arm hidden, then animate in on scroll-in; idle drift afterwards
    frame(0, 0);
    let raf = 0;
    let running = false;
    let onScreen = false;
    let visible = !document.hidden;
    let introStart = 0;
    let started = false;

    const tick = (nowMs: number) => {
      const now = nowMs / 1000;
      if (!introStart) introStart = now;
      const introT = clamp01((now - introStart) / INTRO_DUR);
      const ti = Math.max(0, now - introStart);
      frame(introT, ti);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || !onScreen || !visible) return;
      // only run when actually laid out (desktop map visible)
      if (container.clientWidth === 0) return;
      running = true;
      if (!started) { started = true; introStart = 0; }
      raf = requestAnimationFrame(tick);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const io = new IntersectionObserver(
      (ents) => { onScreen = ents[0]?.isIntersecting ?? false; if (onScreen) start(); else stop(); },
      { threshold: 0 }
    );
    io.observe(container);
    const onVis = () => { visible = !document.hidden; if (visible) start(); else stop(); };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Penrose recedes behind the open modal ----------
  useEffect(() => {
    const inner = penroseInner.current;
    if (!inner) return;
    inner.style.transition = "opacity 0.4s var(--ease)";
    inner.style.opacity = openKey ? "0.28" : "1";
    return () => { if (inner) inner.style.transition = ""; };
  }, [openKey]);

  // ---------- Esc closes the modal ----------
  useEffect(() => {
    if (!openKey) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenKey(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openKey]);

  const setHov = (i: number | null) => { hoverRef.current = i; setHover(i); };
  const openNode = openKey ? systemNodes.find((n) => n.key === openKey) ?? null : null;

  return (
    <div ref={ref}>
      {/* ---------- DESKTOP: interactive orbital map ---------- */}
      <div className="sys-desktop">
        <div className="sys-orbit" style={{ position: "relative", width: "min(560px, 76vw)", aspectRatio: "1 / 1", margin: "0 auto" }}>
          <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} aria-hidden>
            <defs>
              <linearGradient id="sys-line" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--teal)" />
                <stop offset="100%" stopColor="var(--indigo)" />
              </linearGradient>
            </defs>
            {/* concentric orbital guide rings */}
            <g ref={ringsGroup}>
              {RING_GUIDES.map((r, i) => (
                <circle key={`r${i}`} cx="50" cy="50" r={r} fill="none" stroke="var(--teal)" strokeWidth={i >= 2 ? 0.4 : 0.3} opacity={0.18 - i * 0.03} />
              ))}
            </g>
            <path ref={hoverArc} d="" fill="none" stroke="url(#sys-line)" strokeWidth="0.9" strokeLinecap="round" style={{ opacity: 0, transition: "opacity 0.35s var(--ease)" }} />
            {/* uniform spokes (one per node, redrawn each frame) */}
            {systemNodes.map((_, i) => (
              <line key={`s${i}`} ref={(el) => { spokeEls.current[i] = el; }} className="sys-spoke" x1="50" y1="50" x2="50" y2="50" stroke="url(#sys-line)" strokeWidth="0.95" opacity="0" />
            ))}
            {/* data packets */}
            {systemNodes.map((_, i) => (
              <circle key={`p${i}`} ref={(el) => { pulseEls.current[i] = el; }} className="sys-pulse" cx="50" cy="50" r="0.95" fill="var(--teal)" opacity="0" />
            ))}
          </svg>

          {/* Penrose core (above spokes) */}
          <div className="sys-penrose" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 2 }}>
            <div className="sys-penrose-inner" ref={penroseInner} style={{ opacity: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-mark.svg" alt="Trinity Pharma" style={{ width: 86, height: "auto", display: "block" }} />
            </div>
          </div>

          {/* nodes + labels (positioned by the engine; labels stay upright) */}
          {systemNodes.map((n, i) => {
            const nt = t.nodes[n.key];
            return (
              <button
                key={n.key}
                type="button"
                className="sys-node"
                ref={(el) => { nodeEls.current[i] = el; }}
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
                onFocus={() => setHov(i)}
                onBlur={() => setHov(null)}
                onClick={() => setOpenKey(n.key)}
                aria-label={`${nt.title} ${t.system.detailsSuffix}`}
                style={{ position: "absolute", left: "50%", top: "50%", zIndex: 3, background: "none", border: "none", padding: 0, cursor: "pointer", opacity: 0, willChange: "transform, opacity" }}
              >
                <span
                  className="sys-dot"
                  ref={(el) => { dotEls.current[i] = el; }}
                  style={{
                    display: "grid", placeItems: "center",
                    width: n.flagship ? 26 : 16, height: n.flagship ? 26 : 16, borderRadius: "50%",
                    border: "1px solid",
                    borderColor: hover === i ? "var(--teal)" : n.flagship ? "rgba(21,194,171,0.7)" : "var(--ink-3)",
                    background: n.flagship ? "var(--accent)" : "var(--paper-raise)",
                    boxShadow: hover === i ? "0 0 20px 4px rgba(21,194,171,0.6)" : "0 0 0 rgba(0,0,0,0)",
                    transition: "box-shadow 0.4s var(--ease), border-color 0.4s var(--ease)",
                    willChange: "transform",
                  }}
                >
                  {n.flagship ? (
                    <span style={{ color: "#fff", fontSize: 11, lineHeight: 1 }}>→</span>
                  ) : (
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--teal)" }} />
                  )}
                </span>
                <span
                  ref={(el) => { labelEls.current[i] = el; }}
                  style={{ position: "absolute", left: "50%", top: "50%", width: 150, textAlign: "center", lineHeight: 1.22, pointerEvents: "none", willChange: "transform" }}
                >
                  <span style={{ display: "block", fontFamily: "var(--font-mono), monospace", fontSize: "0.68rem", letterSpacing: "0.04em", color: hover === i ? "var(--ink)" : "var(--ink-2)", transition: "color 0.3s var(--ease)" }}>
                    {nt.short}
                  </span>
                  {nt.metric && (
                    <span style={{ display: "block", fontFamily: "var(--font-mono), monospace", fontSize: "0.56rem", letterSpacing: "0.05em", color: "var(--ink-3)", marginTop: 1 }}>
                      {nt.metric}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------- MOBILE / touch: stacked list ---------- */}
      <div className="sys-mobile">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-mark.svg" alt="Trinity Pharma" style={{ width: 100, height: "auto" }} />
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, borderTop: "1px solid var(--ink-3)" }}>
          {systemNodes.map((n) => {
            const nt = t.nodes[n.key];
            return (
              <li key={n.key} style={{ borderBottom: "1px solid var(--ink-3)" }}>
                <button
                  type="button"
                  onClick={() => setOpenKey(n.key)}
                  style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "1.1rem 0.25rem", color: "var(--ink)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}
                >
                  <span>
                    {n.flagship && (
                      <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.6rem", letterSpacing: "0.12em", color: "var(--teal)", display: "block" }}>
                        {t.system.flagship}
                      </span>
                    )}
                    <span style={{ fontWeight: 400 }}>{nt.short}</span>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                    {nt.metric && (
                      <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.6rem", letterSpacing: "0.06em", color: "var(--ink-3)", textAlign: "right" }}>
                        {nt.metric}
                      </span>
                    )}
                    <span style={{ color: "var(--ink-3)" }} aria-hidden>+</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ---------- CENTER MODAL (unchanged funnel) ---------- */}
      {openNode && (
        <div className="sys-card-backdrop" onClick={() => setOpenKey(null)} role="presentation">
          <div className="sys-card glass-panel--light" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={t.nodes[openNode.key].title}>
            <button type="button" onClick={() => setOpenKey(null)} aria-label={t.system.close} className="sys-card-close">✕</button>
            <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.66rem", letterSpacing: "0.14em", color: openNode.flagship ? "var(--teal)" : "var(--ink-3)" }}>
              {t.nodes[openNode.key].tag}
            </span>
            <h3 style={{ margin: "0.6rem 0 0.9rem", fontWeight: 300, fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "var(--ink)" }}>
              {t.nodes[openNode.key].title}
            </h3>
            <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.65, color: "var(--ink-2)" }}>{t.nodes[openNode.key].body}</p>
            <Link
              href={`/kontakt?thema=${openNode.key}`}
              onClick={() => setOpenKey(null)}
              style={{ display: "inline-block", marginTop: "1.75rem", background: "var(--indigo)", color: "#fff", padding: "0.8rem 1.5rem", borderRadius: 999, fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}
            >
              {t.nodes[openNode.key].cta}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
