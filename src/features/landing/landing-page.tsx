"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, UserPlus, Target, Compass, BookOpenText, SealCheck, Certificate, Hammer, Medal, ShieldCheck, Wheelchair, Translate, LinkSimple, Quotes } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/card";
import { PassportCover } from "@/components/passport/passport-cover";
import { TricolourAccent } from "@/components/government/tricolour";
import { StateEmblemPlaceholder } from "@/components/government/emblem";
import { LevelBadge } from "@/components/ui/badge";
import { CourseCard } from "@/components/courses/course-card";
import { COURSES, FEATURED_COURSE_ID } from "@/mocks/courses";
import { CATEGORIES } from "@/mocks/recognition";
import { Icon } from "@/components/ui/icon";
import { LEVELS, LEVEL_ORDER } from "@/constants/levels";
import { SITE } from "@/constants/site";
import { useT } from "@/hooks/use-t";

const JOURNEY = [
  { icon: UserPlus, title: "Register", body: "Quick, mobile-first sign-up with a mock Aadhaar flow." },
  { icon: Target, title: "Assess", body: "A friendly adaptive challenge finds your AI level." },
  { icon: Compass, title: "Discover", body: "Courses matched to your level, goals and interests." },
  { icon: BookOpenText, title: "Learn", body: "Learn on the platform you like. We don't lock you in." },
  { icon: SealCheck, title: "Prove", body: "Quizzes and practical tasks show what you actually learned." },
  { icon: Certificate, title: "Certify", body: "Verified skills become badges and certificates." },
  { icon: Hammer, title: "Build", body: "Turn skills into a project that solves a real problem." },
  { icon: Medal, title: "Get recognised", body: "Project-first national recognition across 15 categories." },
];

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export function LandingPage() {
  const t = useT();
  const featured = COURSES.find((c) => c.id === FEATURED_COURSE_ID)!;
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="jaali absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="absolute -right-24 -top-24 size-[32rem] rounded-full bg-saffron/20 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-24 size-[28rem] rounded-full bg-india-green/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <motion.p variants={fade} initial="hidden" animate="show" className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-semibold text-fg shadow-card">
              <span className="size-2 rounded-full bg-saffron" aria-hidden="true" />{t("hero.eyebrow")}
            </motion.p>
            <motion.h1 variants={fade} initial="hidden" animate="show" transition={{ delay: 0.05 }} className="font-display text-[2.6rem] font-extrabold leading-[1.02] text-fg sm:text-6xl lg:text-7xl">
              {t("hero.title")}
            </motion.h1>
            <motion.p variants={fade} initial="hidden" animate="show" transition={{ delay: 0.12 }} className="mt-5 max-w-xl text-lg text-muted sm:text-xl">{t("hero.sub")}</motion.p>
            <motion.div variants={fade} initial="hidden" animate="show" transition={{ delay: 0.2 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/register" size="lg" variant="saffron">{t("hero.cta1")} <ArrowRight size={20} weight="bold" /></Button>
              <Button href="/discover" size="lg" variant="secondary">{t("hero.cta2")}</Button>
            </motion.div>
            <motion.p variants={fade} initial="hidden" animate="show" transition={{ delay: 0.28 }} className="mt-8 font-display text-xl font-bold text-brand">{SITE.tagline}</motion.p>
          </div>
          <div className="flex justify-center lg:justify-end"><PassportCover name="Aarav Mehta" state="Karnataka" level="builder" stamps={[{ id: "1", label: "Generative AI" }, { id: "2", label: "Prompting" }, { id: "3", label: "AI SDLC" }]} /></div>
        </div>
        <TricolourAccent />
      </section>

      {/* National mission / PM section — awaiting approved assets */}
      <section aria-labelledby="mission-h" className="bg-[#0b1b3a] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[0.8fr_1.2fr] md:items-center md:py-20">
          <figure className="mx-auto w-full max-w-xs">
            <div className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-3xl border-2 border-dashed border-white/30 bg-white/5 p-6 text-center" role="img" aria-label="Placeholder for the approved official photograph. Asset pending authorisation.">
              <div className="jaali absolute inset-0 opacity-30" aria-hidden="true" />
              <div className="relative"><StateEmblemPlaceholder size={56} className="mx-auto border-white/40 bg-white/10 text-white/70" /><p className="mt-4 text-sm font-semibold text-white/80">Approved official photograph</p><p className="mt-1 text-xs text-white/55">Asset pending authorisation. Not to be replaced with any unapproved image.</p></div>
            </div>
          </figure>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffb870]">National mission</p>
            <h2 id="mission-h" className="mt-2 font-display text-4xl font-extrabold leading-tight sm:text-5xl">India's AI future needs you.</h2>
            <blockquote className="relative mt-6 rounded-2xl border border-white/15 bg-white/5 p-5 text-white/85">
              <Quotes size={28} weight="fill" className="text-[#ffb870]" aria-hidden="true" />
              <p className="mt-1 text-lg">{SITE.pmMessage.quote}</p>
              <footer className="mt-3 text-sm text-white/60">Source: {SITE.pmMessage.source}</footer>
            </blockquote>
            <p className="mt-5 max-w-xl text-white/75">The mission is simple: help every young Indian understand AI, learn it well, prove it honestly and use it to solve problems that matter here. This section will carry the approved message and photograph once supplied by the authorised team.</p>
            <div className="mt-7 flex flex-wrap gap-3"><Button href="/register" variant="saffron" size="lg">Begin the AI Challenge</Button><Button href="/mission" variant="ghost" className="text-white hover:bg-white/10">Read the mission</Button></div>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section aria-labelledby="journey-h" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <SectionHeading eyebrow="How it works" title={t("journey.title")} sub={t("journey.sub")} />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {JOURNEY.map((s, i) => (
            <motion.li key={s.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: (i % 4) * 0.07 }}
              className="relative rounded-3xl border border-line bg-surface p-6 shadow-card">
              <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-surface-3" aria-hidden="true">{i + 1}</span>
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand"><s.icon size={26} weight="duotone" /></span>
              <h3 className="mt-4 font-display text-xl font-bold text-fg">{s.title}</h3>
              <p className="mt-1 text-muted">{s.body}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* Levels */}
      <section aria-labelledby="levels-h" className="bg-surface-2 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="The AI proficiency framework" title="Starter → Explorer → Builder → Maker → AI Pro" sub="Five levels, one clear question: where are you today, and what's next?" />
          <div className="mt-10 grid gap-3 md:grid-cols-5">
            {LEVEL_ORDER.map((l, i) => (
              <motion.div key={l} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
                <div className="h-2" style={{ background: `linear-gradient(90deg, ${LEVELS[l].from}, ${LEVELS[l].to})` }} />
                <div className="p-5"><LevelBadge level={l} /><p className="mt-3 text-sm text-muted">{LEVELS[l].definition}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured course */}
      <section aria-labelledby="feat-h" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionHeading eyebrow="Learn anywhere. Prove here." title="Take a course anywhere. Show us what you learned." sub="AI Passport points you to trusted courses on other platforms. When you finish, you come back, take a short verification and submit evidence. That's what turns learning into a credential." />
            <ul className="mt-6 space-y-3 text-fg">
              {["We don't host or control the course. Every external link is clearly marked.", "Course completion alone isn't enough — you prove it with a quiz and real work.", "AI drafts assessments; a human reviews them before they count."].map((x) => (
                <li key={x} className="flex gap-3"><ShieldCheck size={22} weight="duotone" className="mt-0.5 shrink-0 text-india-green" aria-hidden="true" /><span>{x}</span></li>
              ))}
            </ul>
            <Button href="/discover" className="mt-8" size="lg">Explore AI skills <ArrowRight size={20} weight="bold" /></Button>
          </div>
          <div className="mx-auto w-full max-w-md"><CourseCard course={featured} reason="Featured for Builders" /></div>
        </div>
      </section>

      {/* Recognition */}
      <section aria-labelledby="rec-h" className="bg-[#0b1b3a] py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffb870]">Recognition</p>
          <h2 id="rec-h" className="mt-2 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">Certificates recognise learning. Projects recognise capability.</h2>
          <p className="mt-4 max-w-2xl text-white/75">Top 100 recognition is project-first. It isn't a popularity contest or a certificate count — trained reviewers use a published rubric to pick projects that make a real difference.</p>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.slice(0, 10).map((c) => (
              <li key={c.id}><Link href={`/recognition/${c.id}`} className="flex h-full min-h-24 flex-col gap-2 rounded-2xl border border-white/15 bg-white/5 p-4 transition-colors hover:bg-white/10"><Icon name={c.icon} size={26} className="text-[#ffb870]" /><span className="text-sm font-semibold">{c.name}</span></Link></li>
            ))}
          </ul>
          <Button href="/recognition" variant="saffron" className="mt-8" size="lg">See project stories</Button>
        </div>
      </section>

      {/* Trust */}
      <section aria-labelledby="trust-h" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <SectionHeading eyebrow="Built to be trusted" title="Open to everyone. Honest about everything." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { i: Wheelchair, t: "Accessible by design", b: "Keyboard navigation, screen-reader labels, adjustable text size, high contrast and reduced motion." },
            { i: Translate, t: "Built for many languages", b: "English and Hindi today, with a structure ready for more Indian languages." },
            { i: LinkSimple, t: "Clear about external sites", b: "We always tell you when you're leaving AI Passport and who runs the site you're going to." },
          ].map((c) => (
            <div key={c.t} className="rounded-3xl border border-line bg-surface p-6 shadow-card"><c.i size={30} weight="duotone" className="text-brand" aria-hidden="true" /><h3 className="mt-3 font-display text-xl font-bold">{c.t}</h3><p className="mt-1 text-muted">{c.b}</p></div>
          ))}
        </div>
        <div className="mt-12 rounded-[2rem] bg-gradient-to-br from-brand to-[#0b1b3a] p-8 text-center text-white sm:p-12">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Ready to find your AI level?</h2>
          <p className="mx-auto mt-2 max-w-xl text-white/80">A short adaptive challenge. No pressure. It isn't an exam.</p>
          <Button href="/register" size="lg" variant="saffron" className="mt-6">{t("hero.cta1")}</Button>
        </div>
      </section>
    </>
  );
}
