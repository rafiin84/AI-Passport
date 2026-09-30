"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminGetRecognition, adminListProjects, adminSaveCategory, adminSaveRubric, adminScoreProject, adminSetRecognitionStatus } from "@/lib/api";
import { useAction } from "@/hooks/use-api";
import { AdminTable, type Column } from "@/components/admin/admin-table";
import { PageHeader, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/badge";
import { SelectInput, TextInput } from "@/components/ui/field";
import { LoadingBlock } from "@/components/ui/states";
import { Modal } from "@/components/ui/modal";
import type { Recognition, RubricCriterion } from "@/types";

type Row = Recognition & { learnerName: string; projectTitle: string };

export function Top100Admin() {
  const { data } = useQuery({ queryKey: ["admin-recognition"], queryFn: adminGetRecognition });
  const projects = useQuery({ queryKey: ["admin-projects"], queryFn: adminListProjects });
  const [cat, setCat] = useState("ai-education");
  const [newCat, setNewCat] = useState("");
  const [scoring, setScoring] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [rubric, setRubric] = useState<RubricCriterion[] | null>(null);
  const setStatus = useAction((v: { id: string; s: Recognition["status"] }) => adminSetRecognitionStatus(v.id, v.s), { success: "Updated" });
  const saveCat = useAction((v: Parameters<typeof adminSaveCategory>[0]) => adminSaveCategory(v), { success: "Category saved" });
  const score = useAction(() => adminScoreProject({ projectId: scoring!, category: cat, scores }), { success: "Scored and ranked", onSuccess: () => setScoring(null) });
  const saveRubric = useAction((r: RubricCriterion[]) => adminSaveRubric(r), { success: "Rubric saved" });
  if (!data) return <LoadingBlock />;
  const r = rubric ?? data.rubric;
  const total = r.reduce((s, c) => s + c.weight, 0);
  const category = data.categories.find((c) => c.id === cat);
  const rows: Row[] = data.recognitions.filter((x) => x.category === cat).sort((a, b) => a.rank - b.rank);
  const candidates = projects.data?.filter((p) => (p.status === "verified" || p.status === "featured") && !rows.some((x) => x.projectId === p.id)) ?? [];
  const cols: Column<Row>[] = [
    { key: "k", header: "#", sortValue: (x) => x.rank, render: (x) => x.rank },
    { key: "p", header: "Project", render: (x) => <div className="min-w-44"><p className="font-semibold">{x.projectTitle}</p><p className="text-xs text-muted">{x.learnerName}</p></div> },
    { key: "s", header: "Rubric score", sortValue: (x) => x.rubricScore, render: (x) => <span className="tabular-nums font-bold">{x.rubricScore}</span> },
    { key: "st", header: "Status", render: (x) => <Chip tone={x.status === "published" ? "green" : x.status === "shortlisted" ? "saffron" : "neutral"}>{x.status}</Chip> },
    { key: "a", header: "Actions", render: (x) => <div className="flex flex-wrap gap-1"><Button size="sm" variant="ghost" onClick={() => { setScoring(x.projectId); setScores(x.rubricBreakdown); }}>Score</Button>
      {x.status !== "published" && <Button size="sm" onClick={() => setStatus.mutate({ id: x.id, s: "published" })}>Publish</Button>}
      {x.status === "published" && <Button size="sm" variant="secondary" onClick={() => setStatus.mutate({ id: x.id, s: "unpublished" })}>Unpublish</Button>}
      <Button size="sm" variant="ghost" onClick={() => setStatus.mutate({ id: x.id, s: "archived" })}>Archive</Button></div> },
  ];
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Top 100" title="Recognition management" sub="Project-first. Nothing is published to the public until a human reviewer publishes it." />
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end"><SelectInput label="Category" value={cat} onChange={(e) => setCat(e.target.value)} options={data.categories.map((c) => ({ value: c.id, label: `${c.name} (${c.status})` }))} />
        {category && <div className="flex gap-2"><Button variant="secondary" onClick={() => saveCat.mutate({ id: category.id, name: category.name, status: category.status === "published" ? "archived" : "published" })}>{category.status === "published" ? "Archive category" : "Publish category"}</Button></div>}</div>
      <AdminTable columns={cols} rows={rows} caption={`Recognition entries for ${category?.name}`} empty="No projects shortlisted in this category yet." />
      {candidates.length > 0 && <Card className="p-5"><h2 className="font-display text-lg font-bold">Verified projects not yet scored</h2><ul className="mt-3 flex flex-wrap gap-2">{candidates.map((p) => <li key={p.id}><Button size="sm" variant="soft" onClick={() => { setScoring(p.id); setScores({}); }}>Score “{p.title}”</Button></li>)}</ul></Card>}
      <Card className="space-y-3 p-5"><h2 className="font-display text-lg font-bold">Create category</h2><div className="flex flex-wrap items-end gap-3"><div className="min-w-56 flex-1"><TextInput label="Category name" value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="e.g. AI for Sports" /></div><Button disabled={newCat.trim().length < 3} onClick={() => { saveCat.mutate({ name: newCat.trim(), status: "draft" }); setNewCat(""); }}>Add draft category</Button></div></Card>
      <Card className="space-y-3 p-5"><h2 className="font-display text-lg font-bold">Rubric</h2><p className="text-sm text-muted">Published rubric criteria and weights. Weights must total 100%.</p>
        <ul className="space-y-2">{r.map((c, i) => <li key={c.id} className="grid grid-cols-[1fr_6rem] gap-2"><input aria-label={`Criterion ${i + 1} label`} value={c.label} onChange={(e) => setRubric(r.map((x) => (x.id === c.id ? { ...x, label: e.target.value } : x)))} className="h-11 rounded-xl border border-line bg-surface px-3" /><input aria-label={`${c.label} weight`} type="number" min={0} value={c.weight} onChange={(e) => setRubric(r.map((x) => (x.id === c.id ? { ...x, weight: Number(e.target.value) } : x)))} className="h-11 rounded-xl border border-line bg-surface px-3" /></li>)}</ul>
        <div className="flex items-center gap-3"><Button disabled={total !== 100 || !rubric} loading={saveRubric.isPending} onClick={() => saveRubric.mutate(r)}>Save rubric</Button><span className={`text-sm font-semibold ${total === 100 ? "text-india-green" : "text-danger"}`}>Total {total}%</span></div></Card>

      <Modal open={!!scoring} onOpenChange={(o) => !o && setScoring(null)} title="Score project" description="Score each criterion from 0 to 10. The weighted result sets the rank." className="max-w-xl">
        <ul className="space-y-3">{data.rubric.map((c) => <li key={c.id}><label className="flex items-center justify-between gap-3 text-sm font-semibold" htmlFor={`sc-${c.id}`}><span>{c.label} <span className="text-muted">({c.weight}%)</span></span><output className="tabular-nums">{scores[c.id] ?? 0}</output></label><input id={`sc-${c.id}`} type="range" min={0} max={10} value={scores[c.id] ?? 0} onChange={(e) => setScores({ ...scores, [c.id]: Number(e.target.value) })} className="h-8 w-full accent-[var(--brand)]" /></li>)}</ul>
        <div className="mt-5 flex justify-end gap-2"><Button variant="secondary" onClick={() => setScoring(null)}>Cancel</Button><Button loading={score.isPending} onClick={() => score.mutate(undefined)}>Save score</Button></div>
      </Modal>
    </div>
  );
}
