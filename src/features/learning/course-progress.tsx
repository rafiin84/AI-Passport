"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Certificate, Hourglass } from "@phosphor-icons/react";
import { useCourse, useAction, errorMessage, useProfile } from "@/hooks/use-api";
import { declareComplete, startCourse, updateProgress } from "@/lib/api";
import { PageHeader, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LevelBadge, StatusBadge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress";
import { VerificationStepper } from "@/components/courses/verification-stepper";
import { ExternalLinkGate } from "@/components/government/external-link";
import { Modal } from "@/components/ui/modal";
import { ErrorState, LoadingBlock } from "@/components/ui/states";
import { PROVIDERS } from "@/constants/providers";
import { toast } from "@/store/toast";

export function CourseProgress({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useCourse(id);
  const { data: user } = useProfile();
  const [confirm, setConfirm] = useState(false);
  const [local, setLocal] = useState<number | null>(null);
  const start = useAction(() => startCourse(id));
  const progress = useAction((v: number) => updateProgress(id, v), { silentError: true });
  const declare = useAction(() => declareComplete(id), { onSuccess: () => { setConfirm(false); toast.success("Marked complete", "Now show us what you learned."); } });
  if (isLoading) return <LoadingBlock label="Loading progress" />;
  if (error || !data) return <ErrorState title="Course not found" body={errorMessage(error)} onRetry={() => refetch()} />;
  const { course, enrollment, assessmentReady } = data;
  if (!enrollment) {
    return (
      <div className="mx-auto max-w-xl"><PageHeader title={course.title} sub="You haven't started this course yet." />
        <Button loading={start.isPending} size="lg" onClick={() => start.mutate(undefined)}>Start tracking this course</Button></div>
    );
  }
  const value = local ?? enrollment.progress;
  const learning = enrollment.state === "in_progress";
  const canVerify = ["assessment_ready", "not_verified"].includes(enrollment.state);
  const provider = PROVIDERS[course.provider];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader eyebrow="Course progress" title={course.title} sub={`${provider.name} · ${course.duration}`} action={<LevelBadge level={course.level} size="lg" />} />
      <Card className="p-6"><VerificationStepper state={enrollment.state} /></Card>

      <Card className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-6">
          <ProgressRing value={value} size={112} stroke={11} label="Course progress" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-center gap-2"><StatusBadge state={enrollment.state} /></div>
            {learning ? (
              <>
                <label htmlFor="prog" className="block font-semibold">How far are you in the course?</label>
                <input id="prog" type="range" min={0} max={100} step={5} value={value} onChange={(e) => setLocal(Number(e.target.value))} onPointerUp={() => local !== null && progress.mutate(local)} onKeyUp={() => local !== null && progress.mutate(local)} className="h-8 w-full accent-[var(--brand)]" aria-valuetext={`${value} percent`} />
                <p className="text-sm text-muted">Your progress is self-reported. Real completion is checked when you verify.</p>
              </>
            ) : <p className="text-muted">You declared this course complete.</p>}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <ExternalLinkGate href={course.url} providerName={provider.name} variant="secondary">Open on {provider.name}</ExternalLinkGate>
          {learning && <Button variant="saffron" onClick={() => setConfirm(true)}>I've finished this course</Button>}
          {canVerify && <Button variant="saffron" href={`/learning/${id}/verify`}>Show us what you learned <ArrowRight size={18} weight="bold" /></Button>}
          {enrollment.state === "evidence_required" && <Button variant="saffron" href={`/learning/${id}/practical`}>Do the practical task</Button>}
          {["evidence_submitted", "under_review", "credential_issued", "passed", "verified"].includes(enrollment.state) && <Button href={`/learning/${id}/result`}>See verification status</Button>}
        </div>
        {enrollment.state === "declared_complete" && !assessmentReady && (
          <div className="mt-5 flex gap-3 rounded-2xl bg-saffron-soft p-4 text-saffron-deep"><Hourglass size={24} className="shrink-0" aria-hidden="true" /><p className="text-sm"><strong>Assessment being prepared.</strong> Our team reviews every verification assessment before it can lead to a credential. We'll notify you when it's ready.</p></div>
        )}
      </Card>

      <Card className="p-6"><h2 className="flex items-center gap-2 font-display text-xl font-bold"><Certificate size={22} weight="duotone" className="text-brand" aria-hidden="true" />Why verify?</h2><p className="mt-2 text-muted">Certificates recognise learning. Finishing a video course doesn't prove you can do something with it, so we check with a short knowledge check and, where it matters, real work.</p></Card>

      <Modal open={confirm} onOpenChange={setConfirm} title="Finished the course?" description="Only declare completion when you've actually finished. You'll then verify what you learned.">
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button variant="secondary" onClick={() => setConfirm(false)}>Not yet</Button><Button variant="saffron" loading={declare.isPending} onClick={() => declare.mutate(undefined, { onSuccess: (e) => { if (e.state === "assessment_ready") router.push(`/learning/${id}/verify`); } })}>Yes, I've finished</Button></div>
      </Modal>
      {!user && null}
    </div>
  );
}
