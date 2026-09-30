"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List } from "@phosphor-icons/react";
import { useState } from "react";
import { Logo } from "./logo";
import { Icon } from "@/components/ui/icon";
import { ADMIN_NAV } from "@/constants/nav";
import { Chip } from "@/components/ui/badge";
import { Drawer } from "@/components/ui/modal";
import { AccessibilityControls } from "@/components/government/accessibility-controls";
import { TricolourAccent } from "@/components/government/tricolour";
import { cn } from "@/lib/utils";

function Nav({ path, onNavigate }: { path: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Admin" className="space-y-1">
      {ADMIN_NAV.map((n) => {
        const active = n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
        return (
          <Link key={n.href} href={n.href} onClick={onNavigate} aria-current={active ? "page" : undefined}
            className={cn("flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold", active ? "bg-brand text-brand-fg" : "text-fg hover:bg-surface-2")}>
            <Icon name={n.icon} size={20} weight={active ? "fill" : "regular"} />{n.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-dvh">
      <TricolourAccent />
      <div className="flex">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-4 overflow-y-auto border-r border-line bg-surface p-4 lg:flex">
          <Logo className="px-2 py-2" href="/admin" />
          <Chip tone="saffron" className="self-start">Kartik · Admin console</Chip>
          <Nav path={path} />
          <Link href="/dashboard" className="mt-auto rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-surface-2">← Learner view</Link>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-line bg-bg/85 px-4 backdrop-blur-xl lg:px-8">
            <button className="grid size-11 place-items-center rounded-full hover:bg-surface-2 lg:hidden" aria-label="Open admin menu" onClick={() => setOpen(true)}><List size={24} /></button>
            <p className="hidden text-sm text-muted lg:block">Internal tool — reviewer notes and unpublished drafts are never shown to the public.</p>
            <AccessibilityControls className="ml-auto" />
          </header>
          <main id="main" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-6 outline-none lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
      <Drawer open={open} onOpenChange={setOpen} title="Admin menu" side="left"><Nav path={path} onNavigate={() => setOpen(false)} /></Drawer>
    </div>
  );
}
