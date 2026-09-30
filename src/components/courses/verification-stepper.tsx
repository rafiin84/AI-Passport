import { CheckCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { EnrollmentState } from "@/types";

const STEPS = ["Learn", "Declare complete", "Knowledge check", "Evidence", "Credential"];
const IDX: Record<EnrollmentState, number> = {
  not_started: 0, in_progress: 0, declared_complete: 1, assessment_ready: 2, not_verified: 2, passed: 4, evidence_required: 3, evidence_submitted: 3, under_review: 3, verified: 4, credential_issued: 5,
};

export function VerificationStepper({ state }: { state: EnrollmentState }) {
  const cur = IDX[state];
  return (
    <ol className="grid grid-cols-5 gap-1" aria-label="Verification progress">
      {STEPS.map((s, i) => {
        const done = i < cur; const active = i === cur;
        return (
          <li key={s} aria-current={active ? "step" : undefined} className="text-center">
            <div className={cn("mx-auto grid size-9 place-items-center rounded-full border-2 text-sm font-bold", done ? "border-india-green bg-india-green text-white" : active ? "border-saffron bg-saffron-soft text-saffron-deep" : "border-line bg-surface text-muted")}>
              {done ? <CheckCircle size={20} weight="fill" aria-label="done" /> : i + 1}
            </div>
            <p className={cn("mt-1.5 text-[0.7rem] font-semibold leading-tight sm:text-xs", active ? "text-fg" : "text-muted")}>{s}</p>
          </li>
        );
      })}
    </ol>
  );
}
