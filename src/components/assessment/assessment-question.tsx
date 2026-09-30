"use client";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface QuestionView { id: string; prompt: string; options: string[]; topic?: string }

/** One question per screen. Native radios keep keyboard + screen-reader behaviour correct. */
export function AssessmentQuestion({ q, selected, onSelect, locked, correctAnswer, legendPrefix }: {
  q: QuestionView; selected: number | null; onSelect: (i: number) => void; locked?: boolean; correctAnswer?: number; legendPrefix?: string;
}) {
  return (
    <fieldset disabled={locked} className="space-y-5">
      <legend className="w-full">
        {q.topic && <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-saffron-deep">{q.topic}</span>}
        <span className="block font-display text-2xl font-bold leading-snug text-fg sm:text-3xl">{legendPrefix}{q.prompt}</span>
      </legend>
      <div className="grid gap-3" role="radiogroup">
        {q.options.map((o, i) => {
          const isSel = selected === i;
          const showRight = locked && correctAnswer === i;
          const showWrong = locked && isSel && correctAnswer !== i;
          return (
            <motion.label key={i} whileTap={{ scale: 0.985 }} className={cn(
              "flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--ring)]",
              showRight ? "border-india-green bg-green-soft" : showWrong ? "border-danger bg-danger-soft" : isSel ? "border-brand bg-brand-soft" : "border-line bg-surface hover:bg-surface-2",
              locked && "cursor-default")}>
              <input type="radio" name={q.id} className="sr-only" checked={isSel} onChange={() => onSelect(i)} />
              <span className={cn("grid size-8 shrink-0 place-items-center rounded-full border-2 text-sm font-bold", isSel ? "border-brand bg-brand text-brand-fg" : "border-line text-muted")} aria-hidden="true">{String.fromCharCode(65 + i)}</span>
              <span className="flex-1 text-base font-medium text-fg">{o}</span>
              {showRight && <CheckCircle size={26} weight="fill" className="shrink-0 text-india-green" aria-label="Correct answer" />}
              {showWrong && <XCircle size={26} weight="fill" className="shrink-0 text-danger" aria-label="Your answer was not correct" />}
            </motion.label>
          );
        })}
      </div>
    </fieldset>
  );
}
