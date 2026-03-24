import {
  useGetDomains,
  useGetDomain,
  useUpdateDomainNameservers,
  useRenewDomain,
  useToggleDomainIdProtection,
  useToggleDomainRegistrarLock,
  useToggleDomainAutoRenew,
  useTransferDomain,
  useWhoisLookup,
} from "@workspace/api-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import {
  Globe,
  Shield,
  Lock,
  RefreshCw,
  AlertCircle,
  Calendar,
  ChevronRight,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  ArrowRightLeft,
  Search,
} from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const variants: Record<string, string> = {
    active: "bg-green-500/10 text-green-400 border border-green-500/20",
    expired: "bg-red-500/10 text-red-400 border border-red-500/20",
    pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    cancelled: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
    grace: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
    redemption: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    transferred: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  };
  const cls = variants[s] ?? "bg-white/10 text-white/70 border border-white/10";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
  isPending,
  icon: Icon,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  isPending: boolean;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-white/50 mt-0.5">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onToggle(!enabled)}
        disabled={isPending}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
          enabled ? "bg-primary" : "bg-white/10"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function MiniToggle({
  enabled,
  onToggle,
  isPending,
}: {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  isPending: boolean;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(!enabled); }}
      disabled={isPending}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
        enabled ? "bg-primary" : "bg-white/10"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          enabled ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function DaysUntilExpiry({ expiryDate }: { expiryDate?: string }) {
  if (!expiryDate) return null;
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diff = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (isNaN(diff)) return null;
  if (diff < 0) return <span className="text-xs text-red-400">Expired {Math.abs(diff)}d ago</span>;
  if (diff <= 30) return <span className="text-xs text-orange-400">Expires in {diff}d</span>;
  if (diff <= 90) return <span className="text-xs text-yellow-400">Expires in {diff}d</span>;
  return <span className="text-xs text-white/40">Expires in {diff}d</span>;
}

function DomainListRow({ d }: { d: { id: string; domainName: string; status: string; expiryDate?: string; nextDueDate?: string; autoRenew?: boolean; idProtection?: boolean } }) {
  const { toast } = useToast();
  const autoRenewMut = useToggleDomainAutoRenew();

  async function handleToggleAutoRenew(enabled: boolean) {
    try {
      await autoRenewMut.mutateAsync({ domainId: d.id, data: { enabled } });
      toast({ title: `Auto-renew ${enabled ? "enabled" : "disabled"} for ${d.domainName}` });
    } catch {
      toast({ title: "Error", description: "Failed to update auto-renew.", variant: "destructive" });
    }
  }

  return (
    <div className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Globe className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-white truncate">{d.domainName}</p>
          <StatusBadge status={d.status} />
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {d.expiryDate && (
            <span className="flex items-center gap-1 text-xs text-white/50">
              <Calendar className="w-3 h-3" />
              {d.expiryDate}
            </span>
          )}
          <DaysUntilExpiry expiryDate={d.expiryDate} />
          {d.idProtection && (
            <span className="flex items-center gap-1 text-xs text-blue-400">
              <Shield className="w-3 h-3" />
              Privacy on
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2" title="Auto-renew">
          <span className="text-xs text-white/40 hidden sm:inline">Auto-renew</span>
          <MiniToggle
            enabled={d.autoRenew ?? false}
            onToggle={handleToggleAutoRenew}
            isPending={autoRenewMut.isPending}
          />
        </div>
        <Link href={`/domains/${d.id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white gap-1"
          >
            Manage
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function WhoisSearchPanel() {
  const [searchInput, setSearchInput] = useState("");
  const [searchDomain, setSearchDomain] = useState("");

  const { data: whoisData, isLoading: whoisLoading, isError: whoisError, isFetching } = useWhoisLookup(
    { domain: searchDomain },
    { query: { enabled: Boolean(searchDomain), queryKey: [`/api/domains/whois`, { domain: searchDomain }] } }
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchInput.trim().toLowerCase();
    if (trimmed) setSearchDomain(trimmed);
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <h3 className="font-semibold text-white">Domain Availability Check</h3>
        <p className="text-xs text-white/40 mt-0.5">Search for a domain name to check availability</p>
      </div>
      <div className="p-6 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="example.com"
            className="bg-black/20 border-white/10 text-white placeholder:text-white/30 flex-1"
          />
          <Button type="submit" disabled={!searchInput.trim() || isFetching} className="gap-2 flex-shrink-0">
            {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Check
          </Button>
        </form>

        {whoisError && searchDomain && (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Failed to check domain availability. Please try again.</span>
          </div>
        )}

        {whoisData && !whoisLoading && (
          <div className={`rounded-xl p-4 border ${whoisData.available ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}>
            <div className="flex items-center gap-3">
              {whoisData.available ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`font-semibold text-sm ${whoisData.available ? "text-green-400" : "text-red-400"}`}>
                  {whoisData.domain} — {whoisData.available ? "Available" : "Taken"}
                </p>
                {whoisData.status && (
                  <p className="text-xs text-white/50 mt-0.5">Status: {whoisData.status}</p>
                )}
                {whoisData.registrar && (
                  <p className="text-xs text-white/50">Registrar: {whoisData.registrar}</p>
                )}
                {whoisData.expiryDate && (
                  <p className="text-xs text-white/50">Expires: {whoisData.expiryDate}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function DomainsList() {
  const { data, isLoading, isError } = useGetDomains();
  const domains = data?.domains ?? [];

  return (
    <DashboardLayout title="My Domains">
      <div className="space-y-6">
        <WhoisSearchPanel />

        {isLoading && (
          <div className="glass rounded-2xl p-12 text-center text-white/50">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
            <p>Loading domains...</p>
          </div>
        )}

        {isError && (
          <div className="glass rounded-2xl p-8 flex items-center gap-3 text-red-400 border border-red-500/20">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>Failed to load domains. Please refresh and try again.</p>
          </div>
        )}

        {!isLoading && !isError && domains.length === 0 && (
          <div className="glass rounded-2xl p-16 text-center">
            <Globe className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-lg font-semibold text-white/60">No domains found</p>
            <p className="text-sm text-white/40 mt-1">You don't have any domains registered yet.</p>
          </div>
        )}

        {!isLoading && !isError && domains.length > 0 && (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-semibold text-white">Domains ({data?.total ?? domains.length})</h2>
              <p className="text-xs text-white/40 hidden sm:block">Toggle auto-renew directly from the list</p>
            </div>
            <div className="divide-y divide-white/5">
              {domains.map((d) => (
                <DomainListRow key={d.id} d={d} />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export function DomainDetail() {
  const [, params] = useRoute("/domains/:id");
  const id = params?.id ?? "";
  const { data: d, isLoading, isError, refetch } = useGetDomain(id);
  const { toast } = useToast();

  const nsMut = useUpdateDomainNameservers();
  const renewMut = useRenewDomain();
  const idProtMut = useToggleDomainIdProtection();
  const regLockMut = useToggleDomainRegistrarLock();
  const autoRenewMut = useToggleDomainAutoRenew();
  const transferMut = useTransferDomain();

  const [ns1, setNs1] = useState("");
  const [ns2, setNs2] = useState("");
  const [ns3, setNs3] = useState("");
  const [ns4, setNs4] = useState("");
  const [renewYears, setRenewYears] = useState(1);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferSecret, setTransferSecret] = useState("");

  useEffect(() => {
    if (d?.nameservers) {
      setNs1(d.nameservers[0] ?? "");
      setNs2(d.nameservers[1] ?? "");
      setNs3(d.nameservers[2] ?? "");
      setNs4(d.nameservers[3] ?? "");
    }
  }, [d]);

  if (isLoading) {
    return (
      <DashboardLayout title="Domain">
        <div className="glass rounded-2xl p-12 text-center text-white/50">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
          <p>Loading domain...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !d) {
    return (
      <DashboardLayout title="Domain">
        <div className="glass rounded-2xl p-8 flex items-center gap-3 text-red-400 border border-red-500/20">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>Domain not found or you do not have access to it.</p>
        </div>
      </DashboardLayout>
    );
  }

  async function handleUpdateNameservers() {
    const nameservers = [ns1, ns2, ns3, ns4].filter(Boolean);
    if (nameservers.length < 2) {
      toast({ title: "Error", description: "At least 2 nameservers are required", variant: "destructive" });
      return;
    }
    try {
      await nsMut.mutateAsync({ domainId: id, data: { nameservers } });
      toast({ title: "Nameservers updated", description: "Changes have been saved." });
      refetch();
    } catch {
      toast({ title: "Error", description: "Failed to update nameservers. Please try again.", variant: "destructive" });
    }
  }

  async function handleRenew() {
    try {
      await renewMut.mutateAsync({ domainId: id, data: { years: renewYears } });
      toast({ title: "Renewal queued", description: `Domain renewal for ${renewYears} year${renewYears > 1 ? "s" : ""} has been queued.` });
      refetch();
    } catch {
      toast({ title: "Error", description: "Failed to queue renewal. Please try again.", variant: "destructive" });
    }
  }

  async function handleToggleIdProtection(enabled: boolean) {
    try {
      await idProtMut.mutateAsync({ domainId: id, data: { enabled } });
      toast({ title: `ID protection ${enabled ? "enabled" : "disabled"}` });
      refetch();
    } catch {
      toast({ title: "Error", description: "Failed to update ID protection.", variant: "destructive" });
    }
  }

  async function handleToggleRegistrarLock(enabled: boolean) {
    try {
      await regLockMut.mutateAsync({ domainId: id, data: { enabled } });
      toast({ title: `Registrar lock ${enabled ? "enabled" : "disabled"}` });
      refetch();
    } catch {
      toast({ title: "Error", description: "Failed to update registrar lock.", variant: "destructive" });
    }
  }

  async function handleToggleAutoRenew(enabled: boolean) {
    try {
      await autoRenewMut.mutateAsync({ domainId: id, data: { enabled } });
      toast({ title: `Auto-renew ${enabled ? "enabled" : "disabled"}` });
      refetch();
    } catch {
      toast({ title: "Error", description: "Failed to update auto-renew.", variant: "destructive" });
    }
  }

  async function handleTransfer() {
    if (!transferSecret.trim()) {
      toast({ title: "Error", description: "EPP/Auth code is required", variant: "destructive" });
      return;
    }
    try {
      await transferMut.mutateAsync({ domainId: id, data: { transferSecret: transferSecret.trim() } });
      toast({ title: "Transfer initiated", description: "Domain transfer has been submitted." });
      setShowTransfer(false);
      setTransferSecret("");
    } catch {
      toast({ title: "Error", description: "Failed to initiate transfer. Please try again.", variant: "destructive" });
    }
  }

  const expiryDate = d.expiryDate ?? "";
  const isExpiringSoon = (() => {
    if (!expiryDate) return false;
    const diff = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return !isNaN(diff) && diff <= 30;
  })();

  return (
    <DashboardLayout title={d.domainName}>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-white/50">
          <Link href="/domains" className="hover:text-white transition-colors">Domains</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{d.domainName}</span>
        </div>

        {isExpiringSoon && (
          <div className="glass rounded-2xl p-4 flex items-center gap-3 text-orange-300 border border-orange-500/20 bg-orange-500/5">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Domain expiring soon</p>
              <p className="text-sm text-orange-300/70">This domain expires on {expiryDate}. Renew it below to avoid losing it.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h3 className="font-semibold text-white">Domain Information</h3>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <InfoRow label="Domain Name" value={d.domainName} />
                <InfoRow label="Status" value={<StatusBadge status={d.status} />} />
                <InfoRow label="Expiry Date" value={expiryDate || "—"} />
                <InfoRow label="Next Due Date" value={d.nextDueDate || "—"} />
                {d.billingCycle && <InfoRow label="Billing Cycle" value={d.billingCycle} />}
                {d.amount && <InfoRow label="Amount" value={d.amount} />}
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Nameservers</h3>
                  <p className="text-xs text-white/40 mt-0.5">Update the DNS nameservers for this domain</p>
                </div>
                <a
                  href={`https://${d.domainName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  DNS Management
                </a>
              </div>
              <div className="p-6 space-y-4">
                <div className="glass rounded-xl p-4 border border-primary/10 bg-primary/5">
                  <p className="text-xs text-primary/80">
                    DNS zone management is handled at the registrar level. Use your registrar's control panel to manage DNS records for this domain. The link above opens your domain in the browser for reference.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-white/70 text-xs">Nameserver 1</Label>
                    <Input
                      value={ns1}
                      onChange={(e) => setNs1(e.target.value)}
                      placeholder="ns1.example.com"
                      className="bg-black/20 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/70 text-xs">Nameserver 2</Label>
                    <Input
                      value={ns2}
                      onChange={(e) => setNs2(e.target.value)}
                      placeholder="ns2.example.com"
                      className="bg-black/20 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/70 text-xs">Nameserver 3 (optional)</Label>
                    <Input
                      value={ns3}
                      onChange={(e) => setNs3(e.target.value)}
                      placeholder="ns3.example.com"
                      className="bg-black/20 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/70 text-xs">Nameserver 4 (optional)</Label>
                    <Input
                      value={ns4}
                      onChange={(e) => setNs4(e.target.value)}
                      placeholder="ns4.example.com"
                      className="bg-black/20 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleUpdateNameservers}
                  disabled={nsMut.isPending}
                  className="gap-2"
                >
                  {nsMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save Nameservers
                </Button>
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h3 className="font-semibold text-white">Security &amp; Privacy</h3>
                <p className="text-xs text-white/40 mt-0.5">Configure domain protection settings</p>
              </div>
              <div className="px-6">
                <ToggleRow
                  label="WHOIS Privacy (ID Protection)"
                  description="Hide your personal contact information from public WHOIS lookups"
                  enabled={d.idProtection ?? false}
                  onToggle={handleToggleIdProtection}
                  isPending={idProtMut.isPending}
                  icon={Shield}
                />
                <ToggleRow
                  label="Registrar Lock"
                  description="Prevent unauthorized domain transfers by locking it at the registrar level"
                  enabled={d.registrarLock ?? false}
                  onToggle={handleToggleRegistrarLock}
                  isPending={regLockMut.isPending}
                  icon={Lock}
                />
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Transfer Domain</h3>
                  <p className="text-xs text-white/40 mt-0.5">Transfer this domain to another registrar</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTransfer(!showTransfer)}
                  className="gap-1.5 text-white/60"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  {showTransfer ? "Cancel" : "Initiate Transfer"}
                </Button>
              </div>
              {showTransfer ? (
                <div className="p-6 space-y-4">
                  <div className="glass rounded-xl p-4 border border-yellow-500/20 bg-yellow-500/5">
                    <p className="text-xs text-yellow-300/80">
                      Make sure to <strong>disable the registrar lock</strong> before initiating a transfer. You'll need the EPP/Auth code from your current registrar.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/70 text-xs">EPP / Authorization Code</Label>
                    <Input
                      value={transferSecret}
                      onChange={(e) => setTransferSecret(e.target.value)}
                      placeholder="Enter EPP auth code"
                      className="bg-black/20 border-white/10 text-white placeholder:text-white/30 font-mono"
                    />
                  </div>
                  <Button
                    onClick={handleTransfer}
                    disabled={transferMut.isPending}
                    variant="destructive"
                    className="gap-2"
                  >
                    {transferMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRightLeft className="w-4 h-4" />}
                    Submit Transfer Request
                  </Button>
                </div>
              ) : (
                <div className="px-6 py-4 text-sm text-white/40">
                  Click "Initiate Transfer" to move this domain to another registrar using your EPP auth code.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h3 className="font-semibold text-white">Auto-Renew</h3>
              </div>
              <div className="px-6">
                <ToggleRow
                  label="Automatic Renewal"
                  description="Automatically renew this domain before it expires"
                  enabled={d.autoRenew ?? false}
                  onToggle={handleToggleAutoRenew}
                  isPending={autoRenewMut.isPending}
                  icon={RefreshCw}
                />
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h3 className="font-semibold text-white">Renew Domain</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-xs">Renewal Period</Label>
                  <select
                    value={renewYears}
                    onChange={(e) => setRenewYears(Number(e.target.value))}
                    className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {[1, 2, 3, 5].map((y) => (
                      <option key={y} value={y}>
                        {y} {y === 1 ? "Year" : "Years"}
                      </option>
                    ))}
                  </select>
                </div>
                {expiryDate && (
                  <div className="rounded-lg bg-black/20 p-3 text-xs text-white/50 space-y-1">
                    <div className="flex justify-between">
                      <span>Current expiry</span>
                      <span className="text-white/70">{expiryDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>After renewal</span>
                      <span className="text-white/70">
                        {(() => {
                          const d2 = new Date(expiryDate);
                          d2.setFullYear(d2.getFullYear() + renewYears);
                          return isNaN(d2.getTime()) ? "—" : d2.toISOString().split("T")[0];
                        })()}
                      </span>
                    </div>
                  </div>
                )}
                <Button
                  onClick={handleRenew}
                  disabled={renewMut.isPending}
                  className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  {renewMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Renew Now
                </Button>
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h3 className="font-semibold text-white">Quick Status</h3>
              </div>
              <div className="p-6 space-y-3">
                <StatusIndicator label="Auto-Renew" enabled={d.autoRenew ?? false} />
                <StatusIndicator label="WHOIS Privacy" enabled={d.idProtection ?? false} />
                <StatusIndicator label="Registrar Lock" enabled={d.registrarLock ?? false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-white/40 mb-0.5">{label}</p>
      <p className="text-sm text-white font-medium">{value}</p>
    </div>
  );
}

function StatusIndicator({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/60">{label}</span>
      <span className={`flex items-center gap-1.5 text-xs font-medium ${enabled ? "text-green-400" : "text-white/30"}`}>
        {enabled ? (
          <>
            <CheckCircle className="w-3.5 h-3.5" />
            Enabled
          </>
        ) : (
          <>
            <XCircle className="w-3.5 h-3.5" />
            Disabled
          </>
        )}
      </span>
    </div>
  );
}
