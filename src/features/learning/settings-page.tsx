"use client";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile, useAction } from "@/hooks/use-api";
import { resetPrototype, saveProfile, signOut } from "@/lib/api";
import { PageHeader, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorState, LoadingBlock } from "@/components/ui/states";
import { SelectInput } from "@/components/ui/field";
import { LANGUAGES } from "@/constants/i18n";
import { useUi, type TextScale } from "@/store/ui";
import { toast } from "@/store/toast";
import { Avatar } from "@/components/learner/avatar";
import type { Language } from "@/types";

function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-2">
      <span><span className="block font-semibold">{label}</span>{hint && <span className="text-sm text-muted">{hint}</span>}</span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-6 shrink-0 accent-[var(--brand)]" />
    </label>
  );
}

export function SettingsPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const ui = useUi();
  const { data: user, isLoading } = useProfile();
  const savePref = useAction((l: Language) => saveProfile({ preferredLanguage: l }));
  const out = useAction(() => signOut(), { onSuccess: () => { qc.clear(); router.push("/"); } });
  const reset = useAction(() => resetPrototype(), { onSuccess: () => { qc.clear(); toast.success("Prototype data reset"); router.push("/"); } });
  if (isLoading) return <LoadingBlock />;
  if (!user) return <ErrorState title="Not signed in" />;
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Settings" />
      <Card className="flex items-center gap-4 p-5"><Avatar name={user.name} hue={user.avatarHue} size={56} /><div><p className="font-display text-xl font-bold">{user.name}</p><p className="text-sm text-muted">{user.city}, {user.state} · Aadhaar <span className="font-mono">{user.maskedAadhaar}</span></p>
        <p className="text-sm text-muted">{user.ageEligibility === "youth_eligible" ? "Eligible for youth-programme benefits (ages 15–29)" : "General learner — you can learn, verify and build; youth-specific benefits may not apply"}</p></div></Card>
      <Card className="p-5"><h2 className="font-display text-xl font-bold">Language</h2>
        <div className="mt-3"><SelectInput label="Preferred language" value={ui.language} options={LANGUAGES.map((l) => ({ value: l.code, label: l.native }))} onChange={(e) => { const l = e.target.value as Language; ui.setLanguage(l); savePref.mutate(l); }} /></div>
        <p className="mt-2 text-sm text-muted">More Indian languages will be added. Some pages are still English-only in this prototype.</p></Card>
      <Card className="divide-y divide-line p-5"><h2 className="pb-2 font-display text-xl font-bold">Accessibility and display</h2>
        <div className="py-3"><label htmlFor="ts" className="block font-semibold">Text size</label>
          <select id="ts" value={ui.textScale} onChange={(e) => ui.setTextScale(Number(e.target.value) as TextScale)} className="mt-2 h-12 w-full rounded-2xl border border-line bg-surface px-4"><option value={100}>Standard</option><option value={115}>Large</option><option value={130}>Extra large</option></select></div>
        <Toggle label="High contrast" hint="Stronger borders and text" checked={ui.highContrast} onChange={ui.setHighContrast} />
        <Toggle label="Reduce motion" hint="Turns off animations" checked={ui.reduceMotion} onChange={ui.setReduceMotion} />
        <Toggle label="Dark mode" checked={ui.theme === "dark"} onChange={(v) => ui.setTheme(v ? "dark" : "light")} /></Card>
      <Card className="space-y-3 p-5"><h2 className="font-display text-xl font-bold">Account</h2><div className="flex flex-wrap gap-3"><Button variant="secondary" loading={out.isPending} onClick={() => out.mutate(undefined)}>Sign out</Button></div>
        <div className="rounded-2xl border border-dashed border-line p-4"><p className="font-semibold">Prototype tools</p><p className="text-sm text-muted">Restores all sample data and removes anything you created.</p><Button className="mt-3" size="sm" variant="danger" loading={reset.isPending} onClick={() => reset.mutate(undefined)}>Reset prototype data</Button></div></Card>
    </div>
  );
}
