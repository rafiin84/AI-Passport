import { Icon } from "@/components/ui/icon";
import { ProviderBadge } from "./provider-badge";
import type { Course } from "@/types";

export function CourseThumb({ course, className = "h-36" }: { course: Pick<Course, "thumbnail" | "provider" | "title">; className?: string }) {
  const { from, to, icon } = course.thumbnail;
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: `linear-gradient(135deg, ${from}, ${to})` }} role="img" aria-label={`${course.title} — course artwork`}>
      <div className="jaali absolute inset-0 opacity-40 mix-blend-overlay" />
      <div className="absolute -bottom-6 -right-4 text-white/25"><Icon name={icon} size={132} weight="fill" /></div>
      <div className="absolute left-3 top-3"><ProviderBadge provider={course.provider} /></div>
    </div>
  );
}
