"use client";
import { useEffect, useState } from "react";
import { Translate } from "@phosphor-icons/react";
import { LANGUAGES } from "@/constants/i18n";
import { useUi } from "@/store/ui";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useUi();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const active = mounted ? language : "en";
  return (
    <div role="group" aria-label="Language" className={cn("inline-flex items-center gap-1 text-sm", className)}>
      <Translate size={16} aria-hidden="true" className="text-muted" />
      {LANGUAGES.map((l, i) => (
        <span key={l.code} className="inline-flex items-center">
          {i > 0 && <span aria-hidden="true" className="mx-0.5 text-muted">|</span>}
          <button type="button" lang={l.code} aria-pressed={active === l.code} onClick={() => setLanguage(l.code)}
            className={cn("min-h-8 rounded-md px-1.5 font-medium hover:underline", active === l.code ? "font-bold text-brand underline underline-offset-4" : "text-fg")}>
            {l.native}
          </button>
        </span>
      ))}
    </div>
  );
}
