import type { MetadataRoute } from "next";

const BASE = "https://trinity-pharma-brown.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    // Allow all crawling. The legal pages carry their own `noindex` meta
    // (they must stay crawlable for that tag to be honoured), so they are not
    // disallowed here.
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
