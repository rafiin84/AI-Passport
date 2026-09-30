"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, GearSix, SignOut } from "@phosphor-icons/react";
import { GovernmentHeader } from "@/components/government/government-header";
import { GovernmentFooter } from "@/components/government/government-footer";
import { Logo } from "./logo";
import { Icon } from "@/components/ui/icon";
import { LEARNER_NAV, MOBILE_NAV } from "@/constants/nav";
import { useT } from "@/hooks/use-t";
import { useNotifications, useProfile } from "@/hooks/use-api";
import { LevelBadge } from "@/components/ui/badge";
import { signOut } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { cn, initials } from "@/lib/utils";
import { Avatar } from "@/components/learner/avatar";

function isActive(path: string, href: string) { return href === "/dashboard" ? path === href : path === href || path.startsWith(`${href}/`); }

export function AppShell({ children }: { children: React.ReactNode }) {
  const t = useT();
  const path = usePathname();
  const router = useRouter();
  const qc = useQueryClient();
  const { data: user } = useProfile();
  const { data: notes } = useNotifications();
  const unread = notes?.filter((n) => !n.read).length ?? 0;

  return (
    <div className="min-h-dvh">
      <GovernmentHeader />
      <div className="mx-auto flex max-w-[92rem]">
        <aside className="no-print sticky top-0 hidden h-dvh w-64 shrink-0 flex-col justify-between border-r border-line bg-surface/60 p-4 md:flex lg:w-72" aria-label="Sidebar">
          <div>
            <Logo className="px-2 py-3" />
            <nav aria-label="Main" className="mt-4 space-y-1">
              {LEARNER_NAV.map((n) => {
                const active = isActive(path, n.href);
                return (
                  <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined}
                    className={cn("flex min-h-12 items-center gap-3 rounded-2xl px-4 text-[0.95rem] font-semibold transition-colors", active ? "bg-brand text-brand-fg shadow-card" : "text-fg hover:bg-surface-2")}>
                    <Icon name={n.icon} size={22} weight={active ? "fill" : "regular"} />{t(n.key)}
                  </Link>
                );
              })}
            </nav>
          </div>
          {user && (
            <div className="rounded-2xl border border-line bg-surface p-3">
              <div className="flex items-center gap-3">
                <Avatar name={user.name || "?"} hue={user.avatarHue} size={40} />
                <div className="min-w-0"><p className="truncate text-sm font-bold text-fg">{user.name || "New learner"}</p>{user.currentLevel ? <LevelBadge level={user.currentLevel} size="sm" /> : <p className="text-xs text-muted">Level not set</p>}</div>
              </div>
              <div className="mt-3 flex gap-1">
                <Link href="/settings" className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl text-sm font-medium text-muted hover:bg-surface-2"><GearSix size={18} />Settings</Link>
                <button onClick={async () => { await signOut(); qc.clear(); router.push("/"); }} className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl text-sm font-medium text-muted hover:bg-surface-2"><SignOut size={18} />Sign out</button>
              </div>
            </div>
          )}
        </aside>

        <div className="min-w-0 flex-1">
          <header className="no-print sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-bg/85 px-4 backdrop-blur-xl md:justify-end md:px-8">
            <div className="md:hidden"><Logo /></div>
            <Link href="/notifications" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`} className="relative grid size-11 place-items-center rounded-full hover:bg-surface-2">
              <Bell size={24} />{unread > 0 && <span className="absolute right-2 top-2 grid min-w-4 place-items-center rounded-full bg-saffron px-1 text-[10px] font-bold text-[#1a1000]">{unread}</span>}
            </Link>
          </header>
          <main id="main" tabIndex={-1} className="mx-auto min-h-[70dvh] max-w-6xl px-4 pb-32 pt-6 outline-none sm:px-6 md:px-8 md:pb-16 md:pt-8">{children}</main>
          <GovernmentFooter />
        </div>
      </div>

      <nav aria-label="Primary" className="no-print fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {MOBILE_NAV.map((n) => {
            const active = isActive(path, n.href);
            return (
              <li key={n.href}>
                <Link href={n.href} aria-current={active ? "page" : undefined} className={cn("flex min-h-16 flex-col items-center justify-center gap-0.5 text-[0.7rem] font-semibold", active ? "text-brand" : "text-muted")}>
                  <span className={cn("grid h-8 w-14 place-items-center rounded-full transition-colors", active && "bg-brand-soft")}><Icon name={n.icon} size={24} weight={active ? "fill" : "regular"} /></span>{t(n.key)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
