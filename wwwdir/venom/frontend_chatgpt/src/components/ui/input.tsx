import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, label, hint, error, id, ...props },
  ref
) {
  const inputId = id ?? props.name;

  return (
    <label className="flex w-full flex-col gap-2 text-sm text-soft" htmlFor={inputId}>
      {label ? <span className="font-medium">{label}</span> : null}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "glass-card h-12 rounded-2xl border px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-slate-400 focus:border-venom-400/40 focus:ring-2 focus:ring-[var(--ring)]",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs text-rose-400">{error}</span> : hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
});
