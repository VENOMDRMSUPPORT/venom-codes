import type { ComponentType } from "react";
import { AlertCircle, Inbox, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type Kind = "loading" | "error" | "empty";

const map = {
  loading: {
    icon: Loader2,
    iconClass: "animate-spin text-cyan-400"
  },
  error: {
    icon: AlertCircle,
    iconClass: "text-rose-400"
  },
  empty: {
    icon: Inbox,
    iconClass: "text-amber-400"
  }
} satisfies Record<Kind, { icon: ComponentType<{ className?: string }>; iconClass: string }>;

export function DataState({
  kind,
  title,
  message,
  actionLabel,
  onAction
}: {
  kind: Kind;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const config = map[kind];
  const Icon = config.icon;

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader className="items-center text-center">
        <div className="glass-card flex size-14 items-center justify-center rounded-2xl">
          <Icon className={`size-6 ${config.iconClass}`} />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="max-w-md">{message}</CardDescription>
      </CardHeader>
      {actionLabel && onAction ? (
        <CardContent className="flex justify-center">
          <Button type="button" variant={kind === "error" ? "primary" : "secondary"} onClick={onAction}>
            {kind === "error" ? <RefreshCcw className="size-4" /> : null}
            {actionLabel}
          </Button>
        </CardContent>
      ) : null}
    </Card>
  );
}
