import { motion } from "framer-motion";
import { featureGroups } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FeatureGrid() {
  return (
    <section className="shell space-y-10 py-8">
      <SectionHeading
        badge="Platform pillars"
        title="A frontend that communicates product depth like a modern SaaS, not a stock portal skin."
        body="Each section below translates the README vision into a clearer commercial and operational story: security, streaming control, scalable infrastructure, and a client experience designed around trust."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {featureGroups.map((group, index) => (
          <motion.div key={group.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: index * 0.06, duration: 0.35 }}>
            <Card className="h-full rounded-[30px]">
              <CardHeader className="gap-4">
                <Badge>{group.badge}</Badge>
                <div className="space-y-2">
                  <CardTitle className="heading-lg">{group.title}</CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {group.bullets.map((bullet) => (
                    <div key={bullet} className="glass-card rounded-2xl px-4 py-3 text-sm leading-6 text-soft">
                      {bullet}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
