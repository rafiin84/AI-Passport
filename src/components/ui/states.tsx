import { Warning, ArrowClockwise, UserCircle } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-2xl", className)} aria-hidden="true" />;
}

export function LoadingBlock({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <span className="sr-only">{label}…</span>
      <Skeleton className="h-10 w-2/3" /><Skeleton className="h-40 w-full" /><Skeleton className="h-24 w-full" />
    </div>
  );
}

export function CardGridSkeleton({ n = 6 }: { n?: number }) {
  return (
    <div role="status" aria-live="polite" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <span className="sr-only">Loading courses…</span>
      {Array.from({ length: n }, (_, i) => <Skeleton key={i} className="h-72" />)}
    </div>
  );
}

export function EmptyState({ title, body, action, icon }: { title: string; body?: string; action?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-line bg-surface/60 px-6 py-12 text-center">
      <div className="mb-3 grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand">{icon ?? <span className="size-3 rounded-full bg-saffron" />}</div>
      <h3 className="font-display text-xl font-bold text-fg">{title}</h3>
      {body && <p className="mt-1.5 max-w-md text-muted">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ title = "We couldn't load this", body, onRetry }: { title?: string; body?: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="grid place-items-center rounded-3xl border border-danger/40 bg-danger-soft px-6 py-10 text-center">
      <Warning size={36} weight="fill" className="mb-2 text-danger" aria-hidden="true" />
      <h3 className="font-display text-xl font-bold text-fg">{title}</h3>
      <p className="mt-1 max-w-md text-muted">{body ?? "Something went wrong on our side. Check your connection and try again."}</p>
      {onRetry && <Button variant="secondary" className="mt-4" onClick={onRetry}><ArrowClockwise size={18} /> Try again</Button>}
    </div>
  );
}

export function SignInPrompt() {
  return (
    <EmptyState icon={<UserCircle size={30} />} title="Let's get you signed in" body="Register with the mock Aadhaar flow, or continue as the demo learner to explore everything."
      action={<Button href="/register">Register or continue as demo</Button>} />
  );
}
