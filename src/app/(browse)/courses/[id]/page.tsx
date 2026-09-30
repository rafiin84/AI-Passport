import { CourseDetail } from "@/features/courses/course-detail";
export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <CourseDetail id={id} />; }
