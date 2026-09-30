"use client";
import Link from "next/link";
import { ShareNetwork } from "@phosphor-icons/react";
import { usePassport, errorMessage } from "@/hooks/use-api";
import { PassportCover } from "@/components/passport/passport-cover";
import { PassportTimeline, PassportSkillMap } from "@/components/passport/passport-parts";
import { BadgeCard } from "@/components/passport/badge-card";
import { ProjectCard } from "@/components/projects/project-card";
import { Card, SectionHeading } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/ui/states";
import { LevelBadge, Chip } from "@/components/ui/badge";
import { LEVELS } from "@/constants/levels";
import { formatDate } from "@/lib/utils";
import { toast } from "@/store/toast";
import { useT } from "@/hooks/use-t";

export function PassportPage() {
  const t = useT();
  const { data: p, isLoading, error, refetch } = usePassport();
  if (isLoading) return <LoadingBlock label="Opening your Passport" />;
  if (error || !p) return <ErrorState body={errorMessage(error)} onRetry={() => refetch()} />;
  const stamps = p.verifiedSkills.map((v) => ({ id: v.credentialId, label: v.skill.name }));
  const share = async () => {
    const url = `${window.location.origin}/profile/${p.user.id}`;
    try { await navigator.clipboard.writeText(url); toast.success("Link copied", "Your public profile shows only your name, state, level, verified skills and public projects."); } catch { toast.info("Copy this link", url); }
  };
  return (
    <div className="space-y-10">
      <section className="grid items-center gap-8 lg:grid-cols-[28rem_1fr]">
        <PassportCover name={p.user.name} state={`${p.user.city}, ${p.user.state}`} level={p.level} stamps={stamps} />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-saffron-deep">Your AI Passport</p>
          <h1 className="mt-1 font-display text-4xl font-extrabold sm:text-5xl">A living record of what you can do.</h1>
          <p className="mt-3 max-w-lg text-muted">Every stamp here was proved, not just claimed. Add courses, evidence and projects to grow it.</p>
          <div className="mt-5 flex flex-wrap gap-2"><Button onClick={share} variant="secondary"><ShareNetwork size={18} />Share my profile</Button><Button variant="ghost" href={`/profile/${p.user.id}`}>Preview public profile</Button></div>
          <dl className="mt-6 grid grid-cols-3 gap-3 text-center"><div className="rounded-2xl bg-surface p-3 shadow-card"><dd className="font-display text-3xl font-extrabold">{p.verifiedSkills.length}</dd><dt className="text-xs text-muted">Verified skills</dt></div><div className="rounded-2xl bg-surface p-3 shadow-card"><dd className="font-display text-3xl font-extrabold">{p.projects.filter((x) => x.status !== "draft").length}</dd><dt className="text-xs text-muted">Projects</dt></div><div className="rounded-2xl bg-surface p-3 shadow-card"><dd className="font-display text-3xl font-extrabold">{p.recognitions.length}</dd><dt className="text-xs text-muted">Recognitions</dt></div></dl>
        </div>
      </section>

      <section aria-labelledby="id-h"><SectionHeading title="Identity and capability" className="mb-4" />
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6"><h3 id="id-h" className="text-sm font-bold uppercase tracking-wider text-muted">Identity</h3><dl className="mt-3 space-y-1.5"><div className="flex justify-between gap-3"><dt className="text-muted">Name</dt><dd className="font-semibold">{p.user.name}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted">Location</dt><dd className="font-semibold">{p.user.city}, {p.user.state}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted">Education</dt><dd className="font-semibold">{p.user.education}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted">Field</dt><dd className="font-semibold">{p.user.field}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted">Aadhaar (masked)</dt><dd className="font-mono font-semibold">{p.user.maskedAadhaar}</dd></div></dl></Card>
          <Card className="p-6"><h3 className="text-sm font-bold uppercase tracking-wider text-muted">AI capability</h3>{p.level ? <><div className="mt-3"><LevelBadge level={p.level} size="lg" /></div><p className="mt-3 text-muted">{LEVELS[p.level].definition}</p></> : <p className="mt-3 text-muted">Take the AI Challenge to set your level.</p>}
            {p.nextSkill && <p className="mt-4 rounded-2xl bg-saffron-soft p-3 text-sm"><strong>Next recommended skill:</strong> {p.nextSkill.name}</p>}</Card>
        </div>
      </section>

      <section aria-labelledby="skills-h"><SectionHeading title="Verified skills" sub="Stamps and certificates you've earned." action={<Link href="/badges" className="text-sm font-semibold text-brand underline">All badges</Link>} className="mb-4" />
        {p.verifiedSkills.length === 0 ? <EmptyState title={t("empty.certs")} action={<Button href="/discover">Find a course</Button>} /> : <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{p.verifiedSkills.map((v) => <li key={v.credentialId}><BadgeCard id={v.credentialId} skill={v.skill.name} level={v.level} date={v.date} /></li>)}</ul>}
      </section>

      <section><SectionHeading title="Skill map" sub="Where you stand across the AI skill framework." className="mb-4" /><PassportSkillMap verified={p.verifiedSkills.map((v) => v.skill.id)} /></section>

      <section><SectionHeading title="Projects" action={<Button size="sm" href="/projects/new">New project</Button>} className="mb-4" />
        {p.projects.length === 0 ? <EmptyState title={t("empty.projects")} action={<Button href="/projects/new">Start a project</Button>} /> : <div className="grid gap-4 md:grid-cols-2">{p.projects.map((x) => <ProjectCard key={x.id} project={x} />)}</div>}
      </section>

      <section><SectionHeading title="Recognition" className="mb-4" />
        {p.recognitions.length === 0 ? <Card className="p-6 text-muted">No recognition yet. Recognition is project-first — verified projects can be submitted to a category. <Link className="font-semibold text-brand underline" href="/recognition">See categories</Link></Card> : <ul className="grid gap-3 md:grid-cols-2">{p.recognitions.map((r) => <li key={r.id} className="rounded-2xl border border-saffron bg-saffron-soft p-4"><Chip tone="saffron">Top 100 · {r.year}</Chip><p className="mt-2 font-display text-lg font-bold">{r.categoryName}</p><p className="text-sm text-muted">{r.projectTitle}</p></li>)}</ul>}
      </section>

      <section><SectionHeading title="Your journey" className="mb-4" /><PassportTimeline items={p.timeline} /></section>
      <p className="text-sm text-muted">Last updated {formatDate(new Date("2026-09-29").toISOString())}.</p>
    </div>
  );
}
