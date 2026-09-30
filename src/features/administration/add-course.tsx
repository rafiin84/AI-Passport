"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Sparkle } from "@phosphor-icons/react";
import { analyzeSchema } from "@/lib/validation";
import { adminAnalyzeCourse, adminSaveCourse } from "@/lib/api";
import { useAction } from "@/hooks/use-api";
import { PageHeader, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TextArea, TextInput, SelectInput } from "@/components/ui/field";
import { Chip } from "@/components/ui/badge";
import { CourseEditor, draftToValues, type EditorValues } from "./course-editor";
import { PROVIDERS } from "@/constants/providers";
import type { CourseAnalysis, ProviderId } from "@/types";
import { toast } from "@/store/toast";

type Values = z.infer<typeof analyzeSchema> & { provider?: string };
const STEPS = ["Paste URL", "AI analyses", "Review metadata", "Generate assessment", "Publish"];

export function AddCourse() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [analysis, setAnalysis] = useState<{ a: CourseAnalysis; title: string; provider: ProviderId; url: string; desc?: string } | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({ resolver: zodResolver(analyzeSchema) });
  const analyze = useAction((v: Values) => adminAnalyzeCourse({ url: v.url, title: v.title || undefined, description: v.description || undefined, provider: (v.provider || undefined) as ProviderId | undefined }).then((r) => ({ ...r, v })), {
    onSuccess: (r) => { setAnalysis({ a: r.analysis, title: r.title, provider: (r.provider as ProviderId) ?? "udemy", url: r.v.url, desc: r.v.description }); setStep(2); },
  });
  const save = useAction(adminSaveCourse, { onSuccess: (c) => { toast.success("Draft saved", "Now generate the assessment."); router.push(`/admin/courses/${c.id}/assessment?new=1`); } });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Add course" title="Paste a URL. Review. Publish." sub="AI drafts everything. A human approves every word before a learner sees it." />
      <ol className="grid grid-cols-5 gap-1" aria-label="Workflow">{STEPS.map((s, i) => <li key={s} aria-current={i === step ? "step" : undefined} className={`rounded-full px-2 py-1.5 text-center text-[0.7rem] font-semibold sm:text-xs ${i < step ? "bg-green-soft text-india-green" : i === step ? "bg-saffron text-[#1a1000]" : "bg-surface-2 text-muted"}`}>{s}</li>)}</ol>

      {step < 2 && (
        <Card className="max-w-2xl p-6">
          {analyze.isPending ? (
            <div role="status" className="space-y-4 py-6 text-center"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="mx-auto grid size-14 place-items-center rounded-full bg-brand-soft text-brand"><Sparkle size={30} weight="fill" /></motion.div><p className="font-display text-xl font-bold">Analysing the course…</p><p className="text-sm text-muted">Reading title, description and outcomes. Drafting level, skills, audience and verification.</p></div>
          ) : (
            <form noValidate onSubmit={handleSubmit((v) => { setStep(1); analyze.mutate(v, { onError: () => setStep(0) }); })} className="space-y-4">
              <TextInput label="Course URL" placeholder="https://www.udemy.com/course/…" required error={errors.url?.message} {...register("url")} />
              <div className="grid gap-4 sm:grid-cols-2"><SelectInput label="Provider" placeholder="Detect automatically" options={Object.values(PROVIDERS).map((p) => ({ value: p.id, label: p.name }))} {...register("provider")} /><TextInput label="Title (optional)" {...register("title")} /></div>
              <TextArea label="Description or syllabus (optional)" hint="Paste any text you have. More detail gives a better draft." {...register("description")} />
              <Button type="submit" size="lg" variant="saffron"><Sparkle size={20} weight="fill" />Analyse with AI</Button>
              <p className="text-xs text-muted">Tip: paste the featured course URL <span className="break-all font-mono">https://www.udemy.com/course/ai-sdlc-building-with-claude-code-on-zoho-cloud</span> to see a full draft.</p>
            </form>
          )}
        </Card>
      )}

      {step === 2 && analysis && (
        <div className="space-y-5">
          <Card className="flex flex-wrap items-center gap-3 border-saffron bg-saffron-soft p-5"><Chip tone="saffron">AI draft</Chip><p className="flex-1 text-sm text-saffron-deep"><strong>Confidence {Math.round(analysis.a.confidence * 100)}%.</strong> {analysis.a.confidence < 0.7 ? "Limited source information — check everything carefully." : "Review each field before saving."}</p></Card>
          <Card className="space-y-2 p-5 text-sm"><h2 className="font-display text-lg font-bold">AI summary of the approach</h2><p><strong>Assessment approach:</strong> {analysis.a.assessmentApproach}</p><p><strong>Practical verification:</strong> {analysis.a.practicalVerification}</p></Card>
          <CourseEditor initial={draftToValues({ url: analysis.url, provider: analysis.provider, title: analysis.title, description: analysis.a.summary, level: analysis.a.suggestedLevel, skills: analysis.a.skills, categories: analysis.a.categories, domains: analysis.a.domains, targetProfiles: analysis.a.audience, ageRange: analysis.a.ageRange, prerequisites: analysis.a.prerequisites, learningOutcomes: analysis.a.learningOutcomes, verificationType: analysis.a.verificationType, evidenceTypes: analysis.a.evidenceRequirements, hasProject: analysis.a.evidenceRequirements.length > 0 } as EditorValuesSeed)}
            saving={save.isPending} onSave={(d) => save.mutate(d)} submitLabel="Save draft and generate assessment" />
        </div>
      )}
    </div>
  );
}
type EditorValuesSeed = Parameters<typeof draftToValues>[0];
export type { EditorValues };
