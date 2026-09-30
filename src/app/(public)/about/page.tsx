import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";
import { SITE } from "@/constants/site";
export const metadata: Metadata = { title: "About AI Passport" };
export default function Page() {
  return (
    <StaticPage title="About AI Passport" summary="The learning, assessment, verification and recognition layer around India's AI-skilling ecosystem." eyebrow="About">
      <section><h2 className="font-display text-2xl font-bold">Learn anywhere. Prove here.</h2><p className="mt-2 text-muted">AI Passport is not an LMS or a course marketplace. Learners take courses on trusted external platforms, then come back to prove what they learned, earn verified credentials, build projects and be recognised for real work.</p></section>
      <section><h2 className="font-display text-2xl font-bold">Six questions we answer</h2><ol className="mt-3 list-decimal space-y-1 pl-6 text-muted"><li>Where am I today?</li><li>What should I learn next?</li><li>Where can I learn it?</li><li>Did I actually learn it?</li><li>Can I prove what I can do?</li><li>Can India see what I can build?</li></ol></section>
      <section><h2 className="font-display text-2xl font-bold">Ownership and content</h2><dl className="mt-3 space-y-2 text-muted"><div><dt className="inline font-semibold text-fg">Owned by: </dt><dd className="inline">{SITE.ownership.owningDepartment}</dd></div><div><dt className="inline font-semibold text-fg">IndiaAI: </dt><dd className="inline">{SITE.ownership.indiaAiRelationship}</dd></div><div><dt className="inline font-semibold text-fg">Content: </dt><dd className="inline">{SITE.ownership.contentOwnership}</dd></div><div><dt className="inline font-semibold text-fg">Maintained by: </dt><dd className="inline">{SITE.ownership.maintainedBy}</dd></div></dl></section>
      <p className="rounded-2xl bg-surface-2 p-4 text-sm text-muted">This prototype doesn't claim official certification or compliance. Official identity, emblem, domain and copy will be added only after authorised approval.</p>
    </StaticPage>
  );
}
