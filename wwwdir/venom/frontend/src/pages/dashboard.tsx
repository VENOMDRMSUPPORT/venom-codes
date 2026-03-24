import { useGetDashboardSummary } from "@workspace/api-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/hooks/use-auth";
import { Server, Receipt, Ticket, Globe, ArrowRight, AlertCircle, Megaphone } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

function StatCardSkeleton() {
  return <div className="h-36 bg-white/5 rounded-2xl animate-pulse" />;
}

function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

export function Dashboard() {
  const { data, isLoading, isError, error } = useGetDashboardSummary();
  const user = useAuthStore(s => s.user);

  const stats = [
    {
      label: "Active Services",
      value: data?.activeServices ?? 0,
      icon: Server,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
      href: "/services",
    },
    {
      label: "Unpaid Invoices",
      value: data?.pendingInvoices ?? 0,
      subLabel: data?.pendingInvoicesAmount ? `~${data.pendingInvoicesAmount} (recent 5)` : undefined,
      icon: Receipt,
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
      href: "/billing/invoices",
    },
    {
      label: "Open Tickets",
      value: data?.openTickets ?? 0,
      icon: Ticket,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20",
      href: "/support/tickets",
    },
    {
      label: "Active Domains",
      value: data?.activeDomains ?? 0,
      icon: Globe,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
      href: "/domains",
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

        {/* Welcome Banner */}
        <motion.div variants={item} className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-lg shrink-0">
            {user?.firstname?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-white">
              Welcome back, {user?.firstname ?? "Client"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </motion.div>

        {/* Error state */}
        {isError && (
          <motion.div variants={item} className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
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
                  <div className={`glass p-6 rounded-2xl border ${stat.border} relative overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-lg`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.bg}`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-3xl font-display font-bold text-white mb-1 tabular-nums">{stat.value}</h3>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                    {"subLabel" in stat && stat.subLabel && (
                      <p className="text-xs text-muted-foreground mt-0.5">{stat.subLabel}</p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))
          }
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Support Tickets */}
          <motion.div variants={item} className="glass p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-primary" /> Recent Tickets
              </h3>
              <Link href="/support/tickets" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                View all →
              </Link>
            </div>
            {isLoading ? <ListSkeleton rows={3} /> : (
              <div className="space-y-3">
                {data?.recentTickets?.length ? data.recentTickets.map(ticket => (
                  <Link key={ticket.id} href={`/support/tickets/${ticket.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 hover:border-primary/20 transition-all cursor-pointer group">
                      <div className="overflow-hidden mr-3">
                        <p className="text-sm text-white font-medium truncate group-hover:text-primary transition-colors">
                          #{ticket.id} — {ticket.subject}
                        </p>
                        {ticket.lastUpdated && (
                          <p className="text-xs text-muted-foreground mt-0.5">Updated: {ticket.lastUpdated}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-md font-semibold shrink-0 ${
                        ticket.status === "Open" ? "bg-primary/20 text-primary" :
                        ticket.status === "Answered" ? "bg-blue-500/20 text-blue-400" :
                        "bg-white/10 text-white/60"
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  </Link>
                )) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Ticket className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No open tickets</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Recent Invoices */}
          <motion.div variants={item} className="glass p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" /> Recent Invoices
              </h3>
              <Link href="/billing/invoices" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                View all →
              </Link>
            </div>
            {isLoading ? <ListSkeleton rows={3} /> : (
              <div className="space-y-3">
                {data?.recentInvoices?.length ? data.recentInvoices.map(inv => (
                  <Link key={inv.id} href={`/billing/invoices/${inv.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 hover:border-primary/20 transition-all cursor-pointer group">
                      <div>
                        <p className="text-sm text-white font-medium group-hover:text-primary transition-colors">Invoice #{inv.id}</p>
                        {inv.dueDate && <p className="text-xs text-muted-foreground mt-0.5">Due: {inv.dueDate}</p>}
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-sm font-bold text-white">{inv.total}</p>
                        <span className={`text-xs px-2 py-1 rounded-md font-semibold inline-block mt-0.5 ${
                          inv.status === "Unpaid" ? "bg-red-500/20 text-red-400" :
                          inv.status === "Paid" ? "bg-green-500/20 text-green-400" :
                          "bg-white/10 text-white/60"
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                )) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No unpaid invoices</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Announcements */}
        {(isLoading || (data?.recentAnnouncements && data.recentAnnouncements.length > 0)) && (
          <motion.div variants={item} className="glass p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-primary" /> Announcements
              </h3>
              <Link href="/announcements" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                View all →
              </Link>
            </div>
            {isLoading ? <ListSkeleton rows={2} /> : (
              <div className="space-y-3">
                {data?.recentAnnouncements?.map((ann) => (
                  <Link key={ann.id} href="/announcements">
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 hover:border-primary/20 transition-all cursor-pointer group">
                      <p className="text-sm text-white font-medium group-hover:text-primary transition-colors">{ann.title}</p>
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
