import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ShieldCheck, Waves } from "lucide-react";
import { VenomLogo } from "@/components/ui/VenomLogo";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground lg:grid lg:grid-cols-[1fr_0.92fr]">
      <div className="relative hidden overflow-hidden border-r border-border/70 px-10 py-12 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-20 h-72 w-72 rounded-full bg-primary/16 blur-[110px]" />
          <div className="absolute bottom-[-7rem] right-[-2rem] h-80 w-80 rounded-full bg-accent/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,hsl(var(--foreground)/0.04),transparent_45%),radial-gradient(circle_at_85%_85%,hsl(var(--primary)/0.08),transparent_35%)]" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex">
            <VenomLogo size="md" showSlogan />
          </Link>
        </div>

        <motion.div
          className="relative z-10 max-w-md"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Client Security Zone
          </p>
          <h1 className="text-4xl font-display font-bold leading-tight tracking-tight text-foreground">
            Control your platform
            <span className="block text-primary">with professional clarity.</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Centralized access for billing, provisioning, and support operations with role-based safeguards.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { label: "Protected", value: "MFA-Ready" },
              { label: "Support", value: "24/7" },
              { label: "Uptime", value: "99.95%" },
              { label: "Portal", value: "Unified" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border/70 bg-card/70 p-4 backdrop-blur-xl">
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-muted-foreground">
          <Waves className="h-3.5 w-3.5 text-primary" />
          <span>Enterprise-grade access gateway</span>
        </div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-8 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/3 right-[-8rem] h-72 w-72 rounded-full bg-primary/12 blur-[110px]" />
          <div className="absolute left-[-9rem] bottom-[-6rem] h-72 w-72 rounded-full bg-accent/10 blur-[110px]" />
        </div>

        <div className="absolute right-5 top-5 z-20 sm:right-8 sm:top-8">
          <ThemeSwitcher compact />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative z-10 w-full max-w-lg"
        >
          <div className="mb-10 flex justify-center lg:hidden">
            <Link href="/" className="inline-flex">
              <VenomLogo size="lg" showSlogan />
            </Link>
          </div>

          <div className="mb-7">
            <h2 className="text-3xl font-display font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/85 p-6 shadow-2xl shadow-foreground/[0.05] backdrop-blur-2xl sm:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/65 to-transparent" />
            <div className="relative z-10">{children}</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
