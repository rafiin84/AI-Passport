"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { adminListEvidence, adminReviewEvidence } from "@/lib/api";
import { useAction } from "@/hooks/use-api";
import { AdminTable, type Column } from "@/components/admin/admin-table";
import { ReviewPanel } from "@/components/admin/review-panel";
import { PageHeader } from "@/components/ui/card";
import { Chip } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingBlock } from "@/components/ui/states";
import { formatDate } from "@/lib/utils";
import { assessmentForCourse } from "@/mocks/assessments/verification";
import type { Evidence } from "@/types";

type Row = Evidence & { learnerName: string; courseTitle: string };

export function EvidenceReview() {
  const { data } = useQuery({ queryKey: ["admin-evidence"], queryFn: adminListEvidence });
  const [sel, setSel] = useState<string>();
  const review = useAction((v: { id: string; d: "approved" | "rejected"; note: string }) => adminReviewEvidence(v.id, v.d, v.note), { success: "Review saved" });
  if (!data) return <LoadingBlock />;
  const cur = data.find((e) => e.id === sel);
  const rubric = cur ? assessmentForCourse(cur.courseId)?.practical?.rubric : undefined;
  const cols: Column<Row>[] = [
    { key: "l", header: "Learner", sortValue: (e) => e.learnerName, render: (e) => <span className="font-semibold">{e.learnerName}</span> },
    { key: "c", header: "Course", render: (e) => <span className="line-clamp-2 min-w-40">{e.courseTitle}</span> },
    { key: "t", header: "Type", render: (e) => e.type },
    { key: "d", header: "Submitted", sortValue: (e) => e.submittedAt, render: (e) => formatDate(e.submittedAt) },
    { key: "s", header: "Status", sortValue: (e) => e.status, render: (e) => <Chip tone={e.status === "approved" ? "green" : e.status === "rejected" ? "danger" : "saffron"}>{e.status.replace("_", " ")}</Chip> },
  ];
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Evidence" title="Evidence review" sub="Check practical evidence against the rubric. Approving issues the learner's credential." />
      <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <AdminTable columns={cols} rows={data} caption="Evidence submissions" searchText={(e) => `${e.learnerName} ${e.courseTitle}`} onRowClick={(r) => setSel(r.id)} selectedId={sel} />
        <div className="xl:sticky xl:top-20 xl:self-start">
          {cur ? (
            <ReviewPanel key={cur.id} title={cur.courseTitle} busy={review.isPending} initialNote={cur.reviewerNote ?? ""} onApprove={(note) => review.mutate({ id: cur.id, d: "approved", note })} onReject={(note) => review.mutate({ id: cur.id, d: "rejected", note })} approveLabel="Approve and issue credential">
              <p><strong>{cur.learnerName}</strong> · {cur.type}</p><p className="text-muted">{cur.note}</p>
              <Button variant="secondary" size="sm" href={cur.url} external>Open evidence <ArrowSquareOut size={14} /></Button>
              {rubric && <div className="rounded-xl bg-surface-2 p-3"><p className="mb-1 font-semibold">Rubric</p><ul className="space-y-1">{rubric.map((r) => <li key={r.criterion} className="flex justify-between gap-3"><span>{r.criterion}</span><span className="text-muted">{r.weight}%</span></li>)}</ul></div>}
              <p className="text-xs text-muted">Prototype links point to example addresses.</p>
            </ReviewPanel>
          ) : <p className="rounded-2xl border border-dashed border-line p-6 text-center text-muted">Select a submission to review it.</p>}
        </div>
      </div>
    </div>
  );
}
