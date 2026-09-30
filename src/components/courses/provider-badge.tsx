import { PROVIDERS } from "@/constants/providers";
import type { ProviderId } from "@/types";

export function ProviderBadge({ provider, plain }: { provider: ProviderId; plain?: boolean }) {
  const p = PROVIDERS[provider];
  if (plain) return <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-fg"><span className="size-2.5 rounded-full" style={{ background: p.color }} aria-hidden="true" />{p.name}</span>;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[#0b1b3a] shadow-sm">
      <span className="size-2 rounded-full" style={{ background: p.color }} aria-hidden="true" />{p.name}
    </span>
  );
}
