import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";
import { FAQ } from "@/constants/content";
export const metadata: Metadata = { title: "Frequently asked questions" };
export default function Page() {
  return (
    <StaticPage title="Frequently asked questions" eyebrow="FAQ" summary="Straight answers about how AI Praman works.">
      <div className="divide-y divide-line rounded-3xl border border-line bg-surface">
        {FAQ.map((f) => <details key={f.q} className="group p-5"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">{f.q}<span aria-hidden="true" className="text-2xl text-muted transition-transform group-open:rotate-45">+</span></summary><p className="mt-2 text-muted">{f.a}</p></details>)}
      </div>
    </StaticPage>
  );
}
