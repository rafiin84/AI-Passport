"use client";
import { useQuery } from "@tanstack/react-query";
import { listRecognitionCategories } from "@/lib/api";
import { errorMessage } from "@/hooks/use-api";
import { PageHeader, Card } from "@/components/ui/card";
import { CategorySelector } from "@/components/recognition/category-selector";
import { CardGridSkeleton, ErrorState } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { Info } from "@phosphor-icons/react";

export function RecognitionHome() {
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["rec-cats"], queryFn: listRecognitionCategories });
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow="Top 100 recognition · 2027" title="Projects that move India forward" sub="Certificates recognise learning. Projects recognise capability. Every project here solves a real problem — chosen by human reviewers using a published rubric, not by likes or certificate counts." action={<Button href="/projects/new" variant="saffron">Build a project</Button>} />
      <Card className="mb-8 flex gap-3 p-5"><Info size={24} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" /><p className="text-sm text-muted"><strong className="text-fg">Prototype data.</strong> Names, projects and outcomes shown here are sample entries for demonstration. A real Top 100 is published only after configured human review.</p></Card>
      {error ? <ErrorState body={errorMessage(error)} onRetry={() => refetch()} /> : isLoading ? <CardGridSkeleton n={6} /> : <CategorySelector categories={data ?? []} />}
    </div>
  );
}
