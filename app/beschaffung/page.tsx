import type { Metadata } from "next";
import { beschaffungBeats } from "@/components/story/beschaffung";
import BeschaffungHero from "@/components/beschaffung/BeschaffungHero";
import BeschaffungBeat from "@/components/beschaffung/BeschaffungBeat";
import Beat01Anbindung from "@/components/beschaffung/Beat01Anbindung";
import Beat02Motor from "@/components/beschaffung/Beat02Motor";
import Beat03TrinityBuyer from "@/components/beschaffung/Beat03TrinityBuyer";
import Beat04Expertise from "@/components/beschaffung/Beat04Expertise";
import Beat05Ergebnis from "@/components/beschaffung/Beat05Ergebnis";
import TypoPoster from "@/components/beschaffung/TypoPoster";
import BeschaffungCloser from "@/components/beschaffung/BeschaffungCloser";
import GrainOverlay from "@/components/beschaffung/GrainOverlay";
import Schiene from "@/components/beschaffung/Schiene";
import LiquidBackground from "@/components/LiquidBackground";

export const metadata: Metadata = {
  title: "Beschaffung — Trinity Pharma",
};

const graphics = [
  <Beat01Anbindung key="01" />,
  <Beat02Motor key="02" />,
  <Beat03TrinityBuyer key="03" />,
  <Beat04Expertise key="04" />,
  <Beat05Ergebnis key="05" />,
];

export default function BeschaffungPage() {
  return (
    <main
      className="engine"
      style={{
        position: "relative",
        isolation: "isolate",
        background: "var(--engine)",
        color: "var(--engine-ink)",
        overflowX: "hidden",
      }}
    >
      {/* ambient dark liquid (z:0) + the Schiene through-line (z:0, above liquid) */}
      <LiquidBackground variant="dark" />
      <Schiene />
      <GrainOverlay />

      {/* all content sits above the ambient layers */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <BeschaffungHero />

        {beschaffungBeats.slice(0, 3).map((beat, i) => (
          <BeschaffungBeat
            key={beat.n}
            n={beat.n}
            title={beat.title}
            body={beat.body}
            reverse={i % 2 === 1}
          >
            {graphics[i]}
          </BeschaffungBeat>
        ))}

        <TypoPoster
          lines={[
            { text: "Ohne Aufwand." },
            { text: "Ohne Personal." },
            { text: "Ohne Lagerfläche." },
          ]}
        />

        {beschaffungBeats.slice(3, 5).map((beat, i) => (
          <BeschaffungBeat
            key={beat.n}
            n={beat.n}
            title={beat.title}
            body={beat.body}
            reverse={(i + 3) % 2 === 1}
          >
            {graphics[i + 3]}
          </BeschaffungBeat>
        ))}

        <TypoPoster
          lines={[
            { text: "Keine Kosten." },
            { text: "Keine Bindung." },
            { text: "Nur Ergebnis.", gradient: true },
          ]}
        />

        <BeschaffungCloser />
      </div>
    </main>
  );
}
