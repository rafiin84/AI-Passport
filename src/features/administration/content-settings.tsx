"use client";
import { useState } from "react";
import Link from "next/link";
import { PageHeader, Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TextArea, TextInput } from "@/components/ui/field";
import { FAQ, POLICIES } from "@/constants/content";
import { SITE } from "@/constants/site";
import { toast } from "@/store/toast";

export function ContentManagement() {
  const [faq, setFaq] = useState(FAQ);
  const [editing, setEditing] = useState<number | null>(null);
  const pages = [["About", "/about"], ["Mission", "/mission"], ["FAQ", "/faq"], ["Contact", "/contact"], ["Accessibility", "/accessibility"], ...POLICIES.map((p): [string, string] => [p.title, `/policies/${p.slug}`])];
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Content" title="Content management" sub="Government pages, policies and FAQs. Approved copy replaces bracketed placeholders." />
      <Card className="p-5"><h2 className="font-display text-lg font-bold">Pages</h2><ul className="mt-3 divide-y divide-line">{pages.map(([t, h]) => <li key={h} className="flex flex-wrap items-center justify-between gap-2 py-2.5"><Link className="font-semibold text-brand hover:underline" href={h}>{t}</Link><span className="flex items-center gap-2 text-sm text-muted">Last updated {SITE.lastUpdated}<Chip tone="saffron">awaiting approved copy</Chip></span></li>)}</ul></Card>
      <Card className="space-y-3 p-5"><h2 className="font-display text-lg font-bold">FAQ</h2>
        <ul className="space-y-3">{faq.map((f, i) => <li key={f.q} className="rounded-2xl border border-line p-4">{editing === i ? <div className="space-y-3"><TextInput label="Question" value={f.q} onChange={(e) => setFaq(faq.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} /><TextArea label="Answer" value={f.a} onChange={(e) => setFaq(faq.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} /><Button size="sm" onClick={() => { setEditing(null); toast.success("Saved for this session", "Prototype: content edits aren't persisted."); }}>Done</Button></div> : <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{f.q}</p><p className="text-sm text-muted">{f.a}</p></div><Button size="sm" variant="ghost" onClick={() => setEditing(i)}>Edit</Button></div>}</li>)}</ul></Card>
    </div>
  );
}

export function AdminSettings() {
  const rows: [string, string][] = [["Owning department / authority", SITE.ownership.owningDepartment], ["IndiaAI relationship", SITE.ownership.indiaAiRelationship], ["Content ownership", SITE.ownership.contentOwnership], ["Development and maintenance", SITE.ownership.maintainedBy], ["Official domain (placeholder)", SITE.officialDomain], ["Grievance officer", SITE.grievance.officer], ["Official banner authorised", SITE.officialBannerAuthorised ? "Yes" : "No — pending approval"], ["PM message authorised", SITE.pmMessage.authorised ? "Yes" : "No — pending approval"]];
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Settings" title="Government identity configuration" sub="These values live in one configuration file. Nothing here is invented — replace placeholders only with approved copy and assets." />
      <Card className="divide-y divide-line p-2">{rows.map(([k, v]) => <div key={k} className="flex flex-wrap justify-between gap-3 px-3 py-3"><dt className="text-muted">{k}</dt><dd className="max-w-md text-right font-semibold">{v}</dd></div>)}</Card>
      <Card className="space-y-2 p-5 text-sm text-muted"><h2 className="font-display text-lg font-bold text-fg">Before going live</h2><ul className="list-disc space-y-1 pl-5"><li>Supply the approved State Emblem asset and IndiaAI branding.</li><li>Supply the approved PM message, photograph and source reference.</li><li>Confirm the official domain via <code className="font-mono">NEXT_PUBLIC_OFFICIAL_DOMAIN</code>.</li><li>Replace the mock Aadhaar flow with an approved identity integration.</li><li>Have policy text reviewed and approved by the owning authority.</li><li>Get a formal accessibility and security review before claiming compliance.</li></ul></Card>
    </div>
  );
}
