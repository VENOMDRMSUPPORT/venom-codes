import { useState } from "react";
import { Link, useParams } from "wouter";
import {
  useGetInvoices,
  useGetInvoiceDetail,
  useGetQuotes,
  useGetQuoteDetail,
  useGetOrders,
  useGetOrderDetail,
  usePayInvoice,
  useAcceptQuote,
  type Invoice,
  type Quote,
  type Order,
} from "@/api/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Receipt, FileText, ShoppingCart, Search, AlertCircle, ChevronRight, Download, Eye, Calendar, DollarSign, CreditCard, CheckCircle, Package, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// --- INVOICES LIST ---
function getInvoiceBadge(status: string) {
  const s = status.toLowerCase();
  if (s === "paid") return "success";
  if (s === "unpaid") return "destructive";
  if (s === "overdue") return "warning";
  return "secondary";
}

export function InvoicesList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetInvoices({ page, limit: 50 });

  const filtered = (data?.invoices ?? []).filter(
    (inv) =>
      !search ||
      inv.id.toString().includes(search) ||
      (inv.total ?? "").toString().includes(search)
  );

  return (
    <DashboardLayout title="Invoices">
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-background border-border focus-visible:ring-primary h-11 rounded-xl"
          />
        </div>
      </div>

      {isError && (
        <div className="flex items-center gap-3 p-4 mb-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">Failed to load invoices. Please try again.</p>
        </div>
      )}

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/30 border-b border-border text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Invoice #</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {[40, 30, 30, 20, 20, 20].map((w, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-secondary rounded animate-pulse" style={{ width: `${w}%` }} />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading &&
              filtered.map((inv) => (
                <tr key={inv.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">#{inv.id}</td>
                  <td className="px-6 py-4 text-muted-foreground">{inv.date ?? "—"}</td>
                  <td className="px-6 py-4 text-muted-foreground">{inv.dueDate ?? "—"}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{inv.total ?? "—"}</td>
                  <td className="px-6 py-4">
                    <Badge variant={getInvoiceBadge(inv.status) as any}>{inv.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/billing/invoices/${inv.id}`}>
                      <Button variant="ghost" size="sm" className="rounded-lg text-primary hover:bg-primary/10 gap-1">
                        <Eye className="w-3 h-3" /> View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-14 text-muted-foreground">
                  <Receipt className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="font-medium">No invoices found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data: invoice, isLoading, isError } = useGetInvoiceDetail(id ?? "");
  const payMutation = usePayInvoice();

  const handlePayNow = async () => {
    if (!id) return;
    try {
      await payMutation.mutateAsync({ invoiceId: id });
      toast({ title: "Payment initiated", description: "You will be redirected to payment gateway." });
    } catch (error: any) {
      toast({ title: "Payment failed", description: error?.message || "Unable to process payment", variant: "destructive" });
    }
  };

  const handleDownload = async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/invoices/${id}/download`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("venom_token")}` },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      toast({ title: "Download failed", description: "Unable to download invoice PDF", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title={`Invoice #${id}`}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !invoice) {
    return (
      <DashboardLayout title={`Invoice #${id}`}>
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">Failed to load invoice details.</p>
        </div>
      </DashboardLayout>
    );
  }

  const statusColors: Record<string, "success" | "destructive" | "warning" | "secondary"> = {
    paid: "success",
    unpaid: "destructive",
    overdue: "warning",
    cancelled: "secondary",
    draft: "secondary",
  };

  return (
    <DashboardLayout title={`Invoice #${invoice.id}`}>
      <div className="space-y-6">
        {/* Back button */}
        <Link href="/billing/invoices">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Invoices
          </Button>
        </Link>

        {/* Invoice Header */}
        <Card className="border-border/70 bg-card/80">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-display font-bold">Invoice #{invoice.invoiceNum || invoice.id}</h2>
                  <Badge variant={statusColors[invoice.status.toLowerCase()] || "secondary"}>{invoice.status}</Badge>
                </div>
                {invoice.date && (
                  <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Issued: {invoice.date}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
                {invoice.status.toLowerCase() === "unpaid" && invoice.balance && invoice.balance > 0 && (
                  <Button size="sm" onClick={handlePayNow} disabled={payMutation.isPending} className="gap-2">
                    {payMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                    Pay Now
                  </Button>
                )}
              </div>
            </div>

            {invoice.dueDate && (
              <div className="mt-4 p-4 rounded-xl bg-secondary/30">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Due Date:</span> {invoice.dueDate}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Items */}
        <Card className="border-border/70 bg-card/80">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Line Items</h3>
            {invoice.items && invoice.items.length > 0 ? (
              <div className="space-y-3">
                {invoice.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start p-4 rounded-xl bg-background/50 border border-border/60">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.description}</p>
                      {item.qty && item.qty > 1 && <p className="text-xs text-muted-foreground mt-1">Qty: {item.qty}</p>}
                    </div>
                    <p className="font-semibold text-foreground ml-4">{typeof item.amount === "number" ? `$${item.amount.toFixed(2)}` : item.amount}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No line items available.</p>
            )}
          </CardContent>
        </Card>

        {/* Totals */}
        <Card className="border-border/70 bg-card/80">
          <CardContent className="p-6">
            <div className="space-y-3">
              {invoice.subtotal !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{typeof invoice.subtotal === "number" ? `$${invoice.subtotal.toFixed(2)}` : invoice.subtotal}</span>
                </div>
              )}
              {invoice.tax !== undefined && invoice.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax {invoice.taxRate ? `(${invoice.taxRate}%)` : ""}</span>
                  <span className="font-medium">{typeof invoice.tax === "number" ? `$${invoice.tax.toFixed(2)}` : invoice.tax}</span>
                </div>
              )}
              {invoice.credit && invoice.credit > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Credit Applied</span>
                  <span className="font-medium text-emerald-600">-{typeof invoice.credit === "number" ? `$${invoice.credit.toFixed(2)}` : invoice.credit}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">{typeof invoice.total === "number" ? `$${invoice.total.toFixed(2)}` : invoice.total}</span>
              </div>
              {invoice.balance !== undefined && invoice.balance !== invoice.total && (
                <div className="flex justify-between text-sm pt-2 border-t border-border/60">
                  <span className="text-muted-foreground">Balance Due</span>
                  <span className="font-semibold">{typeof invoice.balance === "number" ? `$${invoice.balance.toFixed(2)}` : invoice.balance}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// --- QUOTES LIST ---
export function QuotesList() {
  const { data, isLoading } = useGetQuotes({ limit: 50 });

  return (
    <DashboardLayout title="Quotes">
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/30 border-b border-border text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Quote #</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Subject</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {[30, 50, 20, 20, 20].map((w, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-secondary rounded animate-pulse" style={{ width: `${w}%` }} />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading && (!data?.quotes || data.quotes.length === 0) && (
              <tr>
                <td colSpan={5} className="text-center py-14 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="font-medium">No quotes found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export function QuoteDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data: quote, isLoading, isError } = useGetQuoteDetail(id ?? "");
  const acceptMutation = useAcceptQuote();

  const handleAcceptQuote = async () => {
    if (!id) return;
    try {
      await acceptMutation.mutateAsync({ quoteId: id });
      toast({ title: "Quote accepted", description: "An invoice has been generated for this quote." });
    } catch (error: any) {
      toast({ title: "Accept failed", description: error?.message || "Unable to accept quote", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title={`Quote #${id}`}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !quote) {
    return (
      <DashboardLayout title={`Quote #${id}`}>
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">Failed to load quote details.</p>
        </div>
      </DashboardLayout>
    );
  }

  const statusColors: Record<string, "success" | "destructive" | "warning" | "secondary"> = {
    accepted: "success",
    declined: "destructive",
    pending: "warning",
    draft: "secondary",
  };

  return (
    <DashboardLayout title={`Quote #${quote.quoteNum || quote.id}`}>
      <div className="space-y-6">
        <Link href="/billing/quotes">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Quotes
          </Button>
        </Link>

        <Card className="border-border/70 bg-card/80">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-display font-bold">Quote #{quote.quoteNum || quote.id}</h2>
                  <Badge variant={statusColors[quote.status.toLowerCase()] || "secondary"}>{quote.status}</Badge>
                </div>
                {quote.date && (
                  <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Created: {quote.date}
                  </p>
                )}
              </div>
              {quote.status.toLowerCase() === "pending" && (
                <Button size="sm" onClick={handleAcceptQuote} disabled={acceptMutation.isPending} className="gap-2">
                  {acceptMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Accept Quote
                </Button>
              )}
            </div>

            {quote.validUntil && (
              <div className="mt-4 p-4 rounded-xl bg-secondary/30">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Valid Until:</span> {quote.validUntil}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quote Items</h3>
            {quote.items && quote.items.length > 0 ? (
              <div className="space-y-3">
                {quote.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start p-4 rounded-xl bg-background/50 border border-border/60">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.description}</p>
                      {item.qty && item.qty > 1 && <p className="text-xs text-muted-foreground mt-1">Qty: {item.qty}</p>}
                    </div>
                    <p className="font-semibold text-foreground ml-4">{typeof item.amount === "number" ? `$${item.amount.toFixed(2)}` : item.amount}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No line items available.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-primary">{typeof quote.total === "number" ? `$${quote.total.toFixed(2)}` : quote.total}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// --- ORDERS LIST ---
export function OrdersList() {
  const { data, isLoading } = useGetOrders({ limit: 50 });

  return (
    <DashboardLayout title="Orders">
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/30 border-b border-border text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Order #</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Items</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {[20, 30, 30, 20, 20, 20].map((w, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-secondary rounded animate-pulse" style={{ width: `${w}%` }} />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading && (!data?.orders || data.orders.length === 0) && (
              <tr>
                <td colSpan={6} className="text-center py-14 text-muted-foreground">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="font-medium">No orders found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError } = useGetOrderDetail(id ?? "");

  if (isLoading) {
    return (
      <DashboardLayout title={`Order #${id}`}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !order) {
    return (
      <DashboardLayout title={`Order #${id}`}>
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">Failed to load order details.</p>
        </div>
      </DashboardLayout>
    );
  }

  const statusColors: Record<string, "success" | "destructive" | "warning" | "secondary"> = {
    complete: "success",
    pending: "warning",
    cancelled: "destructive",
    fraud: "destructive",
    accepted: "secondary",
  };

  return (
    <DashboardLayout title={`Order #${order.ordernum || order.id}`}>
      <div className="space-y-6">
        <Link href="/billing/orders">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Button>
        </Link>

        <Card className="border-border/70 bg-card/80">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-display font-bold">Order #{order.ordernum || order.id}</h2>
                  <Badge variant={statusColors[order.status.toLowerCase()] || "secondary"}>{order.status}</Badge>
                </div>
                {order.date && (
                  <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Placed: {order.date}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            {order.items && order.items.length > 0 ? (
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start p-4 rounded-xl bg-background/50 border border-border/60">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.productName}</p>
                        {item.productId && <p className="text-xs text-muted-foreground mt-1">Product ID: {item.productId}</p>}
                      </div>
                    </div>
                    <p className="font-semibold text-foreground ml-4">{typeof item.amount === "number" ? `$${item.amount.toFixed(2)}` : item.amount}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No items found for this order.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Order Total</span>
              <span className="text-xl font-bold text-primary">{typeof order.amount === "number" ? `$${order.amount.toFixed(2)}` : order.amount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
