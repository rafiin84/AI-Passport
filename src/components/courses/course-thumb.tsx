import { Icon } from "@/components/ui/icon";
import { ProviderBadge } from "./provider-badge";
import type { Course } from "@/types";

type Scene = "field" | "health" | "language" | "code" | "learn" | "network";

function sceneFor(c: Pick<Course, "domains" | "categories" | "skills">): Scene {
  const t = [...c.domains, ...c.categories, ...c.skills].join(" ").toLowerCase();
  if (/agri|farm/.test(t)) return "field";
  if (/health/.test(t)) return "health";
  if (/language/.test(t)) return "language";
  if (/coding|sdlc|software|claude|mcp|app-dev/.test(t)) return "code";
  if (/education|student|creator|literacy|fundamental|primer/.test(t)) return "learn";
  return "network";
}

/** Original vector illustration per topic (no stock photos, no real people). */
function SceneArt({ scene, to }: { scene: Scene; to: string }) {
  const w = "rgba(255,255,255,";
  return (
    <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden="true">
      <circle cx="330" cy="46" r="26" fill={`${w}0.35)`} />
      {scene === "field" && (<>
        <path d="M0 150 Q100 110 200 140 T400 120 V200 H0Z" fill={`${w}0.22)`} /><path d="M0 172 Q120 140 240 165 T400 150 V200 H0Z" fill={to} opacity="0.55" />
        {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${20 + i * 28} 200 V${168 - (i % 3) * 6}`} stroke={`${w}0.7)`} strokeWidth="2.5" strokeLinecap="round" />)}
        {Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={20 + i * 28} cy={164 - (i % 3) * 6} rx="4" ry="8" fill={`${w}0.85)`} />)}
      </>)}
      {scene === "health" && (<>
        <path d="M0 130 H90 L110 95 L140 165 L165 110 L185 130 H400" fill="none" stroke={`${w}0.85)`} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0 160 H400" stroke={`${w}0.25)`} strokeWidth="2" strokeDasharray="4 8" /><rect x="292" y="112" width="56" height="56" rx="16" fill={`${w}0.25)`} /><path d="M320 126v28M306 140h28" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      </>)}
      {scene === "language" && (<>
        {[["अ", 40, 150, 64], ["க", 130, 120, 54], ["অ", 210, 160, 58], ["ਪ", 285, 130, 62], ["અ", 345, 175, 46]].map(([g, x, y, s]) => <text key={String(g)} x={x as number} y={y as number} fontSize={s as number} fontWeight="700" fill={`${w}0.7)`} fontFamily="'Noto Sans Devanagari', sans-serif">{g}</text>)}
      </>)}
      {scene === "code" && (<>
        <rect x="40" y="88" width="240" height="96" rx="14" fill={`${w}0.18)`} />
        <circle cx="58" cy="104" r="4" fill={`${w}0.7)`} /><circle cx="72" cy="104" r="4" fill={`${w}0.5)`} /><circle cx="86" cy="104" r="4" fill={`${w}0.35)`} />
        {[[56, 128, 90], [72, 146, 130], [72, 162, 70], [56, 176, 50]].map(([x, y, l], i) => <rect key={i} x={x} y={y - 6} width={l} height="8" rx="4" fill={`${w}0.6)`} />)}
        <text x="300" y="165" fontSize="64" fontWeight="800" fill={`${w}0.8)`} fontFamily="monospace">{"</>"}</text>
      </>)}
      {scene === "learn" && (<>
        <path d="M200 90 L330 128 L200 166 L70 128Z" fill={`${w}0.75)`} /><path d="M120 146 V180 Q200 208 280 180 V146 L200 172Z" fill={`${w}0.5)`} /><path d="M330 128 V170" stroke={`${w}0.85)`} strokeWidth="4" strokeLinecap="round" /><circle cx="330" cy="174" r="7" fill={`${w}0.9)`} />
      </>)}
      {scene === "network" && (<>
        {[[70, 150], [150, 105], [230, 160], [300, 100], [350, 165], [190, 60]].map(([x, y], i, a) => (<g key={i}>{i > 0 && <line x1={a[i - 1]![0]} y1={a[i - 1]![1]} x2={x} y2={y} stroke={`${w}0.45)`} strokeWidth="2" />}<circle cx={x} cy={y} r={i % 2 ? 9 : 13} fill={`${w}0.8)`} /></g>))}
        <line x1="150" y1="105" x2="300" y2="100" stroke={`${w}0.35)`} strokeWidth="2" /><line x1="190" y1="60" x2="300" y2="100" stroke={`${w}0.35)`} strokeWidth="2" />
      </>)}
    </svg>
  );
}

export function CourseThumb({ course, className = "h-36" }: { course: Pick<Course, "thumbnail" | "provider" | "title" | "domains" | "categories" | "skills">; className?: string }) {
  const { from, to, icon } = course.thumbnail;
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: `linear-gradient(135deg, ${from}, ${to})` }} role="img" aria-label={`${course.title} — course artwork`}>
      <div className="jaali absolute inset-0 opacity-40 mix-blend-overlay" />
      <SceneArt scene={sceneFor(course)} to={to} />
      <div className="absolute bottom-3 left-3 grid size-11 place-items-center rounded-2xl bg-white/90 text-[#0b1b3a] shadow-card"><Icon name={icon} size={24} weight="fill" /></div>
      <div className="absolute left-3 top-3"><ProviderBadge provider={course.provider} /></div>
    </div>
  );
}
