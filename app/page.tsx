import Hero from "@/components/hero/Hero";
import PositionBar from "@/components/proof/PositionBar";
import PharmacyJourney from "@/components/journey/PharmacyJourney";
import SystemSection from "@/components/system/SystemSection";
import Finale from "@/components/finale/Finale";
import Testimonial from "@/components/testimonial/Testimonial";
import NetworkMarquee from "@/components/marquee/NetworkMarquee";
import CinematicBand from "@/components/band/CinematicBand";
import LiquidBackground from "@/components/LiquidBackground";

export default function Home() {
  return (
    <main style={{ overflowX: "clip" }}>
      {/* §1 — full-viewport hero video. No shader behind it. */}
      <Hero />

      {/* Everything below the hero shares one low-opacity shader backdrop.
          isolation+relative makes this the paper-backed stacking context: the
          canvas sits at z:0 above this --paper fill, sections at z:1 above it. */}
      <div
        style={{
          position: "relative",
          isolation: "isolate",
          background: "var(--paper)",
        }}
      >
        <LiquidBackground />
        <PositionBar />
        <NetworkMarquee />
        <Testimonial />
        <PharmacyJourney />
        <CinematicBand />
        <SystemSection />
        <Finale />
      </div>
    </main>
  );
}
