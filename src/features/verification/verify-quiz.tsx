"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle, XCircle } from "@phosphor-icons/react";
import { startVerification, submitVerification, type VerificationOutcome } from "@/lib/api";
import { errorMessage, useAction } from "@/hooks/use-api";
import { AssessmentQuestion } from "@/components/assessment/assessment-question";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/ui/states";
import { ProgressBar } from "@/components/ui/progress";

export function VerifyQuiz({ id }: { id: string }) {
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["verify", id], queryFn: () => startVerification(id), retry: false, staleTime: Infinity, refetchOnMount: "always" });
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [outcome, setOutcome] = useState<VerificationOutcome | null>(null);
  const submit = useAction(() => submitVerification(id, answers), { onSuccess: setOutcome });
  useEffect(() => { setI(0); setAnswers({}); setOutcome(null); }, [id]);

  if (isLoading) return <LoadingBlock label="Preparing your verification" />;
  if (error || !data) return <ErrorState title="Can't start verification yet" body={errorMessage(error)} onRetry={() => refetch()} />;
  if (!data.assessment) return <EmptyState title="Assessment being prepared" body="Our team reviews every assessment before it can lead to a credential. We'll notify you as soon as this one is ready." action={<Button href={`/learning/${id}`}>Back to my progress</Button>} />;

  const a = data.assessment;
  const items = [...a.questions.map((q) => ({ ...q, topic: "Knowledge check" })), ...a.scenarios.map((s) => ({ ...s, topic: "Scenario" }))];
  const cur = items[i]!;

  if (outcome) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`rounded-[2rem] p-8 text-center text-white ${outcome.passed ? "bg-gradient-to-br from-india-green to-[#0b5a06]" : "bg-gradient-to-br from-[#b85c00] to-[#7a3b00]"}`}>
          <p className="text-sm font-bold uppercase tracking-widest text-white/80">{outcome.passed ? "You passed" : "Not quite yet"}</p>
          <p className="font-display text-6xl font-extrabold">{outcome.score}%</p>
          <p className="mt-2 text-white/90">{outcome.correct} of {outcome.total} correct · pass mark {a.passMark}%</p>
        </motion.div>
        <Card className="divide-y divide-line">
          {outcome.review.map((r, n) => (
            <details key={r.id} className="group p-4"><summary className="flex cursor-pointer items-center gap-3 font-semibold">{r.selected === r.correctAnswer ? <CheckCircle size={22} weight="fill" className="shrink-0 text-india-green" aria-label="Correct" /> : <XCircle size={22} weight="fill" className="shrink-0 text-danger" aria-label="Incorrect" />}<span>{n + 1}. {r.prompt}</span></summary>
              <div className="mt-3 space-y-1 pl-9 text-sm"><p><span className="font-semibold">Your answer:</span> {r.selected >= 0 ? r.options[r.selected] : "No answer"}</p><p><span className="font-semibold">Correct:</span> {r.options[r.correctAnswer]}</p><p className="text-muted">{r.explanation}</p></div></details>
          ))}
        </Card>
        {outcome.nextStep === "evidence" && <Button block size="lg" variant="saffron" href={`/learning/${id}/practical`}>Now show us the real thing <ArrowRight size={20} weight="bold" /></Button>}
        {outcome.nextStep === "credential" && <Button block size="lg" variant="saffron" href={`/learning/${id}/result`}>See my credential</Button>}
        {outcome.nextStep === "retry" && <div className="flex flex-col gap-2 sm:flex-row"><Button block size="lg" onClick={() => { setI(0); setAnswers({}); setOutcome(null); }}>Try again</Button><Button block size="lg" variant="secondary" href={`/learning/${id}`}>Back to course</Button></div>}
      </div>
    );
  }

  const last = i === items.length - 1;
  return (
    <div className="mx-auto max-w-2xl pb-28 md:pb-0">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-saffron-deep">Show us what you learned</p>
      <h1 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">{data.course.title}</h1>
      <div className="my-5"><ProgressBar value={((i + 1) / items.length) * 100} label="Verification progress" /><p className="mt-1 text-sm text-muted" aria-live="polite">Question {i + 1} of {items.length}</p></div>
      <AnimatePresence mode="wait"><motion.div key={cur.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
        <AssessmentQuestion q={cur} selected={answers[cur.id] ?? null} onSelect={(n) => setAnswers((a) => ({ ...a, [cur.id]: n }))} />
      </motion.div></AnimatePresence>
      <div className="fixed inset-x-0 bottom-16 z-40 flex gap-3 border-t border-line bg-bg/95 p-4 backdrop-blur md:static md:mt-6 md:border-0 md:bg-transparent md:p-0">
        {i > 0 && <Button variant="secondary" size="lg" onClick={() => setI(i - 1)}>Back</Button>}
        {!last ? <Button size="lg" className="flex-1" disabled={answers[cur.id] === undefined} onClick={() => setI(i + 1)}>Next</Button>
          : <Button size="lg" variant="saffron" className="flex-1" disabled={answers[cur.id] === undefined} loading={submit.isPending} onClick={() => submit.mutate(undefined)}>Submit answers</Button>}
      </div>
      <p className="mt-4 hidden text-sm text-muted md:block"><Link href={`/learning/${id}`} className="underline">Leave and come back later</Link></p>
    </div>
  );
}
