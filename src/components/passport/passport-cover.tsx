"use client";
import { motion } from "framer-motion";
import { SealCheck } from "@phosphor-icons/react";
import { ChakraMotif } from "@/components/government/tricolour";
import { LEVELS, LEVEL_ORDER } from "@/constants/levels";
import type { LevelId } from "@/types";

export interface Stamp { id: string; label: string }

/** The signature AI Praman artwork: a living record with level progression and skill stamps. */
export function PassportCover({ name, level, stamps, state, compact }: { name: string; level: LevelId | null; stamps: Stamp[]; state?: string; compact?: boolean }) {
  const li = level ? LEVELS[level].index : -1;
  return (
    <motion.div initial={{ rotateY: -14, opacity: 0, y: 20 }} animate={{ rotateY: 0, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 90, damping: 18 }} style={{ perspective: 1200 }}
      className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-[#0b1b3a] p-6 text-white shadow-lift sm:p-8">
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" aria-hidden="true" />
      <div className="jaali absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#ffb870]">AI Praman</p>
            <p className="mt-0.5 text-xs text-white/70">Learn anywhere. Prove here.</p>
          </div>
          <ChakraMotif size={compact ? 34 : 44} className="text-[#a9b4ff]" />
        </div>
        <div className="mt-8">
          <p className="text-xs uppercase tracking-widest text-white/60">Holder</p>
          <p className="font-display text-2xl font-extrabold sm:text-3xl">{name || "Your name here"}</p>
          {state && <p className="text-sm text-white/70">{state}</p>}
        </div>
        <div className="mt-6" role="img" aria-label={level ? `Level progression: ${LEVELS[level].name}` : "Level not yet set"}>
          <div className="flex items-center gap-1.5">
            {LEVEL_ORDER.map((l, i) => (
              <div key={l} className="flex-1">
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 + i * 0.1 }} style={{ transformOrigin: "left", background: i <= li ? `linear-gradient(90deg, ${LEVELS[l].from}, ${LEVELS[l].to})` : "rgba(255,255,255,0.14)" }} className="h-2 rounded-full" />
                <p className={`mt-1.5 hidden text-[0.6rem] font-semibold sm:block ${i === li ? "text-white" : "text-white/45"}`}>{LEVELS[l].short}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm font-semibold text-[#ffb870]">{level ? `Level: ${LEVELS[level].name}` : "Find your level to begin"}</p>
        </div>
        {!compact && (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-widest text-white/60">Skill stamps</p>
            {stamps.length === 0 ? <p className="mt-2 text-sm text-white/60">Your verified skills will show up here.</p> : (
              <ul className="mt-2 flex flex-wrap gap-2">
                {stamps.slice(0, 6).map((s, i) => (
                  <motion.li key={s.id} initial={{ scale: 0.4, rotate: -12, opacity: 0 }} animate={{ scale: 1, rotate: (i % 2 ? 3 : -3), opacity: 1 }} transition={{ delay: 0.6 + i * 0.12, type: "spring", stiffness: 300, damping: 16 }}
                    className="flex items-center gap-1.5 rounded-lg border border-dashed border-[#ffb870]/70 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-[#ffd9ad]">
                    <SealCheck size={16} weight="fill" aria-hidden="true" />{s.label}
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
