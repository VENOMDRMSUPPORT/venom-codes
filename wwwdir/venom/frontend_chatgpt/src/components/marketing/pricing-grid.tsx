import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { pricingPlans } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PricingGrid() {
  return (
    <section className="shell space-y-10 py-8">
      <SectionHeading
        badge="Commercial model"
        title="Three rollout phases that map directly to operational maturity."
        body="Pilot validates fit, Professional supports production, and Enterprise creates room for distributed scale. The redesign turns pricing into strategy instead of a table of line items."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {pricingPlans.map((plan, index) => (
          <motion.div key={plan.slug} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: index * 0.06, duration: 0.32 }}>
            <Card className="flex h-full flex-col rounded-[32px] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge>{plan.badge}</Badge>
                  <h3 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">{plan.name}</h3>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-semibold tracking-tight text-[var(--foreground)]">{plan.price}</div>
                  <div className="mt-1 text-sm text-muted">{plan.cadence}</div>
                </div>
              </div>

              <div className="mt-5 rounded-[24px] border border-white/8 bg-white/6 p-4 dark:bg-white/4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted">Infrastructure</div>
                <div className="mt-2 text-lg font-semibold text-[var(--foreground)]">{plan.infrastructure}</div>
              </div>

              <p className="mt-5 text-sm leading-7 text-muted">{plan.summary}</p>
              <div className="mt-5 text-sm font-medium text-[var(--foreground)]">Best for: <span className="font-normal text-muted">{plan.bestFor}</span></div>

              <div className="mt-5 space-y-3">
                {plan.included.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/8 px-4 py-3 text-sm text-soft">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[24px] border border-dashed border-cyan-400/20 px-4 py-4 text-sm leading-6 text-muted">{plan.note}</div>

              <div className="mt-auto pt-6">
                <ButtonLink href={`/register?plan=${plan.slug}`} className="w-full justify-between">
                  Choose {plan.name}
                  <ArrowRight className="size-4" />
                </ButtonLink>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
