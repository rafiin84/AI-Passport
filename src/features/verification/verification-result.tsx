"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Hourglass, Medal, Rocket } from "@phosphor-icons/react";
import { useCourse, useAction, errorMessage, useCredentials } from "@/hooks/use-api";
import { demoApproveMyEvidence } from "@/lib/api";
import { PageHeader, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/badge";
import { VerificationStepper } from "@/components/courses/verification-stepper";
import { CertificatePreview } from "@/components/passport/certificate";
import { ErrorState, LoadingBlock } from "@/components/ui/states";
import { toast } from "@/store/toast";

export function VerificationResult({ id }: { id: string }) {
  const { data, isLoading, error, refetch } = useCourse(id);
  const { data: creds } = useCredentials();
  const approve = useAction(() => demoApproveMyEvidence(id), { onSuccess: () => toast.success("Reviewer approved (demo)", "Your certificate is ready.") });
  if (isLoading) return <LoadingBlock />;
  if (error || !data?.enrollment) return <ErrorState body={errorMessage(error)} onRetry={() => refetch()} />;
  const { enrollment: e, course } = data;
  const cred = creds?.find((c) => c.id === e.credentialId);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader eyebrow="Verification result" title={course.title} />
      <Card className="p-6"><VerificationStepper state={e.state} /></Card>

      {(e.state === "under_review" || e.state === "evidence_submitted") && (
        <Card className="p-8 text-center">
          <motion.div animate={{ rotate: [0, 12, -12, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="mx-auto mb-3 grid size-16 place-items-center rounded-full bg-brand-soft text-brand"><Hourglass size={34} weight="duotone" /></motion.div>
          <h2 className="font-display text-3xl font-extrabold">We're checking your evidence.</h2>
          <p className="mx-auto mt-2 max-w-md text-muted">A reviewer will look at your work against the published rubric. You'll get a notification when it's done.</p>
          <div className="mx-auto mt-6 max-w-md rounded-2xl border border-dashed border-saffron p-4 text-left"><Chip tone="saffron">Prototype only</Chip><p className="mt-2 text-sm text-muted">There's no real reviewer in this prototype. Use the button to simulate an approval and see the credential flow. Admins can also approve from <Link className="underline" href="/admin/evidence">the Evidence console</Link>.</p>
            <Button className="mt-3" variant="secondary" size="sm" loading={approve.isPending} onClick={() => approve.mutate(undefined)}>Simulate reviewer approval</Button></div>
        </Card>
      )}

      {e.state === "credential_issued" && (
        <>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[2rem] bg-gradient-to-br from-india-green to-[#0b5a06] p-8 text-center text-white"><p className="text-sm font-bold uppercase tracking-widest text-white/80">Verified</p><h2 className="font-display text-4xl font-extrabold">You proved it.</h2><p className="mt-1 text-white/90">Your credential is issued and added to your AI Praman.</p></motion.div>
          {cred && <CertificatePreview credentialId={cred.id} />}
          <div className="grid gap-3 sm:grid-cols-2"><Button href="/passport" size="lg" variant="secondary"><Medal size={20} />Open my AI Praman</Button><Button href="/projects/new" size="lg" variant="saffron"><Rocket size={20} />Build a project with this skill</Button></div>
        </>
      )}

      {e.state === "not_verified" && <Card className="p-6"><h2 className="font-display text-2xl font-bold">Not verified yet</h2><p className="mt-1 text-muted">That's okay — you can retry the knowledge check or resubmit evidence.</p><div className="mt-4 flex gap-3"><Button href={`/learning/${id}/verify`}>Retry the knowledge check</Button><Button variant="secondary" href={`/learning/${id}/evidence`}>Resubmit evidence</Button></div></Card>}
      {["in_progress", "declared_complete", "assessment_ready", "evidence_required", "passed", "verified"].includes(e.state) && <Card className="p-6"><p className="text-muted">Verification isn't finished yet.</p><Button className="mt-3" href={`/learning/${id}`}>Back to my progress</Button></Card>}
    </div>
  );
}
