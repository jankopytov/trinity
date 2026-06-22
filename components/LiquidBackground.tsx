"use client";

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ *
 * Tunables — dial these for feel.
 * ------------------------------------------------------------------ */
const FLOW_SPEED = 0.07; // time evolution of the noise field (slow = ambient)
const INFLUENCE_RADIUS = 0.3; // soft radius of cursor effect (aspect-corrected, ~0..1)
const INFLUENCE_STRENGTH = 0.7; // how much the cursor brightens the field
const WARP_AMOUNT = 0.35; // extra domain-warp displacement near the cursor
// Peak tint alpha — variant-driven (uniform). Light reads over --paper, dark over --engine.
const OPACITY_LIGHT = 0.35;
const OPACITY_DARK = 0.16;

/* Smoothing / decay (frame-rate-ish lerp factors). */
const POINTER_LERP = 0.08; // pointer trails toward target
const INFLUENCE_LERP = 0.05; // influence eases toward target / decays on idle
const IDLE_MS = 140; // pointer considered "stopped" after this gap
const MAX_DPR = 1.5; // cap render resolution for a background

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  u_resolution;
uniform float u_time;
uniform vec2  u_pointer;     // 0..1, GL space (y up)
uniform float u_influence;   // 0..1, decays when idle
uniform float u_opacity;     // peak tint alpha (variant-driven)

const float FLOW_SPEED        = ${FLOW_SPEED.toFixed(4)};
const float INFLUENCE_RADIUS  = ${INFLUENCE_RADIUS.toFixed(4)};
const float INFLUENCE_STRENGTH= ${INFLUENCE_STRENGTH.toFixed(4)};
const float WARP_AMOUNT       = ${WARP_AMOUNT.toFixed(4)};

const vec3 TEAL   = vec3(0.0824, 0.7608, 0.6706); // #15C2AB
const vec3 INDIGO = vec3(0.2275, 0.1804, 0.7451); // #3A2EBE

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    v += amp * noise(p);
    p *= 2.0;
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);

  // Aspect-corrected distance to the (trailing) pointer.
  vec2 ac = vec2(uv.x * aspect, uv.y);
  vec2 pc = vec2(u_pointer.x * aspect, u_pointer.y);
  float d = distance(ac, pc);
  float infl = smoothstep(INFLUENCE_RADIUS, 0.0, d) * u_influence;

  float t = u_time * FLOW_SPEED;
  vec2 p = uv * 3.0;

  // Domain-warped flow noise.
  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0) + t),
    fbm(p + vec2(5.2, 1.3) - t)
  );
  vec2 warp = q * (0.5 + WARP_AMOUNT * infl);
  vec2 r = vec2(
    fbm(p + 1.6 * warp + vec2(1.7, 9.2) + 0.5 * t),
    fbm(p + 1.6 * warp + vec2(8.3, 2.8) - 0.5 * t)
  );
  float n = clamp(fbm(p + 1.2 * r), 0.0, 1.0);

  vec3 tint = mix(TEAL, INDIGO, smoothstep(0.25, 0.85, n));
  // Gentle brighten toward the cursor.
  tint = mix(tint, tint + 0.18, infl * INFLUENCE_STRENGTH);

  float alpha = u_opacity * (0.55 + 0.45 * n);
  alpha += u_opacity * INFLUENCE_STRENGTH * infl;

  gl_FragColor = vec4(tint, clamp(alpha, 0.0, 1.0));
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error("Shader compile error: " + log);
  }
  return sh;
}

export default function LiquidBackground({
  variant = "light",
}: {
  // "light" reads over --paper (Home/Kontakt); "dark" over --engine (Beschaffung).
  variant?: "light" | "dark";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const canHover = window.matchMedia("(hover: hover)").matches;
    // touch / small screens: independent drift, throttled + DPR-capped + fainter
    const mobile = !canHover || window.matchMedia("(max-width: 900px)").matches;

    const baseOpacity = variant === "dark" ? OPACITY_DARK : OPACITY_LIGHT;
    const opacity = mobile ? baseOpacity * 0.7 : baseOpacity; // ~30% fainter on mobile (desktop unchanged)
    const minFrameMs = mobile ? 1000 / 30 : 0; // ~30fps on mobile, uncapped on desktop

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!gl) return; // graceful: no WebGL → nothing renders, content unaffected

    let program: WebGLProgram;
    try {
      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      program = gl.createProgram()!;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error("Program link error: " + gl.getProgramInfoLog(program));
      }
    } catch {
      return; // never break the page over a background
    }

    gl.useProgram(program);

    // Full-screen quad.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uPointer = gl.getUniformLocation(program, "u_pointer");
    const uInfluence = gl.getUniformLocation(program, "u_influence");
    const uOpacity = gl.getUniformLocation(program, "u_opacity");
    gl.uniform1f(uOpacity, opacity);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : MAX_DPR);

    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    // Pointer state (viewport coords; mapped to canvas-local each frame).
    let clientX = -9999;
    let clientY = -9999;
    let lastMove = -IDLE_MS;
    // Smoothed uniforms.
    let curX = 0.5;
    let curY = 0.5;
    let influence = 0;

    const onMove = (e: MouseEvent) => {
      clientX = e.clientX;
      clientY = e.clientY;
      lastMove = performance.now();
    };

    const draw = (timeMs: number, influenceOverride?: number) => {
      resize();
      const rect = canvas.getBoundingClientRect();
      // target pointer in canvas-local 0..1, GL space (flip y).
      const tx = rect.width > 0 ? (clientX - rect.left) / rect.width : 0.5;
      const tyTop = rect.height > 0 ? (clientY - rect.top) / rect.height : 0.5;
      const ty = 1 - tyTop;

      curX += (tx - curX) * POINTER_LERP;
      curY += (ty - curY) * POINTER_LERP;

      const target =
        influenceOverride !== undefined
          ? influenceOverride
          : performance.now() - lastMove < IDLE_MS
            ? 1
            : 0;
      influence += (target - influence) * INFLUENCE_LERP;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, timeMs * 0.001);
      gl.uniform2f(uPointer, curX, curY);
      gl.uniform1f(uInfluence, influence);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    // ---- Reduced motion: one static frame, no loop, no listeners. ----
    if (reduce) {
      draw(0, 0);
      const onResize = () => draw(0, 0);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    // ---- Animated path. ----
    let rafId = 0;
    let running = false;
    let onScreen = true;
    let visible = !document.hidden;

    let lastDraw = -Infinity;
    const loop = (t: number) => {
      // throttle to ~30fps on mobile (rAF still fires; we skip draws). 60fps on desktop.
      if (t - lastDraw >= minFrameMs) {
        lastDraw = t;
        draw(t);
      }
      rafId = requestAnimationFrame(loop);
    };
    const startLoop = () => {
      if (running || !onScreen || !visible) return;
      running = true;
      // Correct buffer size + a first paint the instant we're eligible,
      // so the canvas never lingers at the 300x150 default.
      resize();
      draw(performance.now());
      rafId = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    if (canHover) window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? true;
        if (onScreen) startLoop();
        else stopLoop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) startLoop();
      else stopLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    startLoop();

    return () => {
      stopLoop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      if (canHover) window.removeEventListener("mousemove", onMove);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        // z:0 (not -10): a negative z-index canvas paints behind the opaque
        // body background:var(--paper) and is occluded. At z:0 it sits in the
        // positioned layer above the paper, with content lifted to z:1 above it.
        zIndex: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
