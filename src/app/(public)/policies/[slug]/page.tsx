import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { POLICIES } from "@/constants/content";
import { StaticPage } from "@/components/layout/static-page";

export function generateStaticParams() { return POLICIES.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; return { title: POLICIES.find((p) => p.slug === slug)?.title }; }

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = POLICIES.find((p) => p.slug === slug);
  if (!policy) notFound();
  return (
    <StaticPage title={policy.title} summary={policy.summary} eyebrow="Website policies" placeholderNotice>
      {policy.sections.map((s) => <section key={s.h}><h2 className="font-display text-2xl font-bold">{s.h}</h2>{s.p.map((t) => <p key={t} className="mt-2 text-muted">{t}</p>)}</section>)}
    </StaticPage>
  );
}
