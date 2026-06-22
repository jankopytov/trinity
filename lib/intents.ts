// Authority for the intent-aware contact page's `thema` KEYS. The display copy
// (headlines/subtitles/subjects) now lives in the i18n dictionary under
// `intents` (lib/i18n/de.ts, en.ts) so it renders in the active language.
// The system-map node CTAs deep-link with these same keys — keep them in sync
// with `key` in components/system/systemData.ts. Keys are language-independent.

export const INTENT_KEYS = [
  "beschaffung",
  "grosshandelserlaubnis",
  "konditionen",
  "ssb",
  "cannabis",
  "lieferengpass",
  "fulfillment",
  "schnittstellen",
] as const;

export type IntentKey = (typeof INTENT_KEYS)[number];

/** Narrowing guard — true only for a known intent key. */
export function isIntentKey(key: string | null | undefined): key is IntentKey {
  return !!key && (INTENT_KEYS as readonly string[]).includes(key);
}
