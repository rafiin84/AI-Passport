import type { Metadata } from "next";
import { BaselineRunner } from "@/features/assessment/baseline-runner";
export const metadata: Metadata = { title: "AI Challenge" };
export default function AssessmentPage() { return <BaselineRunner />; }
