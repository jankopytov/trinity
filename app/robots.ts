import type { MetadataRoute } from "next";
import { SITE_URL as BASE } from "@/lib/site";

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
