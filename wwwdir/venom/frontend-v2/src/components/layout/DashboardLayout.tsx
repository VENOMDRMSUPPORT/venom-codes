import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Server,
  Receipt,
  FileText,
  ShoppingCart,
  Ticket as TicketIcon,
  Globe,
  User,
  Users,
  CreditCard,
  Bell,
  Book,
  LogOut,
  Menu,
  X,
  Lock,
  ChevronLeft,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useAuthStore } from "@/hooks/use-auth";
import { useLogout } from "@/api/client";
import { VenomLogo } from "@/components/ui/VenomLogo";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    label: "Services",
    items: [
      { icon: Server, label: "My Services", href: "/services" },
      { icon: Globe, label: "Domains", href: "/domains" },
      { icon: ShoppingCart, label: "Order New", href: "/order" },
    ],
  },
  {
    label: "Billing",
    items: [
      { icon: Receipt, label: "Invoices", href: "/billing/invoices" },
      { icon: FileText, label: "Quotes", href: "/billing/quotes" },
      { icon: ShoppingCart, label: "Orders", href: "/billing/orders" },
    ],
  },
  {
    label: "Support",
    items: [
      { icon: TicketIcon, label: "Tickets", href: "/support/tickets" },
      { icon: Book, label: "Knowledgebase", href: "/knowledgebase" },
      { icon: Bell, label: "Announcements", href: "/announcements" },
    ],
  },
  {
    label: "Account",
    items: [
      { icon: User, label: "Profile", href: "/account/profile" },
      { icon: Users, label: "Contacts", href: "/account/contacts" },
      { icon: Lock, label: "Security", href: "/account/security" },
      { icon: CreditCard, label: "Payment Methods", href: "/account/payment-methods" },
    ],
  },
];

export function DashboardLayout({ children, title }: { children: ReactNode; title?: string }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className={cn("flex flex-col h-full", collapsed ? "px-2" : "")}>
      {/* Logo */}
      <div className={cn("py-5 border-b border-border/50", collapsed ? "px-2" : "px-5")}>
        <Link href="/dashboard">
          {collapsed ? (
            <div className="w-10 h-10 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="text-primary font-bold text-lg">V</span>
            </div>
          ) : (
            <VenomLogo size="sm" />
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className={cn("flex-1 overflow-y-auto py-4 space-y-6", collapsed ? "px-2" : "px-3")}>
        {NAV_GROUPS.map((group, i) => (
          <div key={i}>
            {!collapsed && (
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                {group.label}
              </div>
            )}
            <div className={cn("space-y-1", collapsed && "flex flex-col items-center")}>
              {group.items.map((item) => {
                const isActive = location === item.href || location.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group",
                      isActive
                        ? "bg-primary/10 text-primary font-medium shadow-sm"
                        : collapsed
                        ? "text-muted-foreground hover:text-foreground hover:bg-secondary w-10 h-10 justify-center"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
                    {!collapsed && <span>{item.label}</span>}

                    {/* Tooltip for collapsed state */}
                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg border border-border">
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={cn("p-4 mt-auto space-y-3 border-t border-border/50", collapsed && "px-2")}>
        {/* Help Link */}
        <Link
          href="/knowledgebase"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all",
            collapsed && "w-10 h-10 justify-center"
          )}
          title={collapsed ? "Help Center" : undefined}
        >
          <HelpCircle className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm">Help Center</span>}
        </Link>

        {/* Theme Switcher - Desktop only */}
        {!collapsed && (
          <div className="px-3 py-2 rounded-xl bg-secondary/50 border border-border/50 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Appearance</span>
            <ThemeSwitcher compact />
          </div>
        )}

        {/* User Card */}
        <div
          className={cn(
            "p-3 rounded-xl bg-secondary/50 border border-border/50 flex items-center gap-3",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {!collapsed ? (
            <>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                  {user?.firstname?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen sticky top-0 z-40 transition-all duration-300",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <div className="flex flex-col h-full glass-dark rounded-2xl m-3 overflow-hidden">
          <SidebarContent collapsed={isCollapsed} />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
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
              className="fixed top-0 left-0 bottom-0 w-72 z-50 glass-dark lg:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative">
        {/* Ambient background */}
        <div className="absolute top-0 left-1/4 w-full h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10" />

        {/* Header */}
        <header className="h-16 lg:h-20 border-b border-border/50 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft className={cn("w-5 h-5 transition-transform", isCollapsed && "rotate-180")} />
            </button>
            {title && (
              <h1 className="text-xl lg:text-2xl font-display font-semibold text-foreground">{title}</h1>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Actions */}
            <Link
              href="/support/tickets/new"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <TicketIcon className="w-4 h-4" />
              <span>New Ticket</span>
            </Link>

            {/* Credit Display */}
            <div className="hidden md:flex items-center gap-2 text-sm bg-secondary/50 px-4 py-2 rounded-xl border border-border/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-muted-foreground">Credit:</span>
              <span className="font-semibold text-foreground">{user?.credit || "$0.00"}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border/50 py-4 px-8">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} VENOM CODES. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
