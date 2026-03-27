import { useMemo, useState } from "react";
import { ArrowRight, Cpu, Globe2, Layers3, Server } from "lucide-react";
import { getService, listServices } from "@/lib/api";
import { services as previewServices } from "@/lib/site";
import { formatDate, statusTone } from "@/lib/utils";
import { usePreviewQuery } from "@/hooks/use-preview-query";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataState } from "@/components/ui/data-state";
import { Input } from "@/components/ui/input";

export function ServicesList() {
  const [query, setQuery] = useState("");
  const servicesQuery = usePreviewQuery({
    queryKey: ["services"],
    queryFn: listServices,
    previewData: previewServices
  });

  const filtered = useMemo(() => {
    const list = servicesQuery.data ?? [];
    if (!query.trim()) return list;
    const value = query.toLowerCase();
    return list.filter((service) => [service.name, service.category, service.region, service.status].some((field) => field.toLowerCase().includes(value)));
  }, [servicesQuery.data, query]);

  if (servicesQuery.isLoading) {
    return (
      <DashboardShell title="Services" description="Review the managed streaming and infrastructure surfaces attached to your account.">
        <DataState kind="loading" title="Loading services" message="Requesting the active service footprint from the connected backend." />
      </DashboardShell>
    );
  }

  if (servicesQuery.isError) {
    return (
      <DashboardShell title="Services" description="Review the managed streaming and infrastructure surfaces attached to your account.">
        <DataState kind="error" title="Unable to load services" message="The service list could not be loaded from the backend." actionLabel="Retry" onAction={() => servicesQuery.refetch()} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="Services"
      description="Production visibility for streaming cores, edge balancers, archive workflows, and other managed surfaces tied to your commercial account."
      actions={<ButtonLink href="/support/new" size="sm">Request service action</ButtonLink>}
    >
      <Card className="rounded-[30px] p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Account footprint</div>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Managed services and runtime posture</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              Service cards communicate the state that matters most to customers: category, region, billing cadence, due dates, routing identity, and overall health posture.
            </p>
          </div>
          <Input label="Search services" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, status, region, or category" />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <DataState kind="empty" title="No matching services" message="Try adjusting the search phrase or review the full footprint without filters." />
      ) : (
        <section className="grid gap-5 xl:grid-cols-2">
          {filtered.map((service) => (
            <Card key={service.id} className="rounded-[30px] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-cyan-400">{service.category}</div>
                  <h3 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{service.name}</h3>
                </div>
                <Badge tone={statusTone(service.status)}>{service.status}</Badge>
              </div>

              <p className="mt-4 text-sm leading-7 text-muted">{service.summary}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Globe2, label: "Region", value: service.region },
                  { icon: Layers3, label: "Billing cycle", value: service.cycle },
                  { icon: Cpu, label: "Protocols", value: service.protocols.join(", ") || "Managed stack" },
                  { icon: Server, label: "Runtime", value: service.uptime }
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/8 px-4 py-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted">
                      <item.icon className="size-4" />
                      {item.label}
                    </div>
                    <div className="mt-3 text-sm font-medium text-[var(--foreground)]">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-muted">Next due {formatDate(service.nextDue)}</div>
                <ButtonLink href={`/services/${service.id}`} variant="outline" size="sm">
                  Open detail
                  <ArrowRight className="size-4" />
                </ButtonLink>
              </div>
            </Card>
          ))}
        </section>
      )}
    </DashboardShell>
  );
}

export function ServiceDetail({ serviceId }: { serviceId: string }) {
  const previewData = previewServices.find((service) => service.id === serviceId) ?? previewServices[0];
  const serviceQuery = usePreviewQuery({
    queryKey: ["service", serviceId],
    queryFn: () => getService(serviceId),
    previewData
  });

  const service = serviceQuery.data;

  if (serviceQuery.isLoading) {
    return (
      <DashboardShell title="Service detail" description="Inspect the selected managed surface, due dates, routing context, and runtime posture.">
        <DataState kind="loading" title="Loading service detail" message="Requesting the selected service payload from the backend." />
      </DashboardShell>
    );
  }

  if (serviceQuery.isError || !service) {
    return (
      <DashboardShell title="Service detail" description="Inspect the selected managed surface, due dates, routing context, and runtime posture.">
        <DataState kind="error" title="Unable to load the service" message="The selected service was not returned by the backend." actionLabel="Retry" onAction={() => serviceQuery.refetch()} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title={service.name}
      description="Granular service detail with a presentation that feels premium while still respecting the separation between browser UI and backend execution."
      actions={<ButtonLink href="/services" variant="outline" size="sm">Back to services</ButtonLink>}
    >
      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[32px] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">{service.category}</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{service.name}</h2>
            </div>
            <Badge tone={statusTone(service.status)}>{service.status}</Badge>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted">{service.summary}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ["Region", service.region],
              ["Billing cycle", service.cycle],
              ["Next due", formatDate(service.nextDue)],
              ["Viewers", service.viewers],
              ["Average load", service.load],
              ["Runtime uptime", service.uptime]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/8 px-4 py-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted">{label}</div>
                <div className="mt-3 text-sm font-medium text-[var(--foreground)]">{value}</div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5">
          <Card className="rounded-[32px] p-6">
            <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Network and origin</div>
            <div className="mt-5 space-y-4">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted">Dedicated IP</div>
                <div className="mt-2 text-sm font-medium text-[var(--foreground)]">{service.ip}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted">Origin / domain</div>
                <div className="mt-2 text-sm font-medium text-[var(--foreground)]">{service.origin}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted">Protocol stack</div>
                <div className="mt-2 text-sm font-medium text-[var(--foreground)]">{service.protocols.join(", ") || "Managed stack"}</div>
              </div>
            </div>
          </Card>

          <Card className="rounded-[32px] p-6">
            <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Operator note</div>
            <p className="mt-4 text-sm leading-7 text-muted">
              In line with the repository architecture, this page intentionally focuses on customer-visible state and does not attempt to reproduce privileged provisioning controls inside the browser.
            </p>
            <div className="mt-6 grid gap-3">
              <ButtonLink href="/support/new" className="w-full justify-between">
                Request a change
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/billing" variant="outline" className="w-full justify-between">
                Review related billing
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </Card>
        </div>
      </section>
    </DashboardShell>
  );
}
