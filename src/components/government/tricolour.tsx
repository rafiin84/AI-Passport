import { cn } from "@/lib/utils";

/** Thin decorative tricolour strip. Purely decorative. */
export function TricolourAccent({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("tricolour-bar", className)} />;
}

/** Small ashoka-chakra-inspired motif (24 spokes, generic geometry — NOT the State Emblem). */
export function ChakraMotif({ size = 32, className }: { size?: number; className?: string }) {
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={className} fill="none" stroke="currentColor">
      <circle cx="32" cy="32" r="29" strokeWidth="3" />
      <circle cx="32" cy="32" r="5" fill="currentColor" stroke="none" />
      {spokes.map((a) => <line key={a} x1="32" y1="32" x2="32" y2="5" strokeWidth="1.6" transform={`rotate(${a} 32 32)`} />)}
    </svg>
  );
}
