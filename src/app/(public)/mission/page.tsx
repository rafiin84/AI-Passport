import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";
import { Button } from "@/components/ui/button";
import { SITE } from "@/constants/site";
export const metadata: Metadata = { title: "Mission" };
export default function Page() {
  return (
    <StaticPage title="India's AI future needs you." summary="A national effort to help every young Indian understand, learn and use AI." eyebrow="The mission" placeholderNotice>
      <blockquote className="rounded-3xl border border-line bg-surface p-6 shadow-card"><p className="text-xl">{SITE.pmMessage.quote}</p><footer className="mt-3 text-sm text-muted">Source: {SITE.pmMessage.source}</footer></blockquote>
      <section><h2 className="font-display text-2xl font-bold">What the mission means for learners</h2><ul className="mt-3 list-disc space-y-1 pl-6 text-muted"><li>Everyone can find their AI level and get a path made for them.</li><li>Learning happens anywhere; proof happens here.</li><li>Projects that solve Indian problems get recognised.</li></ul></section>
      <p className="text-sm text-muted">This page will carry the approved official message, photograph and announcement reference once supplied. It doesn't imply personal endorsement of any feature.</p>
      <Button href="/register" size="lg" variant="saffron">Begin the AI Challenge</Button>
    </StaticPage>
  );
}
