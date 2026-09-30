import type { Metadata } from "next";
import { BadgesPage } from "@/features/passport/badges-page";
export const metadata: Metadata = { title: "Badges" };
export default function Page() { return <BadgesPage />; }
