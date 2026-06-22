// Canonical site origin. Auto-adapts to wherever it's deployed so the repo is
// portable: any Vercel project that builds this repo gets correct absolute OG /
// canonical / sitemap URLs for its own domain — no code change needed.
//
// Resolution order:
//   1. NEXT_PUBLIC_SITE_URL  — set this to pin a custom domain (e.g. https://trinity-pharma.de)
//   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel injects the project's prod domain at build
//   3. fallback — the current vercel alias (also used for local dev)
const fromEnv =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "");

export const SITE_URL = fromEnv || "https://trinity-pharma-brown.vercel.app";
