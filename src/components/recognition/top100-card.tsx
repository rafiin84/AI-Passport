import Link from "next/link";
import { ArrowRight, MapPin } from "@phosphor-icons/react";
import { Avatar } from "@/components/learner/avatar";
import { LevelBadge, SkillChip } from "@/components/ui/badge";
import { skillName } from "@/mocks/skills";
import type { RecognitionEntry } from "@/lib/api";

/** A project story, not a leaderboard row: no scores, ranks-as-points or popularity counts are shown publicly. */
export function Top100Card({ entry, index }: { entry: RecognitionEntry; index: number }) {
  const { learner: l, project: p } = entry;
  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-line bg-surface shadow-card">
      <div className="h-1.5 bg-gradient-to-r from-saffron via-white to-india-green" aria-hidden="true" />
      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[14rem_1fr]">
        <div className="flex items-center gap-4 md:flex-col md:items-start">
          <Avatar name={l.name} hue={l.avatarHue} size={64} />
          <div><p className="font-display text-xl font-bold">{l.name}</p><p className="flex items-center gap-1 text-sm text-muted"><MapPin size={14} aria-hidden="true" />{l.state} · Age {l.age}</p>{l.currentLevel && <div className="mt-2"><LevelBadge level={l.currentLevel} size="sm" /></div>}</div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-saffron-deep">Project {String(index + 1).padStart(2, "0")}</p>
          <h3 className="mt-1 font-display text-2xl font-extrabold leading-tight sm:text-3xl"><Link href={`/projects/${p.id}`} className="after:absolute after:inset-0 focus-visible:after:rounded-[2rem]">{p.title}</Link></h3>
          <dl className="mt-4 space-y-3">
            <div><dt className="text-sm font-bold text-muted">The problem</dt><dd className="line-clamp-2">{p.problem}</dd></div>
            <div><dt className="text-sm font-bold text-muted">The solution</dt><dd className="line-clamp-2">{p.solution}</dd></div>
            <div><dt className="text-sm font-bold text-muted">The impact</dt><dd className="line-clamp-2 font-medium text-india-green">{p.impact}</dd></div>
          </dl>
          <div className="mt-4 flex flex-wrap items-center gap-1.5">{p.skills.map((s) => <SkillChip key={s}>{skillName(s)}</SkillChip>)}<span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-brand">Read the story <ArrowRight size={14} weight="bold" /></span></div>
        </div>
      </div>
    </article>
  );
}
