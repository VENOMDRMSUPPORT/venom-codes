import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "wouter";
import { marketingNavigation } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button, ButtonLink } from "@/components/ui/button";

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-venom-500 to-cyan-400 text-lg font-semibold text-white shadow-[0_14px_40px_rgba(124,58,237,0.35)]">
        V
      </div>
      <div>
        <div className="text-sm font-semibold tracking-[0.28em] text-[var(--foreground)]">VENOM CODES</div>
        <div className="text-xs uppercase tracking-[0.24em] text-muted">Streaming control portal</div>
      </div>
    </div>
  );
}

export function MarketingHeader() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-xl">
      <div className="shell py-4">
        <div className="glass-card flex items-center justify-between rounded-[28px] px-5 py-4">
          <ButtonLink href="/" variant="ghost" className="h-auto px-0 py-0 hover:bg-transparent hover:opacity-90">
            <BrandMark />
          </ButtonLink>

          <nav className="hidden items-center gap-1 lg:flex">
            {marketingNavigation.map((item) => {
              const active = item.href === "/" ? location === "/" : location === item.href || location.startsWith(item.href.replace(/#.*$/, ""));
              return (
                <ButtonLink
                  key={item.href}
                  href={item.href}
                  variant="ghost"
                  size="sm"
                  className={cn("rounded-full text-sm", active && "bg-white/10 dark:bg-white/8")}
                >
                  {item.label}
                </ButtonLink>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <ButtonLink href="/login" variant="outline" size="sm">
              Sign in
            </ButtonLink>
            <ButtonLink href="/register" size="sm">
              Create account
            </ButtonLink>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <Button type="button" variant="outline" size="sm" className="w-11 px-0" onClick={() => setOpen((value) => !value)}>
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </div>
        </div>

        {open ? (
          <div className="glass-card mt-3 rounded-[28px] p-4 lg:hidden">
            <div className="flex flex-col gap-2">
              {marketingNavigation.map((item) => (
                <ButtonLink key={item.href} href={item.href} variant="ghost" className="justify-start rounded-2xl" onClick={() => setOpen(false)}>
                  {item.label}
                </ButtonLink>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ButtonLink href="/login" variant="outline" onClick={() => setOpen(false)}>
                Sign in
              </ButtonLink>
              <ButtonLink href="/register" onClick={() => setOpen(false)}>
                Create account
              </ButtonLink>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
