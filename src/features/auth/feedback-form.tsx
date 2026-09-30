"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "@phosphor-icons/react";
import { feedbackSchema } from "@/lib/validation";
import { sendFeedback } from "@/lib/api";
import { useAction } from "@/hooks/use-api";
import { TextArea, TextInput } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type Values = z.infer<typeof feedbackSchema>;

export function FeedbackForm() {
  const [ref, setRef] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({ resolver: zodResolver(feedbackSchema), defaultValues: { message: "", email: "" } });
  const send = useAction((v: Values) => sendFeedback(v.message, v.email || undefined), { onSuccess: (r) => { setRef(r.reference); reset(); } });
  if (ref) return <div role="status" className="rounded-3xl border border-india-green bg-green-soft p-6"><CheckCircle size={36} weight="fill" className="text-india-green" aria-hidden="true" /><h2 className="mt-2 font-display text-2xl font-bold">Thank you.</h2><p className="text-muted">Your feedback reference is <span className="font-mono font-semibold text-fg">{ref}</span>. In this prototype it is stored only on this device.</p><Button className="mt-4" variant="secondary" onClick={() => setRef(null)}>Send more feedback</Button></div>;
  return (
    <form noValidate onSubmit={handleSubmit((v) => send.mutate(v))} className="max-w-xl space-y-5">
      <TextArea label="Your feedback" required error={errors.message?.message} {...register("message")} />
      <TextInput label="Email (optional)" type="email" hint="Only if you'd like a reply." error={errors.email?.message} {...register("email")} />
      <Button type="submit" size="lg" loading={send.isPending}>Send feedback</Button>
    </form>
  );
}
