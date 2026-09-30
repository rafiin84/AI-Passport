"use client";
import { useMemo, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { EmptyState } from "@/components/ui/states";
import { cn } from "@/lib/utils";

export interface Column<T> { key: string; header: string; render: (row: T) => React.ReactNode; sortValue?: (row: T) => string | number; className?: string }

export function AdminTable<T extends { id: string }>({ columns, rows, caption, searchText, empty = "Nothing to show yet.", onRowClick, selectedId }: {
  columns: Column<T>[]; rows: T[]; caption: string; searchText?: (row: T) => string; empty?: string; onRowClick?: (row: T) => void; selectedId?: string;
}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const shown = useMemo(() => {
    let r = rows;
    if (q && searchText) r = r.filter((x) => searchText(x).toLowerCase().includes(q.toLowerCase()));
    const col = columns.find((c) => c.key === sort?.key);
    if (col?.sortValue && sort) r = [...r].sort((a, b) => { const x = col.sortValue!(a), y = col.sortValue!(b); return (x > y ? 1 : x < y ? -1 : 0) * sort.dir; });
    return r;
  }, [rows, q, sort, columns, searchText]);
  return (
    <div className="space-y-3">
      {searchText && <div className="relative max-w-sm"><MagnifyingGlass size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" /><input type="search" value={q} onChange={(e) => setQ(e.target.value)} aria-label={`Search ${caption}`} placeholder="Search…" className="h-11 w-full rounded-full border border-line bg-surface pl-10 pr-4" /></div>}
      {shown.length === 0 ? <EmptyState title={empty} /> : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead className="border-b border-line bg-surface-2 text-xs uppercase tracking-wider text-muted"><tr>
              {columns.map((c) => <th key={c.key} scope="col" aria-sort={sort?.key === c.key ? (sort.dir === 1 ? "ascending" : "descending") : undefined} className={cn("px-4 py-3 font-bold", c.className)}>
                {c.sortValue ? <button type="button" className="inline-flex min-h-8 items-center gap-1 uppercase hover:text-fg" onClick={() => setSort((s) => (s?.key === c.key ? { key: c.key, dir: (s.dir * -1) as 1 | -1 } : { key: c.key, dir: 1 }))}>{c.header}{sort?.key === c.key && <span aria-hidden="true">{sort.dir === 1 ? "↑" : "↓"}</span>}</button> : c.header}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-line">{shown.map((r) => (
              <tr key={r.id} onClick={onRowClick ? () => onRowClick(r) : undefined} className={cn(onRowClick && "cursor-pointer hover:bg-surface-2", selectedId === r.id && "bg-brand-soft")}>
                {columns.map((c) => <td key={c.key} className={cn("px-4 py-3 align-middle", c.className)}>{c.render(r)}</td>)}
              </tr>))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
