"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { startVerification, submitEvidence } from "@/lib/api";
import { errorMessage, useAction } from "@/hooks/use-api";
import { PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorState, LoadingBlock } from "@/components/ui/states";
import { EvidenceUploader, type EvidenceDraft } from "@/components/projects/evidence-uploader";

export function EvidencePage({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["evidence-form", id], queryFn: () => startVerification(id), retry: false });
  const [items, setItems] = useState<EvidenceDraft[]>([]);
  const submit = useAction(() => submitEvidence(id, items), { onSuccess: () => router.push(`/learning/${id}/result`) });
  if (isLoading) return <LoadingBlock />;
  if (error || !data) return <ErrorState body={errorMessage(error)} onRetry={() => refetch()} />;
  const required = data.assessment?.practical?.requiredEvidence ?? data.course.evidenceTypes;
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader eyebrow="Evidence submission" title="Add your evidence" sub={data.assessment?.practical?.brief ?? data.course.title} />
      <EvidenceUploader types={required.length ? required : ["url"]} items={items} onChange={setItems} />
      <div className="sticky bottom-20 md:static"><Button size="lg" variant="saffron" block disabled={items.length === 0} loading={submit.isPending} onClick={() => submit.mutate(undefined)}>Send to reviewers</Button></div>
      <p className="text-sm text-muted">A human reviewer will check your evidence against the rubric. Please only share links you're happy for reviewers to open.</p>
    </div>
  );
}
