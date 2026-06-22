"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import LangToggle from "@/components/ui/LangToggle";
import MobileMenu from "@/components/MobileMenu";

export default function Nav() {
  const pathname = usePathname();
  const t = useT();
  const preloaderDone = useUIStore((s) => s.preloaderDone);
  const menuOpen = useUIStore((s) => s.menuOpen);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  const LINKS = [
    { href: "/cannabis", label: t.nav.cannabis },
    { href: "/beschaffung", label: t.nav.beschaffung },
    { href: "/kontakt", label: t.nav.kontakt },
  ];

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Transparent only over the hero on Home before scroll; solid everywhere else.
  const transparent = isHome && !scrolled;
  const logoLight = menuOpen; // wordmark must read on the dark menu overlay

  return (
    <>
      <header
        className={`tp-nav${transparent && !menuOpen ? "" : " tp-nav--solid"}${menuOpen ? " tp-nav--menuopen" : ""}`}
        style={{
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.95rem var(--gutter)",
          color: "var(--ink)",
          opacity: preloaderDone ? 1 : 0,
          pointerEvents: preloaderDone ? "auto" : "none",
        }}
      >
        <Link
          href="/"
          onClick={() => menuOpen && setMenuOpen(false)}
          style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", color: "inherit" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="tp-logo-full"
            src={logoLight ? "/brand/logo-light.svg" : "/brand/logo.svg"}
            alt="Trinity Pharma"
            style={{
              height: transparent && !menuOpen ? 52 : 48,
              width: "auto",
              display: "block",
              transition: "height 0.4s var(--ease)",
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="tp-logo-mark"
            src="/brand/logo-mark.svg"
            alt="Trinity Pharma"
            style={{ height: 40, width: "auto" }}
          />
        </Link>

        {/* desktop inline nav (hidden ≤1040px) */}
        <nav className="tp-nav-inline">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="tp-navlink"
              style={{
                fontFamily: "var(--font-mono), monospace",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontSize: "0.72rem",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {link.label}
            </Link>
          ))}
          <LangToggle />
          <Link
            href="/kontakt"
            style={{
              background: "var(--indigo)",
              color: "var(--engine-ink)",
              padding: "0.6rem 1.1rem",
              borderRadius: 999,
              fontSize: "0.74rem",
              fontWeight: 600,
              letterSpacing: "0.02em",
              textDecoration: "none",
            }}
          >
            {t.nav.cta}
          </Link>
        </nav>

        {/* mobile burger (shown ≤1040px) — morphs to X */}
        <button
          type="button"
          className={`tp-burger${menuOpen ? " is-open" : ""}`}
          aria-label={menuOpen ? t.nav.menuClose : t.nav.menuOpen}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="tp-burger-line" />
          <span className="tp-burger-line" />
          <span className="tp-burger-line" />
        </button>
      </header>

      <MobileMenu />
    </>
  );
}
