export function StatTile({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-card"><dt className="text-xs font-bold uppercase tracking-wider text-muted">{label}</dt><dd className="mt-1 font-display text-3xl font-extrabold tabular-nums">{typeof value === "number" ? value.toLocaleString("en-IN") : value}</dd>{hint && <p className="text-xs text-muted">{hint}</p>}</div>
  );
}
