"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Certificate, Medal, Rocket, SealCheck, Target, Path } from "@phosphor-icons/react";
import { useEnrollments, usePassport, useProfile, useRecommendations, useBaselineResult, useCredentials } from "@/hooks/use-api";
import { Card, SectionHeading } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LevelBadge, StatusBadge, Chip } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress";
import { CourseThumb } from "@/components/courses/course-thumb";
import { RecommendationCard } from "@/components/learner/recommendation-card";
import { LoadingBlock } from "@/components/ui/states";
import { LEVELS, LEVEL_ORDER, nextLevelOf } from "@/constants/levels";
import { useT } from "@/hooks/use-t";
import { formatDate } from "@/lib/utils";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

export function Dashboard() {
  const t = useT();
  const { data: user } = useProfile();
  const { data: enrollments } = useEnrollments();
  const { data: passport } = usePassport();
  const { data: recs } = useRecommendations(3);
  const { data: result } = useBaselineResult();
  const { data: creds } = useCredentials();
  if (!user || !enrollments || !passport) return <LoadingBlock label="Loading your dashboard" />;

  const level = user.currentLevel;
  const next = level ? nextLevelOf(level) : null;
  const current = enrollments.filter((e) => e.state === "in_progress").sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0];
  const toProve = enrollments.filter((e) => ["declared_complete", "assessment_ready", "evidence_required", "not_verified"].includes(e.state));
  const inReview = enrollments.filter((e) => ["evidence_submitted", "under_review"].includes(e.state));
  const latestBadge = creds?.[0];
  const project = passport.projects.find((p) => p.status !== "draft") ?? passport.projects[0];
  const hasVerifiedProject = passport.projects.some((p) => p.status === "verified" || p.status === "featured");
  const first = user.name.split(" ")[0];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
      {level ? (
        <motion.section variants={item} aria-labelledby="hero-h" className="relative overflow-hidden rounded-[2rem] p-7 text-white shadow-lift sm:p-10" style={{ background: `linear-gradient(135deg, ${LEVELS[level].from}, ${LEVELS[level].to})` }}>
          <div className="jaali absolute inset-0 opacity-30 mix-blend-overlay" aria-hidden="true" />
          <div className="relative">
            <p className="text-sm font-semibold text-white/85">Namaste, {first}</p>
            <h1 id="hero-h" className="mt-1 font-display text-4xl font-extrabold sm:text-6xl">{t("dash.hero.title", { level: LEVELS[level].name })}</h1>
            {next && <p className="mt-3 max-w-xl text-lg text-white/90">{t("dash.hero.sub", { next: LEVELS[next].name })}</p>}
            <ol className="mt-6 flex max-w-lg items-center gap-1.5" aria-label="Level ladder">{LEVEL_ORDER.map((l) => <li key={l} className="flex-1"><div className={`h-2 rounded-full ${LEVELS[level].index >= LEVELS[l].index ? "bg-white" : "bg-white/30"}`} /><span className="mt-1 block text-[0.68rem] font-semibold text-white/80">{LEVELS[l].short}</span></li>)}</ol>
            <div className="mt-6 flex flex-wrap gap-3"><Button href="/path" variant="secondary" className="border-0">See my path <ArrowRight size={18} weight="bold" /></Button><Button href="/passport" variant="ghost" className="text-white hover:bg-white/15">Open my AI Praman</Button></div>
          </div>
        </motion.section>
      ) : (
        <motion.section variants={item} className="rounded-[2rem] bg-[#0b1b3a] p-8 text-white shadow-lift sm:p-12">
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{t("dash.noLevel.title")}</h1>
          <p className="mt-3 max-w-xl text-lg text-white/80">{t("dash.noLevel.sub")}</p>
          <Button href="/assessment" size="lg" variant="saffron" className="mt-6">Start the AI Challenge <ArrowRight size={20} weight="bold" /></Button>
        </motion.section>
      )}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
        <motion.div variants={item} className="lg:col-span-3">
          <Card className="h-full p-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted"><Rocket size={18} aria-hidden="true" />Current course</div>
            {current ? (
              <div className="flex items-center gap-4">
                <div className="hidden w-32 shrink-0 overflow-hidden rounded-2xl sm:block"><CourseThumb course={current.course} className="h-24" /></div>
                <div className="min-w-0 flex-1"><h2 className="line-clamp-2 font-display text-xl font-bold">{current.course.title}</h2><p className="text-sm text-muted">Pick up where you left off</p><Button href={`/learning/${current.courseId}`} size="sm" className="mt-3">Continue learning</Button></div>
                <ProgressRing value={current.progress} label="Course progress" />
              </div>
            ) : <div><p className="font-display text-xl font-bold">Nothing in progress</p><p className="mt-1 text-muted">Pick a course matched to your level.</p><Button href="/discover" size="sm" className="mt-3">Explore AI skills</Button></div>}
          </Card>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-3">
          <Card className="h-full p-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted"><SealCheck size={18} aria-hidden="true" />{t("dash.prove")}</div>
            {toProve.length + inReview.length === 0 ? <p className="text-muted">Nothing waiting. When you finish a course, declare it complete and we'll check what you learned.</p> : (
              <ul className="space-y-3">
                {toProve.map((e) => <li key={e.id} className="flex items-center justify-between gap-3 rounded-2xl bg-saffron-soft p-3"><span className="min-w-0"><span className="block truncate font-semibold">{e.course.title}</span><StatusBadge state={e.state} /></span><Button size="sm" variant="saffron" href={`/learning/${e.courseId}/verify`}>Verify</Button></li>)}
                {inReview.map((e) => <li key={e.id} className="flex items-center justify-between gap-3 rounded-2xl bg-brand-soft p-3"><span className="min-w-0"><span className="block truncate font-semibold">{e.course.title}</span><span className="text-sm text-muted">We're checking your evidence.</span></span><Link href={`/learning/${e.courseId}/result`} className="text-sm font-semibold text-brand underline">Status</Link></li>)}
              </ul>
            )}
          </Card>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-2"><Card className="h-full p-6"><div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted"><Target size={18} aria-hidden="true" />Next skill</div>
          {passport.nextSkill ? <><p className="font-display text-xl font-bold">{passport.nextSkill.name}</p><p className="mt-1 text-sm text-muted">{passport.nextSkill.description}</p><Link href="/path" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand">See your path <Path size={16} /></Link></> : <p className="text-muted">Complete the AI Challenge to get a recommendation.</p>}</Card></motion.div>

        <motion.div variants={item} className="lg:col-span-2"><Card className="h-full p-6"><div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted"><Certificate size={18} aria-hidden="true" />Latest badge</div>
          {latestBadge ? <><p className="font-display text-xl font-bold">{latestBadge.skillName}</p><p className="mt-1 text-sm text-muted">{latestBadge.type === "badge" ? "Badge" : "Certificate"} · {formatDate(latestBadge.issuedAt)}</p><Link href={`/credentials/${latestBadge.id}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand">View <ArrowRight size={14} weight="bold" /></Link></> : <p className="text-muted">Your verified skills will show up here. Complete a course and prove what you learned.</p>}</Card></motion.div>

        <motion.div variants={item} className="lg:col-span-2"><Card className="h-full p-6"><div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted"><Medal size={18} aria-hidden="true" />Recognition</div>
          <Chip tone={hasVerifiedProject ? "green" : "neutral"}>{hasVerifiedProject ? "Ready to submit" : "Not yet eligible"}</Chip>
          <p className="mt-2 text-sm text-muted">{user.ageEligibility === "youth_eligible" ? "Recognition is project-first. A verified project puts you in the running." : "You can build and submit projects. Some youth-specific benefits apply only to ages 15–29."}</p>
          <Link href={project ? `/projects/${project.id}` : "/projects/new"} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand">{project ? project.title : "Start a project"} <ArrowRight size={14} weight="bold" /></Link></Card></motion.div>
      </div>

      {recs && recs.length > 0 && (
        <motion.section variants={item} aria-labelledby="moves">
          <SectionHeading title={t("dash.next")} sub={result ? `Matched to your ${LEVELS[level ?? "starter"].name} level and growth areas.` : undefined} action={<Link href="/discover" className="text-sm font-semibold text-brand underline">{t("common.viewAll")}</Link>} className="mb-4" />
          <div className="grid gap-4 lg:grid-cols-3">{recs.map((c) => <RecommendationCard key={c.id} course={c} why={c.skills.some((s) => result?.growthAreas.length) ? `Builds: ${result?.growthAreas[0] ?? "your next skill"}` : "A good next step"} />)}</div>
        </motion.section>
      )}
    </motion.div>
  );
}
