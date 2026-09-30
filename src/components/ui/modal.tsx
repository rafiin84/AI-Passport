"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props { open: boolean; onOpenChange: (o: boolean) => void; title: string; description?: string; children: React.ReactNode; className?: string }

export function Modal({ open, onOpenChange, title, description, children, className }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-[#050a18]/60 backdrop-blur-sm" />
        <Dialog.Content asChild>
          <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className={cn("fixed left-1/2 top-1/2 z-[91] max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-line bg-surface p-6 shadow-lift sm:p-8", className)}>
            <Dialog.Title className="font-display text-2xl font-bold text-fg">{title}</Dialog.Title>
            {description ? <Dialog.Description className="mt-2 text-muted">{description}</Dialog.Description> : <Dialog.Description className="sr-only">{title}</Dialog.Description>}
            <div className="mt-5">{children}</div>
            <Dialog.Close aria-label="Close" className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted hover:bg-surface-2"><X size={20} /></Dialog.Close>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function Drawer({ open, onOpenChange, title, children, side = "right" }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; children: React.ReactNode; side?: "right" | "left" }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-[#050a18]/60 backdrop-blur-sm" />
        <Dialog.Content asChild>
          <motion.div initial={{ x: side === "right" ? "100%" : "-100%" }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 300, damping: 34 }}
            className={cn("fixed top-0 z-[91] h-dvh w-[min(26rem,100%)] overflow-y-auto border-line bg-surface p-6 shadow-lift", side === "right" ? "right-0 border-l" : "left-0 border-r")}>
            <Dialog.Title className="font-display text-xl font-bold text-fg">{title}</Dialog.Title>
            <Dialog.Description className="sr-only">{title}</Dialog.Description>
            <div className="mt-5">{children}</div>
            <Dialog.Close aria-label="Close" className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted hover:bg-surface-2"><X size={20} /></Dialog.Close>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
