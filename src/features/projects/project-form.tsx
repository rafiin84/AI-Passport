"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MagicWand } from "@phosphor-icons/react";
import { projectSchema } from "@/lib/validation";
import { createProject, suggestCategory } from "@/lib/api";
import { useAction } from "@/hooks/use-api";
import { PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChipSelect, ErrorSummary, SelectInput, TextArea, TextInput } from "@/components/ui/field";
import { CATEGORIES } from "@/mocks/recognition";
import { SKILLS } from "@/mocks/skills";
import { toast } from "@/store/toast";

type Values = z.infer<typeof projectSchema>;

export function ProjectForm() {
  const router = useRouter();
  const { register, control, handleSubmit, setValue, getValues, formState: { errors, submitCount } } = useForm<Values>({ resolver: zodResolver(projectSchema), defaultValues: { title: "", problem: "", solution: "", description: "", aiUsed: "", impact: "", category: "", skills: [], liveUrl: "", repositoryUrl: "", demoUrl: "" } });
  const create = useAction((v: Values) => createProject(v), { onSuccess: (p) => { toast.success("Project saved as draft"); router.push(`/projects/${p.id}`); } });
  const suggest = useAction(() => suggestCategory(`${getValues("title")} ${getValues("problem")} ${getValues("solution")}`), { onSuccess: (s) => { setValue("category", s.category, { shouldValidate: true }); if (!getValues("skills").length) setValue("skills", s.skills, { shouldValidate: true }); toast.info("Suggestion applied", "Suggestions are a starting point. Reviewers make the final call."); } });
  const errList = Object.entries(errors).map(([k, v]) => ({ id: k, message: String(v?.message ?? "") })).filter((e) => e.message);
  const [showSummary] = useState(true);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="New project" title="Tell us what you built" sub="Start with the problem. Reviewers read that first." />
      <form noValidate onSubmit={handleSubmit((v) => create.mutate(v))} className="space-y-6">
        {submitCount > 0 && showSummary && <ErrorSummary errors={errList} />}
        <TextInput label="Project title" required error={errors.title?.message} {...register("title")} />
        <TextArea label="The problem" required hint="Who has this problem, and why does it matter?" error={errors.problem?.message} {...register("problem")} />
        <TextArea label="Your solution" required hint="What did you build, in plain language?" error={errors.solution?.message} {...register("solution")} />
        <TextArea label="Description" required error={errors.description?.message} {...register("description")} />
        <div className="grid gap-4 sm:grid-cols-2"><TextInput label="How AI is used" required error={errors.aiUsed?.message} {...register("aiUsed")} /><TextInput label="Impact so far" required error={errors.impact?.message} hint="People helped, time saved, tests run" {...register("impact")} /></div>
        <div className="space-y-3 rounded-3xl border border-line bg-surface p-5">
          <div className="flex flex-wrap items-end gap-3"><div className="min-w-56 flex-1"><SelectInput label="Category" required options={CATEGORIES.map((c) => ({ value: c.id, label: c.name }))} placeholder="Choose a category" error={errors.category?.message} {...register("category")} /></div>
            <Button type="button" variant="soft" loading={suggest.isPending} onClick={() => suggest.mutate(undefined)}><MagicWand size={18} />Suggest category and skills</Button></div>
          <Controller control={control} name="skills" render={({ field }) => <div><ChipSelect label="Skills used" options={SKILLS.map((s) => s.name)} value={field.value.map((id) => SKILLS.find((s) => s.id === id)?.name ?? id)} onChange={(names) => field.onChange(names.map((n) => SKILLS.find((s) => s.name === n)!.id))} />{errors.skills && <p role="alert" id="skills" className="mt-1 text-sm font-medium text-danger">{errors.skills.message}</p>}</div>} />
        </div>
        <fieldset className="space-y-4 rounded-3xl border border-line bg-surface p-5"><legend className="px-2 font-semibold">Evidence links</legend><p className="text-sm text-muted">Add at least one so reviewers can see your work. Files aren't uploaded in this prototype.</p>
          <TextInput label="Live URL" type="url" placeholder="https://" error={errors.liveUrl?.message} {...register("liveUrl")} /><TextInput label="Repository" type="url" placeholder="https://github.com/…" error={errors.repositoryUrl?.message} {...register("repositoryUrl")} /><TextInput label="Demo video or walkthrough" type="url" placeholder="https://" error={errors.demoUrl?.message} {...register("demoUrl")} /></fieldset>
        <div className="flex gap-3"><Button type="submit" size="lg" loading={create.isPending}>Save draft</Button><Button href="/projects" size="lg" variant="ghost">Cancel</Button></div>
      </form>
    </div>
  );
}
