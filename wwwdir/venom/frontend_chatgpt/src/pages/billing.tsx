import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Receipt } from "lucide-react";
import { acceptQuote, declineQuote, getInvoice, getOrder, getQuote, listInvoices, listOrders, listQuotes, payInvoice } from "@/lib/api";
import { invoices as previewInvoices, orders as previewOrders, quotes as previewQuotes } from "@/lib/site";
import { formatDate, statusTone, sumNumericStrings } from "@/lib/utils";
import { usePreviewQuery } from "@/hooks/use-preview-query";
import { useAuthStore } from "@/hooks/use-auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataState } from "@/components/ui/data-state";

function SummaryCards({ items }: { items: Array<{ label: string; value: string; detail: string }> }) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="rounded-[28px] p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-muted">{item.label}</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{item.value}</div>
          <p className="mt-3 text-sm leading-7 text-muted">{item.detail}</p>
        </Card>
      ))}
    </section>
  );
}

export function InvoicesList() {
  const invoicesQuery = usePreviewQuery({
    queryKey: ["invoices"],
    queryFn: listInvoices,
    previewData: previewInvoices
  });

  const invoices = invoicesQuery.data ?? [];
  const balance = sumNumericStrings(invoices.map((invoice) => invoice.balance));
  const unpaid = invoices.filter((invoice) => invoice.status.toLowerCase() !== "paid");

  if (invoicesQuery.isLoading) {
    return (
      <DashboardShell title="Billing" description="Invoices, payment posture, quotes, and orders in one polished commercial workspace.">
        <DataState kind="loading" title="Loading billing data" message="Requesting invoice records from the backend." />
      </DashboardShell>
    );
  }

  if (invoicesQuery.isError) {
    return (
      <DashboardShell title="Billing" description="Invoices, payment posture, quotes, and orders in one polished commercial workspace.">
        <DataState kind="error" title="Unable to load invoices" message="The invoice list was not returned by the backend." actionLabel="Retry" onAction={() => invoicesQuery.refetch()} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="Billing"
      description="A commercial layer rebuilt with premium hierarchy and better decision support for finance, account owners, and operations leads."
      actions={<ButtonLink href="/billing/quotes" variant="outline" size="sm">View quotes</ButtonLink>}
    >
      <SummaryCards
        items={[
          { label: "Open invoices", value: String(unpaid.length).padStart(2, "0"), detail: "Billing documents that still require payment, review, or reconciliation." },
          { label: "Outstanding balance", value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(balance), detail: "Aggregated unpaid or partially paid balance across invoices." },
          { label: "Paid history", value: String(invoices.length - unpaid.length).padStart(2, "0"), detail: "Invoices already cleared through a saved payment method or transfer." }
        ]}
      />

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[30px] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Invoices</div>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Current commercial queue</h2>
            </div>
            <Receipt className="size-6 text-cyan-400" />
          </div>
          <div className="mt-6 space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="glass-card rounded-[24px] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold text-[var(--foreground)]">{invoice.id}</div>
                    <div className="mt-1 text-sm text-muted">Issued {formatDate(invoice.issuedOn)} • Due {formatDate(invoice.dueOn)}</div>
                  </div>
                  <Badge tone={statusTone(invoice.status)}>{invoice.status}</Badge>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-muted">Total</div>
                    <div className="mt-2 text-sm font-medium text-[var(--foreground)]">{invoice.total}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-muted">Balance</div>
                    <div className="mt-2 text-sm font-medium text-[var(--foreground)]">{invoice.balance}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-muted">Gateway</div>
                    <div className="mt-2 text-sm font-medium text-[var(--foreground)]">{invoice.gateway}</div>
                  </div>
                </div>
                <div className="mt-5 flex justify-end">
                  <ButtonLink href={`/billing/invoices/${invoice.id}`} variant="outline" size="sm">
                    Invoice detail
                    <ArrowRight className="size-4" />
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5">
          <Card className="rounded-[30px] p-6">
            <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Shortcuts</div>
            <div className="mt-6 grid gap-3">
              <ButtonLink href="/billing/quotes" className="w-full justify-between">
                Review quotes
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/billing/orders" variant="outline" className="w-full justify-between">
                Review orders
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/account/payments" variant="ghost" className="w-full justify-between">
                Saved payment methods
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </Card>

          <Card className="rounded-[30px] p-6">
            <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Commercial UX note</div>
            <p className="mt-4 text-sm leading-7 text-muted">
              Billing pages now communicate state with stronger hierarchy, clearer amounts, and direct routes to actions, while all payment execution still belongs to the backend.
            </p>
          </Card>
        </div>
      </section>
    </DashboardShell>
  );
}

export function InvoiceDetail({ invoiceId }: { invoiceId: string }) {
  const previewMode = useAuthStore((state) => state.previewMode);
  const previewData = previewInvoices.find((invoice) => invoice.id === invoiceId) ?? previewInvoices[0];
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const invoiceQuery = usePreviewQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => getInvoice(invoiceId),
    previewData
  });

  const pay = useMutation({
    mutationFn: () => payInvoice(invoiceId),
    onSuccess: () => {
      setError(null);
      setMessage(previewMode ? "Preview mode does not execute payments, but the UI flow is wired." : "Payment request sent to the backend." );
    },
    onError: (mutationError) => {
      setMessage(null);
      setError(mutationError instanceof Error ? mutationError.message : "Unable to initiate payment.");
    }
  });

  const invoice = invoiceQuery.data;

  if (invoiceQuery.isLoading) {
    return (
      <DashboardShell title="Invoice detail" description="Inspect a single commercial document with clearer totals, line items, and payment posture.">
        <DataState kind="loading" title="Loading invoice" message="Requesting the selected invoice from the backend." />
      </DashboardShell>
    );
  }

  if (invoiceQuery.isError || !invoice) {
    return (
      <DashboardShell title="Invoice detail" description="Inspect a single commercial document with clearer totals, line items, and payment posture.">
        <DataState kind="error" title="Unable to load invoice" message="The selected invoice was not returned by the backend." actionLabel="Retry" onAction={() => invoiceQuery.refetch()} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title={invoice.id} description="A cleaner invoice detail experience with commercial clarity and preserved backend payment discipline." actions={<ButtonLink href="/billing" variant="outline" size="sm">Back to billing</ButtonLink>}>
      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[32px] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Invoice</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{invoice.id}</h2>
            </div>
            <Badge tone={statusTone(invoice.status)}>{invoice.status}</Badge>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Issued", formatDate(invoice.issuedOn)],
              ["Due", formatDate(invoice.dueOn)],
              ["Total", invoice.total],
              ["Balance", invoice.balance]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/8 px-4 py-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted">{label}</div>
                <div className="mt-3 text-sm font-medium text-[var(--foreground)]">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[28px] border border-white/8 p-5">
            <div className="text-sm font-semibold text-[var(--foreground)]">Line items</div>
            <div className="mt-5 space-y-4">
              {invoice.items.map((item) => (
                <div key={`${item.label}-${item.amount}`} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted">{item.label}</span>
                  <span className="font-medium text-[var(--foreground)]">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="rounded-[32px] p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Action panel</div>
          <p className="mt-4 text-sm leading-7 text-muted">
            Payment requests are initiated from the frontend, but actual settlement and gateway logic remain safely on the backend side.
          </p>
          <div className="mt-6 space-y-3">
            <Button type="button" className="w-full justify-center" onClick={() => pay.mutate()} disabled={pay.isPending || invoice.status.toLowerCase() === "paid"}>
              {pay.isPending ? "Initiating payment..." : invoice.status.toLowerCase() === "paid" ? "Invoice already paid" : "Pay invoice"}
            </Button>
            <ButtonLink href="/account/payments" variant="outline" className="w-full justify-center">
              Manage payment methods
            </ButtonLink>
          </div>
          {message ? <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{message}</div> : null}
          {error ? <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">{error}</div> : null}
        </Card>
      </section>
    </DashboardShell>
  );
}

export function QuotesList() {
  const quotesQuery = usePreviewQuery({
    queryKey: ["quotes"],
    queryFn: listQuotes,
    previewData: previewQuotes
  });

  const quotes = quotesQuery.data ?? [];

  if (quotesQuery.isLoading) {
    return (
      <DashboardShell title="Quotes" description="Review commercial proposals, upgrade offers, and rollout options.">
        <DataState kind="loading" title="Loading quotes" message="Requesting the quote list from the backend." />
      </DashboardShell>
    );
  }

  if (quotesQuery.isError) {
    return (
      <DashboardShell title="Quotes" description="Review commercial proposals, upgrade offers, and rollout options.">
        <DataState kind="error" title="Unable to load quotes" message="The quote list was not returned by the backend." actionLabel="Retry" onAction={() => quotesQuery.refetch()} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Quotes" description="Clearer commercial proposal pages for upgrades, expansions, and rollout planning." actions={<ButtonLink href="/billing" variant="outline" size="sm">Invoices</ButtonLink>}>
      <section className="grid gap-5 xl:grid-cols-2">
        {quotes.map((quote) => (
          <Card key={quote.id} className="rounded-[30px] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Quote</div>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{quote.id}</h2>
              </div>
              <Badge tone={statusTone(quote.status)}>{quote.status}</Badge>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">{quote.summary}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 px-4 py-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted">Valid until</div>
                <div className="mt-3 text-sm font-medium text-[var(--foreground)]">{formatDate(quote.validUntil)}</div>
              </div>
              <div className="rounded-2xl border border-white/8 px-4 py-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted">Total</div>
                <div className="mt-3 text-sm font-medium text-[var(--foreground)]">{quote.total}</div>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <ButtonLink href={`/billing/quotes/${quote.id}`} variant="outline" size="sm">
                Quote detail
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </Card>
        ))}
      </section>
    </DashboardShell>
  );
}

export function QuoteDetail({ quoteId }: { quoteId: string }) {
  const previewMode = useAuthStore((state) => state.previewMode);
  const previewData = previewQuotes.find((quote) => quote.id === quoteId) ?? previewQuotes[0];
  const quoteQuery = usePreviewQuery({
    queryKey: ["quote", quoteId],
    queryFn: () => getQuote(quoteId),
    previewData
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const accept = useMutation({
    mutationFn: () => acceptQuote(quoteId),
    onSuccess: () => {
      setError(null);
      setMessage(previewMode ? "Preview mode does not submit the acceptance, but the action is wired." : "Quote acceptance request sent." );
    },
    onError: (mutationError) => {
      setMessage(null);
      setError(mutationError instanceof Error ? mutationError.message : "Unable to accept quote.");
    }
  });

  const decline = useMutation({
    mutationFn: () => declineQuote(quoteId),
    onSuccess: () => {
      setError(null);
      setMessage(previewMode ? "Preview mode does not submit the decline action, but the flow is wired." : "Quote decline request sent." );
    },
    onError: (mutationError) => {
      setMessage(null);
      setError(mutationError instanceof Error ? mutationError.message : "Unable to decline quote.");
    }
  });

  const quote = quoteQuery.data;

  if (quoteQuery.isLoading) {
    return (
      <DashboardShell title="Quote detail" description="Review the selected commercial proposal and act from the premium frontend.">
        <DataState kind="loading" title="Loading quote" message="Requesting the selected quote from the backend." />
      </DashboardShell>
    );
  }

  if (quoteQuery.isError || !quote) {
    return (
      <DashboardShell title="Quote detail" description="Review the selected commercial proposal and act from the premium frontend.">
        <DataState kind="error" title="Unable to load quote" message="The selected quote was not returned by the backend." actionLabel="Retry" onAction={() => quoteQuery.refetch()} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title={quote.id} description="Proposal pages now frame upgrade and expansion offers with stronger hierarchy and direct decision routes." actions={<ButtonLink href="/billing/quotes" variant="outline" size="sm">Back to quotes</ButtonLink>}>
      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[32px] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Quote summary</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{quote.summary}</h2>
            </div>
            <Badge tone={statusTone(quote.status)}>{quote.status}</Badge>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 px-4 py-4">
              <div className="text-xs uppercase tracking-[0.18em] text-muted">Total</div>
              <div className="mt-3 text-sm font-medium text-[var(--foreground)]">{quote.total}</div>
            </div>
            <div className="rounded-2xl border border-white/8 px-4 py-4">
              <div className="text-xs uppercase tracking-[0.18em] text-muted">Valid until</div>
              <div className="mt-3 text-sm font-medium text-[var(--foreground)]">{formatDate(quote.validUntil)}</div>
            </div>
          </div>
          <div className="mt-8 rounded-[28px] border border-white/8 p-5">
            <div className="text-sm font-semibold text-[var(--foreground)]">Scope</div>
            <div className="mt-5 space-y-3">
              {quote.scope.map((item) => (
                <div key={item} className="rounded-2xl border border-white/8 px-4 py-3 text-sm text-soft">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="rounded-[32px] p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Decision actions</div>
          <div className="mt-6 grid gap-3">
            <Button type="button" className="w-full justify-center" onClick={() => accept.mutate()} disabled={accept.isPending}>
              <CheckCircle2 className="size-4" />
              {accept.isPending ? "Accepting..." : "Accept quote"}
            </Button>
            <Button type="button" variant="outline" className="w-full justify-center" onClick={() => decline.mutate()} disabled={decline.isPending}>
              {decline.isPending ? "Declining..." : "Decline quote"}
            </Button>
          </div>
          {message ? <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{message}</div> : null}
          {error ? <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">{error}</div> : null}
        </Card>
      </section>
    </DashboardShell>
  );
}

export function OrdersList() {
  const ordersQuery = usePreviewQuery({
    queryKey: ["orders"],
    queryFn: listOrders,
    previewData: previewOrders
  });

  const orders = ordersQuery.data ?? [];

  if (ordersQuery.isLoading) {
    return (
      <DashboardShell title="Orders" description="Review commercial orders and provisioning-linked purchases.">
        <DataState kind="loading" title="Loading orders" message="Requesting order records from the backend." />
      </DashboardShell>
    );
  }

  if (ordersQuery.isError) {
    return (
      <DashboardShell title="Orders" description="Review commercial orders and provisioning-linked purchases.">
        <DataState kind="error" title="Unable to load orders" message="The order list was not returned by the backend." actionLabel="Retry" onAction={() => ordersQuery.refetch()} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Orders" description="A cleaner reading experience for commercial orders, active purchases, and provisioning states." actions={<ButtonLink href="/cart" size="sm">Open cart</ButtonLink>}>
      <section className="grid gap-5 xl:grid-cols-2">
        {orders.map((order) => (
          <Card key={order.id} className="rounded-[30px] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Order</div>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{order.id}</h2>
              </div>
              <Badge tone={statusTone(order.status)}>{order.status}</Badge>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">{order.summary}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 px-4 py-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted">Placed on</div>
                <div className="mt-3 text-sm font-medium text-[var(--foreground)]">{formatDate(order.placedOn)}</div>
              </div>
              <div className="rounded-2xl border border-white/8 px-4 py-4">
                <div className="text-xs uppercase tracking-[0.18em] text-muted">Total</div>
                <div className="mt-3 text-sm font-medium text-[var(--foreground)]">{order.total}</div>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <ButtonLink href={`/billing/orders/${order.id}`} variant="outline" size="sm">
                Order detail
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </Card>
        ))}
      </section>
    </DashboardShell>
  );
}

export function OrderDetail({ orderId }: { orderId: string }) {
  const previewData = previewOrders.find((order) => order.id === orderId) ?? previewOrders[0];
  const orderQuery = usePreviewQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId),
    previewData
  });

  const order = orderQuery.data;

  if (orderQuery.isLoading) {
    return (
      <DashboardShell title="Order detail" description="Review the selected order and its current commercial status.">
        <DataState kind="loading" title="Loading order" message="Requesting the selected order from the backend." />
      </DashboardShell>
    );
  }

  if (orderQuery.isError || !order) {
    return (
      <DashboardShell title="Order detail" description="Review the selected order and its current commercial status.">
        <DataState kind="error" title="Unable to load order" message="The selected order was not returned by the backend." actionLabel="Retry" onAction={() => orderQuery.refetch()} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title={order.id} description="Order detail pages stay intentionally focused on customer-readable state while backend provisioning remains protected." actions={<ButtonLink href="/billing/orders" variant="outline" size="sm">Back to orders</ButtonLink>}>
      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[32px] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Order summary</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{order.summary}</h2>
            </div>
            <Badge tone={statusTone(order.status)}>{order.status}</Badge>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 px-4 py-4">
              <div className="text-xs uppercase tracking-[0.18em] text-muted">Placed on</div>
              <div className="mt-3 text-sm font-medium text-[var(--foreground)]">{formatDate(order.placedOn)}</div>
            </div>
            <div className="rounded-2xl border border-white/8 px-4 py-4">
              <div className="text-xs uppercase tracking-[0.18em] text-muted">Total</div>
              <div className="mt-3 text-sm font-medium text-[var(--foreground)]">{order.total}</div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[32px] p-6">
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Commercial continuity</div>
          <p className="mt-4 text-sm leading-7 text-muted">
            The commercial area now speaks the same visual language as the platform landing pages and the dashboard. That consistency improves trust during purchasing, renewals, and upgrades.
          </p>
          <div className="mt-6 grid gap-3">
            <ButtonLink href="/billing" className="w-full justify-between">
              Review invoices
              <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/support/new" variant="outline" className="w-full justify-between">
              Ask for help
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </Card>
      </section>
    </DashboardShell>
  );
}
