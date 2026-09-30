"use client";
import { useCredentials, errorMessage } from "@/hooks/use-api";
import { PageHeader } from "@/components/ui/card";
import { BadgeCard } from "@/components/passport/badge-card";
import { EmptyState, ErrorState, LoadingBlock } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/use-t";

export function BadgesPage() {
  const t = useT();
  const { data, isLoading, error, refetch } = useCredentials();
  if (isLoading) return <LoadingBlock />;
  if (error) return <ErrorState body={errorMessage(error)} onRetry={() => refetch()} />;
  return (
    <div>
      <PageHeader eyebrow="Badge collection" title="Your verified skills" sub="Every badge and certificate here was earned by proving what you learned." />
      {!data?.length ? <EmptyState title={t("empty.certs")} action={<Button href="/discover">Find a course</Button>} /> : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{data.map((c) => <li key={c.id}><BadgeCard id={c.id} skill={c.skillName} level={c.level} date={c.issuedAt} type={c.type} /></li>)}</ul>
      )}
    </div>
  );
}
