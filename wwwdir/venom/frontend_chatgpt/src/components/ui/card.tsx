import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass-panel rounded-[28px]", className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-2 p-6", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pb-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-wrap items-center gap-3 px-6 pb-6", className)} {...props} />;
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold tracking-tight text-[var(--foreground)]", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm leading-6 text-muted", className)} {...props}>
      {children}
    </p>
  );
}

export function StatCard({ eyebrow, title, description, value }: { eyebrow?: ReactNode; title: string; description: string; value: string }) {
  return (
    <Card className="h-full">
      <CardHeader className="gap-4">
        {eyebrow}
        <div className="space-y-1">
          <p className="text-sm text-muted">{title}</p>
          <div className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">{value}</div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
