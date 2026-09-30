"use client";
import { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { CourseCard } from "@/components/courses/course-card";
import { Button } from "@/components/ui/button";
import { ChipSelect, SelectInput, TextArea, TextInput } from "@/components/ui/field";
import { LEVELS, LEVEL_ORDER } from "@/constants/levels";
import { PROVIDERS } from "@/constants/providers";
import { SKILLS } from "@/mocks/skills";
import { OCCUPATIONS } from "@/constants/site";
import type { Course, EvidenceType, LevelId, PriceType, ProfileSuitability, ProviderId, VerificationType, CourseFormat } from "@/types";
import type { CourseDraft } from "@/lib/api";

const THUMBS = [["#ffb347", "#e0710a", "Lightning"], ["#38bdf8", "#1d4ed8", "Compass"], ["#a78bfa", "#5b21b6", "Cube"], ["#34d399", "#047857", "Leaf"], ["#fb7185", "#9f1239", "Heartbeat"], ["#2dd4bf", "#0f766e", "Translate"]] as const;
const EVIDENCE: EvidenceType[] = ["url", "repository", "demo", "screenshot", "video", "project"];
const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

export interface EditorValues {
  url: string; provider: ProviderId; title: string; description: string; level: LevelId; skills: string[]; categories: string; domains: string; ageMin: number; ageMax: number; languages: string;
  durationHours: number; price: number; priceType: PriceType; format: CourseFormat; hasProject: boolean; targetProfiles: string[]; prerequisites: string; learningOutcomes: string; buildOutcomes: string;
  verificationType: VerificationType; evidenceTypes: string[]; thumb: number;
}

export function draftToValues(c: Partial<Course> & { url: string }): EditorValues {
  const t = THUMBS.findIndex(([f]) => f === c.thumbnail?.from);
  return {
    url: c.url, provider: c.provider ?? "udemy", title: c.title ?? "", description: c.description ?? "", level: c.level ?? "starter", skills: c.skills ?? [], categories: (c.categories ?? []).join(", "), domains: (c.domains ?? []).join(", "),
    ageMin: c.ageRange?.[0] ?? 15, ageMax: c.ageRange?.[1] ?? 99, languages: (c.languages ?? ["English"]).join(", "), durationHours: c.durationHours ?? 4, price: c.price ?? 0, priceType: c.priceType ?? "free",
    format: c.format ?? "Video", hasProject: c.hasProject ?? false, targetProfiles: c.targetProfiles ?? ["all"], prerequisites: (c.prerequisites ?? []).join("\n"), learningOutcomes: (c.learningOutcomes ?? []).join("\n"), buildOutcomes: (c.buildOutcomes ?? []).join("\n"),
    verificationType: c.verificationType ?? "mcq", evidenceTypes: c.evidenceTypes ?? [], thumb: Math.max(0, t),
  };
}

export function valuesToDraft(v: EditorValues, base?: Partial<Course>): CourseDraft {
  const [from, to, icon] = THUMBS[v.thumb]!;
  return {
    id: base?.id, provider: v.provider, title: v.title, url: v.url, description: v.description, level: v.level, skills: v.skills, categories: v.categories.split(",").map((x) => x.trim()).filter(Boolean), domains: v.domains.split(",").map((x) => x.trim()).filter(Boolean),
    duration: `${v.durationHours} hrs`, durationHours: Number(v.durationHours), languages: v.languages.split(",").map((x) => x.trim()).filter(Boolean), price: Number(v.price), priceType: v.priceType, format: v.format, hasProject: v.hasProject,
    targetProfiles: v.targetProfiles as ProfileSuitability[], ageRange: [Number(v.ageMin), Number(v.ageMax)], prerequisites: lines(v.prerequisites), learningOutcomes: lines(v.learningOutcomes), buildOutcomes: lines(v.buildOutcomes),
    verificationType: v.verificationType, evidenceTypes: v.evidenceTypes as EvidenceType[], featured: base?.featured ?? false, status: base?.status ?? "draft", thumbnail: { from, to, icon }, instructor: base?.instructor,
  };
}

export function CourseEditor({ initial, base, onSave, saving, submitLabel = "Save draft" }: { initial: EditorValues; base?: Partial<Course>; onSave: (d: CourseDraft) => void; saving?: boolean; submitLabel?: string }) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<EditorValues>({ defaultValues: initial });
  const values = useWatch({ control }) as EditorValues;
  const preview = useMemo<Course>(() => {
    const d = valuesToDraft({ ...initial, ...values }, base);
    return { ...d, id: "preview", instructor: d.instructor ?? "", thumbnail: d.thumbnail!, sections: [], verificationAssessmentId: null, sourceMetadata: { urlStatus: "provider-search", curatedOn: "", note: "" }, createdAt: "", updatedAt: "" } as Course;
  }, [values, initial, base]);

  return (
    <form noValidate onSubmit={handleSubmit((v) => onSave(valuesToDraft(v, base)))} className="grid gap-8 xl:grid-cols-[1fr_22rem]">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-[1fr_12rem]"><TextInput label="Course URL" required error={errors.url?.message} {...register("url", { required: "Add the course URL" })} /><SelectInput label="Provider" options={Object.values(PROVIDERS).map((p) => ({ value: p.id, label: p.name }))} {...register("provider")} /></div>
        <TextInput label="Title" required error={errors.title?.message} {...register("title", { required: "Add a title" })} />
        <TextArea label="Description" {...register("description")} />
        <div className="grid gap-4 sm:grid-cols-3"><SelectInput label="Level" options={LEVEL_ORDER.map((l) => ({ value: l, label: LEVELS[l].name }))} {...register("level")} /><SelectInput label="Format" options={["Video", "Self-paced", "Live cohort", "Project-based", "Text + labs"]} {...register("format")} /><TextInput label="Duration (hours)" type="number" step="0.5" min="0.5" {...register("durationHours", { valueAsNumber: true })} /></div>
        <Controller control={control} name="skills" render={({ field }) => <ChipSelect label="Skills" options={SKILLS.map((s) => s.name)} value={field.value.map((id) => SKILLS.find((s) => s.id === id)?.name ?? id)} onChange={(n) => field.onChange(n.map((x) => SKILLS.find((s) => s.name === x)!.id))} />} />
        <div className="grid gap-4 sm:grid-cols-2"><TextInput label="Categories" hint="Comma separated" {...register("categories")} /><TextInput label="Domains" hint="Comma separated, e.g. Agriculture" {...register("domains")} /></div>
        <div className="grid gap-4 sm:grid-cols-3"><TextInput label="Minimum age" type="number" min="10" {...register("ageMin", { valueAsNumber: true })} /><TextInput label="Maximum age" type="number" max="99" {...register("ageMax", { valueAsNumber: true })} /><TextInput label="Languages" hint="Comma separated" {...register("languages")} /></div>
        <div className="grid gap-4 sm:grid-cols-3"><SelectInput label="Price type" options={[{ value: "free", label: "Free" }, { value: "free_audit", label: "Free to audit" }, { value: "paid", label: "Paid" }, { value: "subscription", label: "Subscription" }]} {...register("priceType")} /><TextInput label="Price (₹)" type="number" min="0" {...register("price", { valueAsNumber: true })} /><label className="flex min-h-12 items-center gap-3 self-end rounded-2xl border border-line bg-surface px-4"><input type="checkbox" className="size-5 accent-[var(--brand)]" {...register("hasProject")} /><span className="font-medium">Includes a project</span></label></div>
        <Controller control={control} name="targetProfiles" render={({ field }) => <ChipSelect label="Target learners" options={["all", ...OCCUPATIONS.map((o) => o.value)]} value={field.value} onChange={(v) => field.onChange(v.length ? v : ["all"])} />} />
        <div className="grid gap-4 sm:grid-cols-2"><TextArea label="Prerequisites" hint="One per line" {...register("prerequisites")} /><TextArea label="Learning outcomes" hint="One per line" {...register("learningOutcomes")} /></div>
        <TextArea label="What learners will build" hint="One per line" {...register("buildOutcomes")} />
        <fieldset className="space-y-4 rounded-3xl border border-line bg-surface p-5"><legend className="px-2 font-semibold">Verification</legend>
          <SelectInput label="Verification type" options={[{ value: "mcq", label: "Quiz (MCQ)" }, { value: "scenario", label: "Scenario" }, { value: "practical", label: "Practical task" }, { value: "mixed", label: "Quiz + practical" }]} {...register("verificationType")} />
          <Controller control={control} name="evidenceTypes" render={({ field }) => <ChipSelect label="Evidence required" options={EVIDENCE} value={field.value} onChange={field.onChange} />} /></fieldset>
        <fieldset><legend className="mb-2 text-sm font-semibold">Thumbnail</legend><div className="flex flex-wrap gap-3">{THUMBS.map(([f, t], i) => <label key={f} className="cursor-pointer"><input type="radio" value={i} className="peer sr-only" {...register("thumb", { valueAsNumber: true })} /><span className="block size-14 rounded-2xl ring-offset-2 ring-offset-[var(--bg)] peer-checked:ring-4 peer-checked:ring-[var(--brand)] peer-focus-visible:ring-4" style={{ background: `linear-gradient(135deg, ${f}, ${t})` }}><span className="sr-only">Style {i + 1}</span></span></label>)}</div></fieldset>
        <Button type="submit" size="lg" loading={saving}>{submitLabel}</Button>
      </div>
      <aside className="xl:sticky xl:top-20 xl:self-start"><p className="mb-2 text-sm font-bold uppercase tracking-wider text-muted">Learner card preview</p><CourseCard course={preview} /></aside>
    </form>
  );
}
