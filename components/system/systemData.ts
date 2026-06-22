// Shared node data for the interactive system map (homepage + /system) AND the
// /system detail sections / overview table.
//
// Map order is CLOCKWISE FROM 12:00 (every 45°): the array index drives the
// node angle, so do not reorder without intent. `key` mirrors the `thema` keys
// in lib/intents.ts — each modal CTA deep-links to /kontakt?thema=<key>.

export interface SystemNode {
  key: string;
  /** map label */
  short: string;
  /** map metric line under the label */
  metric?: string;
  /** modal heading */
  title: string;
  /** modal eyebrow tag */
  tag: string;
  /** modal body copy */
  body: string;
  /** modal CTA pill label (deep-links to /kontakt?thema=key) */
  cta: string;
  /** larger, accented map dot */
  flagship?: boolean;
  /** deep page for the /system detail section (optional) */
  href?: string;
  /** /system detail section paragraph */
  line: string;
  /** /system detail section two-column lists */
  detail?: { wir: string[]; sie: string[] };
  /** /system overview table */
  einzeln: boolean;
  paket: boolean;
}

export const systemNodes: SystemNode[] = [
  // 12:00
  {
    key: "beschaffung",
    short: "Beschaffung",
    metric: "Rx & Vollsortiment · 24/7",
    title: "Beschaffung",
    tag: "FLAGSCHIFF · 24/7 BUYER",
    body: "Ihr ausgelagerter Einkaufsdesk – ein Zugang für Ihr komplettes Rx- und Vollsortiment. Bestellung, Beschaffung und Versand laufen vollautomatisch über unsere Systeme, ohne Aufwand auf Ihrer Seite.",
    cta: "Anbindung starten →",
    flagship: true,
    href: "/beschaffung",
    line: "Ihr ausgelagerter Einkaufsdesk – ein Zugang für Ihr komplettes Rx- und Vollsortiment, vollautomatisch über unsere Systeme.",
    einzeln: true,
    paket: true,
  },
  // 1:30
  {
    key: "grosshandelserlaubnis",
    short: "Großhandelserlaubnis",
    metric: "Beantragt & betrieben · §52a AMG",
    title: "Großhandelserlaubnis",
    tag: "KERNSTÜCK · §52A AMG",
    body: "Ihre eigene Großhandelserlaubnis – ohne die Komplexität. Wir übernehmen den Antrag, stellen die verantwortliche Person (VP) und betreiben den GDP-konformen Großhandel, während Sie die Einkaufsvorteile nutzen.",
    cta: "Erlaubnis prüfen lassen →",
    line: "Ihre eigene Großhandelserlaubnis – ohne die Komplexität. Antrag, verantwortliche Person und GDP-konformer Betrieb übernehmen wir.",
    detail: {
      wir: [
        "Den Antrag nach §52a AMG stellen und betreiben",
        "Die verantwortliche Person (VP) stellen",
        "Den GDP-konformen Großhandel führen",
      ],
      sie: ["Ihre Apotheke wie gewohnt führen – und die Einkaufsvorteile nutzen"],
    },
    einzeln: true,
    paket: true,
  },
  // 3:00
  {
    key: "konditionen",
    short: "Top-Konditionen",
    metric: "5 Großhändler gebündelt",
    title: "Top-Konditionen",
    tag: "EINKAUF · GEBÜNDELT",
    body: "Allein verhandelt jede Apotheke aus der schwachen Position. Über uns kaufen Sie zu den gebündelten Konditionen von fünf Großhändlern – bessere Einkaufspreise auf Ihr gesamtes Rx-Sortiment.",
    cta: "Konditionen vergleichen →",
    line: "Gebündelte Konditionen von fünf Großhändlern – bessere Einkaufspreise auf Ihr gesamtes Rx-Sortiment.",
    detail: {
      wir: [
        "Das Volumen des Netzwerks bündeln",
        "Einkaufsvorteile bei fünf Großhändlern sichern",
      ],
      sie: ["Weiter über Ihren gewohnten Großhandel bestellen"],
    },
    einzeln: true,
    paket: true,
  },
  // 4:30
  {
    key: "ssb",
    short: "SSB & Praxisbedarf",
    metric: "Neue Rx-Umsätze · Arztpraxen",
    title: "SSB & Praxisbedarf",
    tag: "UMSATZ · ARZTPRAXEN",
    body: "Sprechstundenbedarf als zusätzlicher Umsatzkanal – ohne Mehrarbeit in der Offizin. Wir wickeln Bestellung, Belieferung und Abrechnung mit den Praxen komplett über unser System ab.",
    cta: "Praxisbedarf aktivieren →",
    line: "Sprechstundenbedarf als zusätzlicher Umsatzkanal – Bestellung, Belieferung und Abrechnung wickeln wir komplett ab.",
    detail: {
      wir: [
        "Bestellung, Belieferung und Abrechnung mit den Praxen abwickeln",
        "Den Kanal unter Ihrer Apotheke aufsetzen und betreuen",
      ],
      sie: ["Die Apotheke betreiben – den Rest übernehmen wir"],
    },
    einzeln: false,
    paket: true,
  },
  // 6:00
  {
    key: "cannabis",
    short: "Cannabis",
    metric: "500+ Sorten · 20+ Hersteller",
    title: "Cannabis",
    tag: "SORTIMENT · 500+ SORTEN",
    body: "Die komplette Cannabis-Infrastruktur hinter Ihrer Apotheke – von der Pflanze bis zum Patienten. Über 500 Sorten von 20+ Herstellern, inklusive Import, Lagerung und Versand, GDP-konform.",
    cta: "Sortiment ansehen →",
    href: "/cannabis",
    line: "Die komplette Cannabis-Infrastruktur – über 500 Sorten von 20+ Herstellern, inklusive Import, Lagerung und Versand.",
    einzeln: true,
    paket: true,
  },
  // 7:30
  {
    key: "lieferengpass",
    short: "Lieferengpass-Management",
    metric: "Sonderbeschaffung · Pharma-Buyer",
    title: "Lieferengpass-Management",
    tag: "VERFÜGBARKEIT · PHARMA-BUYER",
    body: "Wenn der Großhandel nicht liefert, erhöhen wir Ihre Trefferquote. Aktive Sonderbeschaffung und Defektabwicklung über ein eigenes Buyer-Netzwerk – damit seltener ein Patient ohne Medikament dasteht.",
    cta: "Engpass melden →",
    line: "Aktive Sonderbeschaffung und Defektabwicklung über ein eigenes Buyer-Netzwerk – wir erhöhen Ihre Trefferquote.",
    detail: {
      wir: [
        "Defekte aktiv über ein eigenes Buyer-Netzwerk beschaffen",
        "Die Trefferquote bei Engpässen erhöhen",
      ],
      sie: ["Den Engpass melden – wir kümmern uns um die Beschaffung"],
    },
    einzeln: true,
    paket: true,
  },
  // 9:00
  {
    key: "fulfillment",
    short: "Versand & Fulfillment",
    metric: "Pick-up bis Versand",
    title: "Versand & Fulfillment",
    tag: "LOGISTIK · GDP-KONFORM",
    body: "Lager, Kommissionierung und Versand – komplett im Hintergrund, GDP-konform abgesichert. Pick-up bis Patient: temperaturgeführt, dokumentiert, nachverfolgbar.",
    cta: "Ablauf ansehen →",
    line: "Lager, Kommissionierung und Versand – GDP-konform im Hintergrund. Pick-up bis Patient: temperaturgeführt und dokumentiert.",
    detail: {
      wir: [
        "Lager, Kommissionierung und Versand betreiben",
        "GDP-konform: temperaturgeführt, dokumentiert, nachverfolgbar",
      ],
      sie: ["Nichts – es läuft im Hintergrund"],
    },
    einzeln: true,
    paket: true,
  },
  // 10:30
  {
    key: "schnittstellen",
    short: "Schnittstellen",
    metric: "MSV3 & Warenwirtschaft",
    title: "Schnittstellen",
    tag: "TECHNIK · MSV3",
    body: "Vollautomatisch in Ihre Warenwirtschaft integriert – kein manueller Aufwand, keine Doppelpflege. MSV3-Anbindung verbindet Bestellung, Verfügbarkeit und Lieferstatus in Echtzeit.",
    cta: "Integration ansehen →",
    line: "MSV3-Anbindung – Bestellung, Verfügbarkeit und Lieferstatus in Echtzeit, vollautomatisch in Ihre Warenwirtschaft integriert.",
    detail: {
      wir: [
        "Die MSV3-Schnittstelle einrichten und warten",
        "Bestellung, Verfügbarkeit und Lieferstatus in Echtzeit anbinden",
      ],
      sie: ["Nichts – keine Doppelpflege, kein manueller Aufwand"],
    },
    einzeln: true,
    paket: true,
  },
];
