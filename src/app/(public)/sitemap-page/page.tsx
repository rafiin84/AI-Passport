import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/layout/static-page";
import { CATEGORIES } from "@/mocks/recognition";
export const metadata: Metadata = { title: "Sitemap" };
const GROUPS: [string, [string, string][]][] = [
  ["About", [["Home", "/"], ["About AI Praman", "/about"], ["Mission", "/mission"], ["FAQ", "/faq"], ["Help", "/help"]]],
  ["Get started", [["Register", "/register"], ["AI Challenge", "/assessment"], ["Discover courses", "/discover"]]],
  ["Learners", [["Dashboard", "/dashboard"], ["My learning", "/learning"], ["AI Praman", "/passport"], ["Badges", "/badges"], ["Projects", "/projects"], ["Notifications", "/notifications"], ["Settings", "/settings"]]],
  ["Recognition", [["Top 100 categories", "/recognition"], ...CATEGORIES.map((c): [string, string] => [c.name, `/recognition/${c.id}`])]],
  ["Policies and contact", [["Contact us", "/contact"], ["Feedback", "/feedback"], ["Accessibility", "/accessibility"], ["Privacy Policy", "/policies/privacy"], ["Terms & Conditions", "/policies/terms"], ["Copyright Policy", "/policies/copyright"], ["Hyperlinking Policy", "/policies/hyperlinking"], ["Grievance", "/policies/grievance"]]],
];
export default function Page() {
  return (
    <StaticPage title="Sitemap" eyebrow="Website information" summary="Every public page in one place.">
      <div className="grid gap-6 sm:grid-cols-2">{GROUPS.map(([h, links]) => <section key={h}><h2 className="font-display text-xl font-bold">{h}</h2><ul className="mt-2 space-y-1">{links.map(([l, href]) => <li key={href}><Link href={href} className="inline-flex min-h-9 items-center text-brand underline-offset-4 hover:underline">{l}</Link></li>)}</ul></section>)}</div>
    </StaticPage>
  );
}
