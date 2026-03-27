import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { className, label, hint, error, id, ...props },
  ref
) {
  const textareaId = id ?? props.name;

  return (
    <label className="flex w-full flex-col gap-2 text-sm text-soft" htmlFor={textareaId}>
      {label ? <span className="font-medium">{label}</span> : null}
      <textarea
        ref={ref}
        id={textareaId}
        className={cn(
          "glass-card min-h-[140px] rounded-3xl border px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-slate-400 focus:border-venom-400/40 focus:ring-2 focus:ring-[var(--ring)]",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs text-rose-400">{error}</span> : hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
});
