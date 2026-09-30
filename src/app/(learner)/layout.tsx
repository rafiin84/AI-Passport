import { AppShell } from "@/components/layout/app-shell";
import { UserGuard } from "@/components/learner/user-guard";
export default function LearnerLayout({ children }: { children: React.ReactNode }) { return <AppShell><UserGuard>{children}</UserGuard></AppShell>; }
