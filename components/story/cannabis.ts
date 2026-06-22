export interface CannabisBeat {
  id: string;
  frameDir: string;
  frameCount: number;
  eyebrow: string;
  headline: string;
  /** one word in the headline rendered in the teal→indigo accent */
  accentWord?: string;
  subtext: string;
  metric?: { value: number; suffix: string; label: string };
}

export const cannabisBeats: CannabisBeat[] = [
  {
    id: "pflanze",
    frameDir: "/video/story/cannabis/frames/beat-01",
    frameCount: 121,
    eyebrow: "01 — DIE PFLANZE",
    headline: "EU-GMP-zertifiziert. Pharmazeutische Qualität.",
    accentWord: "Qualität.",
    subtext: "Geprüfte Blüten von über 20 Herstellern — lückenlos dokumentiert.",
    metric: { value: 20, suffix: "+", label: "Hersteller" },
  },
  {
    id: "sorten",
    frameDir: "/video/story/cannabis/frames/beat-02",
    frameCount: 151,
    eyebrow: "02 — DIE SORTEN",
    headline: "Das ganze Spektrum. THC bis CBD.",
    accentWord: "Spektrum.",
    subtext: "Über 500 Sorten, kuratiert für jede Indikation.",
    metric: { value: 500, suffix: "+", label: "Sorten" },
  },
  {
    id: "apotheke",
    frameDir: "/video/story/cannabis/frames/beat-03",
    frameCount: 121,
    eyebrow: "03 — IHRE APOTHEKE",
    headline: "Deutschlandweit angeschlossen.",
    accentWord: "angeschlossen.",
    subtext: "Vom Versandhandel bis zur A-Lage — Ihre Apotheke im Netz.",
    metric: { value: 50, suffix: "+", label: "Apotheken" },
  },
  {
    id: "rezept",
    frameDir: "/video/story/cannabis/frames/beat-04",
    frameCount: 121,
    eyebrow: "04 — DAS REZEPT",
    headline: "Vom Telemediziner zum E-Rezept.",
    accentWord: "E-Rezept.",
    subtext: "Anbindung an Telemedizin-Plattformen — das Rezept kommt zu Ihnen.",
  },
  {
    id: "patient",
    frameDir: "/video/story/cannabis/frames/beat-05",
    frameCount: 121,
    eyebrow: "05 — ZUM PATIENTEN",
    headline: "Abholung, Versand, Lieferung.",
    accentWord: "Lieferung.",
    subtext: "Pick-up, DHL, Uber, Lieferando — der Patient wählt.",
  },
  {
    id: "dahinter",
    frameDir: "/video/story/cannabis/frames/beat-06",
    frameCount: 121,
    eyebrow: "06 — DAHINTER",
    headline: "Eigene Systeme. Eine Schiene.",
    accentWord: "Schiene.",
    subtext: "Alles verbunden — von der Pflanze bis zum Patienten.",
  },
];
