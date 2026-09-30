import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language } from "@/types";

export type Theme = "light" | "dark" | "system";
export type TextScale = 100 | 115 | 130;

interface UiState {
  language: Language;
  theme: Theme;
  textScale: TextScale;
  highContrast: boolean;
  reduceMotion: boolean;
  setLanguage: (l: Language) => void;
  setTheme: (t: Theme) => void;
  setTextScale: (s: TextScale) => void;
  setHighContrast: (v: boolean) => void;
  setReduceMotion: (v: boolean) => void;
}

export const useUi = create<UiState>()(
  persist(
    (set) => ({
      language: "en", theme: "system", textScale: 100, highContrast: false, reduceMotion: false,
      setLanguage: (language) => set({ language }), setTheme: (theme) => set({ theme }), setTextScale: (textScale) => set({ textScale }),
      setHighContrast: (highContrast) => set({ highContrast }), setReduceMotion: (reduceMotion) => set({ reduceMotion }),
    }),
    { name: "ai-passport-ui" },
  ),
);
