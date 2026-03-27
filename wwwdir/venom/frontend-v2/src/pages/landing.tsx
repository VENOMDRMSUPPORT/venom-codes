import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Headset,
  Layers3,
  ShieldCheck,
  Sparkles,
  Tv,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { VenomLogo } from "@/components/ui/VenomLogo";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Service Orchestration",
    description: "Deploy, suspend, and recover services with policy-driven workflows and predictable outcomes.",
    icon: Layers3,
  },
  {
    title: "Security Controls",
    description: "Built-in abuse controls, login hardening, and perimeter safeguards for multi-tenant operations.",
    icon: ShieldCheck,
  },
  {
    title: "Operational Support",
    description: "24/7 operational response model with clear escalations and execution-ready runbooks.",
    icon: Headset,
  },
];

const statItems = [
  { value: "99.95%", label: "Platform Uptime" },
  { value: "< 24h", label: "Average Setup" },
  { value: "500+", label: "Operators" },
  { value: "24/7", label: "Senior Support" },
];

const plans = [
  {
    name: "Pilot",
    price: "$50",
    period: "/month",
    highlights: ["1 Main Server", "Core Control Panel", "Basic Monitoring", "Email Support"],
    featured: false,
  },
  {
    name: "Scale",
    price: "$150",
    period: "/month",
    highlights: ["Multi-Node Ready", "Automated Health Rules", "Priority Queue", "Performance Analytics"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "$300",
    period: "/mo",
    highlights: ["Unlimited Streams", "Regional Redundancy", "Dedicated Success Team", "Custom SLA"],
    featured: false,
  },
];

const testimonials = [
  {
    quote: "Provisioning is finally predictable. Our onboarding time dropped by almost half.",
    author: "Ahmed K.",
    role: "IPTV Operator",
  },
  {
    quote: "The panel removed daily friction. Team visibility and response speed are far better now.",
    author: "Sarah M.",
    role: "Reseller",
  },
  {
    quote: "Stable and structured. Support conversations are concise and actually actionable.",
    author: "Omar R.",
    role: "System Admin",
  },
];

function SectionHeading({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="inline-flex items-center rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        {badge}
      </p>
      <h2 className="mt-5 text-3xl font-display font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{subtitle}</p>
    </div>
  );
}

export function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-40 right-[-10%] h-[32rem] w-[32rem] rounded-full bg-accent/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,hsl(var(--foreground)/0.05),transparent_38%),radial-gradient(circle_at_85%_75%,hsl(var(--primary)/0.07),transparent_40%)]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="inline-flex items-center">
            <VenomLogo size="md" showSlogan />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground lg:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
            <a href="#testimonials" className="transition-colors hover:text-foreground">Reviews</a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeSwitcher compact />
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="px-5">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-24 pt-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-7"
          >
            <div className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Control-First IPTV Platform
            </div>

            <h1 className="max-w-2xl text-4xl font-display font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Premium Infrastructure,
              <span className="block text-primary">Without Operational Noise.</span>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              VENOM CODES helps operators run IPTV services with cleaner control planes, stronger safeguards,
              and measurable operational discipline.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="px-8">
                <Link href="/register">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link href="/login">Open Client Area</Link>
              </Button>
            </div>

            <div className="grid max-w-2xl grid-cols-2 gap-3 pt-5 sm:grid-cols-4">
              {statItems.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border/70 bg-card/80 p-4 backdrop-blur-xl">
                  <p className="text-xl font-display font-bold text-foreground">{item.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="relative"
          >
            <Card className="overflow-hidden border-border/70 bg-card/85 backdrop-blur-2xl shadow-2xl shadow-foreground/5">
              <CardContent className="p-0">
                <div className="border-b border-border/70 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Operations Overview</p>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-500">
                      Stable
                    </span>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  {[
                    { label: "Deployment Queue", value: "12 Active", icon: Sparkles },
                    { label: "Connected Devices", value: "18,420", icon: Tv },
                    { label: "Settlement Status", value: "On Time", icon: Wallet },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between rounded-xl border border-border/70 bg-background/80 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <row.icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm text-muted-foreground">{row.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section id="features" className="border-y border-border/60 bg-background/60 py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <SectionHeading
              badge="Why VENOM"
              title="Operationally Elegant by Design"
              subtitle="Every feature is tuned to reduce operational friction, improve trust, and maintain service consistency under load."
            />

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {features.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <Card className="h-full border-border/70 bg-card/80 p-6 backdrop-blur-xl">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-xl font-display font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <SectionHeading
              badge="Pricing"
              title="Straightforward Plans, Serious Capability"
              subtitle="No visual tricks, no hidden friction. Pick a plan, deploy, and grow with confidence."
            />

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={cn(
                    "border-border/70 bg-card/80 p-6 backdrop-blur-xl",
                    plan.featured && "border-primary/40 bg-gradient-to-b from-primary/12 to-card/85 shadow-xl shadow-primary/15"
                  )}
                >
                  <p className="text-sm font-semibold text-muted-foreground">{plan.name}</p>
                  <div className="mt-3 flex items-end gap-1">
                    <span className="text-4xl font-display font-bold text-foreground">{plan.price}</span>
                    <span className="pb-1 text-sm text-muted-foreground">{plan.period}</span>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="mt-8 w-full" variant={plan.featured ? "default" : "outline"}>
                    Choose {plan.name}
                  </Button>
                </Card>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />Secure Payments</span>
              <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary" />30-Day Safety Window</span>
            </div>
          </div>
        </section>

        <section id="testimonials" className="border-t border-border/60 py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <SectionHeading
              badge="Client Voice"
              title="Trusted by Teams That Need Predictability"
              subtitle="Real operational teams choose consistency over hype."
            />

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {testimonials.map((item) => (
                <Card key={item.author} className="border-border/70 bg-card/75 p-6 backdrop-blur-xl">
                  <p className="text-sm leading-relaxed text-muted-foreground">"{item.quote}"</p>
                  <p className="mt-5 text-sm font-semibold text-foreground">{item.author}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <Card className="overflow-hidden border-primary/25 bg-gradient-to-br from-card to-primary/10 p-8 text-center shadow-xl shadow-primary/10 sm:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Get Started</p>
              <h3 className="mt-4 text-3xl font-display font-bold text-foreground sm:text-4xl">Launch a Cleaner Platform Experience</h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Build your service on a premium control layer that is fast to operate and easy to trust.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="px-8">
                  <Link href="/register">Create Account</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="px-8">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.3fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="inline-flex">
              <VenomLogo size="md" showSlogan />
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Professional IPTV control platform designed for operators who need stable operations and reliable client workflows.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Quick Links</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="#features" className="transition-colors hover:text-foreground">Features</a>
              <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
              <a href="#testimonials" className="transition-colors hover:text-foreground">Reviews</a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Legal</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/login" className="transition-colors hover:text-foreground">Client Area</Link>
              <Link href="/register" className="transition-colors hover:text-foreground">Create Account</Link>
              <a className="transition-colors hover:text-foreground" href="#">Privacy Policy</a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/60">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 text-xs text-muted-foreground sm:px-8">
            <span>© {new Date().getFullYear()} VENOM CODES. All rights reserved.</span>
            <span>Built for dependable operations.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
