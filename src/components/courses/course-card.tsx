"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Translate, Wrench, ShieldCheck } from "@phosphor-icons/react";
import { CourseThumb } from "./course-thumb";
import { LevelBadge, SkillChip, Chip } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { skillName } from "@/mocks/skills";
import type { Course } from "@/types";

const VERIFY_LABEL = { mcq: "Quiz", scenario: "Scenario check", practical: "Practical task", mixed: "Quiz + practical" } as const;

export function CourseCard({ course, reason }: { course: Course; reason?: string }) {
  return (
    <motion.article whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
      <CourseThumb course={course} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <LevelBadge level={course.level} size="sm" />
          {course.featured && <Chip tone="saffron">Featured</Chip>}
        </div>
        <h3 className="font-display text-lg font-bold leading-snug text-fg">
          <Link href={`/courses/${course.id}`} className="after:absolute after:inset-0 focus-visible:after:rounded-3xl">{course.title}</Link>
        </h3>
        {reason && <p className="text-sm font-medium text-saffron-deep">{reason}</p>}
        <div className="flex flex-wrap gap-1.5">{course.skills.slice(0, 3).map((s) => <SkillChip key={s}>{skillName(s)}</SkillChip>)}{course.skills.length > 3 && <SkillChip>+{course.skills.length - 3}</SkillChip>}</div>
        <dl className="mt-auto grid grid-cols-2 gap-x-3 gap-y-1.5 pt-2 text-sm text-muted">
          <div className="flex items-center gap-1.5"><Clock size={16} aria-hidden="true" /><dt className="sr-only">Duration</dt><dd>{course.duration}</dd></div>
          <div className="flex items-center gap-1.5"><Translate size={16} aria-hidden="true" /><dt className="sr-only">Languages</dt><dd>{course.languages.join(", ")}</dd></div>
          <div className="flex items-center gap-1.5"><Wrench size={16} aria-hidden="true" /><dt className="sr-only">Format</dt><dd>{course.format}{course.hasProject ? " · project" : ""}</dd></div>
          <div className="flex items-center gap-1.5"><ShieldCheck size={16} aria-hidden="true" /><dt className="sr-only">Verification</dt><dd>{VERIFY_LABEL[course.verificationType]}</dd></div>
        </dl>
        <p className="border-t border-line pt-3 font-semibold text-fg">{formatPrice(course)}</p>
      </div>
    </motion.article>
  );
}
