import Link from "next/link";
import { StateEmblemPlaceholder, IndiaAIHeader } from "./emblem";
import { TricolourAccent } from "./tricolour";
import { SITE } from "@/constants/site";

const LINKS = [
  ["About", "/about"], ["Mission", "/mission"], ["FAQ", "/faq"], ["Contact", "/contact"], ["Feedback", "/feedback"], ["Help", "/help"], ["Accessibility", "/accessibility"],
  ["Privacy", "/policies/privacy"], ["Terms & Conditions", "/policies/terms"], ["Copyright", "/policies/copyright"], ["Hyperlinking", "/policies/hyperlinking"], ["Grievance", "/policies/grievance"], ["Sitemap", "/sitemap-page"],
] as const;

export function GovernmentFooter() {
  return (
    <footer className="no-print mt-16 border-t border-line bg-surface-2">
      <TricolourAccent />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <StateEmblemPlaceholder size={48} />
              <div>
                <p lang="hi" className="font-bold text-fg">भारत सरकार</p>
                <p className="text-sm font-medium text-muted">Government of India</p>
              </div>
            </div>
            <p className="mt-4 font-display text-xl font-bold text-fg">AI Passport</p>
            <p className="text-sm text-muted">{SITE.tagline}</p>
            <div className="mt-4"><IndiaAIHeader /></div>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Website information</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
              {LINKS.map(([l, h]) => <li key={h}><Link href={h} className="inline-flex min-h-9 items-center text-sm font-medium text-fg underline-offset-4 hover:text-brand hover:underline">{l}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="mt-8 grid gap-4 border-t border-line pt-6 text-sm text-muted md:grid-cols-2">
          <div>
            <h2 className="font-semibold text-fg">Ownership information</h2>
            <dl className="mt-2 space-y-1">
              <div><dt className="inline font-medium">Owned by: </dt><dd className="inline">{SITE.ownership.owningDepartment}</dd></div>
              <div><dt className="inline font-medium">IndiaAI: </dt><dd className="inline">{SITE.ownership.indiaAiRelationship}</dd></div>
              <div><dt className="inline font-medium">Content: </dt><dd className="inline">{SITE.ownership.contentOwnership}</dd></div>
              <div><dt className="inline font-medium">Maintained by: </dt><dd className="inline">{SITE.ownership.maintainedBy}</dd></div>
            </dl>
          </div>
          <div className="space-y-1 md:text-right">
            <p><span className="font-medium">Last updated:</span> <time dateTime="2026-09-29">{SITE.lastUpdated}</time></p>
            <p>Domain (placeholder): <span className="font-mono text-xs">{SITE.officialDomain}</span></p>
            <p>External sites are not controlled by AI Passport. See our <Link className="underline" href="/policies/hyperlinking">hyperlinking policy</Link>.</p>
            <p className="text-xs">This prototype makes no claim of official certification or compliance. Sample data is used for demonstration.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
