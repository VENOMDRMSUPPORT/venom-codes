import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { brand, heroStats } from "@/lib/site";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function HeroSection() {
  return (
    <section className="shell relative overflow-hidden py-18 sm:py-24">
      <div className="surface-grid absolute inset-x-6 inset-y-10 rounded-[40px] opacity-40" />
      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 space-y-8">
          <div className="space-y-5">
            <Badge>Self-developed premium frontend</Badge>
            <div className="space-y-5">
              <h1 className="heading-display max-w-5xl font-semibold text-[var(--foreground)]">
                Built for streaming operators who need <span className="gradient-text">control without compromise</span>.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted">{brand.mission}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <ButtonLink href="/register" size="lg">
              Launch your workspace
              <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/login" variant="outline" size="lg">
              Enter client portal
            </ButtonLink>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {heroStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.08, duration: 0.35 }}
                className="glass-card rounded-[24px] p-4"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-muted">{stat.label}</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{stat.value}</div>
                <p className="mt-2 text-sm leading-6 text-muted">{stat.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} className="relative z-10">
          <Card className="overflow-hidden rounded-[34px] p-6">
            <div className="grid gap-5">
              <div className="flex items-center justify-between rounded-[24px] border border-white/8 bg-white/6 px-5 py-4">
                <div>
                  <div className="text-sm font-medium text-[var(--foreground)]">Operational posture</div>
                  <div className="mt-1 text-sm text-muted">Security, distribution, billing, and support aligned in one experience.</div>
                </div>
                <ShieldCheck className="size-10 text-emerald-400" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-white/8 bg-gradient-to-br from-venom-500/14 to-transparent p-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                    <Sparkles className="size-4 text-cyan-400" />
                    Premium SaaS polish
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    Glass surfaces, measured motion, generous whitespace, and a workflow-first layout system built for confidence.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/8 bg-gradient-to-br from-cyan-400/12 to-transparent p-5">
                  <div className="text-sm font-medium text-[var(--foreground)]">Backend-safe architecture</div>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    The browser owns presentation. Sensitive WHMCS and provisioning logic remains where it belongs: behind the server boundary.
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/8 p-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted">Streaming core</div>
                    <div className="mt-2 text-xl font-semibold text-[var(--foreground)]">Live + VOD + radio</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted">Route intelligence</div>
                    <div className="mt-2 text-xl font-semibold text-[var(--foreground)]">Geo and load aware</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted">Commercial stack</div>
                    <div className="mt-2 text-xl font-semibold text-[var(--foreground)]">WHMCS-integrated flows</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
