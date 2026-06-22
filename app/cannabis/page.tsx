import type { Metadata } from "next";
import CannabisScroll from "@/components/cannabis/CannabisScroll";

export const metadata: Metadata = {
  title: "Medizinisches Cannabis",
  description:
    "500+ Sorten von 20+ Herstellern, GDP-konform — von der Pflanze bis zum Patienten. Die komplette Cannabis-Infrastruktur hinter Ihrer Apotheke.",
  alternates: { canonical: "/cannabis" },
};

export default function CannabisPage() {
  return (
    <main>
      <CannabisScroll />
    </main>
  );
}
