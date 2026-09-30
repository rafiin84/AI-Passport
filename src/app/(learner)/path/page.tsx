import type { Metadata } from "next";
import { PathView } from "@/features/assessment/path-view";
export const metadata: Metadata = { title: "Your learning path" };
export default function PathPage() { return <PathView />; }
