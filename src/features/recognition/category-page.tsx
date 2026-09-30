"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getRecognitionCategory } from "@/lib/api";
import { errorMessage } from "@/hooks/use-api";
import { Top100Card } from "@/components/recognition/top100-card";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { TricolourAccent } from "@/components/government/tricolour";

export function CategoryPage({ id }: { id: string }) {
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["rec-cat", id], queryFn: () => getRecognitionCategory(id), retry: false });
  if (isLoading) return <div className="mx-auto max-w-5xl"><LoadingBlock /></div>;
  if (error || !data) return <div className="mx-auto max-w-5xl"><ErrorState title="Category not found" body={errorMessage(error)} onRetry={() => refetch()} /></div>;
  const { category, entries } = data;
  return (
    <div className="mx-auto max-w-5xl">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted"><Link className="hover:underline" href="/recognition">Recognition</Link> <span aria-hidden="true">/</span> {category.name}</nav>
      <header className="relative overflow-hidden rounded-[2rem] bg-[#0b1b3a] p-8 text-white sm:p-12">
        <div className="jaali absolute inset-0 opacity-25" aria-hidden="true" />
        <div className="relative"><Icon name={category.icon} size={40} weight="duotone" className="text-[#ffb870]" /><p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-[#ffb870]">{category.year}</p><h1 className="font-display text-4xl font-extrabold sm:text-6xl">Top 100 {category.name}</h1><p className="mt-3 max-w-2xl text-white/80">{category.description}</p></div>
        <TricolourAccent className="absolute inset-x-0 bottom-0" />
      </header>
      <p className="my-5 text-sm text-muted">Prototype sample entries. Showing {entries.length} of up to 100. Profiles are project stories — there are no popularity scores.</p>
      <h2 className="sr-only">Project stories</h2>
      {entries.length === 0 ? <EmptyState title="Reviews are in progress" body="No projects have been published in this category yet. Have a project that fits?" action={<Button href="/projects/new">Build a project</Button>} /> : <div className="space-y-5">{entries.map((e, i) => <Top100Card key={e.recognition.id} entry={e} index={i} />)}</div>}
    </div>
  );
}
