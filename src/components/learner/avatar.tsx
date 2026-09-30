import { initials } from "@/lib/utils";

/** Generated initials avatar — no photos of real people are used anywhere in this prototype. */
export function Avatar({ name, hue, size = 44 }: { name: string; hue: number; size?: number }) {
  return (
    <span className="grid shrink-0 place-items-center rounded-full font-bold text-white" aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.38, background: `linear-gradient(135deg, hsl(${hue} 70% 52%), hsl(${(hue + 40) % 360} 70% 38%))` }}>
      {initials(name)}
    </span>
  );
}
