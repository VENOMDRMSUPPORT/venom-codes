import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export function SectionHeading({ badge, title, body, aside }: { badge?: string; title: string; body: string; aside?: ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
      <div className="space-y-4">
        {badge ? <Badge>{badge}</Badge> : null}
        <div className="space-y-3">
          <h2 className="heading-xl max-w-4xl font-semibold text-[var(--foreground)]">{title}</h2>
          <p className="max-w-2xl text-base leading-7 text-muted">{body}</p>
        </div>
      </div>
      {aside ? <div className="text-sm leading-7 text-muted">{aside}</div> : null}
    </div>
  );
}
