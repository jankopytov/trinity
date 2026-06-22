"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cannabisBeats, type CannabisBeat } from "@/components/story/cannabis";
import { useT } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

const pad = (n: number) => String(n).padStart(4, "0");
const framePath = (b: CannabisBeat, i: number) => `${b.frameDir}/${pad(i + 1)}.jpg`;
const repFrame = (b: CannabisBeat) => framePath(b, Math.floor(b.frameCount / 2));

// Lazy frame loader with a concurrency cap.
function makeLoader(beat: CannabisBeat, onFirst: () => void) {
  const imgs: HTMLImageElement[] = new Array(beat.frameCount);
  let started = false;
  let next = 0;
  let loaded = 0;
  const MAX = 8;
  const loadOne = () => {
    if (next >= beat.frameCount) return;
    const i = next++;
    const img = new Image();
    img.decoding = "async";
    img.onload = img.onerror = () => {
      loaded++;
      if (i === 0) onFirst();
      loadOne();
    };
    img.src = framePath(beat, i);
    imgs[i] = img;
  };
  return {
    imgs,
    start() {
      if (started) return;
      started = true;
      for (let k = 0; k < MAX; k++) loadOne();
    },
    isStarted: () => started,
  };
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement | undefined, cw: number, ch: number) {
  if (!img || !img.complete || !img.naturalWidth) return;
  const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const w = img.naturalWidth * s;
  const h = img.naturalHeight * s;
  ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
}
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export default function CannabisScroll() {
  const rootRef = useRef<HTMLDivElement>(null);
  const t = useT();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px) and (hover: hover)").matches;

    const sections = Array.from(root.querySelectorAll<HTMLElement>(".cs-beat"));
    const triggers: ScrollTrigger[] = [];
    const cleanups: (() => void)[] = [];

    const setText = (sec: HTMLElement, hp: number, sp: number) => {
      const h = sec.querySelector<HTMLElement>(".cs-headline");
      const s = sec.querySelector<HTMLElement>(".cs-sub");
      const e = sec.querySelector<HTMLElement>(".cs-eyebrow");
      const m = sec.querySelector<HTMLElement>(".cs-metric");
      if (e) gsap.set(e, { opacity: clamp01(hp * 1.4) });
      if (h) gsap.set(h, { opacity: hp, y: 28 * (1 - hp), filter: `blur(${8 * (1 - hp)}px)` });
      if (s) gsap.set(s, { opacity: sp, y: 18 * (1 - sp) });
      if (m) gsap.set(m, { opacity: sp, y: 18 * (1 - sp) });
    };

    const countUp = (sec: HTMLElement, beat: CannabisBeat, instant = false) => {
      const el = sec.querySelector<HTMLElement>(".cs-metric-num span");
      if (!el || !beat.metric) return;
      if (instant) {
        el.textContent = String(beat.metric.value);
        return;
      }
      const proxy = { v: 0 };
      gsap.to(proxy, {
        v: beat.metric.value,
        duration: 1.3,
        ease: "power2.out",
        onUpdate: () => (el.textContent = String(Math.round(proxy.v))),
      });
    };

    // ---------- REDUCED MOTION: first frame + static text ----------
    if (reduce) {
      sections.forEach((sec, i) => {
        const beat = cannabisBeats[i];
        setText(sec, 1, 1);
        countUp(sec, beat, true);
        const canvas = sec.querySelector<HTMLCanvasElement>(".cs-canvas");
        if (canvas && desktop) {
          const ctx = canvas.getContext("2d");
          const img = new Image();
          img.onload = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (ctx) drawCover(ctx, img, window.innerWidth, window.innerHeight);
          };
          img.src = framePath(beat, 0);
        }
      });
      return;
    }

    // ---------- MOBILE: photo-essay, text reveal on scroll ----------
    if (!desktop) {
      sections.forEach((sec) => {
        const els = sec.querySelectorAll(".cs-overlay > *");
        gsap.set(els, { opacity: 0, y: 22 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: sec, start: "top 70%", once: true },
        });
        tl.to(els, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.12 });
      });
      // count-ups on center
      sections.forEach((sec, i) => {
        const beat = cannabisBeats[i];
        if (!beat.metric) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: sec,
            start: "top 55%",
            once: true,
            onEnter: () => countUp(sec, beat),
          })
        );
      });
      return () => triggers.forEach((t) => t.kill());
    }

    // ---------- DESKTOP: pinned canvas scrub ----------
    const loaders = cannabisBeats.map((beat, i) => {
      const sec = sections[i];
      const canvas = sec.querySelector<HTMLCanvasElement>(".cs-canvas")!;
      const ctx = canvas.getContext("2d")!;
      let lastDrawn = -1;

      const sizeCanvas = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        lastDrawn = -1; // force redraw
      };

      const loader = makeLoader(beat, () => {
        // first frame ready → paint it so the beat is never blank
        if (lastDrawn < 0) drawCover(ctx, loader.imgs[0], window.innerWidth, window.innerHeight);
      });

      const draw = (frame: number) => {
        if (frame === lastDrawn) return;
        const img = loader.imgs[frame];
        if (img && img.complete && img.naturalWidth) {
          drawCover(ctx, img, window.innerWidth, window.innerHeight);
          lastDrawn = frame;
        }
      };

      // beat section is tall to give the pin scrub room
      sec.style.height = "220vh";
      sizeCanvas();
      const onResize = () => sizeCanvas();
      window.addEventListener("resize", onResize);
      cleanups.push(() => window.removeEventListener("resize", onResize));

      // lazy load: begin loading this beat when it (or the one before) approaches
      triggers.push(
        ScrollTrigger.create({
          trigger: sec,
          start: "top bottom+=80%",
          end: "bottom top",
          onEnter: () => loader.start(),
          onEnterBack: () => loader.start(),
        })
      );

      let fired = false;
      triggers.push(
        ScrollTrigger.create({
          trigger: sec,
          start: "top top",
          end: "bottom bottom",
          pin: sec.querySelector<HTMLElement>(".cs-pin"),
          pinSpacing: true,
          scrub: 0.5,
          onUpdate: (self) => {
            loader.start();
            const p = self.progress;
            const frame = Math.min(beat.frameCount - 1, Math.round(p * (beat.frameCount - 1)));
            draw(frame);
            setText(sec, clamp01((p - 0.04) / 0.26), clamp01((p - 0.2) / 0.26));
            if (!fired && p > 0.4) {
              fired = true;
              countUp(sec, beat);
            }
          },
        })
      );

      return loader;
    });

    // first beat loads immediately
    loaders[0]?.start();

    // ---------- progress rail / Schiene ----------
    const railFill = root.querySelector<HTMLElement>(".cs-rail-fill");
    const railPulse = root.querySelector<HTMLElement>(".cs-rail-pulse");
    const rail = root.querySelector<HTMLElement>(".cs-rail");
    if (rail) gsap.set(rail, { opacity: 0 });
    triggers.push(
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          gsap.set(railFill, { scaleY: self.progress });
          gsap.set(railPulse, { top: `${self.progress * 100}%`, opacity: 0.8 });
        },
        onToggle: (self) => gsap.to(rail, { opacity: self.isActive ? 1 : 0, duration: 0.4 }),
      })
    );

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((t) => t.kill());
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <>
    <div ref={rootRef} className="cs-root">
      {/* through-line: progress rail + Schiene (desktop) */}
      <div className="cs-rail" aria-hidden>
        <div className="cs-rail-fill" />
        <div className="cs-rail-pulse" />
      </div>

      {cannabisBeats.map((beat, i) => {
        const bt = t.cannabis.beats[i];
        return (
        <section key={beat.id} className="cs-beat" aria-label={bt.eyebrow}>
          <div className="cs-pin">
            <canvas className="cs-canvas" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cs-photo" src={repFrame(beat)} alt="" aria-hidden loading="lazy" />
            <div className="cs-scrim" />
            <div className="cs-overlay">
              <span className="cs-eyebrow">{bt.eyebrow}</span>
              <h2 className="cs-headline">{renderHeadline(bt.headline, bt.accentWord)}</h2>
              <p className="cs-sub">{bt.subtext}</p>
              {beat.metric && (
                <div className="cs-metric">
                  <span className="cs-metric-num">
                    <span>{beat.metric.value}</span>
                    {beat.metric.suffix}
                  </span>
                  <span className="cs-metric-label">{bt.metricLabel}</span>
                </div>
              )}
            </div>
          </div>
        </section>
        );
      })}
    </div>

    {/* End CTA — after beat 06, on the dark engine surface */}
    <section className="cs-end">
      <Reveal stagger={0.12}>
        <p className="cs-end-line">{t.cannabis.endLine}</p>
        <Link href="/kontakt?thema=cannabis" className="cs-end-cta">
          {t.cannabis.endCta}
        </Link>
      </Reveal>
    </section>
    </>
  );
}

// render the headline with one accent word in the teal→indigo gradient
function renderHeadline(headline: string, accentWord: string) {
  if (!accentWord || !headline.includes(accentWord)) return headline;
  const [before, after] = headline.split(accentWord);
  return (
    <>
      {before}
      <span className="cs-accent">{accentWord}</span>
      {after}
    </>
  );
}
