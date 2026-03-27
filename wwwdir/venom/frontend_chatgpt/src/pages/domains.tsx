import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Globe2, ShieldCheck, ShieldOff } from "lucide-react";
import { getDomain, listDomains, toggleAutorenew, toggleRegistrarLock, updateNameservers } from "@/lib/api";
import { domains as previewDomains } from "@/lib/site";
import { formatDate, statusTone } from "@/lib/utils";
import { usePreviewQuery } from "@/hooks/use-preview-query";
import { useAuthStore } from "@/hooks/use-auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataState } from "@/components/ui/data-state";
import { Input } from "@/components/ui/input";

export function DomainsList() {
  const domainsQuery = usePreviewQuery({
    queryKey: ["domains"],
    queryFn: listDomains,
    previewData: previewDomains
  });

  const domains = domainsQuery.data ?? [];

  if (domainsQuery.isLoading) {
    return (
      <DashboardShell title="Domains" description="Inspect managed domains, renewals, nameservers, and registrar posture.">
        <DataState kind="loading" title="Loading domains" message="Requesting the account's managed domain records from the backend." />
      </DashboardShell>
    );
  }

  if (domainsQuery.isError) {
    return (
      <DashboardShell title="Domains" description="Inspect managed domains, renewals, nameservers, and registrar posture.">
        <DataState kind="error" title="Unable to load domains" message="The domain list was not returned by the backend." actionLabel="Retry" onAction={() => domainsQuery.refetch()} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Domains" description="A premium view of domain operations that keeps renewal posture, nameserver state, and registrar settings immediately visible." actions={<ButtonLink href="/support/new" size="sm">Request domain help</ButtonLink>}>
      <section className="grid gap-5 xl:grid-cols-2">
        {domains.map((domain) => (
          <Card key={domain.id} className="rounded-[30px] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Domain</div>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{domain.domain}</h2>
              </div>
              <Badge tone={statusTone(domain.status)}>{domain.status}</Badge>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">{domain.purpose}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 px-4 py-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted">Registrar</div>
                <div className="mt-3 text-sm font-medium text-[var(--foreground)]">{domain.registrar}</div>
              </div>
              <div className="rounded-2xl border border-white/8 px-4 py-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted">Expires</div>
                <div className="mt-3 text-sm font-medium text-[var(--foreground)]">{formatDate(domain.expiresOn)}</div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {domain.autorenew ? <Badge tone="success">Autorenew on</Badge> : <Badge tone="warning">Autorenew off</Badge>}
              {domain.lock ? <Badge tone="success">Registrar lock</Badge> : <Badge tone="warning">Unlocked</Badge>}
            </div>
            <div className="mt-5 flex justify-end">
              <ButtonLink href={`/domains/${domain.id}`} variant="outline" size="sm">
                Domain detail
              </ButtonLink>
            </div>
          </Card>
        ))}
      </section>
    </DashboardShell>
  );
}

export function DomainDetail({ domainId }: { domainId: string }) {
  const previewMode = useAuthStore((state) => state.previewMode);
  const previewData = previewDomains.find((domain) => domain.id === domainId) ?? previewDomains[0];
  const domainQuery = usePreviewQuery({
    queryKey: ["domain", domainId],
    queryFn: () => getDomain(domainId),
    previewData
  });

  const domain = domainQuery.data;
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nameservers, setNameservers] = useState((previewData.nameservers ?? []).join("\n"));

  const nameserverMutation = useMutation({
    mutationFn: () => updateNameservers(domainId, nameservers.split("\n").map((item) => item.trim()).filter(Boolean)),
    onSuccess: () => {
      setError(null);
      setFeedback(previewMode ? "Preview mode does not persist nameserver changes, but the action is wired." : "Nameserver update request submitted." );
    },
    onError: (mutationError) => {
      setFeedback(null);
      setError(mutationError instanceof Error ? mutationError.message : "Unable to update nameservers.");
    }
  });

  const autorenewMutation = useMutation({
    mutationFn: () => toggleAutorenew(domainId, !(domain?.autorenew ?? false)),
    onSuccess: () => {
      setError(null);
      setFeedback(previewMode ? "Preview mode does not persist auto-renew changes, but the action is wired." : "Auto-renew update request submitted." );
    },
    onError: (mutationError) => {
      setFeedback(null);
      setError(mutationError instanceof Error ? mutationError.message : "Unable to update auto-renew.");
    }
  });

  const lockMutation = useMutation({
    mutationFn: () => toggleRegistrarLock(domainId, !(domain?.lock ?? false)),
    onSuccess: () => {
      setError(null);
      setFeedback(previewMode ? "Preview mode does not persist registrar lock changes, but the action is wired." : "Registrar lock update request submitted." );
    },
    onError: (mutationError) => {
      setFeedback(null);
      setError(mutationError instanceof Error ? mutationError.message : "Unable to update registrar lock.");
    }
  });

  if (domainQuery.isLoading) {
    return (
      <DashboardShell title="Domain detail" description="Review nameservers, lock state, and renewal posture for the selected domain.">
        <DataState kind="loading" title="Loading domain" message="Requesting the selected domain record from the backend." />
      </DashboardShell>
    );
  }

  if (domainQuery.isError || !domain) {
    return (
      <DashboardShell title="Domain detail" description="Review nameservers, lock state, and renewal posture for the selected domain.">
        <DataState kind="error" title="Unable to load domain" message="The selected domain was not returned by the backend." actionLabel="Retry" onAction={() => domainQuery.refetch()} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title={domain.domain} description="Domain operations are presented with better hierarchy and explicit state while sensitive registrar execution remains server-side." actions={<ButtonLink href="/domains" variant="outline" size="sm">Back to domains</ButtonLink>}>
      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[32px] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Managed domain</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{domain.domain}</h2>
              <p className="mt-4 text-sm leading-7 text-muted">{domain.purpose}</p>
            </div>
            <Badge tone={statusTone(domain.status)}>{domain.status}</Badge>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Registrar", domain.registrar],
              ["Expires", formatDate(domain.expiresOn)],
              ["Auto-renew", domain.autorenew ? "Enabled" : "Disabled"],
              ["Lock", domain.lock ? "Enabled" : "Disabled"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/8 px-4 py-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted">{label}</div>
                <div className="mt-3 text-sm font-medium text-[var(--foreground)]">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[28px] border border-white/8 p-5">
            <div className="text-sm font-semibold text-[var(--foreground)]">Nameservers</div>
            <div className="mt-5 grid gap-3">
              {domain.nameservers.map((item) => (
                <div key={item} className="rounded-2xl border border-white/8 px-4 py-3 text-sm text-soft">{item}</div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid gap-5">
          <Card className="rounded-[32px] p-6">
            <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Domain controls</div>
            <div className="mt-5 space-y-4">
              <Input label="Nameserver list" value={nameservers} onChange={(event) => setNameservers(event.target.value)} placeholder="One nameserver per line" className="h-auto min-h-[140px] py-4" />
              <Button type="button" onClick={() => nameserverMutation.mutate()} disabled={nameserverMutation.isPending}>
                {nameserverMutation.isPending ? "Updating nameservers..." : "Submit nameserver update"}
              </Button>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button type="button" variant="outline" onClick={() => autorenewMutation.mutate()} disabled={autorenewMutation.isPending}>
                  <Globe2 className="size-4" />
                  {domain.autorenew ? "Disable auto-renew" : "Enable auto-renew"}
                </Button>
                <Button type="button" variant="outline" onClick={() => lockMutation.mutate()} disabled={lockMutation.isPending}>
                  {domain.lock ? <ShieldOff className="size-4" /> : <ShieldCheck className="size-4" />}
                  {domain.lock ? "Disable lock" : "Enable lock"}
                </Button>
              </div>
            </div>
            {feedback ? <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{feedback}</div> : null}
            {error ? <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">{error}</div> : null}
          </Card>

          <Card className="rounded-[32px] p-6">
            <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Operational note</div>
            <p className="mt-4 text-sm leading-7 text-muted">
              Domain actions are initiated from the frontend but executed by the backend integration layer, keeping registrar credentials and privileged workflows out of the browser.
            </p>
          </Card>
        </div>
      </section>
    </DashboardShell>
  );
}
