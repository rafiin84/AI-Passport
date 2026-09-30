"use client";
import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { adminListProjects, adminSetProjectStatus } from "@/lib/api";
import { useAction } from "@/hooks/use-api";
import { AdminTable, type Column } from "@/components/admin/admin-table";
import { ReviewPanel } from "@/components/admin/review-panel";
import { PageHeader } from "@/components/ui/card";
import { ProjectStatusBadge } from "@/components/ui/badge";
import { LoadingBlock } from "@/components/ui/states";
import { CATEGORIES } from "@/mocks/recognition";
import type { Project } from "@/types";

type Row = Project & { learnerName: string };

export function ProjectsAdmin() {
  const { data } = useQuery({ queryKey: ["admin-projects"], queryFn: adminListProjects });
  const [sel, setSel] = useState<string>();
  const act = useAction((v: { id: string; s: Project["status"]; note: string }) => adminSetProjectStatus(v.id, v.s, v.note), { success: "Project updated" });
  if (!data) return <LoadingBlock />;
  const cur = data.find((p) => p.id === sel);
  const cols: Column<Row>[] = [
    { key: "t", header: "Project", sortValue: (p) => p.title, render: (p) => <span className="line-clamp-2 min-w-48 font-semibold">{p.title}</span> },
    { key: "l", header: "Learner", sortValue: (p) => p.learnerName, render: (p) => p.learnerName },
    { key: "c", header: "Category", render: (p) => CATEGORIES.find((c) => c.id === (p.recognitionCategory ?? p.category))?.name ?? p.category },
    { key: "s", header: "Status", sortValue: (p) => p.status, render: (p) => <ProjectStatusBadge status={p.status} /> },
  ];
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Projects" title="Project review" sub="Verify that the project is real, works and matches its claims." />
      <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <AdminTable columns={cols} rows={data} caption="Projects" searchText={(p) => `${p.title} ${p.learnerName}`} onRowClick={(r) => setSel(r.id)} selectedId={sel} />
        <div className="xl:sticky xl:top-20 xl:self-start">
          {cur ? (
            <ReviewPanel key={cur.id} title={cur.title} busy={act.isPending} initialNote={cur.reviewerNotes ?? ""} approveLabel="Mark verified" rejectLabel="Send back to review" rejectNeedsNote={false}
              onApprove={(note) => act.mutate({ id: cur.id, s: "verified", note })} onReject={(note) => act.mutate({ id: cur.id, s: "under_review", note })}>
              <p className="text-muted">{cur.problem}</p><p>{cur.solution}</p><p><span className="font-semibold">Impact:</span> {cur.impact}</p><Link className="font-semibold text-brand underline" href={`/projects/${cur.id}`}>Open public view</Link>
              <button className="block text-sm font-semibold text-saffron-deep underline" onClick={() => act.mutate({ id: cur.id, s: "featured", note: cur.reviewerNotes ?? "" })}>Feature this project</button>
            </ReviewPanel>
          ) : <p className="rounded-2xl border border-dashed border-line p-6 text-center text-muted">Select a project to review it.</p>}
        </div>
      </div>
    </div>
  );
}
