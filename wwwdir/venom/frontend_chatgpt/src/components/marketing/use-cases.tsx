import { motion } from "framer-motion";
import { responseTimes, supportChannels, useCases } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";

export function UseCasesSection() {
  return (
    <section className="shell space-y-10 py-8">
      <SectionHeading
        badge="Where it fits"
        title="Commercial, hospitality, enterprise, and multi-region streaming operations."
        body="The portal now tells a clear story about who this platform is for and why the rollout model matters. Each use case is tied to operational outcomes, not generic claims."
        aside={
          <div className="glass-card rounded-[26px] p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Support matrix</div>
            <div className="mt-4 space-y-3">
              {responseTimes.map((item) => (
                <div key={item.plan} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-soft">{item.plan}</span>
                  <span className="font-medium text-[var(--foreground)]">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-5 md:grid-cols-2">
          {useCases.map((useCase, index) => (
            <motion.div key={useCase.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: index * 0.06, duration: 0.32 }}>
              <Card className="h-full rounded-[30px] p-6">
                <h3 className="text-xl font-semibold text-[var(--foreground)]">{useCase.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{useCase.description}</p>
                <div className="mt-5 space-y-3">
                  {useCase.outcomes.map((outcome) => (
                    <div key={outcome} className="rounded-2xl border border-white/8 px-4 py-3 text-sm text-soft">
                      {outcome}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="rounded-[30px] p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Channel strategy</div>
          <h3 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Client education, support, and account continuity.</h3>
          <p className="mt-3 text-sm leading-7 text-muted">
            Resource surfaces in the public area reinforce the same language used inside the authenticated portal. That consistency reduces friction when an operator moves from evaluation to production.
          </p>

          <div className="mt-6 space-y-4">
            {supportChannels.map((channel) => (
              <div key={channel.label} className="rounded-2xl border border-white/8 px-4 py-4">
                <div className="text-sm font-medium text-[var(--foreground)]">{channel.label}</div>
                <div className="mt-1 text-sm leading-6 text-muted">{channel.value}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
