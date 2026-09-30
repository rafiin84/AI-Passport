import Link from "next/link";
import { ChakraMotif } from "@/components/government/tricolour";
import { cn } from "@/lib/utils";

export function Logo({ className, tagline = false, href = "/" }: { className?: string; tagline?: boolean; href?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)} aria-label="AI Praman home">
      <span className="relative grid size-10 place-items-center rounded-xl bg-[#0b1b3a] text-white shadow-card">
        <span className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-saffron via-white to-india-green" aria-hidden="true" />
        <ChakraMotif size={22} className="text-[#a9b4ff] transition-transform duration-700 group-hover:rotate-90" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-lg font-extrabold tracking-tight text-fg">AI Praman</span>
        {tagline && <span className="block text-[0.7rem] font-medium text-muted">AI skills badhao. India ko aage badhao.</span>}
      </span>
    </Link>
  );
}
