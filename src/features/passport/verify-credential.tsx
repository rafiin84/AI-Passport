"use client";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, WarningOctagon, Prohibit } from "@phosphor-icons/react";
import { getCredential } from "@/lib/api";
import { errorMessage } from "@/hooks/use-api";
import { LoadingBlock, ErrorState } from "@/components/ui/states";
import { Card } from "@/components/ui/card";
import { LEVELS } from "@/constants/levels";
import { formatDate } from "@/lib/utils";

const EV = { url: "Live URL", repository: "Code repository", demo: "Demo", screenshot: "Screenshots", video: "Video", project: "Project write-up" } as const;

/** Public verification. Shows only what a verifier needs: no age, DOB, city, Aadhaar or evidence links. */
export function VerifyCredential({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery({ queryKey: ["verify-cred", id], queryFn: () => getCredential(id), retry: false });
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Credential verification</h1>
      <p className="mt-2 text-muted">Check that an AI Passport credential is genuine and current.</p>
      <div className="mt-8">
        {isLoading ? <LoadingBlock label="Checking credential" /> : error || !data ? (
          <div role="alert" className="rounded-3xl border border-danger bg-danger-soft p-6"><WarningOctagon size={36} weight="fill" className="text-danger" aria-hidden="true" /><h2 className="mt-2 font-display text-2xl font-bold">We couldn't find this credential</h2><p className="mt-1 text-muted">Check the ID and try again. {errorMessage(error)}</p><p className="mt-3 font-mono text-sm">Searched: {id}</p></div>
        ) : (
          <Card className="overflow-hidden">
            <div className={`flex items-center gap-3 p-5 ${data.credential.verificationStatus === "verified" ? "bg-green-soft" : "bg-danger-soft"}`}>
              {data.credential.verificationStatus === "verified" ? <CheckCircle size={40} weight="fill" className="text-india-green" aria-hidden="true" /> : <Prohibit size={40} weight="fill" className="text-danger" aria-hidden="true" />}
              <div><p className="text-sm font-bold uppercase tracking-wider text-muted">Credential status</p><p className="font-display text-2xl font-extrabold">{data.credential.verificationStatus === "verified" ? "Verified" : data.credential.verificationStatus === "revoked" ? "Revoked" : "Pending"}</p></div>
            </div>
            <dl className="divide-y divide-line px-5">
              {[["Learner", data.learnerName], ["Skill", data.skillName], ["Level", LEVELS[data.credential.level].name], ["Type", data.credential.type === "badge" ? "Badge" : "Certificate"], ["Issue date", formatDate(data.credential.issuedAt)], ["Credential ID", data.credential.credentialNumber], ["Verification basis", data.credential.basis], ["Evidence reviewed", data.evidenceTypes.length ? data.evidenceTypes.map((e) => EV[e]).join(", ") : "Assessment only"]].map(([k, v]) => (
                <div key={k} className="flex flex-wrap justify-between gap-2 py-3"><dt className="text-muted">{k}</dt><dd className="font-semibold">{v}</dd></div>
              ))}
            </dl>
            <p className="border-t border-line p-4 text-xs text-muted">Private information such as age, address, identity numbers and evidence links is not shown on this page. Prototype data — not an official credential.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
