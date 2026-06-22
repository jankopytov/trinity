"use client";

import { create } from "zustand";
import type { Lang } from "@/lib/i18n/dict";

const LANG_KEY = "tp-lang";

interface UIState {
  preloaderDone: boolean;
  menuOpen: boolean;
  lang: Lang;
  setPreloaderDone: (done: boolean) => void;
  setMenuOpen: (open: boolean) => void;
  setLang: (lang: Lang) => void;
}

export const useUIStore = create<UIState>((set) => ({
  preloaderDone: false,
  menuOpen: false,
  lang: "de", // SSR default; LangInit hydrates the saved choice on mount
  setPreloaderDone: (done) => set({ preloaderDone: done }),
  setMenuOpen: (open) => set({ menuOpen: open }),
  setLang: (lang) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(LANG_KEY, lang);
      } catch {
        /* ignore storage failures (private mode etc.) */
      }
      document.documentElement.lang = lang;
    }
    set({ lang });
  },
}));

/** Read the persisted language (client only). Returns null if none/invalid. */
export function readSavedLang(): Lang | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(LANG_KEY);
    return v === "de" || v === "en" ? v : null;
  } catch {
    return null;
  }
}
