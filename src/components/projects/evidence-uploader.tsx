"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash, LinkSimple } from "@phosphor-icons/react";
import { evidenceSchema } from "@/lib/validation";
import { SelectInput, TextInput, TextArea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import type { EvidenceType } from "@/types";

export type EvidenceDraft = z.infer<typeof evidenceSchema>;
const LABEL: Record<EvidenceType, string> = { url: "Live URL", repository: "Code repository", demo: "Demo link", screenshot: "Screenshots (link)", video: "Video (link)", project: "Project write-up (link)" };

/** Evidence is submitted as links in this prototype — no files are uploaded or stored. */
export function EvidenceUploader({ types, items, onChange }: { types: EvidenceType[]; items: EvidenceDraft[]; onChange: (v: EvidenceDraft[]) => void }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EvidenceDraft>({ resolver: zodResolver(evidenceSchema), defaultValues: { type: types[0] ?? "url", url: "", note: "" } });
  return (
    <div className="space-y-5">
      <form noValidate onSubmit={handleSubmit((v) => { onChange([...items, v]); reset({ type: v.type, url: "", note: "" }); })} className="space-y-4 rounded-3xl border border-line bg-surface p-5">
        <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
          <SelectInput label="Type" options={types.map((t) => ({ value: t, label: LABEL[t] }))} error={errors.type?.message} {...register("type")} />
          <TextInput label="Link" type="url" placeholder="https://" error={errors.url?.message} hint="Public link to your work. Files aren't uploaded in this prototype." {...register("url")} />
        </div>
        <TextArea label="What does this show?" placeholder="One or two sentences for the reviewer" error={errors.note?.message} {...register("note")} />
        <Button type="submit" variant="soft"><Plus size={18} weight="bold" />Add this evidence</Button>
      </form>
      <ul className="space-y-2" aria-label="Evidence added">
        {items.map((e, i) => (
          <li key={i} className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2 p-3"><LinkSimple size={20} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
            <div className="min-w-0 flex-1"><p className="text-sm font-bold">{LABEL[e.type]}</p><p className="truncate text-sm text-brand">{e.url}</p><p className="text-sm text-muted">{e.note}</p></div>
            <button type="button" aria-label={`Remove ${LABEL[e.type]}`} onClick={() => onChange(items.filter((_, j) => j !== i))} className="grid size-10 place-items-center rounded-full text-muted hover:bg-surface-3"><Trash size={18} /></button></li>
        ))}
      </ul>
    </div>
  );
}
