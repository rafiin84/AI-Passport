import { cn } from "@/lib/utils";
import { LEVELS } from "@/constants/levels";
import type { EnrollmentState, LevelId, ProjectStatus } from "@/types";

export function Chip({ children, tone = "neutral", className }: { children: React.ReactNode; tone?: "neutral" | "brand" | "saffron" | "green" | "danger"; className?: string }) {
  const tones = {
    neutral: "bg-surface-2 text-muted", brand: "bg-brand-soft text-brand", saffron: "bg-saffron-soft text-saffron-deep", green: "bg-green-soft text-india-green", danger: "bg-danger-soft text-danger",
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone], className)}>{children}</span>;
}

export function SkillChip({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-fg">{children}</span>;
}

export function LevelBadge({ level, size = "md", className }: { level: LevelId; size?: "sm" | "md" | "lg"; className?: string }) {
  const l = LEVELS[level];
  const sizes = { sm: "px-2.5 py-0.5 text-xs", md: "px-3 py-1 text-sm", lg: "px-4 py-1.5 text-base" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full font-bold text-white", sizes[size], className)} style={{ background: `linear-gradient(135deg, ${l.from}, ${l.to})` }}>
      <span className="size-1.5 rounded-full bg-white/90" aria-hidden="true" />
      {l.name}
    </span>
  );
}

const ENROLL_LABEL: Record<EnrollmentState, { label: string; tone: "neutral" | "brand" | "saffron" | "green" | "danger" }> = {
  not_started: { label: "Not started", tone: "neutral" }, in_progress: { label: "Learning", tone: "brand" }, declared_complete: { label: "Declared complete", tone: "saffron" },
  assessment_ready: { label: "Ready to verify", tone: "saffron" }, passed: { label: "Passed", tone: "green" }, evidence_required: { label: "Evidence needed", tone: "saffron" },
  evidence_submitted: { label: "Evidence submitted", tone: "brand" }, under_review: { label: "Under review", tone: "brand" }, verified: { label: "Verified", tone: "green" },
  not_verified: { label: "Not verified yet", tone: "danger" }, credential_issued: { label: "Credential issued", tone: "green" },
};

export function StatusBadge({ state }: { state: EnrollmentState }) {
  const s = ENROLL_LABEL[state];
  return <Chip tone={s.tone}>{s.label}</Chip>;
}

const PROJECT_LABEL: Record<ProjectStatus, { label: string; tone: "neutral" | "brand" | "saffron" | "green" }> = {
  draft: { label: "Draft", tone: "neutral" }, submitted: { label: "Submitted", tone: "brand" }, under_review: { label: "Under review", tone: "saffron" }, verified: { label: "Verified", tone: "green" }, featured: { label: "Featured", tone: "saffron" },
};
export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const s = PROJECT_LABEL[status];
  return <Chip tone={s.tone}>{s.label}</Chip>;
}
