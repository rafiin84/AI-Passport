"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Info, Sparkle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { AssessmentQuestion } from "@/components/assessment/assessment-question";
import { Skeleton } from "@/components/ui/states";
import { Chip } from "@/components/ui/badge";
import { answerBaseline, completeBaseline, startBaseline, type AnswerResponse } from "@/lib/api";
import { useAction, useBaselineResult } from "@/hooks/use-api";
import { skillName } from "@/mocks/skills";
import { useT } from "@/hooks/use-t";
import type { BaselineSession, Question } from "@/types";
import Link from "next/link";

type Phase = "intro" | "loading" | "question" | "finishing";

export function BaselineRunner() {
  const t = useT();
  const router = useRouter();
  const { data: existing } = useBaselineResult();
  const [phase, setPhase] = useState<Phase>("intro");
  const [session, setSession] = useState<BaselineSession | null>(null);
  const [q, setQ] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<AnswerResponse | null>(null);
  const [signals, setSignals] = useState<{ skillId: string; correct: boolean }[]>([]);
  const heading = useRef<HTMLDivElement>(null);
  useEffect(() => { heading.current?.focus(); }, [q?.id, phase]);

  const start = useAction(() => startBaseline(), { onSuccess: (r) => { setSession(r.session); setQ(r.question); setSelected(null); setFeedback(null); setSignals([]); setPhase("question"); } });
  const answer = useAction((i: number) => answerBaseline({ sessionId: session!.id, questionId: q!.id, selected: i }), { onSuccess: (r) => { setFeedback(r); setSession(r.session); setSignals((s) => [...s, r.skillSignal]); } });
  const finish = useAction(() => completeBaseline(session!.id), { onSuccess: () => router.push("/assessment/result?reveal=1") });

  const n = session?.answers.length ?? 0;

  if (phase === "intro" || phase === "loading") {
    return (
      <div className="mx-auto max-w-2xl py-6 text-center sm:py-12">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto mb-6 grid size-20 place-items-center rounded-3xl bg-brand-soft text-brand"><Sparkle size={40} weight="duotone" /></motion.div>
        <h1 ref={heading as React.RefObject<HTMLHeadingElement>} tabIndex={-1} className="font-display text-4xl font-extrabold outline-none sm:text-5xl">{t("assess.intro.title")}</h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-muted">{t("assess.intro.sub")}</p>
        <ul className="mx-auto mt-8 grid max-w-md gap-3 text-left">
          {["About 6–12 quick questions, one at a time", "It adapts to you — no fixed 50-question paper", "This is a diagnostic. It doesn't award any certificate"].map((x) => <li key={x} className="flex gap-3 rounded-2xl border border-line bg-surface p-4"><Info size={22} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" /><span>{x}</span></li>)}
        </ul>
        {start.isPending ? (
          <div role="status" className="mx-auto mt-8 max-w-md space-y-3"><span className="sr-only">Preparing your first question…</span><Skeleton className="h-8 w-3/4" /><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
        ) : (
          <div className="mt-8 flex flex-col items-center gap-3">
            <Button size="lg" variant="saffron" onClick={() => start.mutate(undefined)}>{t("assess.start")} <ArrowRight size={20} weight="bold" /></Button>
            {existing && <Link className="text-sm font-semibold text-brand underline" href="/assessment/result">See my last result ({existing.level})</Link>}
          </div>
        )}
      </div>
    );
  }

  if (phase === "finishing" || finish.isPending) {
    return (
      <div role="status" className="grid min-h-[50dvh] place-items-center text-center">
        <div><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="mx-auto mb-5 size-16 rounded-full border-4 border-dashed border-saffron" aria-hidden="true" /><p className="font-display text-2xl font-bold">Reading your skill signals…</p></div>
      </div>
    );
  }

  const done = feedback?.done;
  return (
    <div className="mx-auto max-w-2xl pb-28 md:pb-0">
      <div className="mb-6" aria-live="polite">
        <div className="flex items-center justify-between text-sm font-semibold text-muted"><span>Question {n + (feedback ? 0 : 1)}</span><span>Getting to know your level</span></div>
        <div className="mt-2 flex gap-1" aria-hidden="true">
          {Array.from({ length: Math.max(8, n + 2) }, (_, i) => <motion.span key={i} className="h-2 flex-1 rounded-full" animate={{ backgroundColor: i < n ? "var(--saffron)" : i === n ? "var(--brand)" : "var(--surface-3)" }} />)}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={q!.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ type: "spring", stiffness: 280, damping: 30 }}>
          <div ref={heading} tabIndex={-1} className="outline-none">
            <AssessmentQuestion q={q!} selected={selected} onSelect={(i) => { if (!feedback && !answer.isPending) { setSelected(i); } }} locked={!!feedback} correctAnswer={feedback?.correctAnswer} />
          </div>
        </motion.div>
      </AnimatePresence>

      <div aria-live="polite" className="mt-5">
        {feedback && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl p-4 ${feedback.correct ? "bg-green-soft text-fg" : "bg-saffron-soft text-fg"}`}>
            <p className="font-bold">{feedback.correct ? "Nice — that's a solid signal." : "Good to know — that's a growth area."}</p>
            <p className="mt-1 text-sm text-muted">{feedback.explanation}</p>
          </motion.div>
        )}
      </div>

      {signals.length > 0 && (
        <div className="mt-5" aria-label="Skill signals so far">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Skill signals</p>
          <ul className="flex flex-wrap gap-1.5">{[...new Map(signals.map((s) => [s.skillId, s])).values()].map((s) => <motion.li key={s.skillId} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><Chip tone={s.correct ? "green" : "neutral"}>{skillName(s.skillId)}</Chip></motion.li>)}</ul>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-16 z-40 border-t border-line bg-bg/95 p-4 backdrop-blur md:static md:mt-6 md:border-0 md:bg-transparent md:p-0">
        <div className="mx-auto max-w-2xl">
          {!feedback ? (
            <Button size="lg" block disabled={selected === null} loading={answer.isPending} onClick={() => answer.mutate(selected!)}>Check my answer</Button>
          ) : done ? (
            <Button size="lg" block variant="saffron" onClick={() => { setPhase("finishing"); finish.mutate(undefined); }}>Show me my AI level <ArrowRight size={20} weight="bold" /></Button>
          ) : (
            <Button size="lg" block onClick={() => { setQ(feedback.next); setSelected(null); setFeedback(null); }}>Next question <ArrowRight size={20} weight="bold" /></Button>
          )}
        </div>
      </div>
    </div>
  );
}
