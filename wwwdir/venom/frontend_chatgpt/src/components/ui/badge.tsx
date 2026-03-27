import type { ReactNode } from "react";
import { cn, type Tone } from "@/lib/utils";

const toneStyles: Record<Tone, string> = {
  primary: "border border-venom-400/30 bg-venom-500/10 text-venom-600 dark:text-venom-200",
  success: "border border-emerald-400/30 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300",
  warning: "border border-amber-400/30 bg-amber-400/10 text-amber-700 dark:text-amber-300",
  danger: "border border-rose-400/30 bg-rose-400/10 text-rose-700 dark:text-rose-300",
  muted: "border border-white/10 bg-white/6 text-slate-500 dark:text-slate-300"
};

export function Badge({ children, tone = "primary", className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]",
        toneStyles[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
