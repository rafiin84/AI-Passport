"use client";
import { useQuery } from "@tanstack/react-query";
import { adminListCredentials, adminRevokeCredential } from "@/lib/api";
import { useAction } from "@/hooks/use-api";
import { AdminTable, type Column } from "@/components/admin/admin-table";
import { PageHeader } from "@/components/ui/card";
import { Chip, LevelBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingBlock } from "@/components/ui/states";
import { formatDate } from "@/lib/utils";

export function CredentialsAdmin() {
  const { data } = useQuery({ queryKey: ["admin-credentials"], queryFn: adminListCredentials });
  const rev = useAction((v: { id: string; revoke: boolean }) => adminRevokeCredential(v.id, v.revoke), { success: "Credential updated" });
  if (!data) return <LoadingBlock />;
  type Row = (typeof data)[number];
  const cols: Column<Row>[] = [
    { key: "n", header: "Credential ID", sortValue: (c) => c.credentialNumber, render: (c) => <span className="font-mono text-xs">{c.credentialNumber}</span> },
    { key: "l", header: "Learner", sortValue: (c) => c.learnerName, render: (c) => <span className="font-semibold">{c.learnerName}</span> },
    { key: "s", header: "Skill", render: (c) => <div><p>{c.skillName}</p><p className="text-xs text-muted">{c.type}</p></div> },
    { key: "v", header: "Level", render: (c) => <LevelBadge level={c.level} size="sm" /> },
    { key: "d", header: "Issued", sortValue: (c) => c.issuedAt, render: (c) => formatDate(c.issuedAt) },
    { key: "st", header: "Status", render: (c) => <Chip tone={c.verificationStatus === "verified" ? "green" : "danger"}>{c.verificationStatus}</Chip> },
    { key: "a", header: "", render: (c) => <Button size="sm" variant="ghost" onClick={() => rev.mutate({ id: c.id, revoke: c.verificationStatus === "verified" })}>{c.verificationStatus === "verified" ? "Revoke" : "Reinstate"}</Button> },
  ];
  return <div className="space-y-6"><PageHeader eyebrow="Credentials" title="Credential management" sub="Revoked credentials show as revoked on the public verification page." /><AdminTable columns={cols} rows={data} caption="Credentials" searchText={(c) => `${c.learnerName} ${c.skillName} ${c.credentialNumber}`} /></div>;
}
