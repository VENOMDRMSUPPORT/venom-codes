import { motion } from "framer-motion";
import { platformLayers } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";

export function PlatformStack() {
  return (
    <section className="shell space-y-10 py-8">
      <SectionHeading
        badge="Architecture layers"
        title="A modular story from operator control to secure distribution."
        body="Instead of presenting isolated feature bullets, the new frontend frames the platform as an integrated stack. That makes the value proposition easier to understand for both technical buyers and commercial stakeholders."
      />

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        {platformLayers.map((layer, index) => (
          <motion.div key={layer.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: index * 0.08, duration: 0.32 }}>
            <Card className="h-full rounded-[30px] p-6">
              <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Layer {index + 1}</div>
              <h3 className="mt-3 text-xl font-semibold text-[var(--foreground)]">{layer.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{layer.description}</p>
              <div className="mt-5 space-y-3">
                {layer.bullets.map((bullet) => (
                  <div key={bullet} className="rounded-2xl border border-white/8 px-4 py-3 text-sm leading-6 text-soft">
                    {bullet}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
