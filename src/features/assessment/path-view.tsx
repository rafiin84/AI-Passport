"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Flag, MapPin } from "@phosphor-icons/react";
import { useCourses, useLearningPath, isAuthError, errorMessage } from "@/hooks/use-api";
import { PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LevelBadge, SkillChip } from "@/components/ui/badge";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/ui/states";
import { LEVELS } from "@/constants/levels";
import { skillName } from "@/mocks/skills";
import { COURSES } from "@/mocks/courses";
import { PROVIDERS } from "@/constants/providers";
import { cn } from "@/lib/utils";

export function PathView() {
  const { data: path, isLoading, error, refetch } = useLearningPath();
  useCourses({});
  if (isLoading) return <LoadingBlock label="Building your path" />;
  if (error && !isAuthError(error)) return <ErrorState body={errorMessage(error)} onRetry={() => refetch()} />;
  if (!path) return <EmptyState title="Let's find your level first" body="Your learning path is built from your AI Challenge result." action={<Button href="/assessment">Take the AI Challenge</Button>} />;
  const target = LEVELS[path.targetLevel];
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="Personalised for you" title={LEVELS[path.currentLevel].pathTitle} sub={`You're a ${LEVELS[path.currentLevel].name}. These steps are chosen from your level, gaps, goals and interests.`} action={<LevelBadge level={path.currentLevel} size="lg" />} />
      <ol className="relative space-y-4 pl-2">
        <span className="absolute bottom-10 left-[1.65rem] top-4 w-1 rounded-full bg-gradient-to-b from-saffron via-line to-india-green" aria-hidden="true" />
        {path.steps.map((s, i) => {
          const c = COURSES.find((x) => x.id === s.courseId);
          return (
            <motion.li key={s.order} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="relative flex gap-4">
              <span className={cn("z-10 grid size-11 shrink-0 place-items-center rounded-full border-4 border-bg font-bold", s.status === "done" ? "bg-india-green text-white" : s.status === "current" ? "bg-saffron text-[#1a1000] ring-4 ring-saffron/30" : "bg-surface-3 text-muted")}>
                {s.status === "done" ? <CheckCircle size={22} weight="fill" aria-label="Done" /> : s.order}
              </span>
              <div className={cn("min-w-0 flex-1 rounded-3xl border bg-surface p-5 shadow-card", s.status === "current" ? "border-saffron" : "border-line")}>
                {s.status === "current" && <span className="mb-1 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-saffron-deep"><MapPin size={14} weight="fill" />You are here</span>}
                <h2 className="font-display text-xl font-bold">{s.title}</h2>
                <p className="mt-1 text-muted">{s.why}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">{s.skillIds.slice(0, 3).map((id) => <SkillChip key={id}>{skillName(id)}</SkillChip>)}</div>
                {c ? (
                  <Link href={`/courses/${c.id}`} className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-surface-2 p-3 hover:bg-surface-3">
                    <span className="min-w-0"><span className="block truncate font-semibold">{c.title}</span><span className="text-sm text-muted">{PROVIDERS[c.provider].name} · {c.duration}</span></span><LevelBadge level={c.level} size="sm" />
                  </Link>
                ) : <p className="mt-3 text-sm text-muted">Course to be matched.</p>}
              </div>
            </motion.li>
          );
        })}
        <li className="relative flex gap-4">
          <span className="z-10 grid size-11 shrink-0 place-items-center rounded-full border-4 border-bg text-white" style={{ background: `linear-gradient(135deg, ${target.from}, ${target.to})` }}><Flag size={22} weight="fill" aria-hidden="true" /></span>
          <div className="flex-1 rounded-3xl p-5 text-white" style={{ background: `linear-gradient(135deg, ${target.from}, ${target.to})` }}><p className="text-sm font-bold uppercase tracking-wider text-white/80">Destination</p><h2 className="font-display text-2xl font-extrabold">{target.name}</h2><p className="mt-1 text-white/90">{target.definition}</p></div>
        </li>
      </ol>
    </div>
  );
}
