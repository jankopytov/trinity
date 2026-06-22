"use client";

import { useUIStore } from "@/lib/store";
import { de } from "@/lib/i18n/de";
import { en } from "@/lib/i18n/en";
import type { Dict, Lang } from "@/lib/i18n/dict";

const DICTS: Record<Lang, Dict> = { de, en };

/** Active-language dictionary. Re-renders consumers when the language flips. */
export function useT(): Dict {
  const lang = useUIStore((s) => s.lang);
  return DICTS[lang];
}

/** Active language code (e.g. for <html lang> or number/date formatting). */
export function useLang(): Lang {
  return useUIStore((s) => s.lang);
}

export { de, en };
export type { Dict, Lang };
