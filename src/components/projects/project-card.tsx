import Link from "next/link";
import { ProjectStatusBadge, SkillChip, Chip } from "@/components/ui/badge";
import { CATEGORIES } from "@/mocks/recognition";
import { skillName } from "@/mocks/skills";
import type { Project } from "@/types";

export function ProjectCard({ project, byline }: { project: Project; byline?: string }) {
  const cat = CATEGORIES.find((c) => c.id === project.recognitionCategory)?.name ?? project.category;
  return (
    <article className="relative flex h-full flex-col gap-3 rounded-3xl border border-line bg-surface p-5 shadow-card transition-transform hover:-translate-y-0.5">
      <div className="flex flex-wrap items-center gap-2"><ProjectStatusBadge status={project.status} /><Chip tone="brand">{cat}</Chip></div>
      <h3 className="font-display text-xl font-bold leading-snug"><Link href={`/projects/${project.id}`} className="after:absolute after:inset-0 focus-visible:after:rounded-3xl">{project.title}</Link></h3>
      {byline && <p className="text-sm text-muted">{byline}</p>}
      <p className="line-clamp-3 text-muted">{project.problem}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-1">{project.skills.slice(0, 3).map((s) => <SkillChip key={s}>{skillName(s)}</SkillChip>)}</div>
    </article>
  );
}
