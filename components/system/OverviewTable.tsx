"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { systemNodes } from "@/components/system/systemData";
import Reveal from "@/components/Reveal";

export default function OverviewTable() {
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = tableRef.current;
    if (!el) return;
    const rows = el.querySelectorAll("tbody tr");
    if (reduce) {
      gsap.set(rows, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(rows, {
        opacity: 0,
        y: 18,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
    }, tableRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section-pad" style={{ padding: "7rem var(--gutter)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Reveal stagger={0.12} style={{ marginBottom: "3rem" }}>
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-mono), monospace",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontSize: "0.72rem",
              color: "var(--ink-2)",
            }}
          >
            ÜBERSICHT
          </span>
          <h2
            style={{
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontWeight: 250,
              fontSize: "clamp(26px, 3.6vw, 48px)",
              letterSpacing: "-0.015em",
              color: "var(--ink)",
              margin: "1rem 0 0",
            }}
          >
            Alle Leistungen auf einen Blick.
          </h2>
        </Reveal>

        <table ref={tableRef} className="sys-table">
          <thead>
            <tr>
              <th>Leistung</th>
              <th className="sys-col">Einzeln</th>
              <th className="sys-col">Im Paket</th>
            </tr>
          </thead>
          <tbody>
            {systemNodes.map((n) => (
              <tr key={n.key}>
                <td className="sys-leistung">{n.title}</td>
                <td className="sys-col" data-label="Einzeln">
                  {n.einzeln ? (
                    <span className="sys-check" aria-label="ja">✓</span>
                  ) : (
                    <span className="sys-dash" aria-label="nein">—</span>
                  )}
                </td>
                <td className="sys-col" data-label="Im Paket">
                  {n.paket ? (
                    <span className="sys-check" aria-label="ja">✓</span>
                  ) : (
                    <span className="sys-dash" aria-label="nein">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
