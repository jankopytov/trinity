import type { Metadata } from "next";
import { Suspense } from "react";
import KontaktView from "@/components/kontakt/KontaktView";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Apotheke an Trinity anbinden und ein Erstgespräch vereinbaren — Beschaffung, Großhandelserlaubnis, Cannabis, SSB und Versand aus einer Hand.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktPage() {
  // useSearchParams() in KontaktView requires a Suspense boundary.
  return (
    <Suspense fallback={<main style={{ minHeight: "100dvh", background: "var(--paper)" }} />}>
      <KontaktView />
    </Suspense>
  );
}
