import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-venom-500 to-cyan-400 text-white shadow-[0_14px_40px_rgba(124,58,237,0.28)] hover:opacity-95",
  secondary:
    "bg-white/12 text-[var(--foreground)] hover:bg-white/16 dark:bg-white/6 dark:hover:bg-white/10",
  ghost: "bg-transparent text-[var(--foreground)] hover:bg-white/10 dark:hover:bg-white/6",
  outline: "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-white/10 dark:hover:bg-white/6"
};

const sizeStyles: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base"
};

export function buttonStyles({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string }) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-60",
    variantStyles[variant],
    sizeStyles[size],
    className
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
};

export function Button({ variant, size, className, children, ...props }: ButtonProps) {
  return (
    <button className={buttonStyles({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  children?: ReactNode;
};

export function ButtonLink({ href, variant, size, className, external = false, children, ...props }: ButtonLinkProps) {
  const classes = buttonStyles({ variant, size, className });

  if (external || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
