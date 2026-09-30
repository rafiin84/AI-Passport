"use client";
import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowSquareOut, Code, GlobeHemisphereWest, PlayCircle } from "@phosphor-icons/react";
import { getProject, submitProject } from "@/lib/api";
import { errorMessage, useAction } from "@/hooks/use-api";
import { Avatar } from "@/components/learner/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip, LevelBadge, ProjectStatusBadge, SkillChip } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { SelectInput } from "@/components/ui/field";
import { ErrorState, LoadingBlock } from "@/components/ui/states";
import { CATEGORIES } from "@/mocks/recognition";
import { skillName } from "@/mocks/skills";
import { toast } from "@/store/toast";

export function ProjectDetail({ id }: { id: string }) {
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["project", id], queryFn: () => getProject(id), retry: false });
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState("");
  const submit = useAction((c: string) => submitProject(id, c), { onSuccess: () => { setOpen(false); toast.success("Submitted for recognition", "A reviewer will look at it soon."); refetch(); } });
  if (isLoading) return <LoadingBlock />;
  if (error || !data) return <ErrorState title="Project not found" body={errorMessage(error)} onRetry={() => refetch()} />;
  const { project: p, owner, mine } = data;
  const links = [{ href: p.liveUrl, label: "Live project", icon: GlobeHemisphereWest }, { href: p.repositoryUrl, label: "Repository", icon: Code }, { href: p.demoUrl, label: "Demo", icon: PlayCircle }].filter((l) => l.href);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div><div className="flex flex-wrap items-center gap-2"><ProjectStatusBadge status={p.status} /><Chip tone="brand">{CATEGORIES.find((c) => c.id === (p.recognitionCategory ?? p.category))?.name ?? p.category}</Chip></div>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight">{p.title}</h1>
        <Link href={`/profile/${owner.id}`} className="mt-3 inline-flex items-center gap-3 hover:underline"><Avatar name={owner.name} hue={owner.avatarHue} size={40} /><span><span className="block font-semibold">{owner.name}</span><span className="text-sm text-muted">{owner.state}{owner.age ? ` · ${owner.age}` : ""}</span></span>{owner.currentLevel && <LevelBadge level={owner.currentLevel} size="sm" />}</Link></div>
      <div className="grid gap-4 md:grid-cols-2"><Card className="p-6"><h2 className="text-sm font-bold uppercase tracking-wider text-saffron-deep">The problem</h2><p className="mt-2 text-lg">{p.problem}</p></Card><Card className="p-6"><h2 className="text-sm font-bold uppercase tracking-wider text-india-green">The solution</h2><p className="mt-2 text-lg">{p.solution}</p></Card></div>
      <Card className="p-6"><dl className="grid gap-5 sm:grid-cols-2"><div><dt className="text-sm font-bold uppercase tracking-wider text-muted">How AI is used</dt><dd className="mt-1">{p.aiUsed}</dd></div><div><dt className="text-sm font-bold uppercase tracking-wider text-muted">Impact</dt><dd className="mt-1">{p.impact}</dd></div></dl>
        <div className="mt-5 flex flex-wrap gap-1.5">{p.skills.map((s) => <SkillChip key={s}>{skillName(s)}</SkillChip>)}</div></Card>
      {links.length > 0 && <Card className="p-6"><h2 className="font-display text-xl font-bold">Evidence</h2><ul className="mt-3 grid gap-2 sm:grid-cols-3">{links.map((l) => <li key={l.label}><Button variant="secondary" block href={l.href} external><l.icon size={18} aria-hidden="true" />{l.label}<ArrowSquareOut size={14} aria-hidden="true" /></Button></li>)}</ul><p className="mt-3 text-xs text-muted">Links open in a new tab and are hosted outside AI Passport. Prototype links point to example addresses.</p></Card>}
      {mine && p.status === "draft" && <div className="flex flex-wrap items-center gap-3 rounded-3xl bg-brand-soft p-5"><div className="flex-1"><p className="font-display text-lg font-bold">Ready for reviewers?</p><p className="text-sm text-muted">Submit to a recognition category. You can't be ranked by certificates alone — your project is what counts.</p></div><Button variant="saffron" onClick={() => { setCat(p.category); setOpen(true); }}>Submit for recognition</Button></div>}
      {mine && p.status !== "draft" && <Card className="p-5 text-sm text-muted">Status: <strong className="text-fg">{p.status.replace("_", " ")}</strong>. Reviewers may contact you through notifications. Reviewer notes are internal and never shown publicly.</Card>}
      <Modal open={open} onOpenChange={setOpen} title="Submit for recognition" description="Choose the category that best fits the problem you're solving.">
        <SelectInput label="Category" options={CATEGORIES.filter((c) => c.status === "published").map((c) => ({ value: c.id, label: c.name }))} value={cat} onChange={(e) => setCat(e.target.value)} placeholder="Choose" />
        <div className="mt-5 flex justify-end gap-2"><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button variant="saffron" disabled={!cat} loading={submit.isPending} onClick={() => submit.mutate(cat)}>Submit</Button></div>
      </Modal>
    </div>
  );
}
