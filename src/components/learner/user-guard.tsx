"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/use-api";
import { LoadingBlock, SignInPrompt } from "@/components/ui/states";
import { useRegister } from "@/store/register";

/** Learner pages need a (mock) session. New users who haven't finished profile setup are sent back to it. */
export function UserGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useProfile();
  const router = useRouter();
  const setStep = useRegister((s) => s.setStep);
  const incomplete = !!user && !user.name;
  useEffect(() => { if (incomplete) { setStep("profile"); router.replace("/register"); } }, [incomplete, router, setStep]);
  if (isLoading || incomplete) return <LoadingBlock label="Loading your space" />;
  if (!user) return <SignInPrompt />;
  return <>{children}</>;
}
