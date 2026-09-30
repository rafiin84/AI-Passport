"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Certificate, CheckCircle, Clock, Hammer, ListChecks, Translate, UserCircle, WarningCircle } from "@phosphor-icons/react";
import { useCourse, useProfile, useAction, errorMessage } from "@/hooks/use-api";
import { startCourse } from "@/lib/api";
import { CourseThumb } from "@/components/courses/course-thumb";
import { ProviderBadge } from "@/components/courses/provider-badge";
import { LevelBadge, SkillChip, StatusBadge, Chip } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLinkGate } from "@/components/government/external-link";
import { ErrorState, LoadingBlock } from "@/components/ui/states";
import { PROVIDERS } from "@/constants/providers";
import { skillName } from "@/mocks/skills";
import { formatPrice } from "@/lib/utils";
import type { EvidenceType } from "@/types";

const EVIDENCE_LABEL: Record<EvidenceType, string> = { url: "Live URL", repository: "Code repository", demo: "Demo", screenshot: "Screenshots", video: "Video", project: "Project write-up" };

export function CourseDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useCourse(id);
  const { data: user } = useProfile();
  const start = useAction(() => startCourse(id));
  if (isLoading) return <LoadingBlock label="Loading course" />;
  if (error || !data) return <ErrorState title="Course not found" body={errorMessage(error)} onRetry={() => refetch()} />;
  const { course, enrollment, assessmentReady } = data;
  const provider = PROVIDERS[course.provider];
  const verified = course.sourceMetadata.urlStatus === "verified";

  return (
    <div className="mx-auto max-w-5xl">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted"><Link className="hover:underline" href="/discover">Discover</Link> <span aria-hidden="true">/</span> <span className="text-fg">{course.title}</span></nav>
      <div className="overflow-hidden rounded-[2rem] border border-line bg-surface shadow-card">
        <CourseThumb course={course} className="h-40 sm:h-56" />
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_20rem]">
          <div>
            <div className="flex flex-wrap items-center gap-2"><LevelBadge level={course.level} />{course.featured && <Chip tone="saffron">Featured</Chip>}{enrollment && <StatusBadge state={enrollment.state} />}</div>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{course.title}</h1>
            <p className="mt-3 text-lg text-muted">{course.description}</p>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div><dt className="text-muted">Provider</dt><dd className="mt-0.5"><ProviderBadge provider={course.provider} plain /></dd></div>
              <div><dt className="text-muted">Instructor</dt><dd className="mt-0.5 flex items-center gap-1 font-semibold"><UserCircle size={16} aria-hidden="true" />{course.instructor}</dd></div>
              <div><dt className="text-muted">Duration</dt><dd className="mt-0.5 flex items-center gap-1 font-semibold"><Clock size={16} aria-hidden="true" />{course.duration}</dd></div>
              <div><dt className="text-muted">Language</dt><dd className="mt-0.5 flex items-center gap-1 font-semibold"><Translate size={16} aria-hidden="true" />{course.languages.join(", ")}</dd></div>
            </dl>
          </div>
          <aside className="space-y-3 rounded-3xl bg-surface-2 p-5" aria-label="Start this course">
            <p className="font-display text-2xl font-bold">{formatPrice(course)}</p>
            <p className="text-sm text-muted">{course.format}{course.hasProject ? " · includes a project" : ""}</p>
            <ExternalLinkGate href={course.url} providerName={provider.name} variant="saffron" size="lg" block onProceed={() => { if (user) start.mutate(undefined, { onSuccess: () => router.push(`/learning/${course.id}`) }); }}>
              {enrollment ? `Open on ${provider.name}` : `Learn on ${provider.name}`}
            </ExternalLinkGate>
            {enrollment && <Button href={`/learning/${course.id}`} variant="secondary" block>Go to my progress</Button>}
            {!user && <p className="text-xs text-muted"><Link className="font-semibold text-brand underline" href="/register">Register</Link> to track progress and verify what you learn.</p>}
            <p className="flex gap-2 text-xs text-muted"><WarningCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />{verified ? "Direct link to the course page." : "This link opens the provider's search for this topic. Confirm price and details there."}</p>
          </aside>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <Card className="p-6"><h2 className="font-display text-2xl font-bold">What you'll learn</h2><ul className="mt-4 grid gap-3 sm:grid-cols-2">{course.learningOutcomes.map((o) => <li key={o} className="flex gap-2.5"><CheckCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-india-green" aria-hidden="true" /><span>{o}</span></li>)}</ul></Card>
          {course.buildOutcomes.length > 0 && <Card className="p-6"><h2 className="flex items-center gap-2 font-display text-2xl font-bold"><Hammer size={24} weight="duotone" className="text-saffron-deep" aria-hidden="true" />What you'll build</h2><ul className="mt-4 space-y-2">{course.buildOutcomes.map((o) => <li key={o} className="rounded-2xl bg-surface-2 p-3 font-medium">{o}</li>)}</ul></Card>}
          <Card className="p-6"><h2 className="font-display text-2xl font-bold">Course outline</h2><ol className="mt-4 divide-y divide-line">{course.sections.map((s, i) => <li key={s.title} className="flex items-center justify-between gap-3 py-3"><span className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand">{i + 1}</span><span className="font-medium">{s.title}</span></span>{s.lessons > 0 && <span className="text-sm text-muted">{s.lessons} lessons</span>}</li>)}</ol></Card>
        </div>
        <div className="space-y-6">
          <Card className="p-6"><h2 className="font-display text-xl font-bold">Skills you can verify</h2><div className="mt-3 flex flex-wrap gap-1.5">{course.skills.map((s) => <SkillChip key={s}>{skillName(s)}</SkillChip>)}</div>
            {course.prerequisites.length > 0 && <><h3 className="mt-5 text-sm font-bold uppercase tracking-wider text-muted">Before you start</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{course.prerequisites.map((p) => <li key={p}>{p}</li>)}</ul></>}</Card>
          <Card className="p-6"><h2 className="flex items-center gap-2 font-display text-xl font-bold"><ListChecks size={22} weight="duotone" className="text-brand" aria-hidden="true" />How we verify it</h2>
            {assessmentReady ? (
              <ul className="mt-3 space-y-2 text-sm"><li>1. Declare the course complete here.</li><li>2. Pass a short knowledge check (70% to pass).</li>{course.evidenceTypes.length > 0 && <li>3. Submit evidence: {course.evidenceTypes.map((e) => EVIDENCE_LABEL[e]).join(", ")}.</li>}<li className="flex items-center gap-1.5 font-semibold text-india-green"><Certificate size={18} weight="fill" aria-hidden="true" />Then get your badge and certificate.</li></ul>
            ) : <p className="mt-3 text-sm text-muted">The verification assessment for this course is being prepared and will be reviewed by our team before it can lead to a credential.</p>}
          </Card>
          <p className="text-xs text-muted">Curated {course.sourceMetadata.curatedOn}. {course.sourceMetadata.note}</p>
        </div>
      </div>
    </div>
  );
}
