import type { Metadata } from "next";
import { MyLearning } from "@/features/learning/my-learning";
export const metadata: Metadata = { title: "My learning" };
export default function LearningPage() { return <MyLearning />; }
