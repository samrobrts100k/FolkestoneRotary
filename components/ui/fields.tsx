import * as React from "react";
import { cn } from "@/lib/utils";

const base = "block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-navy placeholder:text-slate-500 focus:border-rotary aria-[invalid=true]:border-red-600";

export function Field({ label, name, error, hint, required, children }: { label: string; name: string; error?: string; hint?: string; required?: boolean; children: (p: { id: string; "aria-describedby"?: string; "aria-invalid"?: boolean; name: string; required?: boolean }) => React.ReactNode }) {
  const describedBy = [error ? `${name}-err` : "", hint ? `${name}-hint` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold">
        {label}{required ? <span aria-hidden className="text-red-700"> *</span> : <span className="font-normal text-slate-blue"> (optional)</span>}
      </label>
      {children({ id: name, name, required, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {hint && <p id={`${name}-hint`} className="mt-1 text-sm text-slate-blue">{hint}</p>}
      {error && <p id={`${name}-err`} role="alert" className="mt-1 text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...p }, r) => <input ref={r} className={cn(base, className)} {...p} />);
Input.displayName = "Input";
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...p }, r) => <textarea ref={r} rows={5} className={cn(base, className)} {...p} />);
Textarea.displayName = "Textarea";
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...p }, r) => <select ref={r} className={cn(base, className)} {...p} />);
Select.displayName = "Select";

export function Consent({ error, children }: { error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm">
        <input type="checkbox" name="consent" required aria-invalid={error ? true : undefined} aria-describedby={error ? "consent-err" : undefined} className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-400 accent-rotary" />
        <span>{children}</span>
      </label>
      {error && <p id="consent-err" role="alert" className="mt-1 text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}
