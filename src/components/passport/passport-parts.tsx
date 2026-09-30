"use client";
import { CheckCircle, Circle, Medal, Rocket, SealCheck, Target } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { SKILLS } from "@/mocks/skills";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PassportTimeline({ items }: { items: { id: string; at: string; title: string; kind: string }[] }) {
  const icon = (k: string) => (k === "credential" ? SealCheck : k === "project" ? Rocket : k === "recognition" ? Medal : Target);
  return (
    <ol className="relative space-y-4 border-l-2 border-line pl-6">
      {items.map((t, i) => { const I = icon(t.kind); return (
        <motion.li key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="relative">
          <span className="absolute -left-[2.05rem] grid size-8 place-items-center rounded-full border-2 border-bg bg-brand-soft text-brand"><I size={16} weight="fill" aria-hidden="true" /></span>
          <p className="font-semibold">{t.title}</p><p className="text-sm text-muted">{formatDate(t.at)}</p>
        </motion.li>
      ); })}
    </ol>
  );
}

/** Map of all skills grouped by category, showing which are verified. Text-based so it is fully accessible. */
export function PassportSkillMap({ verified }: { verified: string[] }) {
  const groups = SKILLS.reduce<Record<string, typeof SKILLS>>((a, s) => { (a[s.category] ??= []).push(s); return a; }, {});
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Object.entries(groups).map(([cat, skills]) => {
        const n = skills.filter((s) => verified.includes(s.id)).length;
        return (
          <section key={cat} aria-label={cat} className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between"><h3 className="text-sm font-bold uppercase tracking-wider text-muted">{cat}</h3><span className="text-xs font-semibold text-muted">{n}/{skills.length}</span></div>
            <ul className="mt-3 space-y-1.5">{skills.map((s) => { const on = verified.includes(s.id); return (
              <li key={s.id} className={cn("flex items-center gap-2 text-sm", on ? "font-semibold text-fg" : "text-muted")}>{on ? <CheckCircle size={18} weight="fill" className="text-india-green" aria-label="Verified" /> : <Circle size={18} aria-label="Not yet verified" />}{s.name}</li>
            ); })}</ul>
          </section>
        );
      })}
    </div>
  );
}
