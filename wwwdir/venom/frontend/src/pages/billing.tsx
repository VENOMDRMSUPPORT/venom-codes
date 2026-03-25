import { useState } from "react";
import {
  useGetInvoices,
  useGetInvoice,
  usePayInvoice,
  useGetQuotes,
  useGetQuote,
  useAcceptQuote,
  useDeleteQuote,
  useSendQuote,
  useGetOrders,
  useGetOrder,
  useCancelOrder,
} from "@workspace/api-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Link, useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Receipt, FileText, ArrowRight, CheckCircle2, AlertCircle,
  Clock, ArrowUpDown, ChevronLeft, ChevronRight, CreditCard,
  Wallet, ShoppingBag, Download, Send, Trash2, Package,
  XCircle, ChevronRight as ChevRight, Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ── helpers ──────────────────────────────────────────────────────────────────

const STATUS_FILTERS = ["All", "Unpaid", "Paid", "Cancelled", "Overdue", "Draft"] as const;
type InvoiceStatusFilter = typeof STATUS_FILTERS[number];
type SortField = "date" | "dueDate" | "total" | "status";
type SortDir = "asc" | "desc";

function invoiceStatusStyle(status: string) {
  const s = status.toLowerCase();
  if (s === "paid") return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
  if (s === "unpaid") return "bg-red-500/15 text-red-400 border border-red-500/30";
  if (s === "overdue") return "bg-orange-500/15 text-orange-400 border border-orange-500/30";
  if (s === "cancelled") return "bg-white/10 text-white/40 border border-white/10";
  if (s === "draft") return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
  return "bg-white/10 text-white/60 border border-white/10";
}

function quoteStatusStyle(status: string) {
  const s = status.toLowerCase();
  if (s === "accepted" || s === "accepted/converted") return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
  if (s === "delivered") return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
  if (s === "draft") return "bg-white/10 text-white/60 border border-white/10";
  if (s === "expired" || s === "dead") return "bg-red-500/15 text-red-400 border border-red-500/30";
  return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
}

function RowSkeleton({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 rounded animate-pulse bg-white/10" style={{ width: `${[60, 35, 35, 25, 18][i] ?? 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

function SortHeader({
  field, label, current, dir, onChange,
}: {
  field: SortField; label: string; current: SortField; dir: SortDir;
  onChange: (f: SortField) => void;
}) {
  const active = current === field;
  return (
    <button
      onClick={() => onChange(field)}
      className={`flex items-center gap-1 group ${active ? "text-primary" : "text-muted-foreground hover:text-white"}`}
    >
      {label}
      <ArrowUpDown className={`w-3 h-3 transition-opacity ${active ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} />
      {active && <span className="text-xs ml-0.5">{dir === "asc" ? "↑" : "↓"}</span>}
    </button>
  );
}

// ── Invoices List ─────────────────────────────────────────────────────────────

export function InvoicesList() {
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>("All");
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const limit = 25;

  const apiStatus = statusFilter === "All" ? undefined : statusFilter;
  const { data, isLoading, isError, refetch } = useGetInvoices({ status: apiStatus, page, limit });

  const invoices = data?.invoices ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleSort = (f: SortField) => {
    if (sortField === f) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else { setSortField(f); setSortDir("asc"); }
  };

  const handleFilterChange = (f: InvoiceStatusFilter) => {
    setStatusFilter(f);
    setPage(1);
  };

  const sorted = [...invoices].sort((a, b) => {
    let av = "", bv = "";
    if (sortField === "date") { av = a.date ?? ""; bv = b.date ?? ""; }
    else if (sortField === "dueDate") { av = a.dueDate ?? ""; bv = b.dueDate ?? ""; }
    else if (sortField === "total") { av = a.total ?? ""; bv = b.total ?? ""; }
    else if (sortField === "status") { av = a.status ?? ""; bv = b.status ?? ""; }
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  return (
    <DashboardLayout title="Invoices">
      <div className="space-y-6">
        {/* Filter bar */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                statusFilter === f
                  ? "bg-primary text-black"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
          <div className="ml-auto text-sm text-muted-foreground self-center">
            {!isLoading && `${total} total`}
          </div>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 border-b border-white/5 text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Invoice #</th>
                <th className="px-6 py-4 font-medium">
                  <SortHeader field="date" label="Date" current={sortField} dir={sortDir} onChange={handleSort} />
                </th>
                <th className="px-6 py-4 font-medium">
                  <SortHeader field="dueDate" label="Due Date" current={sortField} dir={sortDir} onChange={handleSort} />
                </th>
                <th className="px-6 py-4 font-medium">
                  <SortHeader field="total" label="Total" current={sortField} dir={sortDir} onChange={handleSort} />
                </th>
                <th className="px-6 py-4 font-medium">
                  <SortHeader field="status" label="Status" current={sortField} dir={sortDir} onChange={handleSort} />
                </th>
                <th className="px-6 py-4 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} cols={6} />)
                : isError
                ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                        <p className="text-muted-foreground">Failed to load invoices.</p>
                        <Button variant="secondary" size="sm" onClick={() => refetch()}>Retry</Button>
                      </div>
                    </td>
                  </tr>
                )
                : sorted.length === 0
                ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Receipt className="w-10 h-10 text-white/20" />
                        <p className="text-muted-foreground">No invoices found.</p>
                        {statusFilter !== "All" && (
                          <button onClick={() => handleFilterChange("All")} className="text-primary text-sm hover:underline">Clear filter</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
                : sorted.map((inv, i) => (
                  <motion.tr
                    key={inv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-medium font-mono">#{inv.id}</td>
                    <td className="px-6 py-4 text-white/70">{inv.date ?? "—"}</td>
                    <td className="px-6 py-4 text-white/70">{inv.dueDate ?? "—"}</td>
                    <td className="px-6 py-4 text-white font-bold font-mono">${inv.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${invoiceStatusStyle(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(inv.status.toLowerCase() === "unpaid" || inv.status.toLowerCase() === "overdue") && (
                          <Link href={`/billing/invoices/${inv.id}`}>
                            <Button size="sm" className="rounded-lg gap-1 bg-primary hover:bg-primary/90">
                              <CreditCard className="w-3 h-3" /> Pay
                            </Button>
                          </Link>
                        )}
                        <Link href={`/billing/invoices/${inv.id}`}>
                          <Button variant="secondary" size="sm" className="rounded-lg gap-1">
                            View <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-lg gap-1">
                <ChevronLeft className="w-4 h-4" /> Prev
              </Button>
              <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg gap-1">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ── Invoice Detail ────────────────────────────────────────────────────────────

export function InvoiceDetail() {
  const [, params] = useRoute("/billing/invoices/:id");
  const id = params?.id ?? "";
  const { data: inv, isLoading, isError, refetch } = useGetInvoice(id);
  const payMutation = usePayInvoice();
  const { toast } = useToast();
  const [applyCredit, setApplyCredit] = useState(false);

  const handlePay = async () => {
    try {
      const res = await payMutation.mutateAsync({
        invoiceId: id,
        data: { paymentMethod: inv?.paymentMethod ?? "default", applyCredit },
      });
      if (res.redirectUrl) {
        window.location.href = res.redirectUrl;
      } else {
        toast({ title: "Payment submitted", description: res.message ?? "Your payment is being processed." });
        refetch();
      }
    } catch (err) {
      console.error("Pay invoice failed:", err);
      toast({ title: "Payment failed", description: "Please try again or contact support.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Invoice">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-12 bg-white/5 rounded-2xl animate-pulse" />
          <div className="h-96 bg-white/5 rounded-3xl animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !inv) {
    return (
      <DashboardLayout title="Invoice">
        <div className="max-w-4xl mx-auto glass rounded-3xl p-12 text-center flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-white text-lg font-medium">Invoice not found</p>
          <p className="text-muted-foreground">This invoice may not exist or doesn't belong to your account.</p>
          <Link href="/billing/invoices">
            <Button variant="secondary" className="rounded-xl mt-2">Back to Invoices</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isPaid = inv.status.toLowerCase() === "paid";
  const isUnpaid = inv.status.toLowerCase() === "unpaid" || inv.status.toLowerCase() === "overdue";
  const creditVal = parseFloat(inv.credit ?? "0") || 0;

  return (
    <DashboardLayout title={`Invoice #${inv.id}`}>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Back link */}
        <Link href="/billing/invoices">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-2">
            <ChevronLeft className="w-4 h-4" /> Back to Invoices
          </button>
        </Link>

        <div className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden">
          {isPaid && (
            <div className="absolute top-10 right-10 text-emerald-500/10 rotate-12 pointer-events-none select-none">
              <CheckCircle2 className="w-56 h-56" />
            </div>
          )}

          {/* Header */}
          <div className="flex flex-wrap justify-between items-start gap-6 mb-12 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Receipt className="w-7 h-7 text-primary" />
                <h2 className="text-3xl font-display font-bold text-white">INVOICE</h2>
              </div>
              <p className="text-muted-foreground font-mono text-sm">#{inv.id}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-2xl mb-3 font-mono">${inv.total}</p>
              <span className={`px-4 py-1.5 rounded-lg text-sm font-bold uppercase ${invoiceStatusStyle(inv.status)}`}>
                {inv.status}
              </span>
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 relative z-10">
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Invoice Date</p>
              <p className="text-white font-medium">{inv.date ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Due Date</p>
              <p className={`font-medium ${inv.status.toLowerCase() === "overdue" ? "text-orange-400" : "text-white"}`}>
                {inv.dueDate ?? "—"}
              </p>
            </div>
            {inv.paymentMethod && (
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Payment Method</p>
                <p className="text-white font-medium capitalize">{inv.paymentMethod}</p>
              </div>
            )}
            {creditVal > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Credit Applied</p>
                <p className="text-emerald-400 font-medium font-mono">${inv.credit}</p>
              </div>
            )}
          </div>

          {/* Line items */}
          <div className="bg-black/40 rounded-xl border border-white/5 mb-8 relative z-10 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {(inv.items ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-5 py-6 text-center text-muted-foreground text-sm">No line items</td>
                  </tr>
                ) : (
                  (inv.items ?? []).map((item) => (
                    <tr key={item.id} className="border-b border-white/5">
                      <td className="px-5 py-3.5 text-white">
                        {item.description}
                        {item.taxed && <span className="ml-2 text-xs text-muted-foreground">(taxed)</span>}
                      </td>
                      <td className="px-5 py-3.5 text-white font-mono text-right">${item.amount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Totals */}
            <div className="px-5 py-4 flex justify-end border-t border-white/5">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono">${inv.subtotal}</span>
                </div>
                {parseFloat(inv.taxAmount ?? "0") > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax</span>
                    <span className="font-mono">${inv.taxAmount}</span>
                  </div>
                )}
                {creditVal > 0 && (
                  <div className="flex justify-between text-sm text-emerald-400">
                    <span>Credit Applied</span>
                    <span className="font-mono">-${inv.credit}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="font-mono">${inv.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {inv.notes && (
            <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/5 relative z-10">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Notes</p>
              <p className="text-white/80 text-sm">{inv.notes}</p>
            </div>
          )}

          {/* Invoice PDF placeholder */}
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <a
              href="#"
              onClick={e => { e.preventDefault(); toast({ title: "PDF download", description: "Invoice PDF download is not yet available." }); }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          </div>

          {/* Pay actions */}
          {isUnpaid && (
            <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={applyCredit}
                  onChange={e => setApplyCredit(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary"
                />
                <Wallet className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">Apply account credit</span>
              </label>
              <Button
                size="lg"
                className="rounded-xl px-8 gap-2"
                disabled={payMutation.isPending}
                onClick={handlePay}
              >
                <CreditCard className="w-4 h-4" />
                Pay ${inv.total}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// ── Quotes List ───────────────────────────────────────────────────────────────

export function QuotesList() {
  const { data: quotesResponse, isLoading, isError, refetch } = useGetQuotes();
  const quotes = quotesResponse?.quotes ?? [];

  return (
    <DashboardLayout title="Quotes">
      <div className="space-y-4">
        {isLoading ? (
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/5 text-muted-foreground text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Subject</th>
                  <th className="px-6 py-4 font-medium">Valid Until</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>{Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} cols={5} />)}</tbody>
            </table>
          </div>
        ) : isError ? (
          <div className="glass rounded-2xl p-12 text-center flex flex-col items-center gap-4">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-muted-foreground">Failed to load quotes.</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>Retry</Button>
          </div>
        ) : !quotes || quotes.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center flex flex-col items-center gap-3">
            <FileText className="w-12 h-12 text-white/20" />
            <p className="text-white font-medium">No quotes yet</p>
            <p className="text-muted-foreground text-sm">Quotes from your account manager will appear here.</p>
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 border-b border-white/5 text-muted-foreground uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Quote #</th>
                  <th className="px-6 py-4 font-medium">Subject</th>
                  <th className="px-6 py-4 font-medium">Valid Until</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((q, i) => (
                  <motion.tr
                    key={q.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-mono font-medium">#{q.id}</td>
                    <td className="px-6 py-4 text-white">{q.subject}</td>
                    <td className="px-6 py-4 text-white/70">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        {q.expiryDate ?? "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white font-bold font-mono">${q.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${quoteStatusStyle(q.status)}`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/billing/quotes/${q.id}`}>
                        <Button variant="secondary" size="sm" className="rounded-lg gap-1">
                          View <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ── Quote Detail ──────────────────────────────────────────────────────────────

export function QuoteDetail() {
  const [, params] = useRoute("/billing/quotes/:id");
  const [, navigate] = useLocation();
  const id = params?.id ?? "";
  const { data: q, isLoading, isError, refetch } = useGetQuote(id);
  const acceptMut = useAcceptQuote();
  const deleteMut = useDeleteQuote();
  const sendMut = useSendQuote();
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleAccept = async () => {
    try {
      await acceptMut.mutateAsync({ quoteId: id });
      toast({ title: "Quote accepted", description: "Your quote has been accepted successfully." });
      refetch();
    } catch (err) {
      console.error("Accept quote failed:", err);
      toast({ title: "Failed to accept quote", description: "Please try again or contact support.", variant: "destructive" });
    }
  };

  const handleSend = async () => {
    try {
      await sendMut.mutateAsync({ quoteId: id });
      toast({ title: "Quote sent", description: "The quote has been sent to your email." });
    } catch (err) {
      console.error("Send quote failed:", err);
      toast({ title: "Failed to send quote", description: "Please try again or contact support.", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    try {
      await deleteMut.mutateAsync({ quoteId: id });
      toast({ title: "Quote deleted" });
      navigate("/billing/quotes");
    } catch (err) {
      console.error("Delete quote failed:", err);
      toast({ title: "Failed to delete quote", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Quote">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-12 bg-white/5 rounded-2xl animate-pulse" />
          <div className="h-80 bg-white/5 rounded-3xl animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !q) {
    return (
      <DashboardLayout title="Quote">
        <div className="max-w-4xl mx-auto glass rounded-3xl p-12 text-center flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-white text-lg font-medium">Quote not found</p>
          <p className="text-muted-foreground">This quote may not exist or doesn't belong to your account.</p>
          <Link href="/billing/quotes">
            <Button variant="secondary" className="rounded-xl mt-2">Back to Quotes</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isAccepted = q.status.toLowerCase().includes("accepted");
  const isExpired = q.status.toLowerCase() === "expired" || q.status.toLowerCase() === "dead";
  const canAccept = !isAccepted && !isExpired;

  return (
    <DashboardLayout title={`Quote #${q.id}`}>
      <div className="max-w-4xl mx-auto space-y-4">
        <Link href="/billing/quotes">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-2">
            <ChevronLeft className="w-4 h-4" /> Back to Quotes
          </button>
        </Link>

        <div className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden">
          {isAccepted && (
            <div className="absolute top-10 right-10 text-emerald-500/10 rotate-12 pointer-events-none select-none">
              <CheckCircle2 className="w-56 h-56" />
            </div>
          )}

          {/* Header */}
          <div className="flex flex-wrap justify-between items-start gap-6 mb-10 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-7 h-7 text-primary" />
                <h2 className="text-3xl font-display font-bold text-white">QUOTE</h2>
              </div>
              <p className="text-muted-foreground font-mono text-sm">#{q.id}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-2xl mb-3 font-mono">${q.total}</p>
              <span className={`px-4 py-1.5 rounded-lg text-sm font-bold uppercase ${quoteStatusStyle(q.status)}`}>
                {q.status}
              </span>
            </div>
          </div>

          {/* Subject + expiry */}
          <div className="grid grid-cols-2 gap-6 mb-10 relative z-10">
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Subject</p>
              <p className="text-white font-medium">{q.subject}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Valid Until</p>
              <p className={`font-medium ${isExpired ? "text-red-400" : "text-white"}`}>{q.expiryDate ?? "—"}</p>
            </div>
          </div>

          {/* Line items */}
          <div className="bg-black/40 rounded-xl border border-white/5 mb-8 overflow-hidden relative z-10">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 font-medium text-center">Qty</th>
                  <th className="px-5 py-3 font-medium text-right">Unit Price</th>
                  <th className="px-5 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {(q.items ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-6 text-center text-muted-foreground text-sm">No items</td>
                  </tr>
                ) : (
                  (q.items ?? []).map((item) => (
                    <tr key={item.id} className="border-b border-white/5">
                      <td className="px-5 py-3.5 text-white">{item.description}</td>
                      <td className="px-5 py-3.5 text-white/70 text-center">{item.qty ?? 1}</td>
                      <td className="px-5 py-3.5 text-white/70 font-mono text-right">${item.unit ?? "0.00"}</td>
                      <td className="px-5 py-3.5 text-white font-mono font-bold text-right">${item.total}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="px-5 py-4 flex justify-end border-t border-white/5">
              <div className="w-48">
                <div className="flex justify-between text-white font-bold text-base">
                  <span>Total</span>
                  <span className="font-mono">${q.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {q.notes && (
            <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/5 relative z-10">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Notes</p>
              <p className="text-white/80 text-sm">{q.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
            {/* Secondary actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-lg gap-1.5"
                disabled={sendMut.isPending}
                onClick={handleSend}
              >
                <Send className="w-3.5 h-3.5" />
                {sendMut.isPending ? "Sending…" : "Send to Email"}
              </Button>
              {!isAccepted && (
                <Button
                  variant="secondary"
                  size="sm"
                  className={`rounded-lg gap-1.5 ${confirmDelete ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : ""}`}
                  disabled={deleteMut.isPending}
                  onClick={handleDelete}
                  onBlur={() => setConfirmDelete(false)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {deleteMut.isPending ? "Deleting…" : confirmDelete ? "Confirm Delete?" : "Delete Quote"}
                </Button>
              )}
            </div>
            {/* Primary action */}
            {canAccept ? (
              <Button
                size="lg"
                className="rounded-xl px-8 gap-2 bg-emerald-600 hover:bg-emerald-700"
                disabled={acceptMut.isPending}
                onClick={handleAccept}
              >
                <CheckCircle2 className="w-4 h-4" />
                {acceptMut.isPending ? "Accepting…" : "Accept Quote"}
              </Button>
            ) : (
              <div className={`px-6 py-3 rounded-xl text-sm font-medium ${isAccepted ? "bg-emerald-500/15 text-emerald-400" : "bg-white/10 text-muted-foreground"}`}>
                {isAccepted ? "✓ Quote Accepted" : "Quote Expired"}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function orderStatusStyle(status: string) {
  const s = status.toLowerCase();
  if (s === "active" || s === "completed") return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
  if (s === "pending" || s === "pending payment") return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
  if (s === "cancelled" || s === "fraud") return "bg-red-500/20 text-red-400 border border-red-500/30";
  return "bg-primary/20 text-primary border border-primary/30";
}

export function OrdersList() {
  const { data: ordersResponse, isLoading, isError, refetch } = useGetOrders();
  const orders = ordersResponse?.orders ?? [];
  const [, navigate] = useLocation();

  return (
    <DashboardLayout title="Order History">
      <div className="flex justify-end mb-4">
        <Button onClick={() => navigate("/order")} className="gap-2">
          <ShoppingBag className="w-4 h-4" />
          Order New Service
        </Button>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 border-b border-white/5 text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Order #</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} cols={5} />)
              : isError
              ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                      <p className="text-muted-foreground">Failed to load orders.</p>
                      <Button variant="secondary" size="sm" onClick={() => refetch()}>Retry</Button>
                    </div>
                  </td>
                </tr>
              )
              : !orders || orders.length === 0
              ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <ShoppingBag className="w-12 h-12 text-white/20" />
                      <p className="text-muted-foreground">No orders yet.</p>
                      <Button variant="secondary" size="sm" onClick={() => navigate("/order")}>
                        Browse Services
                      </Button>
                    </div>
                  </td>
                </tr>
              )
              : orders.map((o, i) => (
                <motion.tr
                  key={o.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => navigate(`/billing/orders/${o.id}`)}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-white font-mono font-medium">#{o.id}</td>
                  <td className="px-6 py-4 text-white/70">{o.date}</td>
                  <td className="px-6 py-4 text-white font-bold font-mono">${o.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${orderStatusStyle(o.status)}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <ChevRight className="w-4 h-4" />
                  </td>
                </motion.tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export function OrderDetail() {
  const [, params] = useRoute("/billing/orders/:orderId");
  const orderId = params?.orderId ?? "";
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: order, isLoading, isError, refetch } = useGetOrder(orderId);
  const cancelMutation = useCancelOrder();
  const isCancellable = order && ["pending", "pending payment"].includes(order.status.toLowerCase());

  function handleCancel() {
    if (!order) return;
    cancelMutation.mutate({ orderId: order.id }, {
      onSuccess: () => {
        toast({ title: "Order cancelled", description: `Order #${order.id} has been cancelled.` });
        refetch();
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to cancel order.", variant: "destructive" });
      },
    });
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Order Detail">
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !order) {
    return (
      <DashboardLayout title="Order Detail">
        <div className="flex flex-col items-center gap-4 py-32 text-center">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-muted-foreground">Order not found or failed to load.</p>
          <Button variant="secondary" onClick={() => navigate("/billing/orders")}>Back to Orders</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Order #${order.id}`}>
      <div className="mb-6">
        <button
          onClick={() => navigate("/billing/orders")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Orders
        </button>
      </div>

      <div className="glass rounded-2xl p-8 relative overflow-hidden">
        {order.status.toLowerCase() === "active" || order.status.toLowerCase() === "completed" ? (
          <div className="absolute top-10 right-10 text-emerald-500/10 rotate-12 pointer-events-none select-none">
            <CheckCircle2 className="w-48 h-48" />
          </div>
        ) : null}

        <div className="flex flex-wrap justify-between items-start gap-6 mb-10 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-7 h-7 text-primary" />
              <h2 className="text-3xl font-display font-bold text-white">ORDER</h2>
            </div>
            <p className="text-muted-foreground font-mono text-sm">#{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-white font-bold text-2xl mb-3 font-mono">${order.total}</p>
            <span className={`px-4 py-1.5 rounded-lg text-sm font-bold uppercase ${orderStatusStyle(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-10 relative z-10">
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Order Date</p>
            <p className="text-white font-medium">{order.date}</p>
          </div>
          {order.paymentMethod && (
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Payment Method</p>
              <p className="text-white font-medium capitalize">{order.paymentMethod}</p>
            </div>
          )}
          {order.invoiceId && (
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Invoice</p>
              <Link href={`/billing/invoices/${order.invoiceId}`} className="text-primary hover:underline font-medium">
                #{order.invoiceId}
              </Link>
            </div>
          )}
        </div>

        {order.items && order.items.length > 0 && (
          <div className="bg-black/40 rounded-xl border border-white/5 mb-8 overflow-hidden relative z-10">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Domain</th>
                  <th className="px-5 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-white/5">
                    <td className="px-5 py-3.5 text-white">{item.productName}</td>
                    <td className="px-5 py-3.5 text-white/70">{item.domain ?? "—"}</td>
                    <td className="px-5 py-3.5 text-white font-mono font-bold text-right">${item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-4 flex justify-end border-t border-white/5">
              <div className="w-48">
                <div className="flex justify-between text-white font-bold text-base">
                  <span>Total</span>
                  <span className="font-mono">${order.total}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-end relative z-10">
          {order.invoiceId && (
            <Link href={`/billing/invoices/${order.invoiceId}`}>
              <Button variant="secondary" className="gap-2">
                <Receipt className="w-4 h-4" />
                View Invoice
              </Button>
            </Link>
          )}
          {isCancellable && (
            <Button
              variant="destructive"
              className="gap-2"
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
