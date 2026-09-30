"use client";
import Link from "next/link";
import { useEnrollments, errorMessage } from "@/hooks/use-api";
import { PageHeader, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, LevelBadge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { CourseThumb } from "@/components/courses/course-thumb";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/ui/states";
import { PROVIDERS } from "@/constants/providers";

const CTA: Record<string, [string, string]> = {
  in_progress: ["Continue", ""], declared_complete: ["Check status", ""], assessment_ready: ["Show what you learned", "/verify"], evidence_required: ["Submit evidence", "/evidence"],
  evidence_submitted: ["See status", "/result"], under_review: ["See status", "/result"], not_verified: ["Try again", "/verify"], credential_issued: ["View result", "/result"], verified: ["View result", "/result"], passed: ["View result", "/result"], not_started: ["Start", ""],
};

export function MyLearning() {
  const { data, isLoading, error, refetch } = useEnrollments();
  if (isLoading) return <LoadingBlock label="Loading your learning" />;
  if (error) return <ErrorState body={errorMessage(error)} onRetry={() => refetch()} />;
  const active = data?.filter((e) => e.state !== "credential_issued") ?? [];
  const done = data?.filter((e) => e.state === "credential_issued") ?? [];
  return (
    <div>
      <PageHeader eyebrow="My learning" title="What you're learning" sub="Learn on the provider's site. Come back here to track it, declare it complete and show us what you learned." action={<Button href="/discover" variant="secondary">Find a course</Button>} />
      {!data?.length ? <EmptyState title="No courses yet" body="Pick a course matched to your level and start learning." action={<Button href="/discover">Explore AI skills</Button>} /> : (
        <div className="space-y-8">
          <section aria-labelledby="active-h"><h2 id="active-h" className="mb-3 font-display text-2xl font-bold">In progress and to prove</h2>
            {active.length === 0 ? <p className="text-muted">You're all caught up.</p> : <div className="grid gap-4 md:grid-cols-2">{active.map((e) => {
              const [label, suffix] = CTA[e.state] ?? ["Open", ""];
              return (
                <Card key={e.id} className="flex flex-col overflow-hidden sm:flex-row">
                  <div className="sm:w-40"><CourseThumb course={e.course} className="h-28 sm:h-full" /></div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <div className="flex flex-wrap gap-2"><LevelBadge level={e.course.level} size="sm" /><StatusBadge state={e.state} /></div>
                    <h3 className="font-display text-lg font-bold leading-snug">{e.course.title}</h3>
                    <p className="text-sm text-muted">{PROVIDERS[e.course.provider].name}</p>
                    <ProgressBar value={e.progress} label={`${e.course.title} progress`} />
                    <div className="mt-2"><Button size="sm" href={`/learning/${e.courseId}${suffix}`}>{label}</Button></div>
                  </div>
                </Card>
              );
            })}</div>}
          </section>
          {done.length > 0 && <section aria-labelledby="done-h"><h2 id="done-h" className="mb-3 font-display text-2xl font-bold">Completed and verified</h2><ul className="grid grid-cols-1 gap-3 md:grid-cols-2">{done.map((e) => <li key={e.id} className="min-w-0"><Link href={`/learning/${e.courseId}/result`} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 hover:bg-surface-2"><span className="min-w-0"><span className="block truncate font-semibold">{e.course.title}</span><span className="text-sm text-muted">{PROVIDERS[e.course.provider].name}</span></span><StatusBadge state={e.state} /></Link></li>)}</ul></section>}
        </div>
      )}
    </div>
  );
}
