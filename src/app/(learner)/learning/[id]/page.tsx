import { CourseProgress } from "@/features/learning/course-progress";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <CourseProgress id={id} />; }
