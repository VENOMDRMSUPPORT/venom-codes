import { ChevronRight } from "lucide-react";
import { faqItems } from "@/lib/site";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { HeroSection } from "@/components/marketing/hero";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PlatformStack } from "@/components/marketing/platform-stack";
import { UseCasesSection } from "@/components/marketing/use-cases";
import { PricingGrid } from "@/components/marketing/pricing-grid";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Landing() {
  return (
    <div className="min-h-screen pb-10">
      <MarketingHeader />
      <main className="space-y-10 pb-20">
        <HeroSection />
        <span id="platform" className="section-anchor" />
        <FeatureGrid />
        <PlatformStack />
        <span id="use-cases" className="section-anchor" />
        <UseCasesSection />
        <span id="pricing" className="section-anchor" />
        <PricingGrid />

        <section className="shell grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] py-8">
          <Card className="rounded-[32px] p-6 md:p-8">
            <div className="text-xs uppercase tracking-[0.24em] text-cyan-400">FAQ</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground)]">Questions decision-makers ask before rollout.</h2>
            <div className="mt-8 divide-y divide-white/8">
              {faqItems.map((item) => (
                <div key={item.question} className="py-5">
                  <div className="text-lg font-medium text-[var(--foreground)]">{item.question}</div>
                  <p className="mt-2 text-sm leading-7 text-muted">{item.answer}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[32px] p-6 md:p-8">
            <div className="text-xs uppercase tracking-[0.24em] text-cyan-400">Ready to move</div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground)]">Replace the template feeling with a premium portal layer.</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              This rebuild is designed to respect the backend boundaries while radically upgrading the customer-facing experience. Start in preview or go straight into a real account flow.
            </p>
            <div className="mt-8 grid gap-3">
              <ButtonLink href="/register" className="w-full justify-between">
                Create an account
                <ChevronRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/login" variant="outline" className="w-full justify-between">
                Sign in to portal
                <ChevronRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/knowledgebase" variant="ghost" className="w-full justify-between">
                Read the knowledgebase
                <ChevronRight className="size-4" />
              </ButtonLink>
            </div>
          </Card>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
