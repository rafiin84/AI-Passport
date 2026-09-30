"use client";
import { forwardRef, useId, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const control = "w-full rounded-2xl border border-line bg-surface px-4 text-base text-fg placeholder:text-muted/70 transition-colors focus-visible:border-brand aria-[invalid=true]:border-danger min-h-12";

export function Field({ label, hint, error, children, htmlFor, required }: { label: string; hint?: string; error?: string; children: ReactNode; htmlFor: string; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-fg">
        {label}{required && <span className="text-danger" aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && !error && <p id={`${htmlFor}-hint`} className="text-sm text-muted">{hint}</p>}
      {error && <p id={`${htmlFor}-err`} role="alert" className="text-sm font-medium text-danger">{error}</p>}
    </div>
  );
}

type WithField = { label: string; hint?: string; error?: string };

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & WithField>(function TextInput({ label, hint, error, className, id, required, ...p }, ref) {
  const auto = useId(); const fid = id ?? auto;
  return (
    <Field label={label} hint={hint} error={error} htmlFor={fid} required={required}>
      <input ref={ref} id={fid} required={required} aria-invalid={!!error} aria-describedby={error ? `${fid}-err` : hint ? `${fid}-hint` : undefined} className={cn(control, "h-12", className)} {...p} />
    </Field>
  );
});

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & WithField>(function TextArea({ label, hint, error, className, id, required, ...p }, ref) {
  const auto = useId(); const fid = id ?? auto;
  return (
    <Field label={label} hint={hint} error={error} htmlFor={fid} required={required}>
      <textarea ref={ref} id={fid} required={required} aria-invalid={!!error} aria-describedby={error ? `${fid}-err` : hint ? `${fid}-hint` : undefined} className={cn(control, "min-h-28 py-3", className)} {...p} />
    </Field>
  );
});

export const SelectInput = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & WithField & { options: (string | { value: string; label: string })[]; placeholder?: string }>(function SelectInput({ label, hint, error, options, placeholder, className, id, required, ...p }, ref) {
  const auto = useId(); const fid = id ?? auto;
  return (
    <Field label={label} hint={hint} error={error} htmlFor={fid} required={required}>
      <select ref={ref} id={fid} required={required} aria-invalid={!!error} aria-describedby={error ? `${fid}-err` : hint ? `${fid}-hint` : undefined} className={cn(control, "h-12 appearance-none bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-10", className)} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' fill='%23888'%3E%3Cpath d='M213.7 101.7l-80 80a8 8 0 0 1-11.4 0l-80-80a8 8 0 0 1 11.4-11.4L128 164.7l74.3-74.4a8 8 0 0 1 11.4 11.4z'/%3E%3C/svg%3E\")" }} {...p}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  );
});

/** Multi-select rendered as accessible toggle chips. */
export function ChipSelect({ label, options, value, onChange, hint }: { label: string; options: string[]; value: string[]; onChange: (v: string[]) => void; hint?: string }) {
  const id = useId();
  return (
    <fieldset className="space-y-2">
      <legend id={id} className="text-sm font-semibold text-fg">{label}</legend>
      {hint && <p className="text-sm text-muted">{hint}</p>}
      <div className="flex flex-wrap gap-2" role="group" aria-labelledby={id}>
        {options.map((o) => {
          const on = value.includes(o);
          return (
            <button key={o} type="button" aria-pressed={on} onClick={() => onChange(on ? value.filter((v) => v !== o) : [...value, o])}
              className={cn("min-h-11 rounded-full border px-4 text-sm font-medium transition-colors", on ? "border-brand bg-brand text-brand-fg" : "border-line bg-surface text-fg hover:bg-surface-2")}>
              {o}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ErrorSummary({ errors }: { errors: { id: string; message: string }[] }) {
  if (errors.length === 0) return null;
  return (
    <div role="alert" tabIndex={-1} className="rounded-2xl border border-danger bg-danger-soft p-4 text-danger">
      <p className="font-bold">Please fix {errors.length} {errors.length === 1 ? "thing" : "things"} to continue:</p>
      <ul className="mt-1 list-disc pl-5 text-sm">
        {errors.map((e) => <li key={e.id}><a className="underline" href={`#${e.id}`}>{e.message}</a></li>)}
      </ul>
    </div>
  );
}
