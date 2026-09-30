import type { Metadata } from "next";
import { StaticPage } from "@/components/layout/static-page";
import { FeedbackForm } from "@/features/auth/feedback-form";
export const metadata: Metadata = { title: "Feedback" };
export default function Page() {
  return <StaticPage title="Feedback" eyebrow="Feedback" summary="Tell us what works, what doesn't and what would help."><FeedbackForm /></StaticPage>;
}
