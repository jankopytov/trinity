"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useUIStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import LangToggle from "@/components/ui/LangToggle";

export default function MobileMenu() {
  const pathname = usePathname();
  const t = useT();
  const menuOpen = useUIStore((s) => s.menuOpen);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);

  const LINKS = [
    { href: "/cannabis", label: t.nav.cannabis },
    { href: "/beschaffung", label: t.nav.beschaffung },
    { href: "/kontakt", label: t.nav.kontakt },
  ];
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = () => setMenuOpen(false);

  // mount + animate open / close
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (menuOpen) {
      setMounted(true);
      return;
    }
    // closing: animate out then unmount (if currently mounted)
    if (!mounted) return;
    const root = rootRef.current;
    if (!root || reduce) {
      setMounted(false);
      return;
    }
    const items = root.querySelectorAll(".tp-menu-item");
    const tl = gsap.timeline({ onComplete: () => setMounted(false) });
    tl.to(items, { opacity: 0, y: 12, duration: 0.25, ease: "power2.in", stagger: 0.03 }, 0);
    tl.to(root, { opacity: 0, scale: 0.98, duration: 0.3, ease: "power2.in" }, 0.05);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  // animate in once mounted
  useEffect(() => {
    if (!mounted || !menuOpen) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (!root) return;
    const items = root.querySelectorAll(".tp-menu-item");
    if (reduce) {
      gsap.set(root, { opacity: 1, scale: 1 });
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(root, { opacity: 0, scale: 0.985 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });
      gsap.fromTo(items, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.05, delay: 0.1 });
    }, rootRef);
    return () => ctx.revert();
  }, [mounted, menuOpen]);

  // scroll lock + Esc, while open
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      className="tp-menu"
      role="dialog"
      aria-modal="true"
      // close when tapping the empty overlay (not a link/CTA)
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      {/* language toggle — top of the overlay, above the links */}
      <div className="tp-menu-item" style={{ marginBottom: "2rem" }}>
        <LangToggle size="lg" />
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className={`tp-menu-item tp-menu-link${active ? " tp-menu-link--active" : ""}`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/kontakt"
        onClick={close}
        className="tp-menu-item"
        style={{
          alignSelf: "flex-start",
          marginTop: "1.5rem",
          background: "var(--indigo)",
          color: "#FFFFFF",
          padding: "0.9rem 1.8rem",
          borderRadius: 999,
          fontSize: "0.95rem",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        {t.nav.cta}
      </Link>

      <div
        className="tp-menu-item"
        style={{
          marginTop: "1.5rem",
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.1em",
          color: "var(--engine-ink-2)",
          display: "flex",
          gap: "0.8rem",
        }}
      >
        <Link href="/impressum" onClick={close} style={{ color: "inherit", textDecoration: "none" }}>
          {t.footer.impressum}
        </Link>
        <span aria-hidden>·</span>
        <Link href="/datenschutz" onClick={close} style={{ color: "inherit", textDecoration: "none" }}>
          {t.footer.datenschutz}
        </Link>
      </div>
    </div>
  );
}
