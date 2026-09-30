"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { EyeSlash } from "@phosphor-icons/react";

/** Reviewer decision panel. Notes entered here are internal and never shown to learners publicly. */
export function ReviewPanel({ title, children, onApprove, onReject, busy, approveLabel = "Approve", rejectLabel = "Request changes", initialNote = "", rejectNeedsNote = true }: {
  title: string; children: React.ReactNode; onApprove: (note: string) => void; onReject?: (note: string) => void; busy?: boolean; approveLabel?: string; rejectLabel?: string; initialNote?: string; rejectNeedsNote?: boolean;
}) {
  const [note, setNote] = useState(initialNote);
  return (
    <Card className="space-y-4 p-5">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <div className="space-y-2 text-sm">{children}</div>
      <TextArea label="Reviewer note" hint="Shared with the learner only if you request changes." value={note} onChange={(e) => setNote(e.target.value)} />
      <p className="flex items-center gap-1.5 text-xs text-muted"><EyeSlash size={14} aria-hidden="true" />Internal notes are never shown publicly.</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" loading={busy} onClick={() => onApprove(note)}>{approveLabel}</Button>
        {onReject && <Button variant="secondary" disabled={busy || (rejectNeedsNote && note.trim().length < 5)} onClick={() => onReject(note)}>{rejectLabel}</Button>}
      </div>
    </Card>
  );
}
