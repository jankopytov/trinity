import type { Metadata } from "next";
import { Mona_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LangInit from "@/components/LangInit";

const monaSans = Mona_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Canonical origin — resolves from env (Vercel) so the repo is portable across
// deployments; drives absolute OG image URLs for link unfurls.
export { SITE_URL } from "@/lib/site";
import { SITE_URL } from "@/lib/site";
const DEFAULT_TITLE =
  "Trinity Pharma — Die Infrastruktur, an der die Apotheken Deutschlands hängen.";
const DEFAULT_DESC =
  "Beschaffung, Großhandelserlaubnis, medizinisches Cannabis, SSB und Versand — eine geschlossene Infrastruktur für Apotheken. Deutschlandweit, ein System.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s · Trinity Pharma",
  },
  description: DEFAULT_DESC,
  applicationName: "Trinity Pharma",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    alternateLocale: "en_US",
    siteName: "Trinity Pharma",
    url: "/",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: [
      { url: "/brand/og.jpg", width: 1200, height: 630, alt: "Trinity Pharma — Apotheken-Infrastruktur" },
      { url: "/brand/og-square.jpg", width: 1200, height: 1200, alt: "Trinity Pharma" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: ["/brand/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${monaSans.variable} ${geistMono.variable}`}>
      <body>
        <LangInit />
        <Preloader />
        <SmoothScroll>
          <Nav />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
