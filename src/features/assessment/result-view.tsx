"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Lightning, TrendUp } from "@phosphor-icons/react";
import { useBaselineResult } from "@/hooks/use-api";
import { AILevelCard } from "@/components/assessment/ai-level-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip, LevelBadge } from "@/components/ui/badge";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/ui/states";
import { LEVELS } from "@/constants/levels";
import { skillName } from "@/mocks/skills";
import { useT } from "@/hooks/use-t";
import { isAuthError, errorMessage } from "@/hooks/use-api";

export function ResultView() {
  const t = useT();
  const reveal = useSearchParams().get("reveal") === "1";
  const { data: r, isLoading, error, refetch } = useBaselineResult();
  const [stage, setStage] = useState(reveal ? 0 : 3);
  useEffect(() => {
    if (!reveal || !r) return;
    const timers = [setTimeout(() => setStage(1), 900), setTimeout(() => setStage(2), 2600), setTimeout(() => setStage(3), 4400)];
    return () => timers.forEach(clearTimeout);
  }, [reveal, r]);

  if (isLoading) return <LoadingBlock label="Loading your result" />;
  if (error && !isAuthError(error)) return <ErrorState body={errorMessage(error)} onRetry={() => refetch()} />;
  if (!r) return <EmptyState title="No result yet" body="Take the AI Challenge to find your level." action={<Button href="/assessment">Find my AI level</Button>} />;
  const L = LEVELS[r.level];
  const conf = r.confidence >= 0.8 ? "High" : r.confidence >= 0.55 ? "Medium" : "Early";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AnimatePresence mode="wait">
        {stage < 2 && (
          <motion.div key="signals" exit={{ opacity: 0, y: -20 }} className="grid min-h-[55dvh] place-items-center text-center" role="status" aria-live="polite">
            <div>
              <p className="font-display text-3xl font-extrabold">{stage === 0 ? "Reading your answers…" : "Here are your skill signals"}</p>
              <ul className="mt-6 flex flex-wrap justify-center gap-2">
                {stage >= 1 && r.skillsDetected.map((s, i) => (
                  <motion.li key={s.skillId} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15, type: "spring" }}><Chip tone={s.strength >= 0.5 ? "green" : "saffron"} className="px-4 py-2 text-sm">{skillName(s.skillId)}</Chip></motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {stage >= 2 && (
        <>
          <AILevelCard level={r.level} />
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: stage >= 3 ? 1 : 0, y: stage >= 3 ? 0 : 24 }} className="space-y-6">
            <Card className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-2xl font-bold">What this means</h2>
                <div className="flex items-center gap-2 text-sm" title="How sure we are about this level">
                  <span className="font-semibold text-muted">Confidence: {conf}</span>
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-surface-3" role="img" aria-label={`Confidence ${Math.round(r.confidence * 100)} percent`}><div className="h-full rounded-full bg-india-green" style={{ width: `${r.confidence * 100}%` }} /></div>
                </div>
              </div>
              <p className="mt-3 text-muted">{L.definition}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-3">{L.demonstrates.map((d) => <li key={d} className="rounded-2xl bg-surface-2 p-3 text-sm font-medium">{d}</li>)}</ul>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-6"><h3 className="flex items-center gap-2 font-display text-xl font-bold"><Lightning size={22} weight="fill" className="text-saffron" aria-hidden="true" />Your strengths</h3><ul className="mt-3 space-y-2">{r.strengths.map((s) => <li key={s} className="flex items-center gap-2"><span className="size-2 rounded-full bg-india-green" aria-hidden="true" />{s}</li>)}</ul></Card>
              <Card className="p-6"><h3 className="flex items-center gap-2 font-display text-xl font-bold"><TrendUp size={22} weight="bold" className="text-brand" aria-hidden="true" />Level-up opportunities</h3><ul className="mt-3 space-y-2">{r.growthAreas.map((s) => <li key={s} className="flex items-center gap-2"><span className="size-2 rounded-full bg-saffron" aria-hidden="true" />{s}</li>)}</ul></Card>
            </div>
            {r.nextLevel && <Card className="flex flex-wrap items-center gap-3 p-6"><span className="font-semibold">Next level:</span><LevelBadge level={r.nextLevel} /><span className="text-muted">{LEVELS[r.nextLevel].definition}</span></Card>}
            <p className="text-sm text-muted">This is a diagnostic based on {r.questionsAnswered} questions, not a certificate. Your level updates as you learn and verify skills.</p>
            <div className="sticky bottom-20 z-10 md:static"><Button href="/path" size="lg" variant="saffron" block>{t("result.cta")}</Button></div>
          </motion.div>
        </>
      )}
    </div>
  );
}
