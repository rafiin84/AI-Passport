"use client";
import { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useCourses, useProfile, useRecommendations, errorMessage } from "@/hooks/use-api";
import { CourseCard } from "@/components/courses/course-card";
import { CardGridSkeleton, EmptyState, ErrorState } from "@/components/ui/states";
import { PageHeader, SectionHeading } from "@/components/ui/card";
import { LEVEL_ORDER, LEVELS } from "@/constants/levels";
import { PROVIDERS } from "@/constants/providers";
import { cn } from "@/lib/utils";
import type { LevelId, ProviderId } from "@/types";
import { Button } from "@/components/ui/button";

export function DiscoverView() {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<LevelId | "">("");
  const [provider, setProvider] = useState<ProviderId | "">("");
  const [free, setFree] = useState(false);
  const { data: user } = useProfile();
  const query = { q: q || undefined, level: level || undefined, provider: provider || undefined, free: free || undefined };
  const { data: courses, isLoading, error, refetch, isFetching } = useCourses(query);
  const { data: recs } = useRecommendations(3);
  const filtered = !!(q || level || provider || free);

  return (
    <div>
      <PageHeader eyebrow="Discover" title="Your next moves" sub="Courses from trusted platforms, matched to your level. Learn anywhere — prove it here." />
      {user?.currentLevel && recs && !filtered && (
        <section aria-labelledby="foryou" className="mb-10">
          <SectionHeading title="Picked for you" sub={`Based on your ${LEVELS[user.currentLevel].name} level, goals and interests.`} className="mb-4" />
          <div className="grid gap-4 md:grid-cols-3">{recs.map((c) => <CourseCard key={c.id} course={c} reason={c.level === user.currentLevel ? "Right at your level" : "A step up for you"} />)}</div>
        </section>
      )}
      <section aria-labelledby="all">
        <h2 id="all" className="sr-only">All courses</h2>
        <div className="sticky top-14 z-20 -mx-4 mb-6 space-y-3 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 md:top-14">
          <div className="relative">
            <MagnifyingGlass size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input value={q} onChange={(e) => setQ(e.target.value)} type="search" aria-label="Search courses" placeholder="Search prompts, agents, farming, healthcare…" className="h-12 w-full rounded-full border border-line bg-surface pl-12 pr-4 text-base" />
          </div>
          <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by level">
            {(["", ...LEVEL_ORDER] as (LevelId | "")[]).map((l) => (
              <button key={l || "all"} aria-pressed={level === l} onClick={() => setLevel(l)} className={cn("min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold", level === l ? "border-brand bg-brand text-brand-fg" : "border-line bg-surface hover:bg-surface-2")}>{l ? LEVELS[l].name : "All levels"}</button>
            ))}
            <span className="mx-1 h-6 w-px shrink-0 bg-line" aria-hidden="true" />
            <label className="sr-only" htmlFor="prov">Provider</label>
            <select id="prov" value={provider} onChange={(e) => setProvider(e.target.value as ProviderId | "")} className="min-h-10 shrink-0 rounded-full border border-line bg-surface px-3 text-sm font-semibold">
              <option value="">All providers</option>{Object.values(PROVIDERS).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button aria-pressed={free} onClick={() => setFree(!free)} className={cn("min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold", free ? "border-india-green bg-green-soft text-india-green" : "border-line bg-surface hover:bg-surface-2")}>Free options</button>
          </div>
        </div>
        <p className="mb-4 text-sm text-muted" aria-live="polite">{isLoading ? "Loading courses…" : `${courses?.length ?? 0} course${courses?.length === 1 ? "" : "s"}${isFetching ? " · updating" : ""}`}</p>
        {error ? <ErrorState body={errorMessage(error)} onRetry={() => refetch()} /> : isLoading ? <CardGridSkeleton /> : courses && courses.length === 0 ? (
          <EmptyState title="Nothing matches yet" body="Try removing a filter or searching for a different skill." action={<Button variant="secondary" onClick={() => { setQ(""); setLevel(""); setProvider(""); setFree(false); }}>Clear filters</Button>} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{courses?.map((c) => <CourseCard key={c.id} course={c} />)}</div>
        )}
        <p className="mt-8 text-sm text-muted">Prices, durations and links are curated snapshots and may change on the provider's site. Providers are independent of AI Passport; no partnership is implied.</p>
      </section>
    </div>
  );
}
