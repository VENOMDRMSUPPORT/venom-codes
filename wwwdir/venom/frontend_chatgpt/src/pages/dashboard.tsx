import { useMemo } from "react";
import { ArrowRight, CreditCard, Headphones, Receipt, Server, ShieldCheck } from "lucide-react";
import { listInvoices, listServices, listTickets } from "@/lib/api";
import { dashboardMetrics, invoices as previewInvoices, services as previewServices, tickets as previewTickets } from "@/lib/site";
import { formatDate, formatDateTime, statusTone, toNumber } from "@/lib/utils";
import { usePreviewQuery } from "@/hooks/use-preview-query";
import { useAuthStore } from "@/hooks/use-auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, StatCard } from "@/components/ui/card";
import { DataState } from "@/components/ui/data-state";

function deriveMetrics(services: typeof previewServices, invoices: typeof previewInvoices, tickets: typeof previewTickets, creditBalance: number) {
  const openInvoices = invoices.filter((invoice) => invoice.status.toLowerCase() !== "paid");
  const openTickets = tickets.filter((ticket) => !["resolved", "closed"].includes(ticket.status.toLowerCase()));
  return [
    { label: "Active services", value: String(services.length).padStart(2, "0"), detail: "Streaming surfaces and infrastructure nodes under management." },
    { label: "Open invoices", value: String(openInvoices.length).padStart(2, "0"), detail: "Commercial actions currently awaiting payment or review." },
    { label: "Support queue", value: String(openTickets.length).padStart(2, "0"), detail: "Tickets still moving through triage, action, or confirmation." },
    { label: "Credit balance", value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(creditBalance), detail: "Available credit ready for billing events and renewals." }
  ];
}

export function Dashboard() {
  const client = useAuthStore((state) => state.client);
  const previewMode = useAuthStore((state) => state.previewMode);

  const servicesQuery = usePreviewQuery({
    queryKey: ["services"],
    queryFn: listServices,
    previewData: previewServices
  });

  const invoicesQuery = usePreviewQuery({
    queryKey: ["invoices"],
    queryFn: listInvoices,
    previewData: previewInvoices
  });

  const ticketsQuery = usePreviewQuery({
    queryKey: ["tickets"],
    queryFn: listTickets,
    previewData: previewTickets
  });

  const services = servicesQuery.data ?? [];
  const invoices = invoicesQuery.data ?? [];
  const tickets = ticketsQuery.data ?? [];

  const metrics = useMemo(() => {
    if (previewMode) return dashboardMetrics;
    return deriveMetrics(services, invoices, tickets, client?.creditBalance ?? 0);
  }, [previewMode, services, invoices, tickets, client?.creditBalance]);

  if (servicesQuery.isLoading || invoicesQuery.isLoading || ticketsQuery.isLoading) {
    return (
      <DashboardShell title="Dashboard" description="Aggregating service, billing, and support signals into one operational view.">
        <DataState kind="loading" title="Building your dashboard" message="Pulling service, billing, and support data from the connected environment." />
      </DashboardShell>
    );
  }

  if (servicesQuery.isError || invoicesQuery.isError || ticketsQuery.isError) {
    return (
      <DashboardShell title="Dashboard" description="Aggregating service, billing, and support signals into one operational view.">
        <DataState
          kind="error"
          title="Unable to assemble the live dashboard"
          message="One or more backend requests failed. Preview mode remains available for UI review, but live portal data needs the API contract to respond correctly."
          actionLabel="Retry"
          onAction={() => {
            servicesQuery.refetch();
            invoicesQuery.refetch();
            ticketsQuery.refetch();
          }}
        />
      </DashboardShell>
    );
  }

  const totalBalance = invoices.reduce((total, invoice) => total + toNumber(invoice.balance), 0);

  return (
    <DashboardShell
      title="Dashboard"
      description="A premium overview of your streaming footprint, billing workload, and support momentum across the WHMCS-connected ecosystem."
      actions={<ButtonLink href="/support/new" size="sm">Open ticket</ButtonLink>}
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <StatCard
            key={metric.label}
            eyebrow={<Badge tone={index === 0 ? "success" : index === 1 ? "warning" : index === 2 ? "primary" : "muted"}>{metric.label}</Badge>}
            title={metric.label}
            value={metric.value}
            description={metric.detail}
          />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[30px] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Live services</div>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Streaming and infrastructure surfaces</h2>
            </div>
            <ButtonLink href="/services" variant="ghost" size="sm">
              View all
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>

          <div className="mt-6 space-y-4">
            {services.slice(0, 3).map((service) => (
              <div key={service.id} className="glass-card rounded-[24px] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold text-[var(--foreground)]">{service.name}</div>
                    <div className="mt-1 text-sm text-muted">{service.summary}</div>
                  </div>
                  <Badge tone={statusTone(service.status)}>{service.status}</Badge>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-4">
                  {[
                    { label: "Region", value: service.region },
                    { label: "Billing", value: service.cycle },
                    { label: "Next due", value: formatDate(service.nextDue) },
                    { label: "Uptime", value: service.uptime }
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted">{item.label}</div>
                      <div className="mt-2 text-sm font-medium text-[var(--foreground)]">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5">
          <Card className="rounded-[30px] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Billing workload</div>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Commercial queue</h2>
              </div>
              <Receipt className="size-6 text-cyan-400" />
            </div>
            <div className="mt-5 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalBalance)}
            </div>
            <p className="mt-2 text-sm leading-7 text-muted">Outstanding invoice balance across all non-paid billing documents.</p>
            <div className="mt-6 space-y-4">
              {invoices.slice(0, 3).map((invoice) => (
                <div key={invoice.id} className="rounded-2xl border border-white/8 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-[var(--foreground)]">{invoice.id}</div>
                    <Badge tone={statusTone(invoice.status)}>{invoice.status}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted">Due {formatDate(invoice.dueOn)}</span>
                    <span className="font-medium text-[var(--foreground)]">{invoice.balance}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[30px] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Support motion</div>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Recent tickets</h2>
              </div>
              <Headphones className="size-6 text-cyan-400" />
            </div>
            <div className="mt-6 space-y-4">
              {tickets.slice(0, 3).map((ticket) => (
                <div key={ticket.id} className="rounded-2xl border border-white/8 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-[var(--foreground)]">{ticket.subject}</div>
                    <Badge tone={statusTone(ticket.status)}>{ticket.status}</Badge>
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">{ticket.department} • {ticket.priority}</div>
                  <div className="mt-3 text-sm text-muted">Updated {formatDateTime(ticket.updatedAt)}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {[
          {
            icon: Server,
            title: "Service-led visibility",
            body: "The dashboard summarizes operational state without leaking privileged backend implementation details into the browser."
          },
          {
            icon: CreditCard,
            title: "Commercial continuity",
            body: "Invoices, orders, quotes, and the cart all share a consistent premium language instead of disconnected hosting templates."
          },
          {
            icon: ShieldCheck,
            title: "Architecture discipline",
            body: "This redesign respects the repository rule that sensitive logic stays behind the backend while the frontend owns experience quality."
          }
        ].map((item) => (
          <Card key={item.title} className="rounded-[30px] p-6">
            <item.icon className="size-6 text-cyan-400" />
            <h3 className="mt-4 text-xl font-semibold text-[var(--foreground)]">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{item.body}</p>
          </Card>
        ))}
      </section>
    </DashboardShell>
  );
}
