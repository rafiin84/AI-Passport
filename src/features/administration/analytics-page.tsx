"use client";
import { useQuery } from "@tanstack/react-query";
import { adminAnalytics } from "@/lib/api";
import { PageHeader, Card } from "@/components/ui/card";
import { StatTile } from "@/components/admin/stat-tile";
import { BarChart } from "@/components/admin/bar-chart";
import { LoadingBlock } from "@/components/ui/states";
import { LEVELS } from "@/constants/levels";
import { PROVIDERS } from "@/constants/providers";
import { pct } from "@/lib/utils";

const LABELS: Record<string, string> = { registrations: "Registrations", eligibleYouth: "Eligible youth (15–29)", activeLearners: "Active learners", assessmentStarts: "Assessment starts", assessmentCompletions: "Assessment completions", courseOpens: "Course opens", completionDeclarations: "Completion declarations", verificationAttempts: "Verification attempts", credentialsIssued: "Credentials issued", projectsSubmitted: "Projects submitted", verifiedProjects: "Verified projects", recognitionShortlisted: "Recognition shortlisted" };

export function AnalyticsPage() {
  const { data } = useQuery({ queryKey: ["admin-analytics"], queryFn: adminAnalytics });
  if (!data) return <LoadingBlock />;
  const top = data.funnel[0]!.count;
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Analytics" title="Programme analytics" sub="Sample figures for demonstration. Analytics support the programme; they aren't the learner experience." />
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">{Object.entries(data.totals).map(([k, v]) => <StatTile key={k} label={LABELS[k] ?? k} value={v} />)}</dl>
      <div className="grid gap-4 lg:grid-cols-2">
        <BarChart title="Level distribution" data={data.levelDistribution.map((l) => ({ label: LEVELS[l.level].name, value: l.count, color: LEVELS[l.level].to }))} />
        <BarChart title="Top states by registrations" data={data.stateDistribution.map((s) => ({ label: s.state, value: s.count }))} color="var(--saffron)" />
        <BarChart title="Age distribution" data={data.ageDistribution.map((a) => ({ label: a.band, value: a.count }))} color="var(--india-green)" />
        <BarChart title="Skill demand" data={data.skillDemand.map((s) => ({ label: s.skill, value: s.count }))} />
        <BarChart title="Provider demand (course opens)" data={data.providerDemand.map((p) => ({ label: PROVIDERS[p.provider].name, value: p.opens, color: PROVIDERS[p.provider].color }))} />
        <Card className="p-5"><h2 className="font-display text-lg font-bold">Funnel</h2><ol className="mt-4 space-y-2">{data.funnel.map((f) => <li key={f.stage}><div className="mb-1 flex justify-between text-sm"><span className="font-medium">{f.stage}</span><span className="tabular-nums text-muted">{f.count.toLocaleString("en-IN")} · {pct(f.count, top)}%</span></div><div className="h-3 overflow-hidden rounded-full bg-surface-3"><div className="h-full rounded-full bg-gradient-to-r from-saffron to-brand" style={{ width: `${pct(f.count, top)}%` }} /></div></li>)}</ol></Card>
      </div>
      <Card className="overflow-x-auto p-5"><h2 className="font-display text-lg font-bold">Weekly trend</h2><table className="mt-3 w-full min-w-[24rem] text-sm"><caption className="sr-only">Weekly registrations and verifications</caption><thead><tr className="text-left text-muted"><th className="py-1">Week</th><th className="py-1 text-right">Registrations</th><th className="py-1 text-right">Verifications</th></tr></thead><tbody>{data.weekly.map((w) => <tr key={w.week} className="border-t border-line"><td className="py-1.5">{w.week}</td><td className="py-1.5 text-right tabular-nums">{w.registrations.toLocaleString("en-IN")}</td><td className="py-1.5 text-right tabular-nums">{w.verifications.toLocaleString("en-IN")}</td></tr>)}</tbody></table></Card>
    </div>
  );
}
