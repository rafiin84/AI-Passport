"use client";
import { useProjects, errorMessage } from "@/hooks/use-api";
import { PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/ui/states";
import { useT } from "@/hooks/use-t";

export function ProjectsPage() {
  const t = useT();
  const { data, isLoading, error, refetch } = useProjects("mine");
  if (isLoading) return <LoadingBlock />;
  if (error) return <ErrorState body={errorMessage(error)} onRetry={() => refetch()} />;
  return (
    <div>
      <PageHeader eyebrow="Projects" title="Build something real" sub="Recognition is project-first. Show a problem you cared about and what you built with AI to solve it." action={<Button href="/projects/new" variant="saffron">New project</Button>} />
      {!data?.length ? <EmptyState title={t("empty.projects")} action={<Button href="/projects/new">Start a project</Button>} /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.map((p) => <ProjectCard key={p.id} project={p} />)}</div>}
    </div>
  );
}
