import type { Metadata } from "next";
import { DiscoverView } from "@/features/courses/discover-view";
export const metadata: Metadata = { title: "Discover AI courses" };
export default function DiscoverPage() { return <DiscoverView />; }
