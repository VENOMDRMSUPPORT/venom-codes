import { brand, pricingPlans, supportChannels } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/5 py-16">
      <div className="shell grid gap-10 lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
        <div className="space-y-4">
          <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--foreground)]">{brand.name}</div>
          <p className="max-w-md text-sm leading-7 text-muted">{brand.mission}</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/register" size="sm">
              Start your rollout
            </ButtonLink>
            <ButtonLink href="/catalog" variant="outline" size="sm">
              Browse catalog
            </ButtonLink>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]">Platform</h3>
          <div className="flex flex-col gap-3 text-sm text-muted">
            <ButtonLink href="/#platform" variant="ghost" className="h-auto justify-start px-0 py-0 hover:bg-transparent">
              Platform overview
            </ButtonLink>
            <ButtonLink href="/#pricing" variant="ghost" className="h-auto justify-start px-0 py-0 hover:bg-transparent">
              Pricing tiers
            </ButtonLink>
            <ButtonLink href="/knowledgebase" variant="ghost" className="h-auto justify-start px-0 py-0 hover:bg-transparent">
              Knowledgebase
            </ButtonLink>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]">Commercial tiers</h3>
          <div className="space-y-3 text-sm text-muted">
            {pricingPlans.map((plan) => (
              <div key={plan.slug}>
                <div className="text-[var(--foreground)]">{plan.name}</div>
                <div>{plan.price} {plan.cadence}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]">Support</h3>
          <div className="space-y-3 text-sm text-muted">
            {supportChannels.map((channel) => (
              <div key={channel.label}>
                <div className="text-[var(--foreground)]">{channel.label}</div>
                <div>{channel.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
