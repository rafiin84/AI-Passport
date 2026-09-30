"use client";
import Link from "next/link";
import { Bell, Certificate, Medal, Rocket, Target, BookOpenText, Info } from "@phosphor-icons/react";
import { useNotifications, useAction, errorMessage } from "@/hooks/use-api";
import { markNotificationsRead } from "@/lib/api";
import { PageHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/ui/states";
import { timeAgo, cn } from "@/lib/utils";

const ICON = { credential: Certificate, assessment: Target, course: BookOpenText, project: Rocket, recognition: Medal, system: Info } as const;

export function NotificationsPage() {
  const { data, isLoading, error, refetch } = useNotifications();
  const read = useAction(() => markNotificationsRead());
  if (isLoading) return <LoadingBlock />;
  if (error) return <ErrorState body={errorMessage(error)} onRetry={() => refetch()} />;
  const unread = data?.filter((n) => !n.read).length ?? 0;
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Notifications" sub={unread ? `${unread} new` : "You're all caught up"} action={unread > 0 ? <Button variant="secondary" size="sm" loading={read.isPending} onClick={() => read.mutate(undefined)}>Mark all as read</Button> : undefined} />
      {!data?.length ? <EmptyState icon={<Bell size={28} />} title="Nothing new" body="Updates about your courses, verification and projects will appear here." /> : (
        <ul className="space-y-2">{data.map((n) => { const I = ICON[n.kind]; const inner = (
          <div className={cn("flex gap-3 rounded-2xl border p-4", n.read ? "border-line bg-surface" : "border-saffron bg-saffron-soft")}>
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface text-brand"><I size={22} weight="duotone" aria-hidden="true" /></span>
            <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><p className="font-semibold">{!n.read && <span className="sr-only">Unread: </span>}{n.title}</p><time className="shrink-0 text-xs text-muted" dateTime={n.at}>{timeAgo(n.at)}</time></div><p className="text-sm text-muted">{n.body}</p></div>
          </div>); return <li key={n.id}>{n.href ? <Link href={n.href} className="block">{inner}</Link> : inner}</li>; })}</ul>
      )}
    </div>
  );
}
