import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/layout/static-page";
import { SITE } from "@/constants/site";
export const metadata: Metadata = { title: "Contact us" };
export default function Page() {
  return (
    <StaticPage title="Contact us" eyebrow="Contact" summary="Helpdesk and grievance details will be published here once notified." placeholderNotice>
      <dl className="grid gap-4 sm:grid-cols-3">
        {[["Email", SITE.contact.email], ["Helpline", SITE.contact.phone], ["Hours", SITE.contact.hours]].map(([k, v]) => <div key={k} className="rounded-2xl border border-line bg-surface p-5"><dt className="text-sm font-bold uppercase tracking-wider text-muted">{k}</dt><dd className="mt-1 font-semibold">{v}</dd></div>)}
      </dl>
      <p className="text-muted">Have a suggestion? Use the <Link className="font-semibold text-brand underline" href="/feedback">feedback form</Link>. To raise a complaint, see the <Link className="font-semibold text-brand underline" href="/policies/grievance">grievance pathway</Link>.</p>
    </StaticPage>
  );
}
