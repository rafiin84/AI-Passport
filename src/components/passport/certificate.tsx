"use client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Printer, SealCheck } from "@phosphor-icons/react";
import { getCredential } from "@/lib/api";
import { StateEmblemPlaceholder } from "@/components/government/emblem";
import { TricolourAccent, ChakraMotif } from "@/components/government/tricolour";
import { Button } from "@/components/ui/button";
import { LEVELS } from "@/constants/levels";
import { SITE } from "@/constants/site";
import { formatDate } from "@/lib/utils";
import { LoadingBlock, ErrorState } from "@/components/ui/states";
import { errorMessage } from "@/hooks/use-api";

/** Accessible certificate. All official marks are placeholders: no invented seal, signature or authority. */
export function CertificatePreview({ credentialId, showActions = true }: { credentialId: string; showActions?: boolean }) {
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["credential", credentialId], queryFn: () => getCredential(credentialId), retry: false });
  if (isLoading) return <LoadingBlock label="Loading certificate" />;
  if (error || !data) return <ErrorState title="Certificate not found" body={errorMessage(error)} onRetry={() => refetch()} />;
  const { credential: c, learnerName, skillName, course } = data;
  const level = LEVELS[c.level];
  const verifyUrl = `https://${SITE.officialDomain}/verify/${c.credentialNumber}`;
  return (
    <motion.article initial={{ opacity: 0, y: 30, rotateX: 12 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ type: "spring", stiffness: 110, damping: 18 }}
      aria-label={`Certificate: ${learnerName}, ${skillName}, ${level.name}`} className="overflow-hidden rounded-[1.5rem] border-2 border-[#0b1b3a]/15 bg-[#fffdf8] text-[#0b1b3a] shadow-lift">
      <TricolourAccent className="!h-2" />
      <div className="relative p-6 sm:p-10">
        <div className="jaali pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="relative">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#0b1b3a]/15 pb-5">
            <div className="flex items-center gap-3"><StateEmblemPlaceholder size={52} /><div><p lang="hi" className="font-bold">भारत सरकार</p><p className="text-sm font-medium">Government of India</p></div></div>
            <div className="flex items-center gap-2 text-right"><div><p className="font-display text-lg font-extrabold">AI Praman</p><p className="text-xs text-[#4b5877]">{SITE.tagline}</p></div><ChakraMotif size={36} className="text-[#06038d]" /></div>
          </header>
          <div className="py-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b85c00]">Certificate of verified skill</p>
            <p className="mt-6 text-sm text-[#4b5877]">This is to certify that</p>
            <h2 className="mt-1 font-display text-4xl font-extrabold sm:text-5xl">{learnerName}</h2>
            <p className="mt-5 text-sm text-[#4b5877]">has demonstrated verified capability in</p>
            <p className="mt-1 font-display text-3xl font-bold text-[#1a2b8f]">{skillName}</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, ${level.from}, ${level.to})` }}><SealCheck size={18} weight="fill" aria-hidden="true" />{level.name} level</p>
          </div>
          <dl className="grid gap-4 border-t border-[#0b1b3a]/15 pt-5 text-sm sm:grid-cols-2">
            <div><dt className="text-[#4b5877]">Verification basis</dt><dd className="font-semibold">{c.basis}</dd><dd className="mt-0.5 text-xs text-[#4b5877]">Course: {course.title}</dd></div>
            <div><dt className="text-[#4b5877]">Issue date</dt><dd className="font-semibold">{formatDate(c.issuedAt)}</dd><dt className="mt-2 text-[#4b5877]">Credential ID</dt><dd className="font-mono font-semibold">{c.credentialNumber}</dd></div>
          </dl>
          <div className="mt-4 flex items-center gap-3 sm:justify-end">
              <div role="img" aria-label="QR code placeholder" className="grid size-20 shrink-0 grid-cols-5 gap-0.5 rounded-md border border-dashed border-[#4b5877] p-1.5">{Array.from({ length: 25 }, (_, i) => <span key={i} className={[0,1,2,4,5,6,10,12,14,18,20,22,23,24,8,16].includes(i) ? "bg-[#0b1b3a]/70" : ""} />)}</div>
              <div className="min-w-0 text-xs text-[#4b5877]"><p>QR placeholder</p><p className="break-all">Verify (placeholder): {verifyUrl}</p></div>
            </div>
          <footer className="mt-6 flex flex-wrap items-end justify-between gap-3 border-t border-dashed border-[#0b1b3a]/20 pt-4 text-xs text-[#4b5877]"><p>Authorised signatory and seal: [to be supplied by the approved issuing authority]</p><p>Status: <strong className="text-[#138808]">{c.verificationStatus === "verified" ? "Verified" : c.verificationStatus}</strong></p></footer>
        </div>
      </div>
      {showActions && <div className="no-print flex flex-wrap gap-2 border-t border-[#0b1b3a]/10 bg-[#f3efe8] p-4"><Button size="sm" variant="secondary" className="border-[#0b1b3a]/30 bg-white text-[#0b1b3a] hover:bg-[#f3efe8]" onClick={() => window.print()}><Printer size={16} />Print / save as PDF</Button><Button size="sm" variant="ghost" className="text-[#0b1b3a] hover:bg-black/5" href={`/verify/${c.credentialNumber}`}>Public verification page</Button></div>}
    </motion.article>
  );
}
