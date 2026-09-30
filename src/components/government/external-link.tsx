"use client";
import { useState } from "react";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/use-t";

/** Every provider link goes through this interstitial. Never implies provider affiliation. */
export function ExternalLinkGate({ href, providerName, onProceed, children, variant = "primary", size = "md", block, className }: {
  href: string; providerName: string; onProceed?: () => void; children: React.ReactNode; variant?: "primary" | "saffron" | "secondary" | "soft"; size?: "sm" | "md" | "lg"; block?: boolean; className?: string;
}) {
  const [open, setOpen] = useState(false);
  const t = useT();
  return (
    <>
      <Button variant={variant} size={size} block={block} className={className} onClick={() => setOpen(true)}>{children}<ArrowSquareOut size={18} aria-hidden="true" /></Button>
      <Modal open={open} onOpenChange={setOpen} title={t("leave.title")} description={t("leave.body", { provider: providerName })}>
        <div className="rounded-2xl bg-surface-2 p-3 text-sm text-muted">
          You'll open <span className="break-all font-mono text-xs text-fg">{href}</span> in a new tab. Come back to AI Praman when you finish — then declare your course complete and show us what you learned.
        </div>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => setOpen(false)}>{t("leave.stay")}</Button>
          <Button variant="saffron" href={href} external onClick={() => { onProceed?.(); setOpen(false); }}>{t("leave.continue", { provider: providerName })}</Button>
        </div>
      </Modal>
    </>
  );
}
