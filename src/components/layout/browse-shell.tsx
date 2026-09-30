"use client";
import { useProfile } from "@/hooks/use-api";
import { AppShell } from "./app-shell";
import { PublicShell } from "./public-shell";

/** Pages that anyone can read (catalogue, recognition) but that feel native inside the learner app once signed in. */
export function BrowseShell({ children }: { children: React.ReactNode }) {
  const { data: user } = useProfile();
  return user?.name ? <AppShell>{children}</AppShell> : <PublicShell>{children}</PublicShell>;
}
