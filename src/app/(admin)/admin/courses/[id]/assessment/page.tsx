import { Suspense } from "react";
import { AssessmentEditor } from "@/features/administration/assessment-editor";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <Suspense><AssessmentEditor courseId={id} /></Suspense>; }
