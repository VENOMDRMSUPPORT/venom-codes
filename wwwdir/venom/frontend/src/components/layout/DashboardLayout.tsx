import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Server, Receipt, FileText, ShoppingCart,
  Ticket as TicketIcon, Globe, User, Users, CreditCard,
  Bell, Book, LogOut, Menu, X, Lock
} from "lucide-react";
import { useAuthStore } from "@/hooks/use-auth";
import { useLogout } from "@workspace/api-client";
import { VenomLogo } from "@/components/ui/VenomLogo";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    ]
  },
  {
    label: "Services",
    items: [
      { icon: Server, label: "My Services", href: "/services" },
      { icon: Globe, label: "Domains", href: "/domains" },
      { icon: ShoppingCart, label: "Order New", href: "/order" },
    ]
  },
  {
    label: "Billing",
    items: [
      { icon: Receipt, label: "Invoices", href: "/billing/invoices" },
      { icon: FileText, label: "Quotes", href: "/billing/quotes" },
      { icon: ShoppingCart, label: "Orders", href: "/billing/orders" },
    ]
  },
  {
    label: "Support",
    items: [
      { icon: TicketIcon, label: "Tickets", href: "/support/tickets" },
      { icon: Book, label: "Knowledgebase", href: "/knowledgebase" },
      { icon: Bell, label: "Announcements", href: "/announcements" },
    ]
  },
  {
    label: "Account",
    items: [
      { icon: User, label: "Profile", href: "/account/profile" },
      { icon: Users, label: "Contacts", href: "/account/contacts" },
      { icon: Lock, label: "Security", href: "/account/security" },
      { icon: CreditCard, label: "Payment Methods", href: "/account/payment-methods" },
    ]
  }
];

export function DashboardLayout({ children, title }: { children: ReactNode; title?: string }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout: clearStore } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (e) {
      // ignore
    } finally {
      clearStore();
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-border/40">
        <Link href="/dashboard">
          <VenomLogo size="sm" showSlogan />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6 custom-scrollbar">
        {NAV_GROUPS.map((group, i) => (
          <div key={i}>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              {group.label}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location === item.href || location.startsWith(`${item.href}/`);
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-primary/10 text-primary font-medium border border-primary/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' 
                        : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
                      }
                    `}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                    {item.label}
                    {isActive && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 mt-auto space-y-3">
        <div className="px-2 py-2 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium pl-1">Appearance</span>
          <ThemeSwitcher compact />
        </div>

        <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img 
              src={`${import.meta.env.BASE_URL}images/avatar.png`} 
              alt="Avatar" 
              className="w-9 h-9 rounded-full border-2 border-primary/30"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate">{user?.firstname} {user?.lastname}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="hidden lg:block w-72 h-screen sticky top-0 z-40 glass-panel">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-72 z-50 bg-card border-r border-border lg:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-full h-96 bg-primary/3 dark:bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10" />
        
        <header className="h-20 border-b border-border/50 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 bg-background/60 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-primary/5"
            >
              <Menu className="w-6 h-6" />
            </button>
            {title && <h1 className="text-2xl font-display font-semibold text-foreground">{title}</h1>}
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-4 py-2 rounded-full border border-border/40">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Credit: {user?.credit || "$0.00"}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
