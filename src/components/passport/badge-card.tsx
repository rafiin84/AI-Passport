"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { SealCheck } from "@phosphor-icons/react";
import { LEVELS } from "@/constants/levels";
import { formatDate } from "@/lib/utils";
import type { LevelId } from "@/types";

export function BadgeCard({ id, skill, level, date, type, locked }: { id?: string; skill: string; level: LevelId; date?: string; type?: "badge" | "certificate"; locked?: boolean }) {
  const l = LEVELS[level];
  const body = (
    <motion.div whileHover={{ y: -4, rotate: -1 }} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}
      className={`flex h-full flex-col items-center rounded-3xl border border-line bg-surface p-5 text-center shadow-card ${locked ? "opacity-60" : ""}`}>
      <div className="relative grid size-20 place-items-center text-white" style={{ clipPath: "polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)", background: locked ? "var(--surface-3)" : `linear-gradient(135deg, ${l.from}, ${l.to})` }}>
        <SealCheck size={36} weight="fill" aria-hidden="true" className={locked ? "text-muted" : ""} />
      </div>
      <p className="mt-3 font-display text-base font-bold leading-tight">{skill}</p>
      <p className="mt-1 text-xs font-semibold text-muted">{l.name}{type ? ` · ${type === "badge" ? "Badge" : "Certificate"}` : ""}</p>
      {date && <p className="mt-0.5 text-xs text-muted">{formatDate(date)}</p>}
    </motion.div>
  );
  return id ? <Link href={`/credentials/${id}`} className="block h-full">{body}</Link> : body;
}
