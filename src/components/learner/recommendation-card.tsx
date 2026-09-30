import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { CourseThumb } from "@/components/courses/course-thumb";
import { LevelBadge } from "@/components/ui/badge";
import type { Course } from "@/types";

export function RecommendationCard({ course, why }: { course: Course; why: string }) {
  return (
    <Link href={`/courses/${course.id}`} className="group flex gap-4 rounded-3xl border border-line bg-surface p-3 shadow-card transition-transform hover:-translate-y-0.5">
      <div className="w-28 shrink-0 overflow-hidden rounded-2xl sm:w-36"><CourseThumb course={course} className="h-full min-h-28" /></div>
      <div className="min-w-0 flex-1 py-1 pr-2">
        <LevelBadge level={course.level} size="sm" />
        <h3 className="mt-1.5 line-clamp-2 font-display text-lg font-bold leading-snug">{course.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-saffron-deep">{why}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand">View course <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1" /></span>
      </div>
    </Link>
  );
}
