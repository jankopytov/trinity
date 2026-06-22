"use client";

import { useEffect } from "react";
import { useUIStore, readSavedLang } from "@/lib/store";

/**
 * Hydrates the persisted language on mount and keeps <html lang> in sync.
 * Server renders <html lang="de"> (the store default); if the visitor saved
 * "en", we switch on mount. Renders nothing.
 */
export default function LangInit() {
  const lang = useUIStore((s) => s.lang);
  const setLang = useUIStore((s) => s.setLang);

  // apply the saved choice once on mount
  useEffect(() => {
    const saved = readSavedLang();
    if (saved && saved !== lang) setLang(saved);
    else document.documentElement.lang = lang;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep <html lang> in sync on every change
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
