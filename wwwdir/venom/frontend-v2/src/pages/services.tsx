import { useState } from "react";
import {
  useGetServices,
  useGetService,
  useGetServiceAddons,
  useCancelService,
  useSuspendService,
  useUnsuspendService,
  useUpgradeService,
  useTerminateService,
} from "@/api/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Link, useRoute } from "wouter";
import { Server, Search, ExternalLink, ShieldCheck, AlertCircle, ChevronRight, Plus, CheckCircle, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = ["All", "Active", "Suspended", "Cancelled", "Terminated"] as const;
type StatusFilter = typeof STATUS_FILTERS[number];
type SortField = "productName" | "nextDueDate" | "amount" | "status";
type SortDir = "asc" | "desc";

function getStatusBadge(status: string) {
  const s = status.toLowerCase();
  if (s === "active") return "success";
  if (s === "suspended") return "warning";
  if (s === "cancelled" || s === "terminated") return "destructive";
  return "secondary";
}

function ServiceRowSkeleton() {
  return (
    <tr className="border-b border-border">
      {[60, 40, 40, 30, 20].map((w, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-secondary rounded animate-pulse" style={{ width: `${w}%` }} />
        </td>
      ))}
    </tr>
  );
}

function SortButton({
  field,
  label,
  current,
  dir,
  onChange,
}: {
  field: SortField;
  label: string;
  current: SortField;
  dir: SortDir;
  onChange: (f: SortField) => void;
}) {
  const active = current === field;
  return (
    <button
      onClick={() => onChange(field)}
      className={cn(
        "flex items-center gap-1 group text-xs font-semibold uppercase tracking-wider",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
      <ArrowUpDown
        className={cn(
          "w-3 h-3 transition-opacity",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-50"
        )}
      />
      {active && <span className="text-xs ml-0.5">{dir === "asc" ? "↑" : "↓"}</span>}
    </button>
  );
}

export function ServicesList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [sortField, setSortField] = useState<SortField>("nextDueDate");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  const apiStatus = statusFilter === "All" ? undefined : statusFilter;
  const { data, isLoading, isError } = useGetServices({ status: apiStatus, page, limit: 100 });

  const handleFilterChange = (s: StatusFilter) => {
    setStatusFilter(s);
    setPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = (data?.services ?? [])
    .filter(
      (svc) =>
        !search ||
        svc.productName.toLowerCase().includes(search.toLowerCase()) ||
        (svc.domain ?? "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === "amount") {
        const parseAmt = (s: string | undefined) =>
          parseFloat(s?.replace(/[^0-9.]/g, "") ?? "0") || 0;
        const diff = parseAmt(a.amount?.toString()) - parseAmt(b.amount?.toString());
        return sortDir === "asc" ? diff : -diff;
      }
      const getVal = (s: typeof a) => {
        if (sortField === "productName") return s.productName ?? "";
        if (sortField === "nextDueDate") return s.nextDueDate ?? "";
        if (sortField === "status") return s.status ?? "";
        return "";
      };
      const av = getVal(a);
      const bv = getVal(b);
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  return (
    <DashboardLayout title="My Services">
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search services or domains..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-background border-border focus-visible:ring-primary h-11 rounded-xl"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => handleFilterChange(s)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                statusFilter === s
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <Link href="/order" className="sm:ml-auto">
          <Button className="h-11 rounded-xl shrink-0 gap-2 shadow-lg shadow-primary/10">
            <Plus className="w-4 h-4" /> Order New
          </Button>
        </Link>
      </div>

      {isError && (
        <div className="flex items-center gap-3 p-4 mb-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">Failed to load services. Please try again.</p>
        </div>
      )}

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/30 border-b border-border text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">
                  <SortButton
                    field="productName"
                    label="Product / Service"
                    current={sortField}
                    dir={sortDir}
                    onChange={handleSort}
                  />
                </th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">
                  <SortButton
                    field="amount"
                    label="Pricing"
                    current={sortField}
                    dir={sortDir}
                    onChange={handleSort}
                  />
                </th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">
                  <SortButton
                    field="nextDueDate"
                    label="Next Due"
                    current={sortField}
                    dir={sortDir}
                    onChange={handleSort}
                  />
                </th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">
                  <SortButton
                    field="status"
                    label="Status"
                    current={sortField}
                    dir={sortDir}
                    onChange={handleSort}
                  />
                </th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => <ServiceRowSkeleton key={i} />)}
              {!isLoading &&
                filtered.map((svc) => (
                  <tr
                    key={svc.id}
                    className="border-b border-border hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">{svc.productName}</p>
                      {svc.domain && (
                        <p className="text-xs text-primary/70 font-mono mt-1">{svc.domain}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-foreground/80">
                      {svc.amount ?? "—"}
                      {svc.billingCycle && (
                        <span className="text-xs text-muted-foreground ml-1.5">/{svc.billingCycle}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-foreground/80">{svc.nextDueDate ?? "—"}</td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusBadge(svc.status) as any}>{svc.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/services/${svc.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-lg text-primary hover:bg-primary/10 gap-1"
                        >
                          Manage <ChevronRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              {!isLoading && filtered.length === 0 && !isError && (
                <tr>
                  <td colSpan={5} className="text-center py-14 text-muted-foreground">
                    <Server className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium mb-2">
                      {search || statusFilter !== "All"
                        ? "No matching services found"
                        : "No services yet"}
                    </p>
                    <Link href="/order">
                      <Button size="sm" className="mt-2 rounded-xl gap-2">
                        <Plus className="w-4 h-4" /> Order a Service
                      </Button>
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {data && data.total > 0 && (
          <div className="px-6 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {filtered.length} of {data.total} service{data.total !== 1 ? "s" : ""}
              {search && " (filtered)"}
            </span>
            {data.total > (data.limit ?? 100) && (
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                <span>
                  Page {page} of {Math.ceil(data.total / (data.limit ?? 100))}
                </span>
                <button
                  disabled={page >= Math.ceil(data.total / (data.limit ?? 100))}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

type ModalType = "cancel" | "upgrade" | "terminate" | null;
type ActionResult = { label: string; success: boolean; message?: string };

export function ServiceDetail() {
  const [, params] = useRoute("/services/:id");
  const id = params?.id ?? "";

  const [modal, setModal] = useState<ModalType>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelType, setCancelType] = useState<"End of Billing Period" | "Immediate">(
    "End of Billing Period"
  );
  const [upgradeProductId, setUpgradeProductId] = useState("");
  const [upgradePayment, setUpgradePayment] = useState("paypal");
  const [actionResult, setActionResult] = useState<ActionResult | null>(null);

  const { data: svc, isLoading, isError, refetch } = useGetService(id);
  const { data: addons, isLoading: addonsLoading, isError: addonsError } = useGetServiceAddons(id);
  const cancelMutation = useCancelService();
  const suspendMutation = useSuspendService();
  const unsuspendMutation = useUnsuspendService();
  const upgradeMutation = useUpgradeService();
  const terminateMutation = useTerminateService();

  const closeModal = () => {
    setModal(null);
    setCancelReason("");
    cancelMutation.reset();
    upgradeMutation.reset();
    terminateMutation.reset();
  };

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync({
        serviceId: id,
        data: { reason: cancelReason, type: cancelType },
      });
      closeModal();
      setActionResult({
        label: "Cancellation request submitted. Our team will process it shortly.",
        success: true,
      });
      refetch();
    } catch (err) {
      console.error("Cancel mutation failed:", err);
    }
  };

  const handleUpgrade = async () => {
    if (!upgradeProductId.trim()) return;
    try {
      await upgradeMutation.mutateAsync({
        serviceId: id,
        data: { newproductid: upgradeProductId.trim(), paymentmethod: upgradePayment },
      });
      closeModal();
      setActionResult({
        label: "Upgrade initiated. You will be billed for the pro-rated difference.",
        success: true,
      });
      refetch();
    } catch (err) {
      console.error("Upgrade mutation failed:", err);
    }
  };

  const handleSuspend = async () => {
    try {
      await suspendMutation.mutateAsync({ serviceId: id });
      setActionResult({ label: "Service has been suspended.", success: true });
      refetch();
    } catch {
      setActionResult({
        label: "Failed to suspend service. Please try again.",
        success: false,
      });
    }
  };

  const handleUnsuspend = async () => {
    try {
      await unsuspendMutation.mutateAsync({ serviceId: id });
      setActionResult({ label: "Service has been unsuspended.", success: true });
      refetch();
    } catch {
      setActionResult({
        label: "Failed to unsuspend service. Please try again.",
        success: false,
      });
    }
  };

  const handleTerminate = async () => {
    try {
      await terminateMutation.mutateAsync({ serviceId: id });
      closeModal();
      setActionResult({ label: "Service has been terminated.", success: true });
      refetch();
    } catch (err) {
      console.error("Terminate mutation failed:", err);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Service Detail">
        <div className="space-y-6">
          <div className="h-64 bg-secondary/30 rounded-2xl animate-pulse" />
          <div className="h-40 bg-secondary/30 rounded-2xl animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !svc) {
    return (
      <DashboardLayout title="Service Detail">
        <div className="flex items-center gap-3 p-5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-medium">Service not found</p>
            <p className="text-sm mt-1 text-rose-500/70">This service may not belong to your account.</p>
          </div>
        </div>
        <Link href="/services">
          <Button variant="outline" className="mt-4 rounded-xl border-border">
            ← Back to Services
          </Button>
        </Link>
      </DashboardLayout>
    );
  }

  const statusLower = svc.status.toLowerCase();
  const isActive = statusLower === "active";
  const isSuspended = statusLower === "suspended";
  const isCancelled = statusLower === "cancelled";
  const isTerminated = statusLower === "terminated";
  const anyPending = suspendMutation.isPending || unsuspendMutation.isPending;
  const serviceIsGone = isCancelled || isTerminated;

  return (
    <DashboardLayout title="Manage Service">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Services
        </Link>

        {/* Action result banner */}
        {actionResult && (
          <div
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border",
              actionResult.success
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                : "bg-rose-500/10 border-rose-500/30 text-rose-500"
            )}
          >
            {actionResult.success ? (
              <CheckCircle className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <p className="text-sm font-medium">{actionResult.label}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-card border border-border p-8">
              <div className="flex items-start justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                    {svc.productName}
                  </h2>
                  {svc.domain && (
                    <p className="text-primary font-mono text-sm bg-primary/10 px-3 py-1.5 rounded-lg inline-block">
                      {svc.domain}
                    </p>
                  )}
                </div>
                <Badge variant={getStatusBadge(svc.status) as any} className="text-sm px-3 py-1">
                  {svc.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-5 p-6 bg-secondary/30 rounded-xl border border-border">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                    Registration Date
                  </p>
                  <p className="font-semibold text-foreground">{svc.regDate ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                    Next Due Date
                  </p>
                  <p className="font-semibold text-foreground">{svc.nextDueDate ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                    Recurring Amount
                  </p>
                  <p className="font-semibold text-foreground">
                    {svc.amount ?? "—"}
                    {svc.billingCycle && (
                      <span className="text-sm font-normal text-muted-foreground ml-1.5">
                        ({svc.billingCycle})
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                    Dedicated IP
                  </p>
                  <p className="font-semibold text-foreground font-mono">{svc.dedicatedIp ?? "None"}</p>
                </div>
                {svc.username && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                      Username
                    </p>
                    <p className="font-semibold text-foreground font-mono">{svc.username}</p>
                  </div>
                )}
              </div>

              {svc.notes && (
                <div className="mt-5 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                  <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
                    Notes
                  </p>
                  <p className="text-sm text-foreground/80">{svc.notes}</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-border">
                <Button className="w-full h-12 rounded-xl gap-2 shadow-lg shadow-primary/10">
                  <ExternalLink className="w-4 h-4" /> Login to Control Panel
                </Button>
              </div>
            </div>

            {/* Addons */}
            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="text-base font-display font-bold text-foreground mb-5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Active Add-ons
              </h3>
              {addonsLoading && (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 bg-secondary/30 rounded-xl animate-pulse" />
                  ))}
                </div>
              )}
              {addonsError && (
                <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" /> Failed to load add-ons.
                </div>
              )}
              {!addonsLoading && !addonsError && addons && addons.length > 0 && (
                <div className="space-y-3">
                  {addons.map((addon) => (
                    <div
                      key={addon.id}
                      className="p-4 bg-secondary/30 rounded-xl border border-border flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-foreground text-sm">{addon.name}</p>
                        {addon.nextDueDate && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Next Due: {addon.nextDueDate}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {addon.amount && <p className="font-bold text-foreground text-sm">{addon.amount}</p>}
                        <Badge variant={getStatusBadge(addon.status) as any} className="mt-0.5">
                          {addon.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!addonsLoading && !addonsError && (!addons || addons.length === 0) && (
                <p className="text-sm text-muted-foreground">No add-ons active for this service.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="rounded-2xl bg-card border border-border p-5">
              <h3 className="text-sm font-display font-bold text-foreground mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2.5">
                {isActive && (
                  <Button
                    variant="outline"
                    onClick={() => setModal("upgrade")}
                    className="w-full justify-start h-10 border-border hover:bg-secondary text-sm rounded-xl"
                  >
                    Upgrade / Downgrade
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start h-10 border-border hover:bg-secondary text-sm rounded-xl"
                >
                  Change Password
                </Button>
                <Link href={`/support/tickets/new?service=${svc.id}`}>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-10 border-border hover:bg-secondary text-sm rounded-xl"
                  >
                    Open Support Ticket
                  </Button>
                </Link>
                {isActive && (
                  <Button
                    variant="outline"
                    disabled={anyPending}
                    onClick={handleSuspend}
                    className="w-full justify-start h-10 border-amber-500/30 text-amber-500 hover:bg-amber-500/10 text-sm rounded-xl"
                  >
                    {suspendMutation.isPending ? "Suspending..." : "Suspend Service"}
                  </Button>
                )}
                {isSuspended && (
                  <Button
                    variant="outline"
                    disabled={anyPending}
                    onClick={handleUnsuspend}
                    className="w-full justify-start h-10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 text-sm rounded-xl"
                  >
                    {unsuspendMutation.isPending ? "Unsuspending..." : "Unsuspend Service"}
                  </Button>
                )}
                {(isActive || isSuspended) && (
                  <Button
                    variant="outline"
                    onClick={() => setModal("terminate")}
                    className="w-full justify-start h-10 border-rose-600/40 text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 text-sm rounded-xl"
                  >
                    Terminate Service
                  </Button>
                )}
                {(isActive || isSuspended) && !serviceIsGone && (
                  <Button
                    variant="outline"
                    onClick={() => setModal("cancel")}
                    className="w-full justify-start h-10 border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-sm rounded-xl"
                  >
                    Request Cancellation
                  </Button>
                )}
              </div>
            </div>

            {/* Service Info */}
            <div className="rounded-2xl bg-card border border-border p-5">
              <h3 className="text-sm font-display font-bold text-foreground mb-3">
                Service Info
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service ID</span>
                  <span className="text-foreground font-mono">#{svc.id}</span>
                </div>
                {svc.productId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Product ID</span>
                    <span className="text-foreground font-mono">#{svc.productId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {modal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              key={modal}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              {modal === "cancel" && (
                <>
                  <h3 className="text-lg font-display font-bold text-foreground mb-2">
                    Request Cancellation
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    Submit a cancellation request for{" "}
                    <strong className="text-foreground">{svc.productName}</strong>.
                  </p>
                  <div className="mb-4">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                      Timing
                    </label>
                    <div className="flex gap-2">
                      {(["End of Billing Period", "Immediate"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setCancelType(t)}
                          className={cn(
                            "flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all",
                            cancelType === t
                              ? "bg-rose-500/20 border-rose-500/50 text-rose-300"
                              : "bg-secondary border-border text-muted-foreground hover:bg-secondary/80"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                      Reason *
                    </label>
                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Please describe why you'd like to cancel..."
                      className="w-full h-28 bg-background border border-border rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  {cancelMutation.isError && (
                    <p className="text-sm text-rose-400 mb-4">
                      {(cancelMutation.error as { message?: string })?.message ??
                        "Failed to submit. Try again."}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl border-border"
                      onClick={closeModal}
                      disabled={cancelMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 rounded-xl bg-rose-500 hover:bg-rose-600 text-white"
                      disabled={!cancelReason.trim() || cancelMutation.isPending}
                      onClick={handleCancel}
                    >
                      {cancelMutation.isPending ? "Submitting..." : "Submit Request"}
                    </Button>
                  </div>
                </>
              )}

              {modal === "upgrade" && (
                <>
                  <h3 className="text-lg font-display font-bold text-foreground mb-2">
                    Upgrade / Downgrade
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    Enter the new product ID to upgrade or downgrade{" "}
                    <strong className="text-foreground">{svc.productName}</strong>.
                  </p>
                  <div className="mb-4">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                      New Product ID *
                    </label>
                    <Input
                      value={upgradeProductId}
                      onChange={(e) => setUpgradeProductId(e.target.value)}
                      placeholder="e.g. 42"
                      className="bg-background border-border focus-visible:ring-primary rounded-xl"
                    />
                  </div>
                  <div className="mb-5">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
                      Payment Method
                    </label>
                    <Input
                      value={upgradePayment}
                      onChange={(e) => setUpgradePayment(e.target.value)}
                      placeholder="e.g. paypal, stripe"
                      className="bg-background border-border focus-visible:ring-primary rounded-xl"
                    />
                  </div>
                  {upgradeMutation.isError && (
                    <p className="text-sm text-rose-400 mb-4">
                      {(upgradeMutation.error as { message?: string })?.message ??
                        "Upgrade failed. Try again."}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl border-border"
                      onClick={closeModal}
                      disabled={upgradeMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 rounded-xl"
                      disabled={!upgradeProductId.trim() || upgradeMutation.isPending}
                      onClick={handleUpgrade}
                    >
                      {upgradeMutation.isPending ? "Upgrading..." : "Confirm Upgrade"}
                    </Button>
                  </div>
                </>
              )}

              {modal === "terminate" && (
                <>
                  <h3 className="text-lg font-display font-bold text-foreground mb-2">
                    Terminate Service
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    This will{" "}
                    <strong className="text-rose-400">permanently terminate</strong>{" "}
                    <strong className="text-foreground">{svc.productName}</strong> via the module action.
                  </p>
                  <p className="text-sm text-rose-400/80 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-5">
                    Warning: This action is immediate and irreversible. All data on the service will
                    be deleted.
                  </p>
                  {terminateMutation.isError && (
                    <p className="text-sm text-rose-400 mb-4">
                      {(terminateMutation.error as { message?: string })?.message ??
                        "Termination failed. Try again."}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl border-border"
                      onClick={closeModal}
                      disabled={terminateMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
                      disabled={terminateMutation.isPending}
                      onClick={handleTerminate}
                    >
                      {terminateMutation.isPending ? "Terminating..." : "Terminate Now"}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
