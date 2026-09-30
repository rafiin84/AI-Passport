"use client";
import { SKILLS } from "@/mocks/skills";
import { PageHeader } from "@/components/ui/card";
import { AdminTable, type Column } from "@/components/admin/admin-table";
import { LevelBadge, Chip } from "@/components/ui/badge";
import type { Skill } from "@/types";

export function SkillsPage() {
  const cols: Column<Skill>[] = [
    { key: "n", header: "Skill", sortValue: (s) => s.name, render: (s) => <div className="min-w-48"><p className="font-semibold">{s.name}</p><p className="text-xs text-muted">{s.description}</p></div> },
    { key: "c", header: "Category", sortValue: (s) => s.category, render: (s) => s.category },
    { key: "l", header: "Levels", render: (s) => <div className="flex flex-wrap gap-1">{s.levels.map((l) => <LevelBadge key={l} level={l} size="sm" />)}</div> },
    { key: "e", header: "Evidence types", render: (s) => <div className="flex flex-wrap gap-1">{s.evidenceTypes.map((e) => <Chip key={e}>{e}</Chip>)}</div> },
  ];
  return <div className="space-y-6"><PageHeader eyebrow="Assessments" title="Skill taxonomy" sub={`${SKILLS.length} skills across the five-level AI Proficiency Framework.`} /><AdminTable columns={cols} rows={SKILLS} caption="Skills" searchText={(s) => `${s.name} ${s.category}`} /></div>;
}
