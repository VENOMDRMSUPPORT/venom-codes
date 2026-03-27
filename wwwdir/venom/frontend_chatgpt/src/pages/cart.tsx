import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { checkoutCart, clearCart, getCart, removeCartItem } from "@/lib/api";
import { cartPreview, catalogProducts as previewCatalogProducts } from "@/lib/site";
import { sumNumericStrings } from "@/lib/utils";
import { usePreviewQuery } from "@/hooks/use-preview-query";
import { useAuthStore } from "@/hooks/use-auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataState } from "@/components/ui/data-state";

export function Cart() {
  const previewMode = useAuthStore((state) => state.previewMode);
  const cartQuery = usePreviewQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    previewData: cartPreview
  });
  const [previewItems, setPreviewItems] = useState(cartPreview);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (previewMode) {
      setPreviewItems(cartPreview);
    }
  }, [previewMode]);

  const items = previewMode ? previewItems : cartQuery.data ?? [];
  const subtotal = useMemo(() => sumNumericStrings(items.map((item) => item.total)), [items]);

  const remove = useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: (_data, itemId) => {
      setError(null);
      if (previewMode) {
        setPreviewItems((current) => current.filter((item) => item.id !== itemId));
        setFeedback("Preview cart updated locally.");
        return;
      }
      setFeedback("Cart item removal sent to the backend.");
      cartQuery.refetch();
    },
    onError: (mutationError) => {
      setFeedback(null);
      setError(mutationError instanceof Error ? mutationError.message : "Unable to remove the cart item.");
    }
  });

  const clear = useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => {
      setError(null);
      if (previewMode) {
        setPreviewItems([]);
        setFeedback("Preview cart cleared locally.");
        return;
      }
      setFeedback("Cart clear request sent to the backend.");
      cartQuery.refetch();
    },
    onError: (mutationError) => {
      setFeedback(null);
      setError(mutationError instanceof Error ? mutationError.message : "Unable to clear the cart.");
    }
  });

  const checkout = useMutation({
    mutationFn: () => checkoutCart({}),
    onSuccess: () => {
      setError(null);
      setFeedback(previewMode ? "Preview mode does not create a live checkout session, but the flow is wired." : "Checkout request submitted to the backend." );
    },
    onError: (mutationError) => {
      setFeedback(null);
      setError(mutationError instanceof Error ? mutationError.message : "Unable to start checkout.");
    }
  });

  if (cartQuery.isLoading && !previewMode) {
    return (
      <DashboardShell title="Cart" description="Review the current commercial selection before checkout.">
        <DataState kind="loading" title="Loading cart" message="Requesting the current cart session from the backend." />
      </DashboardShell>
    );
  }

  if (cartQuery.isError && !previewMode) {
    return (
      <DashboardShell title="Cart" description="Review the current commercial selection before checkout.">
        <DataState kind="error" title="Unable to load the cart" message="The cart session was not returned by the backend." actionLabel="Retry" onAction={() => cartQuery.refetch()} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Cart" description="A cleaner commercial staging area for selected products, billing cycles, and the final checkout transition." actions={<ButtonLink href="/catalog" variant="outline" size="sm">Browse catalog</ButtonLink>}>
      {feedback ? <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-300">{feedback}</div> : null}
      {error ? <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">{error}</div> : null}

      {items.length === 0 ? (
        <DataState kind="empty" title="Your cart is currently empty" message="Add a product from the catalog to stage the next commercial action." actionLabel="Open catalog" onAction={() => (window.location.href = "/catalog")} />
      ) : (
        <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-[32px] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Cart items</div>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Selected products</h2>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => clear.mutate()} disabled={clear.isPending}>
                <Trash2 className="size-4" />
                Clear cart
              </Button>
            </div>
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="glass-card rounded-[24px] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-[var(--foreground)]">{item.label}</div>
                      <div className="mt-1 text-sm text-muted">{item.cycle}</div>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => remove.mutate(item.id)} disabled={remove.isPending}>
                      Remove
                    </Button>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted">Unit price</div>
                      <div className="mt-2 text-sm font-medium text-[var(--foreground)]">{item.unitPrice}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted">Quantity</div>
                      <div className="mt-2 text-sm font-medium text-[var(--foreground)]">{item.quantity}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted">Total</div>
                      <div className="mt-2 text-sm font-medium text-[var(--foreground)]">{item.total}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-5">
            <Card className="rounded-[32px] p-6">
              <ShoppingCart className="size-6 text-cyan-400" />
              <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">Checkout summary</h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted">Items</span>
                  <span className="font-medium text-[var(--foreground)]">{items.length}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-medium text-[var(--foreground)]">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(subtotal)}</span>
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                <Button type="button" className="w-full justify-center" onClick={() => checkout.mutate()} disabled={checkout.isPending}>
                  {checkout.isPending ? "Starting checkout..." : "Proceed to checkout"}
                  <ArrowRight className="size-4" />
                </Button>
                <ButtonLink href="/catalog" variant="outline" className="w-full justify-center">
                  Continue browsing
                </ButtonLink>
              </div>
            </Card>

            <Card className="rounded-[32px] p-6">
              <div className="text-xs uppercase tracking-[0.22em] text-cyan-400">Suggested next step</div>
              <p className="mt-4 text-sm leading-7 text-muted">
                {previewCatalogProducts[0]?.highlight ?? "Browse the catalog to add more rollout options before checkout."}
              </p>
            </Card>
          </div>
        </section>
      )}
    </DashboardShell>
  );
}
