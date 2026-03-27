import { useGetDashboardSummary } from "@/api/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/hooks/use-auth";
import { Server, Receipt, Ticket, Globe, ArrowRight, AlertCircle, Megaphone, TrendingUp, Activity, Calendar, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function StatCardSkeleton() {
  return (
    <div className="h-36 bg-secondary/30 rounded-2xl animate-pulse" />
  );
}

function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-secondary/30 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

export function Dashboard() {
  const { data, isLoading, isError, error } = useGetDashboardSummary();
  const user = useAuthStore((s) => s.user);

  const stats = [
    {
      label: "Active Services",
      value: data?.activeServices ?? 0,
      icon: Server,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      href: "/services",
      description: "Your running services",
    },
    {
      label: "Unpaid Invoices",
      value: data?.pendingInvoices ?? 0,
      subLabel: data?.pendingInvoicesAmount ? `~${data.pendingInvoicesAmount}` : undefined,
      icon: Receipt,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      href: "/billing/invoices",
      description: "Pending payment",
    },
    {
      label: "Open Tickets",
      value: data?.openTickets ?? 0,
      icon: Ticket,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      href: "/support/tickets",
      description: "Awaiting response",
    },
    {
      label: "Active Domains",
      value: data?.activeDomains ?? 0,
      icon: Globe,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      href: "/domains",
      description: "Registered domains",
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        {/* Welcome Banner */}
        <motion.div variants={item} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-accent/10 border border-primary/20 p-6 lg:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-display font-bold text-2xl shrink-0 shadow-lg shadow-primary/30">
              {user?.firstname?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-display font-bold text-foreground">
                Welcome back, {user?.firstname ?? "Client"}
              </h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            <Link
              href="/order"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Order New Service
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Error state */}
        {isError && (
          <motion.div variants={item} className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">
              {(error as { message?: string })?.message ?? "Failed to load dashboard data. Please refresh."}
            </p>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            : stats.map((stat, i) => (
              <motion.div key={i} variants={item}>
                <Link href={stat.href} className="block group">
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-2xl bg-card border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                      stat.border
                    )}
                  >
                    {/* Background decoration */}
                    <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-30", stat.bg)} />

                    <div className="flex items-center justify-between mb-4">
                      <div className={cn("p-3 rounded-xl", stat.bg)}>
                        <stat.icon className={cn("w-5 h-5", stat.color)} />
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-3xl font-display font-bold text-foreground mb-1 tabular-nums">
                      {stat.value}
                    </h3>
                    <p className="text-sm font-medium text-foreground">{stat.label}</p>
                    {"subLabel" in stat && stat.subLabel && (
                      <p className="text-xs text-muted-foreground mt-0.5">{stat.subLabel}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
        </div>

        {/* Quick Stats Row */}
        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Server Status</p>
              <p className="text-sm font-semibold text-emerald-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Monthly Spending</p>
              <p className="text-sm font-semibold">{user?.credit || "$0.00"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Ticket className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Support Priority</p>
              <p className="text-sm font-semibold">Standard</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
            <div className="p-2 rounded-lg bg-primary/10">
              <Server className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Account Type</p>
              <p className="text-sm font-semibold">Premium Client</p>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Support Tickets */}
          <motion.div variants={item} className="rounded-2xl bg-card border border-border p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                Recent Tickets
              </h3>
              <Link
                href="/support/tickets"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {isLoading ? (
              <ListSkeleton rows={3} />
            ) : (
              <div className="space-y-3">
                {data?.recentTickets?.length ? (
                  data.recentTickets.map((ticket) => (
                    <Link key={ticket.id} href={`/support/tickets/${ticket.id}`}>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-transparent hover:border-border hover:bg-secondary/50 transition-all cursor-pointer group">
                        <div className="overflow-hidden mr-3">
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            #{ticket.id} — {ticket.subject}
                          </p>
                          {ticket.lastUpdated && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Updated: {ticket.lastUpdated}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={
                            ticket.status === "Open"
                              ? "default"
                              : ticket.status === "Answered"
                              ? "secondary"
                              : "outline"
                          }
                          className="shrink-0"
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <Ticket className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No open tickets</p>
                    <Link
                      href="/support/tickets/new"
                      className="text-primary hover:underline text-sm mt-2 inline-block"
                    >
                      Create a new ticket
                    </Link>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Recent Invoices */}
          <motion.div variants={item} className="rounded-2xl bg-card border border-border p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                Recent Invoices
              </h3>
              <Link
                href="/billing/invoices"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {isLoading ? (
              <ListSkeleton rows={3} />
            ) : (
              <div className="space-y-3">
                {data?.recentInvoices?.length ? (
                  data.recentInvoices.map((inv) => (
                    <Link key={inv.id} href={`/billing/invoices/${inv.id}`}>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-transparent hover:border-border hover:bg-secondary/50 transition-all cursor-pointer group">
                        <div>
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            Invoice #{inv.id}
                          </p>
                          {inv.dueDate && (
                            <p className="text-xs text-muted-foreground mt-0.5">Due: {inv.dueDate}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p className="text-sm font-bold">{inv.total}</p>
                          <Badge
                            variant={
                              inv.status === "Unpaid"
                                ? "destructive"
                                : inv.status === "Paid"
                                ? "success"
                                : "outline"
                            }
                            className="mt-0.5"
                          >
                            {inv.status}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No unpaid invoices</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Announcements */}
        {(isLoading || (data?.recentAnnouncements && data.recentAnnouncements.length > 0)) && (
          <motion.div variants={item} className="rounded-2xl bg-card border border-border p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" />
                Announcements
              </h3>
              <Link
                href="/announcements"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {isLoading ? (
              <ListSkeleton rows={2} />
            ) : (
              <div className="space-y-3">
                {data?.recentAnnouncements?.map((ann) => (
                  <Link key={ann.id} href="/announcements">
                    <div className="p-4 rounded-xl bg-secondary/30 border border-transparent hover:border-border hover:bg-secondary/50 transition-all cursor-pointer group">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {ann.title}
                      </p>
                      {ann.date && <p className="text-xs text-muted-foreground mt-0.5">{ann.date}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
