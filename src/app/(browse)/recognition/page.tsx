import type { Metadata } from "next";
import { RecognitionHome } from "@/features/recognition/recognition-home";
export const metadata: Metadata = { title: "Top 100 recognition" };
export default function Page() { return <RecognitionHome />; }
