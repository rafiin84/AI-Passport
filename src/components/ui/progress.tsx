"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProgressRing({ value, size = 88, stroke = 9, label, className, color = "var(--brand)" }: { value: number; size?: number; stroke?: number; label?: string; className?: string; color?: string }) {
  const r = (size - stroke) / 2; const c = 2 * Math.PI * r;
  return (
    <div className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }} role="img" aria-label={`${label ?? "Progress"}: ${Math.round(value)} percent`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - value / 100) }} transition={{ type: "spring", stiffness: 60, damping: 18 }} />
      </svg>
      <span className="absolute font-display text-lg font-bold text-fg">{Math.round(value)}%</span>
    </div>
  );
}

export function ProgressBar({ value, className, label }: { value: number; className?: string; label?: string }) {
  return (
    <div role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? "Progress"} className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-3", className)}>
      <motion.div className="h-full rounded-full bg-gradient-to-r from-saffron to-brand" initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ type: "spring", stiffness: 70, damping: 20 }} />
    </div>
  );
}
