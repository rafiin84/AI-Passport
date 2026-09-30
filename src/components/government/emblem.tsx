import { cn } from "@/lib/utils";

/**
 * PLACEHOLDER ONLY. The State Emblem of India must be used only from the approved government asset,
 * unaltered and per the rules governing its use. This box deliberately does not attempt to draw it.
 * To go live: replace the body of this component with the supplied approved asset.
 */
export function StateEmblemPlaceholder({ size = 44, className }: { size?: number; className?: string }) {
  return (
    <div role="img" aria-label="Placeholder for the approved State Emblem of India. Official asset pending." title="Approved State Emblem of India — asset pending"
      className={cn("grid shrink-0 place-items-center rounded-lg border-2 border-dashed border-muted/60 bg-surface-2 text-center text-[7px] font-bold uppercase leading-[1.1] tracking-wide text-muted", className)} style={{ width: size, height: size }}>
      <span aria-hidden="true">State<br />Emblem<br />asset<br />pending</span>
    </div>
  );
}

/** Placeholder for approved IndiaAI branding. */
export function IndiaAIHeader({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2 rounded-lg border border-dashed border-muted/60 px-2.5 py-1.5 text-xs font-semibold text-muted", className)} title="Approved IndiaAI branding — asset pending">
      <span className="size-2 rounded-full bg-saffron" aria-hidden="true" /> IndiaAI <span className="font-normal">(approved branding pending)</span>
    </div>
  );
}
