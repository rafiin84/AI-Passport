import { Suspense } from "react";
import type { Metadata } from "next";
import { ResultView } from "@/features/assessment/result-view";
import { LoadingBlock } from "@/components/ui/states";
export const metadata: Metadata = { title: "Your AI level" };
export default function ResultPage() { return <Suspense fallback={<LoadingBlock />}><ResultView /></Suspense>; }
