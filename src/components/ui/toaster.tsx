"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Info, WarningCircle, X } from "@phosphor-icons/react";
import { useToasts } from "@/store/toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { items, dismiss } = useToasts();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[100] flex flex-col items-center gap-2 px-4 md:bottom-6" role="region" aria-label="Notifications" aria-live="polite">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div key={t.id} layout initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className={cn("pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border bg-surface p-4 shadow-lift", t.tone === "error" ? "border-danger" : t.tone === "success" ? "border-india-green" : "border-line")}>
            {t.tone === "success" ? <CheckCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-india-green" /> : t.tone === "error" ? <WarningCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-danger" /> : <Info size={22} weight="fill" className="mt-0.5 shrink-0 text-brand" />}
            <div className="min-w-0 flex-1"><p className="font-semibold text-fg">{t.title}</p>{t.description && <p className="text-sm text-muted">{t.description}</p>}</div>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="grid size-8 place-items-center rounded-full text-muted hover:bg-surface-2"><X size={16} /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
