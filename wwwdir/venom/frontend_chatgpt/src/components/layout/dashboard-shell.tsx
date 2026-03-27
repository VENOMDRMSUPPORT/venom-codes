import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronRight, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuthStore } from "@/hooks/use-auth";
import { sidebarNavigation } from "@/lib/site";
import { cn, initials } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function SidebarNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();

  return (
    <div className="space-y-8">
      {sidebarNavigation.map((group) => (
        <div key={group.title} className="space-y-3">
          <div className="px-3 text-xs font-semibold uppercase tracking-[0.26em] text-muted">{group.title}</div>
          <div className="space-y-1">
            {group.items.map((item) => {
              const active = location === item.href || (item.href !== "/dashboard" && location.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium text-muted hover:bg-white/10 hover:text-[var(--foreground)] dark:hover:bg-white/6",
                    active && "bg-gradient-to-r from-venom-500/18 to-cyan-400/10 text-[var(--foreground)]"
                  )}
                >
                  <span>{item.label}</span>
                  <ChevronRight className={cn("size-4 opacity-0 transition", active && "opacity-100")} />
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardShell({
  title,
  description,
  actions,
  children
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const client = useAuthStore((state) => state.client);
  const previewMode = useAuthStore((state) => state.previewMode);
  const [, setLocation] = useLocation();

  const name = useMemo(() => `${client?.firstname ?? "VENOM"} ${client?.lastname ?? "Operator"}`.trim(), [client?.firstname, client?.lastname]);

  async function handleLogout() {
    await logout();
    setLocation("/");
  }

  return (
    <div className="min-h-screen pb-10">
      <div className="shell pt-5">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="glass-card sticky top-5 rounded-[30px] p-5">
              <div className="space-y-4 border-b border-white/8 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-venom-500 to-cyan-400 text-lg font-semibold text-white">
                    V
                  </div>
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--foreground)]">VENOM CODES</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted">Client command center</div>
                  </div>
                </div>
                <div className="glass-card rounded-3xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-[var(--foreground)]">
                      {initials(client?.firstname, client?.lastname)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--foreground)]">{name}</div>
                      <div className="text-xs text-muted">{client?.company ?? "Managed account"}</div>
                    </div>
                  </div>
                  {previewMode ? <Badge className="mt-3" tone="warning">Preview mode</Badge> : null}
                </div>
              </div>

              <div className="mt-6">
                <SidebarNavigation />
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/8 pt-5">
                <ThemeToggle />
                <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="size-4" />
                  {previewMode ? "Exit preview" : "Sign out"}
                </Button>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="glass-card sticky top-5 z-30 rounded-[30px] px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" size="sm" className="w-11 px-0 lg:hidden" onClick={() => setOpen(true)}>
                    <Menu className="size-4" />
                  </Button>
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-muted">Secure portal</div>
                    <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">{title}</h1>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {previewMode ? <Badge tone="warning">Preview data</Badge> : <Badge tone="success">Live session</Badge>}
                  {actions}
                </div>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{description}</p>
            </div>

            {children}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="glass-card h-full w-[88vw] max-w-sm rounded-r-[30px] p-5"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--foreground)]">VENOM CODES</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted">Navigation</div>
                </div>
                <Button type="button" variant="outline" size="sm" className="w-11 px-0" onClick={() => setOpen(false)}>
                  <X className="size-4" />
                </Button>
              </div>
              <SidebarNavigation onNavigate={() => setOpen(false)} />
              <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/8 pt-5">
                <ThemeToggle />
                <ButtonLink href="/" variant="outline" size="sm" onClick={() => setOpen(false)}>
                  Marketing site
                </ButtonLink>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
