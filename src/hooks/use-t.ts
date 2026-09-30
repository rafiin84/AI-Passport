"use client";
import { useCallback } from "react";
import { translate } from "@/constants/i18n";
import { useUi } from "@/store/ui";

export function useT() {
  const language = useUi((s) => s.language);
  return useCallback((key: string, vars?: Record<string, string>) => translate(language, key, vars), [language]);
}
