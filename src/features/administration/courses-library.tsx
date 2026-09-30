"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { adminListCourses, adminSetCourseStatus } from "@/lib/api";
import { useAction } from "@/hooks/use-api";
import { AdminTable, type Column } from "@/components/admin/admin-table";
import { PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip, LevelBadge } from "@/components/ui/badge";
import { LoadingBlock } from "@/components/ui/states";
import { PROVIDERS } from "@/constants/providers";
import type { Course } from "@/types";

export function CoursesLibrary() {
  const { data } = useQuery({ queryKey: ["admin-courses"], queryFn: adminListCourses });
  const set = useAction((v: { id: string; s: Parameters<typeof adminSetCourseStatus>[1] }) => adminSetCourseStatus(v.id, v.s), { success: "Course updated" });
  if (!data) return <LoadingBlock />;
  const cols: Column<Course>[] = [
    { key: "title", header: "Course", sortValue: (c) => c.title, render: (c) => <div className="min-w-56"><Link href={`/admin/courses/${c.id}`} className="font-semibold text-brand hover:underline">{c.title}</Link><p className="text-xs text-muted">{PROVIDERS[c.provider].name} · {c.duration}</p></div> },
    { key: "level", header: "Level", sortValue: (c) => c.level, render: (c) => <LevelBadge level={c.level} size="sm" /> },
    { key: "status", header: "Status", sortValue: (c) => c.status, render: (c) => <div className="flex gap-1.5"><Chip tone={c.status === "published" ? "green" : c.status === "draft" ? "saffron" : "neutral"}>{c.status}</Chip>{c.featured && <Chip tone="brand">featured</Chip>}</div> },
    { key: "asm", header: "Assessment", render: (c) => c.verificationAssessmentId ? <Chip tone="green">approved</Chip> : <Link className="text-sm font-semibold text-brand underline" href={`/admin/courses/${c.id}/assessment`}>Set up</Link> },
    { key: "act", header: "Actions", render: (c) => (
      <div className="flex flex-wrap gap-1.5">
        {c.status === "published" ? <Button size="sm" variant="secondary" onClick={() => set.mutate({ id: c.id, s: "unpublished" })}>Unpublish</Button> : <Button size="sm" onClick={() => set.mutate({ id: c.id, s: "published" })}>Publish</Button>}
        <Button size="sm" variant="ghost" onClick={() => set.mutate({ id: c.id, s: c.featured ? "unfeature" : "feature" })}>{c.featured ? "Unfeature" : "Feature"}</Button>
      </div>) },
  ];
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Courses" title="Course library" sub={`${data.length} courses. Paste a URL to add a new one — AI drafts the metadata, you review it.`} action={<Button href="/admin/courses/new" variant="saffron">Add course</Button>} />
      <AdminTable columns={cols} rows={data} caption="Courses" searchText={(c) => `${c.title} ${c.provider} ${c.level}`} />
    </div>
  );
}
