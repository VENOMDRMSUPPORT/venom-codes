import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-xl",
          title: "text-sm font-semibold text-foreground",
          description: "text-sm text-muted-foreground",
          actionButton:
            "bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium",
          cancelButton:
            "bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg text-sm font-medium",
          success: "border-emerald-500/30",
          error: "border-rose-500/30",
          warning: "border-amber-500/30",
          info: "border-blue-500/30",
        },
      }}
    />
  );
}
