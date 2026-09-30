import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/layout/static-page";
export const metadata: Metadata = { title: "Accessibility statement" };
const ITEMS = ["Skip to main content link on every page", "Full keyboard navigation with visible focus", "Semantic headings, landmarks and labelled forms", "Error summaries that link to the field with the problem", "Adjustable text size, high contrast and dark mode", "Reduced motion, honouring your device setting", "Large tap targets and mobile-first layouts", "Text alternatives for charts and artwork", "English and हिन्दी, with a structure ready for more languages"];
export default function Page() {
  return (
    <StaticPage title="Accessibility" eyebrow="Accessibility" summary="AI Passport is designed to be usable by everyone, including people with disabilities.">
      <ul className="grid gap-3 sm:grid-cols-2">{ITEMS.map((i) => <li key={i} className="rounded-2xl border border-line bg-surface p-4">{i}</li>)}</ul>
      <section><h2 className="font-display text-2xl font-bold">Status</h2><p className="mt-2 text-muted">This prototype is built to be evaluated against applicable Government of India web guidelines. It makes no claim of formal compliance or certification.</p></section>
      <section><h2 className="font-display text-2xl font-bold">Tell us about a barrier</h2><p className="mt-2 text-muted">If something doesn't work for you, tell us through the <Link className="font-semibold text-brand underline" href="/feedback">feedback form</Link>.</p></section>
    </StaticPage>
  );
}
