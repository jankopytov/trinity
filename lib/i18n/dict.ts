// Shape of the translation dictionary. de.ts and en.ts both implement `Dict`,
// so TypeScript enforces identical key coverage across languages (a missing or
// extra key is a compile error). useT() returns the active-language Dict.

export type Lang = "de" | "en";

export interface NodeText {
  short: string;
  metric: string;
  title: string;
  tag: string;
  body: string;
  cta: string;
}

export interface IntentText {
  ueberschrift: string;
  untertitel: string;
  betreff: string;
}

export interface JourneyStep {
  n: string;
  title: string;
  desc: string;
}

export interface BeatText {
  eyebrow: string;
  headline: string;
  /** must be a substring of `headline` — rendered in the accent gradient */
  accentWord: string;
  subtext: string;
  /** label for the count-up metric (empty when the beat has no metric) */
  metricLabel: string;
}

export interface BeschaffungBeatText {
  n: string;
  title: string;
  body: string;
}

export interface PosterLineText {
  text: string;
  gradient?: boolean;
}

export interface LegalLine {
  /** optional mono label shown before the value (e.g. "Kontakt") */
  label?: string;
  value: string;
}

export interface LegalSection {
  heading: string;
  /** paragraphs */
  body: string[];
  /** optional bullet list (e.g. the DSGVO rights) */
  bullets?: string[];
}

export interface Dict {
  nav: {
    cannabis: string;
    beschaffung: string;
    kontakt: string;
    cta: string;
    menuOpen: string;
    menuClose: string;
  };
  hero: { line1: string; line2: string; cta: string };
  position: {
    suffix: string;
    countLabel: string;
    support: string[];
    statement: string;
  };
  marquee: { eyebrow: string };
  testimonial: { eyebrow: string; quote: string; name: string; role: string };
  journey: { eyebrow: string; headline: string; steps: JourneyStep[] };
  system: {
    eyebrow: string;
    headline: string;
    flagship: string;
    close: string;
    detailsSuffix: string;
  };
  /** keyed by thema (unchanged across languages) */
  nodes: Record<string, NodeText>;
  band: { line: string };
  finale: { statement: string; cta: string };
  footer: { kontakt: string; impressum: string; datenschutz: string; copyright: string };
  kontakt: {
    eyebrow: string;
    fallback: { ueberschrift: string; untertitel: string };
    form: {
      name: string;
      apotheke: string;
      email: string;
      telefon: string;
      betreff: string;
      nachricht: string;
      namePh: string;
      apothekePh: string;
      emailPh: string;
      telefonPh: string;
      betreffPh: string;
      nachrichtPh: string;
      submit: string;
      submitting: string;
      required: string;
      emailInvalid: string;
      successTitle: (vorname: string) => string;
      successBody: (betreff: string) => string;
      sendError: string;
    };
    trust: string;
    direct: {
      eyebrow: string;
      telefon: string;
      email: string;
      whatsapp: string;
      whatsappCta: string;
      note: string;
    };
  };
  intents: Record<string, IntentText>;
  cannabis: { beats: BeatText[]; endLine: string; endCta: string };
  beschaffung: {
    heroTitle: string;
    heroSub: string;
    beats: BeschaffungBeatText[];
    poster1: PosterLineText[];
    poster2: PosterLineText[];
    closerLine: string;
    closerCta: string;
    // in-graphic labels
    gOrder: string;
    gDelivery: string;
    gAvailableOrdered: string;
    gRecurringRevenue: string;
  };
  legal: {
    /** EN only: the non-binding-translation notice; "" in DE */
    nonBinding: string;
    impressum: {
      eyebrow: string;
      headline: string;
      section5: string; // "Angaben gemäß § 5 TMG"
      company: string;
      address: string;
      country: string;
      vertretenLabel: string;
      vertreten: string;
      kontaktLabel: string;
      kontaktEmail: string;
      registerLabel: string;
      register: string;
      ustLabel: string;
      ust: string;
      verantwortlichLabel: string;
      verantwortlich: string;
      haftungLabel: string;
      haftung: string;
    };
    datenschutz: {
      eyebrow: string;
      headline: string;
      sections: LegalSection[];
    };
  };
  langToggle: { de: string; en: string; label: string };
}
