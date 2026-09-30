"use client";
import { useEffect, useState } from "react";
import { Moon, Sun, Circle, TextAa, TextAUnderline } from "@phosphor-icons/react";
import { useUi } from "@/store/ui";
import { useT } from "@/hooks/use-t";
import { cn } from "@/lib/utils";

const btn = "grid size-9 min-h-9 min-w-9 place-items-center rounded-lg border border-line bg-surface text-fg hover:bg-surface-2 aria-pressed:border-brand aria-pressed:bg-brand-soft aria-pressed:text-brand";

/** Compact accessibility toolbar: text size, contrast, theme. Settings persist per device. */
export function AccessibilityControls({ className }: { className?: string }) {
  const ui = useUi();
  const t = useT();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && (ui.theme === "dark" || (ui.theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches));
  const scale = mounted ? ui.textScale : 100;
  return (
    <div role="group" aria-label={t("a11y.title")} className={cn("flex items-center gap-1.5", className)}>
      <button type="button" className={btn} aria-label="Decrease text size" disabled={scale === 100} onClick={() => ui.setTextScale(scale === 130 ? 115 : 100)}><TextAa size={16} /></button>
      <button type="button" className={btn} aria-label="Increase text size" disabled={scale === 130} onClick={() => ui.setTextScale(scale === 100 ? 115 : 130)}><TextAUnderline size={20} weight="bold" /></button>
      <button type="button" className={btn} aria-label={t("a11y.contrast")} aria-pressed={mounted && ui.highContrast} onClick={() => ui.setHighContrast(!ui.highContrast)}><Circle size={18} weight="duotone" /></button>
      <button type="button" className={btn} aria-label={t("a11y.theme")} aria-pressed={dark} onClick={() => ui.setTheme(dark ? "light" : "dark")}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
    </div>
  );
}
