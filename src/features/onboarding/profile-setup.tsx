"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ChipSelect, ErrorSummary, SelectInput, TextInput } from "@/components/ui/field";
import { Logo } from "@/components/layout/logo";
import { aboutSchema, goalsSchema, prefsSchema, workSchema } from "@/lib/validation";
import { EDUCATION, EXPERIENCE, GOALS, INTERESTS, OCCUPATIONS, STATES } from "@/constants/site";
import { saveProfile } from "@/lib/api";
import { useAction } from "@/hooks/use-api";
import { useRegister } from "@/store/register";
import { useUi } from "@/store/ui";
import { cn } from "@/lib/utils";
import type { AiExperience, Language, OccupationStatus } from "@/types";

const schema = aboutSchema.merge(workSchema).merge(goalsSchema).merge(prefsSchema);
type Values = z.infer<typeof schema>;
const STEPS: { title: string; sub: string; fields: (keyof Values)[] }[] = [
  { title: "First, who are you?", sub: "Just the basics.", fields: ["name", "dateOfBirth", "state", "city"] },
  { title: "What's your day like?", sub: "So we can pick examples that feel familiar.", fields: ["education", "occupationStatus", "field"] },
  { title: "How much AI have you used?", sub: "There's no wrong answer.", fields: ["aiExperience"] },
  { title: "What do you want from AI?", sub: "Pick your goals and interests.", fields: ["goals", "interests"] },
  { title: "Make it work for you", sub: "Language and accessibility. You can change these any time.", fields: ["preferredLanguage"] },
];

function OptionCard({ selected, onSelect, title, hint }: { selected: boolean; onSelect: () => void; title: string; hint?: string }) {
  return (
    <button type="button" role="radio" aria-checked={selected} onClick={onSelect}
      className={cn("min-h-16 rounded-2xl border p-4 text-left transition-all", selected ? "border-brand bg-brand-soft shadow-card ring-2 ring-brand" : "border-line bg-surface hover:bg-surface-2")}>
      <span className="block font-semibold text-fg">{title}</span>{hint && <span className="mt-0.5 block text-sm text-muted">{hint}</span>}
    </button>
  );
}

export function ProfileSetup() {
  const router = useRouter();
  const reset = useRegister((s) => s.reset);
  const setUiLang = useUi((s) => s.setLanguage);
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [step]);
  const { register, control, trigger, handleSubmit, watch, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema), mode: "onTouched",
    defaultValues: { name: "", dateOfBirth: "", state: "", city: "", education: "", occupationStatus: "", field: "", aiExperience: undefined, goals: [], interests: [], preferredLanguage: "en", largeText: false, highContrast: false, reduceMotion: false, screenReader: false },
  });
  const save = useAction((v: Values) => saveProfile({
    name: v.name, dateOfBirth: v.dateOfBirth, state: v.state, city: v.city, education: v.education, occupationStatus: v.occupationStatus as OccupationStatus, field: v.field,
    aiExperience: v.aiExperience as AiExperience, goals: v.goals, interests: v.interests, preferredLanguage: v.preferredLanguage as Language,
    accessibilityPreferences: { largeText: v.largeText, highContrast: v.highContrast, reduceMotion: v.reduceMotion, screenReader: v.screenReader },
  }), { onSuccess: (_u) => { reset(); router.push("/assessment"); } });

  const next = async () => { if (await trigger(STEPS[step]!.fields)) setStep((s) => s + 1); };
  const errList = STEPS[step]!.fields.flatMap((f) => (errors[f]?.message ? [{ id: String(f), message: String(errors[f]!.message) }] : []));
  const last = step === STEPS.length - 1;
  const ui = useUi();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 flex items-center justify-between"><Logo /><span className="text-sm font-medium text-muted">{step + 1} / {STEPS.length}</span></div>
      <div className="mb-8 flex gap-1.5" aria-hidden="true">{STEPS.map((_, i) => <motion.span key={i} className="h-1.5 flex-1 rounded-full bg-surface-3" animate={{ backgroundColor: i <= step ? "var(--saffron)" : "var(--surface-3)" }} />)}</div>
      <form noValidate onSubmit={handleSubmit((v) => save.mutate(v))}>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ type: "spring", stiffness: 260, damping: 28 }} className="space-y-5">
            <div>
              <h1 ref={heading} tabIndex={-1} className="font-display text-3xl font-extrabold outline-none sm:text-4xl">{STEPS[step]!.title}</h1>
              <p className="mt-1 text-muted">{STEPS[step]!.sub}</p>
            </div>
            <ErrorSummary errors={errList} />
            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><TextInput label="Full name" autoComplete="name" required error={errors.name?.message} {...register("name")} /></div>
                <TextInput label="Date of birth" type="date" required max="2026-09-29" error={errors.dateOfBirth?.message} hint="Used to check age eligibility for youth programmes. Everyone can learn." {...register("dateOfBirth")} />
                <SelectInput label="State / UT" required options={STATES} placeholder="Choose" error={errors.state?.message} {...register("state")} />
                <div className="sm:col-span-2"><TextInput label="City or district" autoComplete="address-level2" required error={errors.city?.message} {...register("city")} /></div>
              </div>
            )}
            {step === 1 && (
              <div className="space-y-5">
                <Controller control={control} name="occupationStatus" render={({ field }) => (
                  <fieldset><legend className="mb-2 text-sm font-semibold">I am a…</legend>
                    <div role="radiogroup" className="grid gap-2 sm:grid-cols-2">{OCCUPATIONS.map((o) => <OptionCard key={o.value} selected={field.value === o.value} onSelect={() => field.onChange(o.value)} title={o.label} />)}</div>
                    {errors.occupationStatus && <p role="alert" id="occupationStatus" className="mt-1 text-sm font-medium text-danger">{errors.occupationStatus.message}</p>}
                  </fieldset>
                )} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectInput label="Education" required options={EDUCATION} placeholder="Choose" error={errors.education?.message} {...register("education")} />
                  <TextInput label="Field of study or work" required placeholder="e.g. Computer Science, Retail, Farming" error={errors.field?.message} {...register("field")} />
                </div>
              </div>
            )}
            {step === 2 && (
              <Controller control={control} name="aiExperience" render={({ field }) => (
                <div role="radiogroup" aria-label="AI experience" className="grid gap-2">{EXPERIENCE.map((o) => <OptionCard key={o.value} selected={field.value === o.value} onSelect={() => field.onChange(o.value)} title={o.label} hint={o.hint} />)}
                  {errors.aiExperience && <p role="alert" id="aiExperience" className="text-sm font-medium text-danger">{errors.aiExperience.message}</p>}</div>
              )} />
            )}
            {step === 3 && (
              <div className="space-y-6">
                <Controller control={control} name="goals" render={({ field }) => <div><ChipSelect label="My goals" options={GOALS} value={field.value} onChange={field.onChange} />{errors.goals && <p role="alert" id="goals" className="mt-1 text-sm font-medium text-danger">{errors.goals.message}</p>}</div>} />
                <Controller control={control} name="interests" render={({ field }) => <div><ChipSelect label="Areas I care about" options={INTERESTS} value={field.value} onChange={field.onChange} />{errors.interests && <p role="alert" id="interests" className="mt-1 text-sm font-medium text-danger">{errors.interests.message}</p>}</div>} />
              </div>
            )}
            {step === 4 && (
              <div className="space-y-5">
                <SelectInput label="Preferred language" options={[{ value: "en", label: "English" }, { value: "hi", label: "हिन्दी (Hindi)" }]} {...register("preferredLanguage", { onChange: (e) => setUiLang(e.target.value as Language) })} />
                <fieldset className="space-y-2"><legend className="text-sm font-semibold">Accessibility</legend>
                  {([["largeText", "Larger text"], ["highContrast", "High contrast"], ["reduceMotion", "Reduce motion"], ["screenReader", "I use a screen reader"]] as const).map(([k, l]) => (
                    <label key={k} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-line bg-surface px-4">
                      <input type="checkbox" className="size-5 accent-[var(--brand)]" {...register(k, { onChange: (e) => { const on = e.target.checked; if (k === "largeText") ui.setTextScale(on ? 115 : 100); if (k === "highContrast") ui.setHighContrast(on); if (k === "reduceMotion") ui.setReduceMotion(on); } })} />
                      <span className="font-medium">{l}</span>
                    </label>
                  ))}
                </fieldset>
                {watch("name") && <p className="rounded-2xl bg-brand-soft p-4 text-brand">Nice to meet you, <strong>{watch("name").split(" ")[0]}</strong>. Next: a friendly challenge to find your AI level.</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="sticky bottom-0 -mx-4 mt-8 flex gap-3 border-t border-line bg-bg/90 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0">
          {step > 0 && <Button type="button" variant="secondary" size="lg" onClick={() => setStep((s) => s - 1)}><ArrowLeft size={18} />Back</Button>}
          {!last ? <Button key="next" type="button" size="lg" className="flex-1" onClick={next}>Continue <ArrowRight size={18} weight="bold" /></Button>
            : <Button key="finish" type="submit" size="lg" variant="saffron" className="flex-1" loading={save.isPending}>Take me to the AI Challenge</Button>}
        </div>
      </form>
    </div>
  );
}
