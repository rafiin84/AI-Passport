"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, IdentificationBadge, Lock, ShieldCheck, Sparkle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/field";
import { Chip } from "@/components/ui/badge";
import { ChakraMotif, TricolourAccent } from "@/components/government/tricolour";
import { useRegister, type RegisterStep } from "@/store/register";
import { aadhaarSchema, otpSchema } from "@/lib/validation";
import { mockAadhaarAuth } from "@/lib/api";
import { useAction } from "@/hooks/use-api";
import { maskAadhaar } from "@/lib/utils";
import { ProfileSetup } from "@/features/onboarding/profile-setup";
import { Logo } from "@/components/layout/logo";

const slide = { initial: { opacity: 0, x: 28 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -28 }, transition: { type: "spring" as const, stiffness: 260, damping: 28 } };
const ORDER: RegisterStep[] = ["welcome", "aadhaar", "consent", "otp", "success", "profile"];

function MockNotice() {
  return <p className="rounded-2xl border border-saffron/50 bg-saffron-soft p-3 text-sm text-saffron-deep"><strong>Prototype:</strong> this is a mock. No real Aadhaar service is contacted and no identity is verified.</p>;
}

export function RegisterFlow() {
  const { step, setStep, masked, reset } = useRegister();
  const router = useRouter();
  const idx = ORDER.indexOf(step);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, [step]);

  const demo = useAction(() => mockAadhaarAuth({ step: "demo" }), { onSuccess: () => { reset(); router.push("/dashboard"); } });

  if (step === "profile") return <ProfileSetup />;

  return (
    <div className="mx-auto grid min-h-[80dvh] max-w-5xl grid-cols-[minmax(0,1fr)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <aside className="hidden rounded-[2rem] bg-[#0b1b3a] p-8 text-white lg:block">
        <ChakraMotif size={44} className="text-[#a9b4ff]" />
        <h2 className="mt-6 font-display text-3xl font-extrabold leading-tight">Your AI journey starts with one quick step.</h2>
        <ul className="mt-6 space-y-4 text-white/80">
          <li className="flex gap-3"><Lock size={22} className="mt-0.5 shrink-0 text-[#ffb870]" aria-hidden="true" />Your full Aadhaar number is never shown or stored in this prototype. Only a masked version appears.</li>
          <li className="flex gap-3"><ShieldCheck size={22} className="mt-0.5 shrink-0 text-[#ffb870]" aria-hidden="true" />You choose what to share and can review consent at every step.</li>
          <li className="flex gap-3"><Sparkle size={22} className="mt-0.5 shrink-0 text-[#ffb870]" aria-hidden="true" />Everyone can register and learn. Some youth-specific benefits depend on age eligibility.</li>
        </ul>
      </aside>

      <div className="rounded-[2rem] border border-line bg-surface p-6 shadow-card sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <Logo />
          <span className="text-sm font-medium text-muted" aria-live="polite">Step {Math.min(idx + 1, 5)} of 5</span>
        </div>
        <div className="mb-6 flex gap-1.5" aria-hidden="true">{ORDER.slice(0, 5).map((s, i) => <span key={s} className={`h-1.5 flex-1 rounded-full ${i <= idx ? "bg-saffron" : "bg-surface-3"}`} />)}</div>

        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <motion.div key="welcome" {...slide} className="space-y-5">
              <h1 ref={headingRef} tabIndex={-1} className="font-display text-3xl font-extrabold outline-none">Welcome. Let's set up your AI Praman.</h1>
              <p className="text-muted">It takes about two minutes. You'll register with Aadhaar (mock), tell us a bit about yourself, and then take a friendly challenge to find your AI level.</p>
              <MockNotice />
              <Button block size="lg" onClick={() => setStep("aadhaar")}><IdentificationBadge size={22} /> Register with Aadhaar (mock)</Button>
              <div className="relative py-1 text-center text-sm text-muted"><span className="relative z-10 bg-surface px-3">or</span><span className="absolute inset-x-0 top-1/2 h-px bg-line" aria-hidden="true" /></div>
              <Button block size="lg" variant="secondary" loading={demo.isPending} onClick={() => demo.mutate(undefined)}>Continue as demo learner (Aarav, Builder)</Button>
              <p className="text-center text-xs text-muted">The demo learner has courses, credentials and projects already, so you can explore everything.</p>
            </motion.div>
          )}
          {step === "aadhaar" && <motion.div key="aadhaar" {...slide}><AadhaarStep headingRef={headingRef} /></motion.div>}
          {step === "consent" && <motion.div key="consent" {...slide}><ConsentStep headingRef={headingRef} /></motion.div>}
          {step === "otp" && <motion.div key="otp" {...slide}><OtpStep headingRef={headingRef} /></motion.div>}
          {step === "success" && (
            <motion.div key="success" {...slide} className="space-y-5 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14 }} className="mx-auto grid size-20 place-items-center rounded-full bg-green-soft text-india-green"><CheckCircle size={48} weight="fill" /></motion.div>
              <h1 ref={headingRef} tabIndex={-1} className="font-display text-3xl font-extrabold outline-none">You're in.</h1>
              <p className="text-muted">Mock verification complete for <span className="font-mono font-semibold text-fg">{masked}</span>.</p>
              <TricolourAccent className="mx-auto max-w-32 rounded-full" />
              <Button block size="lg" onClick={() => setStep("profile")}>Set up my profile</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

type HeadRef = { headingRef: React.RefObject<HTMLHeadingElement | null> };

function Back({ to }: { to: RegisterStep }) {
  const setStep = useRegister((s) => s.setStep);
  return <button type="button" onClick={() => setStep(to)} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg"><ArrowLeft size={16} />Back</button>;
}

function AadhaarStep({ headingRef }: HeadRef) {
  const { setStep, setAadhaar } = useRegister();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<{ aadhaar: string }>({ resolver: zodResolver(aadhaarSchema) });
  const [server, setServer] = useState<string>();
  const req = useAction((aadhaar: string) => mockAadhaarAuth({ step: "request-otp", aadhaar }), { silentError: true });
  return (
    <form noValidate className="space-y-5" onSubmit={handleSubmit(async (v) => {
      const digits = v.aadhaar.replace(/\s/g, "");
      try { const r = await req.mutateAsync(digits); setAadhaar(digits, r.masked); setStep("consent"); } catch (e) { setServer(e instanceof Error ? e.message : "Something went wrong"); }
    })}>
      <Back to="welcome" />
      <h1 ref={headingRef} tabIndex={-1} className="font-display text-3xl font-extrabold outline-none">Enter your Aadhaar number</h1>
      <p className="text-muted">Mock entry — any 12 digits will work. We'll show only the last four digits from here on.</p>
      <TextInput label="Aadhaar number" inputMode="numeric" autoComplete="off" placeholder="0000 0000 0000" maxLength={14} error={errors.aadhaar?.message ?? server}
        {...register("aadhaar", { onChange: (e) => { const d = String(e.target.value).replace(/\D/g, "").slice(0, 12); setValue("aadhaar", d.replace(/(\d{4})(?=\d)/g, "$1 ")); setServer(undefined); } })} />
      <MockNotice />
      <Button type="submit" block size="lg" loading={req.isPending}>Continue</Button>
    </form>
  );
}

function ConsentStep({ headingRef }: HeadRef) {
  const { setStep, masked } = useRegister();
  const [checks, setChecks] = useState([false, false]);
  const items = [
    "I agree to share my name, age and location with AI Praman to personalise my learning and to check youth-programme eligibility.",
    "I understand AI Praman stores only a masked Aadhaar reference (last 4 digits) and that this prototype does not connect to any identity service.",
  ];
  return (
    <div className="space-y-5">
      <Back to="aadhaar" />
      <h1 ref={headingRef} tabIndex={-1} className="font-display text-3xl font-extrabold outline-none">Your consent</h1>
      <p className="text-muted">Aadhaar reference: <span className="font-mono font-semibold text-fg">{masked || maskAadhaar("")}</span></p>
      <div className="space-y-3">
        {items.map((t, i) => (
          <label key={i} className="flex min-h-14 cursor-pointer items-start gap-3 rounded-2xl border border-line bg-surface-2/60 p-4">
            <input type="checkbox" checked={checks[i]} onChange={(e) => setChecks((c) => c.map((v, j) => (j === i ? e.target.checked : v)))} className="mt-1 size-5 accent-[var(--brand)]" />
            <span className="text-sm text-fg">{t}</span>
          </label>
        ))}
      </div>
      <p className="text-sm text-muted">Read our <a className="underline" href="/policies/privacy" target="_blank" rel="noopener">Privacy Policy</a> (opens in a new tab).</p>
      <Button block size="lg" disabled={!checks.every(Boolean)} onClick={() => setStep("otp")}>I agree — send OTP</Button>
    </div>
  );
}

function OtpStep({ headingRef }: HeadRef) {
  const { setStep, aadhaarDigits, masked } = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<{ otp: string }>({ resolver: zodResolver(otpSchema) });
  const [server, setServer] = useState<string>();
  const verify = useAction((otp: string) => mockAadhaarAuth({ step: "verify-otp", aadhaar: aadhaarDigits, otp }), { silentError: true });
  return (
    <form noValidate className="space-y-5" onSubmit={handleSubmit(async (v) => {
      try { await verify.mutateAsync(v.otp); setStep("success"); } catch (e) { setServer(e instanceof Error ? e.message : "Something went wrong"); }
    })}>
      <Back to="consent" />
      <h1 ref={headingRef} tabIndex={-1} className="font-display text-3xl font-extrabold outline-none">Enter the OTP</h1>
      <p className="text-muted">We've "sent" a 6-digit code to the phone linked with <span className="font-mono font-semibold text-fg">{masked}</span>.</p>
      <Chip tone="saffron">Prototype OTP: 123456</Chip>
      <TextInput label="6-digit OTP" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="••••••" className="text-center text-2xl tracking-[0.5em]" error={errors.otp?.message ?? server} {...register("otp", { onChange: () => setServer(undefined) })} />
      <Button type="submit" block size="lg" loading={verify.isPending}>Verify</Button>
    </form>
  );
}
