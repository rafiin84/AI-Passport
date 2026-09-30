"use client";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Hammer } from "@phosphor-icons/react";
import { startVerification } from "@/lib/api";
import { errorMessage } from "@/hooks/use-api";
import { PageHeader, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/badge";
import { ErrorState, LoadingBlock } from "@/components/ui/states";

const LABEL = { url: "Live URL", repository: "Code repository", demo: "Demo", screenshot: "Screenshots", video: "Video", project: "Project write-up" } as const;

export function Practical({ id }: { id: string }) {
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["practical", id], queryFn: () => startVerification(id), retry: false });
  if (isLoading) return <LoadingBlock />;
  if (error || !data) return <ErrorState body={errorMessage(error)} onRetry={() => refetch()} />;
  const p = data.assessment?.practical;
  if (!p) return <ErrorState title="No practical task for this course" body="This course is verified by its knowledge check alone." />;
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader eyebrow="Practical challenge" title="Show us what you built" sub={data.course.title} />
      <Card className="p-6 sm:p-8"><Hammer size={32} weight="duotone" className="text-saffron-deep" aria-hidden="true" /><p className="mt-3 font-display text-2xl font-bold leading-snug">{p.brief}</p>
        <h2 className="mt-6 text-sm font-bold uppercase tracking-wider text-muted">Evidence we'll ask for</h2><div className="mt-2 flex flex-wrap gap-2">{p.requiredEvidence.map((e) => <Chip key={e} tone="brand">{LABEL[e]}</Chip>)}</div></Card>
      <Card className="p-6"><h2 className="font-display text-xl font-bold">How reviewers score it</h2><p className="mt-1 text-sm text-muted">A human reviewer uses this rubric. No credential is issued from an unreviewed submission.</p>
        <ul className="mt-4 space-y-3">{p.rubric.map((r) => <li key={r.criterion} className="flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-sm font-bold text-brand">{r.weight}%</span><span><span className="block font-semibold">{r.criterion}</span><span className="text-sm text-muted">{r.description}</span></span></li>)}</ul></Card>
      <Button href={`/learning/${id}/evidence`} size="lg" variant="saffron" block>Submit my evidence <ArrowRight size={20} weight="bold" /></Button>
    </div>
  );
}
