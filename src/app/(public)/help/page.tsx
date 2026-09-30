import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/layout/static-page";
export const metadata: Metadata = { title: "Help" };
const STEPS = [["Register", "Use the mock Aadhaar flow or continue as the demo learner."], ["Take the AI Challenge", "A friendly adaptive set of questions. About 6–12."], ["Follow your path", "Open a course. You'll be told when you're leaving AI Passport."], ["Come back and verify", "Declare completion, pass a knowledge check and submit evidence."], ["Build and get recognised", "Add a project and submit it to a category."]];
export default function Page() {
  return (
    <StaticPage title="Help" eyebrow="Help" summary="Getting started, in five steps.">
      <ol className="space-y-3">{STEPS.map(([t, d], i) => <li key={t} className="flex gap-4 rounded-2xl border border-line bg-surface p-4"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-saffron font-bold text-[#1a1000]">{i + 1}</span><span><span className="block font-display text-lg font-bold">{t}</span><span className="text-muted">{d}</span></span></li>)}</ol>
      <p className="text-muted">More questions? Read the <Link className="font-semibold text-brand underline" href="/faq">FAQ</Link> or <Link className="font-semibold text-brand underline" href="/contact">contact us</Link>.</p>
    </StaticPage>
  );
}
