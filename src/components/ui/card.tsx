import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...p }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-3xl border border-line bg-surface shadow-card", className)} {...p} />;
}

export function SectionHeading({ eyebrow, title, sub, action, className }: { eyebrow?: string; title: string; sub?: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-3", className)}>
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-saffron-deep">{eyebrow}</p>}
        <h2 className="font-display text-2xl font-bold text-fg sm:text-3xl">{title}</h2>
        {sub && <p className="mt-1.5 max-w-2xl text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, sub, eyebrow, action }: { title: string; sub?: string; eyebrow?: string; action?: React.ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-saffron-deep">{eyebrow}</p>}
        <h1 className="font-display text-3xl font-extrabold leading-tight text-fg sm:text-4xl">{title}</h1>
        {sub && <p className="mt-2 max-w-2xl text-base text-muted">{sub}</p>}
      </div>
      {action}
    </header>
  );
}
