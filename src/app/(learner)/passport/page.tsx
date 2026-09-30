import type { Metadata } from "next";
import { PassportPage } from "@/features/passport/passport-page";
export const metadata: Metadata = { title: "My AI Passport" };
export default function Page() { return <PassportPage />; }
