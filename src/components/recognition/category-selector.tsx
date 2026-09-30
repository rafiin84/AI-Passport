"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import type { RecognitionCategory } from "@/types";

export function CategorySelector({ categories }: { categories: (RecognitionCategory & { count: number })[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((c, i) => (
        <motion.li key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
          <Link href={`/recognition/${c.id}`} className="group flex h-full gap-4 rounded-3xl border border-line bg-surface p-5 shadow-card transition-all hover:-translate-y-1 hover:border-saffron">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-saffron-soft text-saffron-deep"><Icon name={c.icon} size={30} weight="duotone" /></span>
            <span className="min-w-0"><span className="block font-display text-lg font-bold leading-tight">{c.name}</span><span className="mt-1 block text-sm text-muted">{c.description}</span><span className="mt-2 block text-xs font-bold uppercase tracking-wider text-brand">{c.count > 0 ? `${c.count} project stor${c.count === 1 ? "y" : "ies"}` : "Reviews in progress"} · {c.year}</span></span>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}
