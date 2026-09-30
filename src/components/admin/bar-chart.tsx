"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Horizontal bar chart with an accessible data table alternative. */
export function BarChart({ title, data, unit = "", color = "var(--brand)" }: { title: string; data: { label: string; value: number; color?: string }[]; unit?: string; color?: string }) {
  const [table, setTable] = useState(false);
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <figure className="rounded-3xl border border-line bg-surface p-5 shadow-card">
      <figcaption className="mb-4 flex items-start justify-between gap-3"><span className="font-display text-lg font-bold">{title}</span>
        <button type="button" onClick={() => setTable(!table)} aria-pressed={table} className="min-h-9 rounded-full border border-line px-3 text-xs font-semibold hover:bg-surface-2">{table ? "Show chart" : "Show as table"}</button></figcaption>
      {table ? (
        <table className="w-full text-sm"><caption className="sr-only">{title}</caption><thead><tr className="text-left text-muted"><th className="py-1 font-semibold">Item</th><th className="py-1 text-right font-semibold">Value</th></tr></thead>
          <tbody>{data.map((d) => <tr key={d.label} className="border-t border-line"><td className="py-1.5">{d.label}</td><td className="py-1.5 text-right font-semibold">{d.value.toLocaleString("en-IN")}{unit}</td></tr>)}</tbody></table>
      ) : (
        <div role="img" aria-label={`${title}. ${data.map((d) => `${d.label}: ${d.value}${unit}`).join("; ")}`}><ul className="space-y-2.5">
          {data.map((d) => (
            <li key={d.label} aria-hidden="true"><div className="mb-1 flex justify-between text-sm"><span className="font-medium">{d.label}</span><span className="tabular-nums text-muted">{d.value.toLocaleString("en-IN")}{unit}</span></div>
              <div className="h-2.5 overflow-hidden rounded-full bg-surface-3"><div className={cn("h-full rounded-full")} style={{ width: `${(d.value / max) * 100}%`, background: d.color ?? color }} /></div></li>
          ))}
        </ul></div>
      )}
    </figure>
  );
}
