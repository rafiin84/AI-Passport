"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { adminListCourses, adminSaveCourse, adminSetCourseStatus } from "@/lib/api";
import { errorMessage, useAction } from "@/hooks/use-api";
import { PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/badge";
import { ErrorState, LoadingBlock } from "@/components/ui/states";
import { CourseEditor, draftToValues } from "./course-editor";

export function CourseEdit({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-courses"], queryFn: adminListCourses });
  const save = useAction(adminSaveCourse, { success: "Saved" });
  const status = useAction((s: Parameters<typeof adminSetCourseStatus>[1]) => adminSetCourseStatus(id, s), { success: "Course updated" });
  if (isLoading) return <LoadingBlock />;
  const course = data?.find((c) => c.id === id);
  if (error || !course) return <ErrorState title="Course not found" body={errorMessage(error)} />;
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Course editor" title={course.title} sub="Changes to published courses go live as soon as you save." action={
        <div className="flex flex-wrap items-center gap-2"><Chip tone={course.status === "published" ? "green" : "saffron"}>{course.status}</Chip>
          {course.status === "published" ? <Button variant="secondary" onClick={() => status.mutate("unpublished")}>Unpublish</Button> : <Button onClick={() => status.mutate("published")}>Publish</Button>}
          <Button variant="ghost" onClick={() => status.mutate(course.featured ? "unfeature" : "feature")}>{course.featured ? "Unfeature" : "Feature"}</Button>
          <Button variant="soft" href={`/admin/courses/${id}/assessment`}>Assessment</Button></div>} />
      <p className="text-sm text-muted"><Link href="/admin/courses" className="underline">← Course library</Link></p>
      <CourseEditor key={course.updatedAt} initial={draftToValues(course)} base={course} saving={save.isPending} onSave={(d) => save.mutate(d)} submitLabel="Save changes" />
    </div>
  );
}
