"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { adminGetLearner, adminListLearners } from "@/lib/api";
import { AdminTable, type Column } from "@/components/admin/admin-table";
import { PageHeader, Card } from "@/components/ui/card";
import { Avatar } from "@/components/learner/avatar";
import { Chip, LevelBadge, StatusBadge } from "@/components/ui/badge";
import { LoadingBlock, ErrorState } from "@/components/ui/states";
import { errorMessage } from "@/hooks/use-api";
import { formatDate } from "@/lib/utils";
import type { User } from "@/types";

type Row = User & { credentialCount: number; courseCount: number; projectCount: number };

export function LearnersDirectory() {
  const { data } = useQuery({ queryKey: ["admin-learners"], queryFn: adminListLearners });
  if (!data) return <LoadingBlock />;
  const cols: Column<Row>[] = [
    { key: "n", header: "Learner", sortValue: (u) => u.name, render: (u) => <Link href={`/admin/learners/${u.id}`} className="flex min-w-48 items-center gap-3 font-semibold text-brand hover:underline"><Avatar name={u.name} hue={u.avatarHue} size={36} />{u.name}</Link> },
    { key: "a", header: "Age", sortValue: (u) => u.age, render: (u) => <span>{u.age} {u.ageEligibility === "youth_eligible" && <Chip tone="green">youth</Chip>}</span> },
    { key: "s", header: "State", sortValue: (u) => u.state, render: (u) => `${u.city}, ${u.state}` },
    { key: "l", header: "Level", sortValue: (u) => u.currentLevel ?? "", render: (u) => u.currentLevel ? <LevelBadge level={u.currentLevel} size="sm" /> : <span className="text-muted">—</span> },
    { key: "c", header: "Credentials", sortValue: (u) => u.credentialCount, render: (u) => u.credentialCount },
    { key: "co", header: "Courses", sortValue: (u) => u.courseCount, render: (u) => u.courseCount },
    { key: "p", header: "Projects", sortValue: (u) => u.projectCount, render: (u) => u.projectCount },
  ];
  return <div className="space-y-6"><PageHeader eyebrow="Learners" title="Learner directory" sub={`${data.length} sample learners. Identity numbers are always masked.`} /><AdminTable columns={cols} rows={data} caption="Learners" searchText={(u) => `${u.name} ${u.state} ${u.city}`} /></div>;
}

export function LearnerDetail({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-learner", id], queryFn: () => adminGetLearner(id), retry: false });
  if (isLoading) return <LoadingBlock />;
  if (error || !data) return <ErrorState body={errorMessage(error)} />;
  const u = data.user;
  return (
    <div className="space-y-6">
      <p className="text-sm"><Link href="/admin/learners" className="underline">← Learners</Link></p>
      <header className="flex flex-wrap items-center gap-4"><Avatar name={u.name} hue={u.avatarHue} size={72} /><div><h1 className="font-display text-3xl font-extrabold">{u.name}</h1><p className="text-muted">{u.city}, {u.state} · Age {u.age} · {u.education} · {u.field}</p><div className="mt-2 flex gap-2">{u.currentLevel && <LevelBadge level={u.currentLevel} />}<Chip tone={u.ageEligibility === "youth_eligible" ? "green" : "neutral"}>{u.ageEligibility === "youth_eligible" ? "Youth eligible" : "General learner"}</Chip></div></div></header>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5"><h2 className="font-display text-lg font-bold">Profile</h2><dl className="mt-3 space-y-1.5 text-sm"><div className="flex justify-between"><dt className="text-muted">Aadhaar (masked)</dt><dd className="font-mono">{u.maskedAadhaar}</dd></div><div className="flex justify-between"><dt className="text-muted">AI experience</dt><dd>{u.aiExperience}</dd></div><div className="flex justify-between gap-4"><dt className="text-muted">Goals</dt><dd className="text-right">{u.goals.join(", ")}</dd></div><div className="flex justify-between gap-4"><dt className="text-muted">Interests</dt><dd className="text-right">{u.interests.join(", ")}</dd></div><div className="flex justify-between"><dt className="text-muted">Language</dt><dd>{u.preferredLanguage === "hi" ? "हिन्दी" : "English"}</dd></div></dl></Card>
        <Card className="p-5"><h2 className="font-display text-lg font-bold">Learning</h2>{data.learning.length ? <ul className="mt-3 space-y-2">{data.learning.map((l) => <li key={l.courseId} className="flex items-center justify-between gap-3 text-sm"><span className="min-w-0 truncate">{l.title}</span><StatusBadge state={l.state} /></li>)}</ul> : <p className="mt-3 text-sm text-muted">No courses yet.</p>}</Card>
        <Card className="p-5"><h2 className="font-display text-lg font-bold">Credentials</h2>{data.credentials.length ? <ul className="mt-3 space-y-1.5 text-sm">{data.credentials.map((c) => <li key={c.id} className="flex justify-between gap-3"><span>{data.verifiedSkills.find((v) => v.credentialId === c.id)?.skill.name} · {c.type}</span><span className="text-muted">{formatDate(c.issuedAt)}</span></li>)}</ul> : <p className="mt-3 text-sm text-muted">None yet.</p>}</Card>
        <Card className="p-5"><h2 className="font-display text-lg font-bold">Projects</h2>{data.projects.length ? <ul className="mt-3 space-y-1.5 text-sm">{data.projects.map((p) => <li key={p.id} className="flex justify-between gap-3"><Link className="font-semibold text-brand hover:underline" href={`/projects/${p.id}`}>{p.title}</Link><Chip>{p.status.replace("_", " ")}</Chip></li>)}</ul> : <p className="mt-3 text-sm text-muted">None yet.</p>}</Card>
      </div>
    </div>
  );
}
