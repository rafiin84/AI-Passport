import { SITE } from "@/constants/site";
import { TricolourAccent } from "@/components/government/tricolour";

/** Standard chrome for government information pages: heading, last-updated, ownership note. */
export function StaticPage({ title, summary, children, eyebrow, placeholderNotice }: { title: string; summary?: string; children: React.ReactNode; eyebrow?: string; placeholderNotice?: boolean }) {
  return (
    <div>
      <div className="border-b border-line bg-surface-2"><div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.14em] text-saffron-deep">{eyebrow}</p>}
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{title}</h1>
        {summary && <p className="mt-3 max-w-2xl text-lg text-muted">{summary}</p>}
        <p className="mt-4 text-sm text-muted">Last updated: <time dateTime="2026-09-29">{SITE.lastUpdated}</time></p>
      </div><TricolourAccent /></div>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {placeholderNotice && <p className="mb-8 rounded-2xl border border-saffron/50 bg-saffron-soft p-4 text-sm text-saffron-deep"><strong>Draft text.</strong> Content marked in [brackets] is a placeholder and awaits approval from the owning authority.</p>}
        <div className="space-y-6 text-base leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
