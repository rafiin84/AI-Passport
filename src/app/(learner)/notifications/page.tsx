import type { Metadata } from "next";
import { NotificationsPage } from "@/features/learning/notifications-page";
export const metadata: Metadata = { title: "Notifications" };
export default function Page() { return <NotificationsPage />; }
