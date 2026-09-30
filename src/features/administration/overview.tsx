"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { adminAnalytics, adminListEvidence, adminListProjects, adminListAssessments } from "@/lib/api";
import { PageHeader, Card } from "@/components/ui/card";
import { StatTile } from "@/components/admin/stat-tile";
import { BarChart } from "@/components/admin/bar-chart";
import { LoadingBlock } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { LEVELS } from "@/constants/levels";

export function AdminOverview() {
  const a = useQuery({ queryKey: ["admin-analytics"], queryFn: adminAnalytics });
  const ev = useQuery({ queryKey: ["admin-evidence"], queryFn: adminListEvidence });
  const pr = useQuery({ queryKey: ["admin-projects"], queryFn: adminListProjects });
  const as = useQuery({ queryKey: ["admin-assessments"], queryFn: adminListAssessments });
  if (!a.data) return <LoadingBlock />;
  const t = a.data.totals;
  const queues = [
    { label: "Evidence waiting", n: ev.data?.filter((e) => e.status === "submitted" || e.status === "under_review").length ?? 0, href: "/admin/evidence" },
    { label: "Projects to review", n: pr.data?.filter((p) => p.status === "submitted" || p.status === "under_review").length ?? 0, href: "/admin/projects" },
    { label: "Assessments awaiting approval", n: as.data?.filter((x) => x.reviewStatus !== "approved").length ?? 0, href: "/admin/assessments" },
  ];
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Kartik · Admin console" title="Overview" sub="What needs a human today." action={<Button href="/admin/courses/new" variant="saffron">Add a course</Button>} />
      <section aria-label="Review queues" className="grid gap-4 sm:grid-cols-3">{queues.map((q) => <Link key={q.label} href={q.href} className="rounded-3xl border border-line bg-surface p-6 shadow-card hover:border-saffron"><p className="font-display text-5xl font-extrabold tabular-nums">{q.n}</p><p className="mt-1 font-semibold">{q.label}</p></Link>)}</section>
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Registrations" value={t.registrations!} /><StatTile label="Active learners" value={t.activeLearners!} /><StatTile label="Credentials issued" value={t.credentialsIssued!} /><StatTile label="Projects submitted" value={t.projectsSubmitted!} />
      </dl>
      <div className="grid gap-4 lg:grid-cols-2">
        <BarChart title="Learners by level" data={a.data.levelDistribution.map((l) => ({ label: LEVELS[l.level].name, value: l.count, color: LEVELS[l.level].to }))} />
        <Card className="p-5"><h2 className="font-display text-lg font-bold">Learner journey funnel</h2><ol className="mt-4 space-y-2">{a.data.funnel.map((f, i) => <li key={f.stage} className="flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-4 py-2.5"><span className="font-medium">{i + 1}. {f.stage}</span><span className="tabular-nums font-bold">{f.count.toLocaleString("en-IN")}</span></li>)}</ol><Link href="/admin/analytics" className="mt-3 inline-block text-sm font-semibold text-brand underline">Full analytics</Link></Card>
      </div>
    </div>
  );
}
