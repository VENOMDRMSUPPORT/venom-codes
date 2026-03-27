import { ReactNode } from "react";
import { motion } from "framer-motion";
import { VenomLogo } from "@/components/ui/VenomLogo";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen w-full flex bg-background text-foreground selection:bg-primary/30">
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-border/50">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/auth-bg.png`}
            alt="Abstract Background"
            className="w-full h-full object-cover dark:opacity-60 dark:mix-blend-luminosity opacity-40 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-background" />
        </div>
        
        <div className="relative z-10">
          <VenomLogo size="md" showSlogan />
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="font-display text-5xl font-bold leading-tight text-foreground mb-6">
            Elite Infrastructure.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Total Control.</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your high-performance IPTV streaming infrastructure and services from our unified client portal.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-primary/8 dark:bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-1/4 left-1/4 w-96 h-96 bg-accent/5 dark:bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center gap-2 bg-background/80 backdrop-blur-md border border-border/40 rounded-xl px-3 py-2">
            <ThemeSwitcher compact />
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <div className="lg:hidden flex justify-center mb-10">
            <VenomLogo size="md" showSlogan horizontal={false} />
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-display font-bold text-foreground mb-2">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>

          <div className="glass p-8 rounded-3xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none" />
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
