"use client";
import { useQuery } from "@tanstack/react-query";
import { getPublicLearner } from "@/lib/api";
import { errorMessage } from "@/hooks/use-api";
import { PassportCover } from "@/components/passport/passport-cover";
import { BadgeCard } from "@/components/passport/badge-card";
import { ProjectCard } from "@/components/projects/project-card";
import { SectionHeading, Card } from "@/components/ui/card";
import { ErrorState, LoadingBlock } from "@/components/ui/states";
import { Chip } from "@/components/ui/badge";

export function PublicProfile({ id }: { id: string }) {
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["public", id], queryFn: () => getPublicLearner(id), retry: false });
  if (isLoading) return <div className="mx-auto max-w-5xl px-4 py-10"><LoadingBlock /></div>;
  if (error || !data) return <div className="mx-auto max-w-5xl px-4 py-10"><ErrorState title="Profile not found" body={errorMessage(error)} onRetry={() => refetch()} /></div>;
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6">
      <div className="grid items-center gap-8 lg:grid-cols-[28rem_1fr]">
        <PassportCover name={data.name} state={data.state} level={data.level} stamps={data.verifiedSkills.map((v) => ({ id: v.credentialId, label: v.skill.name }))} />
        <div><Chip tone="green">Public AI Praman</Chip><h1 className="mt-3 font-display text-4xl font-extrabold">{data.name}</h1><p className="mt-2 max-w-lg text-muted">Shared by the learner. This page shows only name, state, level, verified skills and projects that have been verified. Contact details, date of birth and identity information are never shown.</p></div>
      </div>
      <section><SectionHeading title="Verified skills" className="mb-4" />{data.verifiedSkills.length ? <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{data.verifiedSkills.map((v) => <li key={v.credentialId}><BadgeCard id={`${v.credentialId}`} skill={v.skill.name} level={v.level} date={v.date} /></li>)}</ul> : <Card className="p-6 text-muted">No verified skills yet.</Card>}</section>
      <section><SectionHeading title="Projects" className="mb-4" />{data.projects.length ? <div className="grid gap-4 md:grid-cols-2">{data.projects.map((p) => <ProjectCard key={p.id} project={p} />)}</div> : <Card className="p-6 text-muted">No public projects yet.</Card>}</section>
      {data.recognitions.length > 0 && <section><SectionHeading title="Recognition" className="mb-4" /><ul className="grid gap-3 md:grid-cols-2">{data.recognitions.map((r) => <li key={r.id} className="rounded-2xl border border-saffron bg-saffron-soft p-4"><Chip tone="saffron">Top 100 · {r.year}</Chip><p className="mt-2 font-display text-lg font-bold">{r.categoryName}</p><p className="text-sm text-muted">{r.projectTitle}</p></li>)}</ul></section>}
    </div>
  );
}
