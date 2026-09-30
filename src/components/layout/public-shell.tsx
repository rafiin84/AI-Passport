"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GovernmentHeader } from "@/components/government/government-header";
import { GovernmentFooter } from "@/components/government/government-footer";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/use-t";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/use-api";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const t = useT();
  const path = usePathname();
  const { data: user } = useProfile();
  const links = [["/about", "nav.about"], ["/mission", "nav.mission"], ["/recognition", "nav.recognition"], ["/faq", "nav.faq"]] as const;
  return (
    <>
      <GovernmentHeader />
      <header className="no-print sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo tagline />
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {links.map(([h, k]) => (
              <Link key={h} href={h} aria-current={path.startsWith(h) ? "page" : undefined} className={cn("rounded-full px-4 py-2 text-sm font-semibold hover:bg-surface-2", path.startsWith(h) ? "text-brand" : "text-fg")}>{t(k)}</Link>
            ))}
          </nav>
          <Button href={user ? "/dashboard" : "/register"} size="sm">{user ? "Go to my dashboard" : t("nav.signIn")}</Button>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="outline-none">{children}</main>
      <GovernmentFooter />
    </>
  );
}
