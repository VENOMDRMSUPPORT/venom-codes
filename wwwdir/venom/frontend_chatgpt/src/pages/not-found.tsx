import { AlertTriangle, ArrowLeft } from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function NotFound() {
  return (
    <div className="min-h-screen pb-10">
      <MarketingHeader />
      <main className="shell flex min-h-[70vh] items-center justify-center py-16">
        <Card className="max-w-2xl rounded-[36px] p-10 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-rose-400/12 text-rose-400">
            <AlertTriangle className="size-7" />
          </div>
          <div className="mt-6 text-xs uppercase tracking-[0.24em] text-cyan-400">Not found</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--foreground)]">This route does not exist in the rebuilt portal.</h1>
          <p className="mt-4 text-base leading-8 text-muted">
            The design system and routing layer are ready, but this specific path is not mapped in the current frontend build.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/" variant="outline">
              <ArrowLeft className="size-4" />
              Back to home
            </ButtonLink>
            <ButtonLink href="/dashboard">Open dashboard</ButtonLink>
          </div>
        </Card>
      </main>
      <MarketingFooter />
    </div>
  );
}
