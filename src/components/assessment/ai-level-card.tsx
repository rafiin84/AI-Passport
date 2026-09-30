"use client";
import { motion } from "framer-motion";
import { LEVELS, LEVEL_ORDER } from "@/constants/levels";
import type { LevelId } from "@/types";

/** Big, motivational level reveal. */
export function AILevelCard({ level, headline, sub }: { level: LevelId; headline?: string; sub?: string }) {
  const l = LEVELS[level];
  return (
    <motion.div initial={{ scale: 0.85, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 160, damping: 14 }}
      className="relative overflow-hidden rounded-[2rem] p-8 text-white shadow-lift sm:p-12" style={{ background: `linear-gradient(135deg, ${l.from}, ${l.to})` }}>
      <div className="jaali absolute inset-0 opacity-30 mix-blend-overlay" aria-hidden="true" />
      <div className="relative">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">{headline ?? "You did it"}</p>
        <h2 className="mt-2 font-display text-5xl font-extrabold sm:text-7xl">You're {level === "pro" ? "an" : "a"} {l.name}</h2>
        <p className="mt-4 max-w-xl text-lg text-white/90">{sub ?? l.motivation}</p>
        <ol className="mt-8 flex items-center gap-2" aria-label="Level ladder">
          {LEVEL_ORDER.map((id) => (
            <li key={id} className="flex-1"><div className={`h-2 rounded-full ${l.index >= LEVELS[id].index ? "bg-white" : "bg-white/30"}`} /><span className={`mt-1.5 block text-[0.7rem] font-semibold ${id === level ? "text-white" : "text-white/60"}`}>{LEVELS[id].short}</span></li>
          ))}
        </ol>
      </div>
    </motion.div>
  );
}
